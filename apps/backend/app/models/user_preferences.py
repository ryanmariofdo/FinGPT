from uuid import UUID, uuid4

from sqlalchemy import text
from sqlmodel import Field, SQLModel


class UserPreferences(SQLModel, table=True):
    __tablename__ = "user_preferences"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )
    user_id: UUID = Field(unique=True, index=True)
    currency: str = Field(default="USD", sa_column_kwargs={"server_default": "USD"})
