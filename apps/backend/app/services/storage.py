from uuid import UUID, uuid4

import httpx

from app.core.config import get_settings

_BUCKET = "receipts"

_EXTENSION_BY_CONTENT_TYPE = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}


def upload_receipt_image(user_id: UUID, file_bytes: bytes, content_type: str) -> str:
    settings = get_settings()
    extension = _EXTENSION_BY_CONTENT_TYPE.get(content_type, "jpg")
    path = f"{user_id}/{uuid4()}.{extension}"

    response = httpx.put(
        f"{settings.supabase_url}/storage/v1/object/{_BUCKET}/{path}",
        headers={
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "apikey": settings.supabase_service_role_key,
            "Content-Type": content_type,
        },
        content=file_bytes,
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Supabase Storage upload failed ({response.status_code}): {response.text}")

    return path


def delete_receipt_image(path: str) -> None:
    settings = get_settings()

    response = httpx.delete(
        f"{settings.supabase_url}/storage/v1/object/{_BUCKET}/{path}",
        headers={
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "apikey": settings.supabase_service_role_key,
        },
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Supabase Storage delete failed ({response.status_code}): {response.text}")
