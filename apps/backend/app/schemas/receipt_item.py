from decimal import Decimal
from uuid import UUID

from sqlmodel import SQLModel


class ReceiptItemInput(SQLModel):
    name: str
    amount: Decimal


class ReceiptItemRead(SQLModel):
    id: UUID
    name: str
    amount: Decimal
