import { NextRequest, NextResponse } from "next/server";

import { getDefaultAuthCompletionPath, isSafeAuthNextPath } from "@/lib/auth";
import { METIS_EXTENSION_SOURCE, isExtensionAuthSource } from "@/lib/contracts/communication";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const redirectBase = requestUrl.origin;
  const nextPath = requestUrl.searchParams.get("next");
  const source = isExtensionAuthSource(requestUrl.searchParams.get("source")) ? METIS_EXTENSION_SOURCE : null;
  // Extension auth keeps its own completion path, but normal web auth keeps
  // the usual post-auth destinations when the source marker is absent.
  const redirectPath = isSafeAuthNextPath(nextPath) ? nextPath : getDefaultAuthCompletionPath(source);

  if (error) {
    const failureUrl = new URL("/sign-in", redirectBase);
    if (source) {
      failureUrl.searchParams.set("source", source);
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
    failureUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(new URL(redirectPath, redirectBase));
}
