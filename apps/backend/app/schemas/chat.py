from typing import Literal

from pydantic import field_validator
from sqlmodel import Field, SQLModel


class ChatMessage(SQLModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(SQLModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=40)

    @field_validator("messages")
    @classmethod
    def _requires_user_message(cls, v: list[ChatMessage]) -> list[ChatMessage]:
        if not any(m.role == "user" for m in v):
            raise ValueError("messages must include at least one user message")
        return v


class ChatResponse(SQLModel):
    reply: str
