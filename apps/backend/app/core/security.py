import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.core.config import get_settings

settings = get_settings()

# PyJWT's PyJWKClient fetches Supabase's public signing keys and caches them,
# so we don't hit the JWKS endpoint on every single request.
_jwks_client = jwt.PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")


def decode_supabase_jwt(credentials: HTTPAuthorizationCredentials) -> dict:
    """Verify a Supabase-issued JWT and return its claims."""
    token = credentials.credentials
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        return jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
