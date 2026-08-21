from datetime import date
from decimal import Decimal

from sqlmodel import SQLModel

from app.schemas.receipt_item import ReceiptItemInput


class ReceiptScanResponse(SQLModel):
    amount: Decimal
    title: str
    occurred_at: date
    confidence: float
    image_url: str
    items: list[ReceiptItemInput]
