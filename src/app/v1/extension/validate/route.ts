import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { bootstrapAccountData, getAccountDashboardSnapshot } from "@/lib/account-data";
import { getWebEnv } from "@/lib/env";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token.length >= 20 ? token : null;
}

function deriveAccountState(account: ReturnType<typeof getAccountDashboardSnapshot>) {
  const plusBetaEnabled = account.tier === "plus_beta" || account.tier === "paid" || account.isBeta;
  const apiBetaEnabled = account.tier === "plus_beta" || account.tier === "paid";

  return {
    plan: account.tier,
    plus_beta_enabled: plusBetaEnabled,
    api_beta_enabled: apiBetaEnabled,
    allow_plus_ui: plusBetaEnabled,
    allow_report_email: plusBetaEnabled,
  };
}

export async function POST(request: NextRequest) {
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json(
      { detail: "Unauthorized." },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": "Bearer",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const env = getWebEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json(
      { detail: "Unauthorized." },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": "Bearer",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    const accountData = await bootstrapAccountData(supabase, user);
    const dashboard = getAccountDashboardSnapshot(accountData);

    return NextResponse.json(
      {
        account: deriveAccountState(dashboard),
        bridgeAccount: {
          email: dashboard.email,
          username: dashboard.username,
          scansUsed: dashboard.scansUsed,
          tier: dashboard.tier,
          isBeta: dashboard.isBeta,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "The extension validation route could not load the account snapshot.",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
