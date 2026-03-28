import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.app.config import ApiEnv, get_env

app = FastAPI(
    title="Metis Web API",
    version="0.1.0",
    description="FastAPI backend for the Metis auth foundation and protected product routes.",
)

env = get_env()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(env.frontend_url)],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_env(config: ApiEnv) -> dict[str, object]:
    return {
        "api_port": config.api_port,
        "frontend_url": str(config.frontend_url),
        "has_database_url": bool(config.database_url),
        "has_supabase_service_role_key": bool(config.supabase_service_role_key),
        "has_resend_api_key": bool(config.resend_api_key),
    }


def get_bearer_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )

    return authorization.removeprefix("Bearer ").strip()


def fetch_authenticated_user(token: str, config: ApiEnv) -> dict[str, object]:
    request = Request(
        f"{str(config.supabase_url).rstrip('/')}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": config.supabase_service_role_key,
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        if exc.code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The auth token is not valid.",
            ) from exc
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase auth verification failed upstream.",
        ) from exc
    except URLError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase auth verification is unavailable.",
        ) from exc


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/readyz")
def readyz() -> JSONResponse:
    return JSONResponse({"status": "ready", "config": serialize_env(get_env())})


@app.get("/auth/me")
def auth_me(token: str = Depends(get_bearer_token)) -> dict[str, object]:
    user = fetch_authenticated_user(token, get_env())

    return {
        "user": {
            "id": user.get("id"),
            "email": user.get("email"),
            "role": user.get("role"),
            "aud": user.get("aud"),
        }
    }
