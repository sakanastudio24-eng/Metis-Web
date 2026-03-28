from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ApiEnv(BaseSettings):
    api_port: int = Field(alias="API_PORT", default=8000)
    database_url: str = Field(alias="DATABASE_URL")
    supabase_url: AnyHttpUrl = Field(alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(alias="SUPABASE_SERVICE_ROLE_KEY")
    resend_api_key: str = Field(alias="RESEND_API_KEY")
    frontend_url: AnyHttpUrl = Field(alias="FRONTEND_URL")

    model_config = SettingsConfigDict(env_file=(".env",), env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_env() -> ApiEnv:
    return ApiEnv()
