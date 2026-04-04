import {
  METIS_AUTH_SUCCESS_PATH,
  type MetisAuthSource,
  isExtensionAuthSource,
} from "@/lib/contracts/communication";
import type { User } from "@supabase/supabase-js";
import { siteConfig } from "@/lib/site";

// Callback completion is deliberately narrow so auth cannot bounce users
// through arbitrary internal paths.
const ALLOWED_AUTH_REDIRECTS = new Set([
  "/logged-in",
  "/account",
  "/account/pricing",
  "/account/settings",
  "/account/security",
  METIS_AUTH_SUCCESS_PATH,
]);

function getAuthOrigin(origin?: string): string {
  if (origin) {
    return origin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return siteConfig.url;
}

export function getDefaultAuthCompletionPath(source?: string | null): string {
  return isExtensionAuthSource(source) ? METIS_AUTH_SUCCESS_PATH : "/logged-in";
}

export function getAuthCallbackUrl(origin?: string, nextPath?: string, source?: MetisAuthSource | null): string {
  const url = new URL("/auth/callback", getAuthOrigin(origin));

  // The callback only completes provider auth and magic-link auth. It should
  // never become a generic redirect surface.
  if (nextPath && isSafeAuthNextPath(nextPath)) {
    url.searchParams.set("next", nextPath);
  }

  if (source) {
    url.searchParams.set("source", source);
  }

  return url.toString();
}

export function isLocalMagicLinkCallbackEnabled(value: string | null | undefined): boolean {
  return value === "local";
}

export function getMagicLinkCallbackUrl(nextPath?: string, source?: MetisAuthSource | null, localOverride = false): string {
  // Magic links default to the real site so cross-device sign-in can finish on
  // a phone or another laptop. Localhost stays opt-in for same-browser testing.
  const url = new URL(getAuthCallbackUrl(localOverride ? "http://localhost:3000" : siteConfig.url, nextPath, source));

  if (localOverride) {
    url.searchParams.set("magic_link", "local");
  }

  return url.toString();
}

export function deriveAccountUsername(email: string | null | undefined): string {
  return (email?.split("@")[0] ?? "").trim().toLowerCase();
}

export function getDeletedAtFromUser(user: Pick<User, "user_metadata"> | null | undefined): string | null {
  const deletedAt = user?.user_metadata?.deleted_at;
  return typeof deletedAt === "string" && deletedAt.length > 0 ? deletedAt : null;
}

export function isDeletedUser(user: Pick<User, "user_metadata"> | null | undefined): boolean {
  return Boolean(getDeletedAtFromUser(user));
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
