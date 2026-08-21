from functools import lru_cache

from openai import OpenAI

from app.core.config import get_settings


@lru_cache
def get_nvidia_client() -> OpenAI:
    return OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=get_settings().nvidia_api_key,
    )
