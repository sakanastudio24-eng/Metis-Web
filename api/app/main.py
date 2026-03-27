from fastapi import FastAPI
from fastapi.responses import JSONResponse

from api.app.config import ApiEnv, get_env

app = FastAPI(
    title="Metis Web API",
    version="0.1.0",
    description="Small FastAPI scaffold for the future Metis auth and product routes.",
)


def serialize_env(env: ApiEnv) -> dict[str, object]:
    return {
        "api_port": env.api_port,
        "api_allowed_origins": env.api_allowed_origins,
        "next_public_site_url": str(env.next_public_site_url),
        "next_public_ward_studio_url": str(env.next_public_ward_studio_url),
        "next_public_metis_api_base_url": str(env.next_public_metis_api_base_url),
    }


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/readyz")
def readyz() -> JSONResponse:
    env = get_env()
    return JSONResponse({"status": "ready", "config": serialize_env(env)})
