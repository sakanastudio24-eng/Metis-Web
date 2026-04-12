import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { incrementUsageCounter, upsertTrackedSite } from "@/lib/account-data";
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

export async function POST(request: NextRequest) {
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ detail: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json()) as {
    route?: unknown;
    score?: unknown;
    issueCount?: unknown;
    confidence?: unknown;
  };

  if (typeof payload.route !== "string") {
    return NextResponse.json({ detail: "Route is required." }, { status: 400 });
  }

  let origin: string;

  try {
    const parsed = new URL(payload.route);
    origin = parsed.origin;
  } catch {
    return NextResponse.json({ detail: "Route must be an absolute website URL." }, { status: 400 });
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
    return NextResponse.json({ detail: "Unauthorized." }, { status: 401 });
  }

  try {
    const [usage, trackedSite] = await Promise.all([
      incrementUsageCounter(supabase, user.id),
      upsertTrackedSite(supabase, user.id, origin, payload.route),
    ]);

    return NextResponse.json(
      {
        accepted: true,
        kind: "scan_summary",
        route: payload.route,
        scansUsed: usage.scans_used,
        trackedOrigin: trackedSite.origin,
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
        detail: error instanceof Error ? error.message : "The scan summary route could not update account metrics.",
      },
      { status: 502 }
    );
  }
}
