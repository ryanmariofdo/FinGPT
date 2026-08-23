from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import or_, select

from app.deps import CurrentUserId, SessionDep
from app.models import Category, Transaction
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])


def _get_owned_category(session: SessionDep, category_id: UUID, user_id: UUID) -> Category:
    category = session.get(Category, category_id)
    if category is None or category.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.get("", response_model=list[CategoryRead])
def list_categories(session: SessionDep, user_id: CurrentUserId):
    statement = select(Category).where(
        or_(Category.user_id.is_(None), Category.user_id == user_id)
    )
    return session.exec(statement).all()


@router.post("", response_model=CategoryRead)
def create_category(category: CategoryCreate, session: SessionDep, user_id: CurrentUserId):
    db_category = Category(name=category.name, user_id=user_id)
    session.add(db_category)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Category '{category.name}' already exists",
        )
    session.refresh(db_category)
    return db_category


@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: UUID,
    update: CategoryUpdate,
    session: SessionDep,
    user_id: CurrentUserId,
):
    category = _get_owned_category(session, category_id, user_id)
    category.name = update.name
    session.add(category)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Category '{update.name}' already exists",
        )
    session.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: UUID, session: SessionDep, user_id: CurrentUserId):
    category = _get_owned_category(session, category_id, user_id)

    in_use_count = len(
        session.exec(select(Transaction).where(Transaction.category_id == category_id)).all()
    )
    if in_use_count:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete — {in_use_count} transaction(s) use this category",
        )

    session.delete(category)
    session.commit()
