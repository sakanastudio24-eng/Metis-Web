import { NextResponse } from "next/server";

import { getAuthenticatedUserOrNull } from "@/lib/auth-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const extensionId = url.searchParams.get("extensionId");
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    const target = new URL("/sign-in?source=extension", url);

    if (extensionId) {
      target.searchParams.set("extensionId", extensionId);
    }

    return NextResponse.redirect(target);
  }

  if (user.deletedAt) {
    return NextResponse.redirect(new URL("/account-deleted", url));
  }

  const target = new URL("/account/settings?source=extension", url);

  if (extensionId) {
    target.searchParams.set("extensionId", extensionId);
  }

  return NextResponse.redirect(target);
}
