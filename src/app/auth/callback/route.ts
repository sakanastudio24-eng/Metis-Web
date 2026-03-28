import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const redirectBase = requestUrl.origin;

  if (error) {
    const failureUrl = new URL("/sign-in", redirectBase);
    failureUrl.searchParams.set("error", error === "access_denied" ? "oauth_cancelled" : "callback_failed");

    if (errorDescription) {
      failureUrl.searchParams.set("message", errorDescription);
    }

    return NextResponse.redirect(failureUrl);
  }

  if (!code) {
    const failureUrl = new URL("/sign-in", redirectBase);
    failureUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(failureUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const failureUrl = new URL("/sign-in", redirectBase);
    failureUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(new URL("/logged-in", redirectBase));
}
