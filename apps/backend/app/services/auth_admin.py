from uuid import UUID

import httpx

from app.core.config import get_settings


def delete_auth_user(user_id: UUID) -> None:
    settings = get_settings()

    response = httpx.delete(
        f"{settings.supabase_url}/auth/v1/admin/users/{user_id}",
        headers={
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "apikey": settings.supabase_service_role_key,
        },
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Supabase Auth user delete failed ({response.status_code}): {response.text}")
