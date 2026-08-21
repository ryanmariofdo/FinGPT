from datetime import date
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.deps import CurrentUserId, SessionDep
from app.models import ReceiptItem, Transaction
from app.models.transaction import TransactionSource
from app.schemas.receipt_attach import ReceiptAttachRequest
from app.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionSummary,
    TransactionTrendPoint,
    TransactionUpdate,
)

_TREND_BUCKET_UNIT = {
    "daily": "day",
    "weekly": "week",
    "monthly": "month",
    "yearly": "year",
}

router = APIRouter(prefix="/transactions", tags=["transactions"])


def _get_owned_transaction(session: SessionDep, transaction_id: UUID, user_id: UUID) -> Transaction:
    transaction = session.get(Transaction, transaction_id)
    if transaction is None or transaction.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction


def _apply_date_and_category_filters(statement, date_from, date_to, category_id):
    if date_from is not None:
        statement = statement.where(Transaction.occurred_at >= date_from)
    if date_to is not None:
        statement = statement.where(Transaction.occurred_at <= date_to)
    if category_id is not None:
        statement = statement.where(Transaction.category_id == category_id)
    return statement


def _to_read(transaction: Transaction, items: list[ReceiptItem]) -> TransactionRead:
    return TransactionRead(**transaction.model_dump(), items=items)


def _read_with_items(session: SessionDep, transaction: Transaction) -> TransactionRead:
    items = session.exec(
        select(ReceiptItem).where(ReceiptItem.transaction_id == transaction.id)
    ).all()
    return _to_read(transaction, items)


def _reads_with_items(session: SessionDep, transactions: list[Transaction]) -> list[TransactionRead]:
    transaction_ids = [t.id for t in transactions]
    all_items = session.exec(
        select(ReceiptItem).where(ReceiptItem.transaction_id.in_(transaction_ids))
    ).all()
    items_by_transaction: dict[UUID, list[ReceiptItem]] = {}
    for item in all_items:
        items_by_transaction.setdefault(item.transaction_id, []).append(item)
    return [_to_read(t, items_by_transaction.get(t.id, [])) for t in transactions]


@router.post("", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate, session: SessionDep, user_id: CurrentUserId
):
    fields = transaction.model_dump(exclude={"items"})
    db_transaction = Transaction(
        **fields,
        user_id=user_id,
        source=TransactionSource.manual,
    )
    session.add(db_transaction)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category_id",
        )
    session.refresh(db_transaction)

    db_items = []
    if transaction.items:
        db_items = [
            ReceiptItem(transaction_id=db_transaction.id, name=item.name, amount=item.amount)
            for item in transaction.items
        ]
        session.add_all(db_items)
        session.commit()
        session.refresh(db_transaction)

    return _to_read(db_transaction, db_items)


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    session: SessionDep,
    user_id: CurrentUserId,
    date_from: date | None = None,
    date_to: date | None = None,
    source: TransactionSource | None = None,
    category_id: UUID | None = None,
    type: Literal["income", "expense"] | None = None,
):
    statement = select(Transaction).where(Transaction.user_id == user_id)
    statement = _apply_date_and_category_filters(statement, date_from, date_to, category_id)
    if source is not None:
        statement = statement.where(Transaction.source == source)
    if type == "income":
        statement = statement.where(Transaction.amount > 0)
    elif type == "expense":
        statement = statement.where(Transaction.amount < 0)
    return _reads_with_items(session, session.exec(statement).all())


@router.get("/summary", response_model=TransactionSummary)
def get_transaction_summary(
    session: SessionDep,
    user_id: CurrentUserId,
    date_from: date | None = None,
    date_to: date | None = None,
    category_id: UUID | None = None,
):
    statement = select(
        func.coalesce(func.sum(Transaction.amount).filter(Transaction.amount > 0), 0).label(
            "income"
        ),
        func.coalesce(func.sum(Transaction.amount).filter(Transaction.amount < 0), 0).label(
            "expenses"
        ),
        func.coalesce(func.sum(Transaction.amount), 0).label("net"),
    ).where(Transaction.user_id == user_id)
    statement = _apply_date_and_category_filters(statement, date_from, date_to, category_id)

    income, expenses, net = session.exec(statement).one()
    return TransactionSummary(income=income, expenses=abs(expenses), net=net)


@router.get("/trend", response_model=list[TransactionTrendPoint])
def get_transaction_trend(
    session: SessionDep,
    user_id: CurrentUserId,
    range: Literal["daily", "weekly", "monthly", "yearly"],
    date_from: date | None = None,
    date_to: date | None = None,
    category_id: UUID | None = None,
):
    bucket = func.date_trunc(_TREND_BUCKET_UNIT[range], Transaction.occurred_at).label("bucket")
    statement = (
        select(
            bucket,
            func.coalesce(func.sum(Transaction.amount).filter(Transaction.amount > 0), 0).label(
                "income"
            ),
            func.coalesce(func.sum(Transaction.amount).filter(Transaction.amount < 0), 0).label(
                "expenses"
            ),
            func.coalesce(func.sum(Transaction.amount), 0).label("net"),
        )
        .where(Transaction.user_id == user_id)
        .group_by(bucket)
        .order_by(bucket)
    )
    statement = _apply_date_and_category_filters(statement, date_from, date_to, category_id)

    return [
        TransactionTrendPoint(bucket=row.bucket, income=row.income, expenses=abs(row.expenses), net=row.net)
        for row in session.exec(statement).all()
    ]


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(transaction_id: UUID, session: SessionDep, user_id: CurrentUserId):
    transaction = _get_owned_transaction(session, transaction_id, user_id)
    return _read_with_items(session, transaction)


@router.patch("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: UUID,
    update: TransactionUpdate,
    session: SessionDep,
    user_id: CurrentUserId,
):
    transaction = _get_owned_transaction(session, transaction_id, user_id)
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)
    session.add(transaction)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category_id",
        )
    session.refresh(transaction)
    return _read_with_items(session, transaction)


@router.post("/{transaction_id}/receipt-items", response_model=TransactionRead)
def attach_receipt_items(
    transaction_id: UUID,
    body: ReceiptAttachRequest,
    session: SessionDep,
    user_id: CurrentUserId,
):
    transaction = _get_owned_transaction(session, transaction_id, user_id)

    existing_items = session.exec(
        select(ReceiptItem).where(ReceiptItem.transaction_id == transaction.id)
    ).all()
    for item in existing_items:
        session.delete(item)

    transaction.image_url = body.image_url
    if body.amount is not None:
        transaction.amount = body.amount
    if body.occurred_at is not None:
        transaction.occurred_at = body.occurred_at
    session.add(transaction)

    db_items = [
        ReceiptItem(transaction_id=transaction.id, name=item.name, amount=item.amount)
        for item in body.items
    ]
    session.add_all(db_items)
    session.commit()
    session.refresh(transaction)

    return _to_read(transaction, db_items)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: UUID, session: SessionDep, user_id: CurrentUserId):
    transaction = _get_owned_transaction(session, transaction_id, user_id)
    session.delete(transaction)
    session.commit()
