from typing import Literal

from sqlmodel import SQLModel


class ChatMessage(SQLModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(SQLModel):
    messages: list[ChatMessage]


class ChatResponse(SQLModel):
    reply: str
