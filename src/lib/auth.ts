export function getAuthCallbackUrl(origin?: string): string {
  if (origin) {
    return `${origin}/auth/callback`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }

  return "http://localhost:3000/auth/callback";
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
