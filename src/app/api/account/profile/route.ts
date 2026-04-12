import { NextResponse } from "next/server";

import { bootstrapAccountData, getAccountDashboardSnapshot, updateProfileUsername } from "@/lib/account-data";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function isUniqueViolation(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: unknown }).code === "23505"
  );
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const payload = (await request.json()) as { username?: unknown };

    if (typeof payload.username !== "string") {
      return NextResponse.json({ detail: "Username is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    await updateProfileUsername(supabase, user.user.id, payload.username);
    const accountData = await bootstrapAccountData(supabase, user.user);

    return NextResponse.json({
      account: getAccountDashboardSnapshot(accountData),
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ detail: "That username is already in use." }, { status: 409 });
    }

    return NextResponse.json(
      {
        detail: error instanceof Error ? error.message : "Could not update the account profile.",
      },
      { status: 500 }
    );
  }
}
