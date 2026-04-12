import { NextResponse } from "next/server";

import { PostgrestError } from "@supabase/supabase-js";

import {
  bootstrapAccountData,
  enrollAccountInPlusBeta,
  getAccountDashboardSnapshot,
} from "@/lib/account-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ detail: "You need to sign in first." }, { status: 401 });
  }

  try {
    await bootstrapAccountData(supabase, user);
    await enrollAccountInPlusBeta(supabase, user.id);
    const refreshed = await bootstrapAccountData(supabase, user);

    return NextResponse.json({
      account: getAccountDashboardSnapshot(refreshed),
    });
  } catch (error) {
    const detail =
      error instanceof PostgrestError && typeof error.message === "string"
        ? error.message
        : error instanceof Error
          ? error.message
          : "Could not enable Plus Beta for this account.";

    return NextResponse.json({ detail }, { status: 500 });
  }
}
