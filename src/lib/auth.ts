const ALLOWED_AUTH_REDIRECTS = new Set([
  "/logged-in",
  "/account",
  "/account/security",
]);

function getAuthOrigin(origin?: string): string {
  if (origin) {
    return origin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(origin?: string, nextPath?: string): string {
  const url = new URL("/auth/callback", getAuthOrigin(origin));

  // The callback only completes provider auth and magic-link auth. It should
  // never become a generic redirect surface.
  if (nextPath && isSafeAuthNextPath(nextPath)) {
    url.searchParams.set("next", nextPath);
  }

  return url.toString();
}

export function isSafeAuthNextPath(nextPath: string | null | undefined): nextPath is string {
  return Boolean(nextPath && ALLOWED_AUTH_REDIRECTS.has(nextPath));
}

export function getAuthErrorMessage(code: string | null): string | null {
  switch (code) {
    case "callback_failed":
      return "Link expired or already used. Send a new link to keep going.";
    case "oauth_cancelled":
      return "The provider sign-in was cancelled before it finished.";
    default:
      return null;
  }
}
