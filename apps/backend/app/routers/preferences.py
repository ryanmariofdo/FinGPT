from fastapi import APIRouter
from sqlmodel import select

from app.deps import CurrentUserId, SessionDep
from app.models import UserPreferences
from app.schemas.user_preferences import UserPreferencesRead, UserPreferencesUpdate

router = APIRouter(prefix="/preferences", tags=["preferences"])


def _get_or_create_preferences(session: SessionDep, user_id) -> UserPreferences:
    preferences = session.exec(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    ).first()
    if preferences is None:
        preferences = UserPreferences(user_id=user_id)
        session.add(preferences)
        session.commit()
        session.refresh(preferences)
    return preferences


@router.get("", response_model=UserPreferencesRead)
def get_preferences(session: SessionDep, user_id: CurrentUserId):
    return _get_or_create_preferences(session, user_id)


@router.patch("", response_model=UserPreferencesRead)
def update_preferences(
    update: UserPreferencesUpdate, session: SessionDep, user_id: CurrentUserId
):
    preferences = _get_or_create_preferences(session, user_id)
    preferences.currency = update.currency
    session.add(preferences)
    session.commit()
    session.refresh(preferences)
    return preferences
