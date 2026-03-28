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

  if (nextPath && isSafeAuthNextPath(nextPath)) {
    url.searchParams.set("next", nextPath);
  }

  return url.toString();
}

export function isSafeAuthNextPath(nextPath: string | null | undefined): nextPath is string {
  return Boolean(nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//"));
}

export function getAuthErrorMessage(code: string | null): string | null {
  switch (code) {
    case "callback_failed":
      return "That sign-in link is not usable anymore. Try again.";
    case "oauth_cancelled":
      return "The provider sign-in was cancelled before it finished.";
    case "invalid_credentials":
      return "That email and password combination did not work.";
    case "verification_required":
      return "Check your inbox and confirm your email before signing in.";
    case "reset_failed":
      return "That recovery link is not usable anymore. Request a new one.";
    default:
      return null;
  }
}

export function getSupabaseAuthErrorCode(error: unknown): string | null {
  if (!(error instanceof Error) || !error.message) {
    return null;
  }

  const message = error.message.toLowerCase();

  if (message.includes("email not confirmed")) {
    return "verification_required";
  }

  if (message.includes("invalid login credentials") || message.includes("invalid grant")) {
    return "invalid_credentials";
  }

  return null;
}
