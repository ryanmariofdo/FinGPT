from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class TransactionSource(str, Enum):
    manual = "manual"
    sms = "sms"


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True)

    title: str
    amount: Decimal = Field(max_digits=12, decimal_places=2)
    category_id: UUID | None = Field(default=None, foreign_key="categories.id")
    source: TransactionSource
    occurred_at: date

    created_at: datetime = Field(default_factory=datetime.utcnow)
