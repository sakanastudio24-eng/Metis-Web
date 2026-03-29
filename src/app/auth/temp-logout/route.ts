import { NextResponse } from "next/server";

import { getTemporaryAuthCookieName } from "@/lib/temp-auth";

// TODO(remove-temp-auth): Remove the local-only temporary account path after auth review is complete.
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getTemporaryAuthCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });
  return response;
}
