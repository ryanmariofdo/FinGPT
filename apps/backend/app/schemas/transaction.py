from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from sqlmodel import SQLModel

from app.models.transaction import TransactionSource


class TransactionCreate(SQLModel):
    title: str
    amount: Decimal
    category_id: UUID | None = None
    occurred_at: date


class TransactionUpdate(SQLModel):
    title: str | None = None
    amount: Decimal | None = None
    category_id: UUID | None = None
    occurred_at: date | None = None


class TransactionRead(SQLModel):
    id: UUID
    user_id: UUID
    title: str
    amount: Decimal
    category_id: UUID | None
    source: TransactionSource
    occurred_at: date
    created_at: datetime


class TransactionSummary(SQLModel):
    income: Decimal
    expenses: Decimal
    net: Decimal


class TransactionTrendPoint(SQLModel):
    bucket: date
    income: Decimal
    expenses: Decimal
    net: Decimal
