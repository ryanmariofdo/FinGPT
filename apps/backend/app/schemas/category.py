from uuid import UUID

from sqlmodel import SQLModel


class CategoryRead(SQLModel):
    id: UUID
    user_id: UUID | None
    name: str


class CategoryCreate(SQLModel):
    name: str
