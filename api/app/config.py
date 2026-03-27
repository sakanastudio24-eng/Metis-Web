from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ApiEnv(BaseSettings):
    api_port: int = Field(alias="API_PORT", default=8000)
    api_allowed_origins: str = Field(alias="API_ALLOWED_ORIGINS")
    auth_secret: str = Field(alias="AUTH_SECRET")
    google_client_id: str = Field(alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(alias="GOOGLE_CLIENT_SECRET")
    email_auth_from: str = Field(alias="EMAIL_AUTH_FROM")
    email_auth_server: str = Field(alias="EMAIL_AUTH_SERVER")
    next_public_site_url: AnyHttpUrl = Field(alias="NEXT_PUBLIC_SITE_URL")
    next_public_ward_studio_url: AnyHttpUrl = Field(alias="NEXT_PUBLIC_WARD_STUDIO_URL")
    next_public_metis_api_base_url: AnyHttpUrl = Field(alias="NEXT_PUBLIC_METIS_API_BASE_URL")

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_env() -> ApiEnv:
    return ApiEnv()
