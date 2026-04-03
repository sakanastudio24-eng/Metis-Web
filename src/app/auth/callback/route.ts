import { NextRequest, NextResponse } from "next/server";

import { getDefaultAuthCompletionPath, isSafeAuthNextPath } from "@/lib/auth";
import { getAuthSource } from "@/lib/contracts/communication";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const redirectBase = requestUrl.origin;
  const nextPath = requestUrl.searchParams.get("next");
  const source = getAuthSource(requestUrl.searchParams.get("source"));
  const localMagicLink = requestUrl.origin === "http://localhost:3000";
  // Extension auth keeps its own completion path, but normal web auth keeps
  // the usual post-auth destinations when the source marker is absent.
  const redirectPath = isSafeAuthNextPath(nextPath) ? nextPath : getDefaultAuthCompletionPath(source);

  if (error) {
    const failureUrl = new URL("/sign-in", redirectBase);
    if (source) {
      failureUrl.searchParams.set("source", source);
    }
    if (localMagicLink) {
      failureUrl.searchParams.set("magic_link", "local");
    }
    failureUrl.searchParams.set("error", error === "access_denied" ? "oauth_cancelled" : "callback_failed");

    if (errorDescription) {
      failureUrl.searchParams.set("message", errorDescription);
    }

    return NextResponse.redirect(failureUrl);
  }

  if (!code) {
    const failureUrl = new URL("/sign-in", redirectBase);
    if (source) {
      failureUrl.searchParams.set("source", source);
    }
    if (localMagicLink) {
      failureUrl.searchParams.set("magic_link", "local");
    }
    failureUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(failureUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const failureUrl = new URL("/sign-in", redirectBase);
    if (source) {
      failureUrl.searchParams.set("source", source);
    }
    if (localMagicLink) {
      failureUrl.searchParams.set("magic_link", "local");
    }
    failureUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(failureUrl);
  }

  const successUrl = new URL(redirectPath, redirectBase);

  if (!source && redirectPath === "/logged-in") {
    successUrl.searchParams.set("auth", "confirmed");
  }

  return NextResponse.redirect(successUrl);
}
