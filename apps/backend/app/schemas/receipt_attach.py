from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlmodel import SQLModel

from app.schemas.receipt_item import ReceiptItemInput


class ReceiptAttachRequest(SQLModel):
    items: list[ReceiptItemInput]
    image_url: str | None = None
    title: str | None = None
    category_id: UUID | None = None
    amount: Decimal | None = None
    occurred_at: date | None = None
