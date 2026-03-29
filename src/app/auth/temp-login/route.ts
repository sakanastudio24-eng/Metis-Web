import { NextRequest, NextResponse } from "next/server";

import {
  getTemporaryAuthCookieName,
  getTemporaryAuthCookieValue,
  isTemporaryAuthEnabled,
} from "@/lib/temp-auth";

// TODO(remove-temp-auth): Remove the local-only temporary account path after auth review is complete.
export async function POST(request: NextRequest) {
  if (!isTemporaryAuthEnabled(request.nextUrl.hostname)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getTemporaryAuthCookieName(),
    value: getTemporaryAuthCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return response;
}
