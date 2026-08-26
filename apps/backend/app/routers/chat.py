from fastapi import APIRouter, HTTPException, status

from app.deps import CurrentUserId, SessionDep
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import SYSTEM_PROMPT, _build_finance_context
from app.services.nvidia import get_nvidia_client
from app.services.rate_limit import check_rate_limit

_MODEL = "meta/llama-3.2-11b-vision-instruct"

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest, session: SessionDep, user_id: CurrentUserId):
    if not check_rate_limit(user_id):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You've reached your hourly message limit (5/hour). Try again later.",
        )

    context = _build_finance_context(session, user_id)
    messages = [{"role": "system", "content": SYSTEM_PROMPT + context}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    try:
        response = get_nvidia_client().chat.completions.create(
            model=_MODEL, messages=messages
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Chat service unavailable, try again",
        )

    return ChatResponse(reply=response.choices[0].message.content)
