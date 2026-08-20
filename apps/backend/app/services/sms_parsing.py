from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel

from app.services.gemini import get_gemini_client

_MODEL = "gemini-flash-latest"

_PROMPT = """You are extracting a bank transaction from an SMS notification.
Read the SMS below and extract the amount, a short merchant/title, whether
it is income (money received) or expense (money spent), the transaction
date, and your confidence in this extraction (0 to 1).

If the SMS is not a bank transaction notification at all, or you cannot
determine a required field, set confidence to 0.

SMS:
{raw_text}
"""


class ParsedTransaction(BaseModel):
    amount: Decimal
    title: str
    direction: Literal["income", "expense"]
    occurred_at: date
    confidence: float


def parse_transaction_sms(raw_text: str) -> ParsedTransaction | None:
    client = get_gemini_client()
    try:
        response = client.models.generate_content(
            model=_MODEL,
            contents=_PROMPT.format(raw_text=raw_text),
            config={
                "response_mime_type": "application/json",
                "response_schema": ParsedTransaction,
            },
        )
    except Exception:
        return None

    parsed = response.parsed
    if not isinstance(parsed, ParsedTransaction):
        return None
    return parsed
