from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import text
from sqlmodel import Field, SQLModel


class TransactionSource(str, Enum):
    manual = "manual"
    sms = "sms"
    receipt = "receipt"


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )
    user_id: UUID = Field(index=True)

    title: str
    amount: Decimal = Field(max_digits=12, decimal_places=2)
    category_id: UUID | None = Field(default=None, foreign_key="categories.id")
    source: TransactionSource
    occurred_at: date
    dedupe_hash: str | None = Field(default=None, index=True)
    needs_review: bool = Field(default=False)
    raw_source_text: str | None = Field(default=None)
    image_url: str | None = Field(default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow)
