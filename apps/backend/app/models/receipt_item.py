from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import text
from sqlmodel import Field, SQLModel


class ReceiptItem(SQLModel, table=True):
    __tablename__ = "receipt_items"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )
    transaction_id: UUID = Field(foreign_key="transactions.id", index=True)

    name: str
    amount: Decimal = Field(max_digits=12, decimal_places=2)

    created_at: datetime = Field(default_factory=datetime.utcnow)
