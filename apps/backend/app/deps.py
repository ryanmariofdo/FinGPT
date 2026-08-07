from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.core.security import decode_supabase_jwt
from app.db.session import get_session

SessionDep = Annotated[Session, Depends(get_session)]

bearer_scheme = HTTPBearer()


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
) -> UUID:
    claims = decode_supabase_jwt(credentials)
    return UUID(claims["sub"])


CurrentUserId = Annotated[UUID, Depends(get_current_user_id)]
