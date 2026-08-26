import logging

from fastapi import APIRouter, status
from sqlmodel import delete, select

from app.deps import CurrentUserId, SessionDep
from app.models import Category, ReceiptItem, Transaction, UserPreferences
from app.services.auth_admin import delete_auth_user
from app.services.storage import delete_receipt_image

logger = logging.getLogger(__name__)

router = APIRouter(tags=["account"])


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(session: SessionDep, user_id: CurrentUserId):
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == user_id)
    ).all()
    image_paths = [t.image_url for t in transactions if t.image_url]
    transaction_ids = [t.id for t in transactions]

    if transaction_ids:
        session.exec(
            delete(ReceiptItem).where(ReceiptItem.transaction_id.in_(transaction_ids))
        )
        session.exec(delete(Transaction).where(Transaction.user_id == user_id))

    session.exec(delete(UserPreferences).where(UserPreferences.user_id == user_id))
    session.exec(delete(Category).where(Category.user_id == user_id))
    session.commit()

    for path in image_paths:
        try:
            delete_receipt_image(path)
        except Exception:
            logger.warning("Failed to delete receipt image %s for user %s", path, user_id)

    try:
        delete_auth_user(user_id)
    except Exception:
        logger.warning("Failed to delete Supabase auth user %s", user_id)
