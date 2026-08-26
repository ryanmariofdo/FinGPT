from datetime import datetime

from sqlmodel import SQLModel

from app.schemas.transaction import TransactionRead


class SmsIngestRequest(SQLModel):
    raw_text: str
    received_at: datetime | None = None


class SmsIngestResponse(SQLModel):
    transaction: TransactionRead | None
    duplicate: bool
    skipped: bool = False
