from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import or_, select

from app.deps import CurrentUserId, SessionDep
from app.models import Category
from app.schemas.category import CategoryCreate, CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


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
