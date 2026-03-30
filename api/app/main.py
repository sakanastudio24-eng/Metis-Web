import json
from json import JSONDecodeError
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import Depends, FastAPI, Header, HTTPException, Request as FastAPIRequest, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict

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
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
)


@app.middleware("http")
async def add_security_headers(request: FastAPIRequest, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


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
            detail="Unauthorized.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.removeprefix("Bearer ").strip()

    if len(token) < 20:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token


def fetch_authenticated_user(token: str, config: ApiEnv) -> dict[str, object]:
    request = Request(
        f"{str(config.supabase_url).rstrip('/')}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": config.supabase_service_role_key,
            "Accept": "application/json",
        },
    )

    try:
        with urlopen(request, timeout=5) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        if exc.code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase auth verification failed upstream.",
        ) from exc
    except JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase auth verification failed upstream.",
        ) from exc
    except URLError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase auth verification is unavailable.",
        ) from exc


class UsageEventPayload(BaseModel):
    type: str
    occurredAt: int
    route: str | None = None

    model_config = ConfigDict(extra="forbid")


class ScanSummaryPayload(BaseModel):
    route: str
    score: float | None = None
    issueCount: int
    confidence: str | None = None

    model_config = ConfigDict(extra="forbid")


class PremiumReportRequestPayload(BaseModel):
    route: str
    requestedAt: int
    source: str

    model_config = ConfigDict(extra="forbid")


def _meta_bool(meta: dict[str, object], *keys: str) -> bool:
    for key in keys:
        value = meta.get(key)
        if isinstance(value, bool):
            return value
    return False


def derive_account_state(user: dict[str, object]) -> dict[str, object]:
    app_meta = user.get("app_metadata")
    user_meta = user.get("user_metadata")

    app_meta = app_meta if isinstance(app_meta, dict) else {}
    user_meta = user_meta if isinstance(user_meta, dict) else {}

    plan = next(
        (
            value
            for value in (
                app_meta.get("plan"),
                app_meta.get("tier"),
                user_meta.get("plan"),
                user_meta.get("tier"),
            )
            if isinstance(value, str)
        ),
        "free",
    )

    if plan not in {"free", "plus_beta", "paid"}:
        plan = "free"

    # A valid signed-in user still defaults to free unless backend metadata says
    # otherwise. Authenticated does not imply beta or paid access.
    plus_beta_enabled = _meta_bool(app_meta, "plus_beta_enabled", "plusBetaEnabled") or _meta_bool(
        user_meta,
        "plus_beta_enabled",
        "plusBetaEnabled",
    ) or plan == "plus_beta"
    api_beta_enabled = _meta_bool(app_meta, "api_beta_enabled", "apiBetaEnabled") or _meta_bool(
        user_meta,
        "api_beta_enabled",
        "apiBetaEnabled",
    )
    allow_plus_ui = _meta_bool(app_meta, "allow_plus_ui", "allowPlusUi") or plus_beta_enabled
    allow_report_email = _meta_bool(app_meta, "allow_report_email", "allowReportEmail") or _meta_bool(
        user_meta,
        "allow_report_email",
        "allowReportEmail",
    )

    return {
        "plan": plan,
        "plus_beta_enabled": plus_beta_enabled,
        "api_beta_enabled": api_beta_enabled,
        "allow_plus_ui": allow_plus_ui,
        "allow_report_email": allow_report_email,
    }


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


@app.post("/v1/extension/validate")
def extension_validate(token: str = Depends(get_bearer_token)) -> dict[str, object]:
    user = fetch_authenticated_user(token, get_env())
    account = derive_account_state(user)

    return {
        "account": account,
    }


@app.post("/api/events")
def api_events(payload: UsageEventPayload, token: str = Depends(get_bearer_token)) -> dict[str, object]:
    fetch_authenticated_user(token, get_env())
    return {"accepted": True, "kind": "event", "type": payload.type}


@app.post("/api/scan-summary")
def api_scan_summary(payload: ScanSummaryPayload, token: str = Depends(get_bearer_token)) -> dict[str, object]:
    fetch_authenticated_user(token, get_env())
    return {"accepted": True, "kind": "scan_summary", "route": payload.route}


@app.post("/api/premium-report-request")
def api_premium_report_request(
    payload: PremiumReportRequestPayload,
    token: str = Depends(get_bearer_token),
) -> dict[str, object]:
    fetch_authenticated_user(token, get_env())
    return {"accepted": True, "kind": "premium_report_request", "route": payload.route}
