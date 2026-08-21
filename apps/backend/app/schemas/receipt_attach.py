from datetime import date
from decimal import Decimal

from sqlmodel import SQLModel

from app.schemas.receipt_item import ReceiptItemInput


class ReceiptAttachRequest(SQLModel):
    image_url: str
    items: list[ReceiptItemInput]
    amount: Decimal | None = None
    occurred_at: date | None = None
