import hashlib
import re
from datetime import datetime, timedelta

from fastapi import APIRouter
from sqlmodel import select

from app.deps import CurrentUserId, SessionDep
from app.models import Transaction
from app.models.transaction import TransactionSource
from app.schemas.sms_ingest import SmsIngestRequest, SmsIngestResponse
from app.services.sms_parsing import parse_transaction_sms

DEDUPE_WINDOW = timedelta(minutes=5)
CONFIDENCE_THRESHOLD = 0.7

router = APIRouter(prefix="/transactions", tags=["sms-ingest"])


def _normalize(raw_text: str) -> str:
    return re.sub(r"\s+", " ", raw_text.strip().lower())


def _dedupe_hash(user_id, raw_text: str) -> str:
    normalized = _normalize(raw_text)
    return hashlib.sha256(f"{user_id}{normalized}".encode()).hexdigest()


@router.post("/ingest-sms", response_model=SmsIngestResponse)
def ingest_sms(body: SmsIngestRequest, session: SessionDep, user_id: CurrentUserId):
    dedupe_hash = _dedupe_hash(user_id, body.raw_text)
    window_start = datetime.utcnow() - DEDUPE_WINDOW

    statement = select(Transaction).where(
        Transaction.user_id == user_id,
        Transaction.dedupe_hash == dedupe_hash,
        Transaction.created_at >= window_start,
    )
    existing = session.exec(statement).first()
    if existing is not None:
        return SmsIngestResponse(transaction=existing, duplicate=True)

    fallback_occurred_at = (body.received_at or datetime.utcnow()).date()
    parsed = parse_transaction_sms(body.raw_text)

    if parsed is None or parsed.confidence < CONFIDENCE_THRESHOLD:
        db_transaction = Transaction(
            user_id=user_id,
            title="Unparsed SMS",
            amount=0,
            source=TransactionSource.sms,
            occurred_at=fallback_occurred_at,
            dedupe_hash=dedupe_hash,
            needs_review=True,
            raw_source_text=body.raw_text,
        )
    else:
        amount = parsed.amount if parsed.direction == "income" else -parsed.amount
        db_transaction = Transaction(
            user_id=user_id,
            title=parsed.title,
            amount=amount,
            source=TransactionSource.sms,
            occurred_at=parsed.occurred_at,
            dedupe_hash=dedupe_hash,
            needs_review=False,
            raw_source_text=body.raw_text,
        )
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)

    # Re-check after commit: a concurrent request (e.g. a retried/duplicate
    # POST arriving at nearly the same instant) could have passed the
    # earlier check before either row existed. Whichever row committed
    # first wins; if we lost the race, discard ours and return the winner.
    statement = select(Transaction).where(
        Transaction.user_id == user_id,
        Transaction.dedupe_hash == dedupe_hash,
        Transaction.created_at >= window_start,
        Transaction.id != db_transaction.id,
    )
    earlier = session.exec(statement).first()
    if earlier is not None and earlier.created_at < db_transaction.created_at:
        session.delete(db_transaction)
        session.commit()
        return SmsIngestResponse(transaction=earlier, duplicate=True)

    return SmsIngestResponse(transaction=db_transaction, duplicate=False)
