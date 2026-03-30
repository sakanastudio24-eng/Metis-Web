const TEMP_AUTH_COOKIE_NAME = "metis_temp_session";
const TEMP_AUTH_COOKIE_VALUE = "google-test";
const TEMP_AUTH_EMAIL = "google-test@local.metis";

export type TemporarySessionDetails = {
  kind: "temporary";
  isTemporary: true;
  email: string;
  provider: "google-test";
  emailConfirmed: true;
  user: null;
};

function isTemporaryAuthOptInEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_TEMP_AUTH === "true";
}

export function isTemporaryAuthEnabled(hostname?: string): boolean {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  if (!isTemporaryAuthOptInEnabled()) {
    return false;
  }

  if (!hostname) {
    return true;
  }

  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getTemporaryAuthCookieName() {
  return TEMP_AUTH_COOKIE_NAME;
}

export function getTemporaryAuthCookieValue() {
  return TEMP_AUTH_COOKIE_VALUE;
}

export function buildTemporarySession(): TemporarySessionDetails {
  return {
    kind: "temporary",
    isTemporary: true,
    email: TEMP_AUTH_EMAIL,
    provider: "google-test",
    emailConfirmed: true,
    user: null,
  };
}
