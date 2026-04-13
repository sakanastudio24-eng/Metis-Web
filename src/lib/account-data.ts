import type { PostgrestError, SupabaseClient, User } from "@supabase/supabase-js";

export type ProfileTier = "free" | "plus_beta" | "paid";

export type OnboardingRole =
  | "founder"
  | "engineer"
  | "product"
  | "design"
  | "marketing"
  | "ops"
  | "other";

export type OnboardingPrimaryGoal =
  | "reduce_cost"
  | "improve_performance"
  | "understand_stack"
  | "prep_for_launch"
  | "validate_ai_spend"
  | "other";

export type OnboardingTrafficBand =
  | "under_1k"
  | "1k_to_10k"
  | "10k_to_100k"
  | "100k_plus"
  | "not_sure";

export type OnboardingHostingProvider =
  | "vercel"
  | "netlify"
  | "cloudflare"
  | "aws"
  | "render"
  | "railway"
  | "other"
  | "not_sure";

export type OnboardingAppType =
  | "marketing"
  | "ecommerce"
  | "saas_dashboard"
  | "ai_app"
  | "internal_tool"
  | "docs_content"
  | "marketplace"
  | "portfolio"
  | "media_heavy"
  | "other"
  | "not_sure";

export type OnboardingTeamSize = "solo" | "two_to_five" | "six_to_twenty" | "twenty_plus";

export type OnboardingBiggestCostPain = "api" | "ai" | "assets" | "third_party" | "hosting" | "unclear" | "other";

export interface ProfileRow {
  id: string;
  email: string | null;
  username: string;
  tier: ProfileTier;
  is_beta: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingAnswersRow {
  user_id: string;
  role: OnboardingRole;
  primary_goal: OnboardingPrimaryGoal;
  traffic_band: OnboardingTrafficBand;
  hosting_provider: OnboardingHostingProvider;
  app_type: OnboardingAppType;
  team_size: OnboardingTeamSize;
  biggest_cost_pain: OnboardingBiggestCostPain;
  created_at: string;
  updated_at: string;
}

export interface UsageCounterRow {
  user_id: string;
  scans_used: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface TrackedSiteRow {
  user_id: string;
  origin: string;
  last_route: string | null;
  last_scanned_at: string;
  created_at: string;
  updated_at: string;
}

export interface AccountDataSnapshot {
  profile: ProfileRow;
  usage: UsageCounterRow;
  onboarding: OnboardingAnswersRow | null;
  sitesTracked: number;
}

export interface AccountDashboardSnapshot {
  email: string | null;
  username: string;
  tier: ProfileTier;
  isBeta: boolean;
  onboardingComplete: boolean;
  scansUsed: number;
  sitesTracked: number;
  periodStart: string;
  periodEnd: string;
}

type ClientLike = SupabaseClient;

function isMissingTrackedSitesError(error: PostgrestError | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || error.message.toLowerCase().includes("tracked_sites");
}

export const onboardingOptions = {
  role: [
    { value: "founder", label: "Founder" },
    { value: "engineer", label: "Engineer" },
    { value: "product", label: "Product" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "ops", label: "Ops" },
    { value: "other", label: "Other" }
  ] satisfies ReadonlyArray<{ value: OnboardingRole; label: string }>,
  primaryGoal: [
    { value: "reduce_cost", label: "Reduce cost" },
    { value: "improve_performance", label: "Improve performance" },
    { value: "understand_stack", label: "Understand my stack" },
    { value: "prep_for_launch", label: "Prepare for launch" },
    { value: "validate_ai_spend", label: "Validate AI spend" },
    { value: "other", label: "Other" }
  ] satisfies ReadonlyArray<{ value: OnboardingPrimaryGoal; label: string }>,
  trafficBand: [
    { value: "under_1k", label: "Under 1k" },
    { value: "1k_to_10k", label: "1k to 10k" },
    { value: "10k_to_100k", label: "10k to 100k" },
    { value: "100k_plus", label: "100k plus" },
    { value: "not_sure", label: "Not sure" }
  ] satisfies ReadonlyArray<{ value: OnboardingTrafficBand; label: string }>,
  hostingProvider: [
    { value: "vercel", label: "Vercel" },
    { value: "netlify", label: "Netlify" },
    { value: "cloudflare", label: "Cloudflare" },
    { value: "aws", label: "AWS" },
    { value: "render", label: "Render" },
    { value: "railway", label: "Railway" },
    { value: "other", label: "Other" },
    { value: "not_sure", label: "Not sure" }
  ] satisfies ReadonlyArray<{ value: OnboardingHostingProvider; label: string }>,
  appType: [
    { value: "marketing", label: "Marketing site" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "saas_dashboard", label: "SaaS dashboard" },
    { value: "ai_app", label: "AI app" },
    { value: "internal_tool", label: "Internal tool" },
    { value: "docs_content", label: "Docs or content" },
    { value: "marketplace", label: "Marketplace" },
    { value: "portfolio", label: "Portfolio" },
    { value: "media_heavy", label: "Media-heavy app" },
    { value: "other", label: "Other" },
    { value: "not_sure", label: "Not sure" }
  ] satisfies ReadonlyArray<{ value: OnboardingAppType; label: string }>,
  teamSize: [
    { value: "solo", label: "Solo" },
    { value: "two_to_five", label: "2 to 5" },
    { value: "six_to_twenty", label: "6 to 20" },
    { value: "twenty_plus", label: "20 plus" }
  ] satisfies ReadonlyArray<{ value: OnboardingTeamSize; label: string }>,
  biggestCostPain: [
    { value: "api", label: "API costs" },
    { value: "ai", label: "AI spend" },
    { value: "assets", label: "Assets" },
    { value: "third_party", label: "Third-party tools" },
    { value: "hosting", label: "Hosting" },
    { value: "unclear", label: "Still unclear" },
    { value: "other", label: "Other" }
  ] satisfies ReadonlyArray<{ value: OnboardingBiggestCostPain; label: string }>
} as const;

export function getUsageWindow(now = new Date()) {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString()
  };
}

export function normalizeAccountUsernameInput(value: string | null | undefined) {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized;
}

function baseUsernameFromEmail(email: string | null | undefined) {
  const local = email?.split("@", 1)[0] ?? "";
  const sanitized = normalizeAccountUsernameInput(local);
  return sanitized || "metis-user";
}

function buildUsernameCandidates(email: string | null | undefined, userId: string) {
  const base = baseUsernameFromEmail(email);
  return [base, `${base}-${userId.slice(0, 6)}`, `metis-${userId.slice(0, 8)}`];
}

function normalizeProfileTier(value: unknown): ProfileTier {
  return value === "plus_beta" || value === "paid" ? value : "free";
}

function normalizeProfileRow(value: unknown): ProfileRow | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;

  if (typeof row.id !== "string" || typeof row.username !== "string") {
    return null;
  }

  return {
    id: row.id,
    email: typeof row.email === "string" ? row.email : null,
    username: row.username,
    tier: normalizeProfileTier(row.tier),
    is_beta: row.is_beta === true,
    onboarding_complete: row.onboarding_complete === true,
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString()
  };
}

function normalizeOnboardingRow(value: unknown): OnboardingAnswersRow | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;

  if (
    typeof row.user_id !== "string" ||
    typeof row.role !== "string" ||
    typeof row.primary_goal !== "string" ||
    typeof row.traffic_band !== "string" ||
    typeof row.hosting_provider !== "string" ||
    typeof row.app_type !== "string" ||
    typeof row.team_size !== "string" ||
    typeof row.biggest_cost_pain !== "string"
  ) {
    return null;
  }

  return {
    user_id: row.user_id,
    role: row.role as OnboardingRole,
    primary_goal: row.primary_goal as OnboardingPrimaryGoal,
    traffic_band: row.traffic_band as OnboardingTrafficBand,
    hosting_provider: row.hosting_provider as OnboardingHostingProvider,
    app_type: row.app_type as OnboardingAppType,
    team_size: row.team_size as OnboardingTeamSize,
    biggest_cost_pain: row.biggest_cost_pain as OnboardingBiggestCostPain,
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString()
  };
}

function normalizeUsageRow(value: unknown): UsageCounterRow | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;

  if (typeof row.user_id !== "string") {
    return null;
  }

  return {
    user_id: row.user_id,
    scans_used: typeof row.scans_used === "number" ? row.scans_used : 0,
    period_start: typeof row.period_start === "string" ? row.period_start : getUsageWindow().periodStart,
    period_end: typeof row.period_end === "string" ? row.period_end : getUsageWindow().periodEnd,
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString()
  };
}

function normalizeTrackedSiteRow(value: unknown): TrackedSiteRow | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;

  if (typeof row.user_id !== "string" || typeof row.origin !== "string") {
    return null;
  }

  return {
    user_id: row.user_id,
    origin: row.origin,
    last_route: typeof row.last_route === "string" ? row.last_route : null,
    last_scanned_at: typeof row.last_scanned_at === "string" ? row.last_scanned_at : new Date().toISOString(),
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString(),
  };
}

async function getProfileRow(supabase: ClientLike, userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return normalizeProfileRow(data);
}

async function getOnboardingRow(supabase: ClientLike, userId: string) {
  const { data, error } = await supabase.from("onboarding_answers").select("*").eq("user_id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return normalizeOnboardingRow(data);
}

async function getUsageRow(supabase: ClientLike, userId: string) {
  const { data, error } = await supabase.from("usage_counters").select("*").eq("user_id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return normalizeUsageRow(data);
}

async function getTrackedSiteCount(supabase: ClientLike, userId: string) {
  const { data, error } = await supabase.from("tracked_sites").select("origin").eq("user_id", userId);

  if (error) {
    // tracked_sites is additive dashboard telemetry. Missing the follow-up
    // migration should not block auth callback completion or account access.
    if (isMissingTrackedSitesError(error)) {
      return 0;
    }
    throw error;
  }

  return Array.isArray(data) ? data.map(normalizeTrackedSiteRow).filter(Boolean).length : 0;
}

export async function upsertTrackedSite(
  supabase: ClientLike,
  userId: string,
  origin: string,
  route?: string | null
) {
  const { data, error } = await supabase
    .from("tracked_sites")
    .upsert(
      {
        user_id: userId,
        origin,
        last_route: route ?? null,
        last_scanned_at: new Date().toISOString(),
      },
      { onConflict: "user_id,origin" }
    )
    .select("*")
    .single();

  if (error) {
    // Scan-summary writes should keep working even if tracked_sites has not
    // been rolled out in every environment yet.
    if (isMissingTrackedSitesError(error)) {
      return null;
    }
    throw error;
  }

  const row = normalizeTrackedSiteRow(data);

  if (!row) {
    throw new Error("Could not store the tracked site.");
  }

  return row;
}

function isUniqueViolation(error: { code?: string } | null | undefined) {
  return error?.code === "23505";
}

async function insertProfileWithCandidate(
  supabase: ClientLike,
  user: User,
  username: string
) {
  const payload = {
    id: user.id,
    email: user.email ?? null,
    username
  };
  const { data, error } = await supabase.from("profiles").insert(payload).select("*").single();

  if (error) {
    if (isUniqueViolation(error)) {
      return null;
    }

    throw error;
  }

  return normalizeProfileRow(data);
}

async function ensureProfileRow(supabase: ClientLike, user: User) {
  const existing = await getProfileRow(supabase, user.id);

  if (!existing) {
    for (const candidate of buildUsernameCandidates(user.email, user.id)) {
      const inserted = await insertProfileWithCandidate(supabase, user, candidate);
      if (inserted) {
        return inserted;
      }
    }

    throw new Error("Could not create a unique profile username.");
  }

  if (existing.email !== (user.email ?? null)) {
    const { error } = await supabase
      .from("profiles")
      .update({ email: user.email ?? null })
      .eq("id", user.id);

    if (error) {
      throw error;
    }
  }

  if (existing.username.trim().length === 0) {
    for (const candidate of buildUsernameCandidates(user.email, user.id)) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ username: candidate, email: user.email ?? null })
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) {
        if (isUniqueViolation(error)) {
          continue;
        }

        throw error;
      }

      const updated = normalizeProfileRow(data);
      if (updated) {
        return updated;
      }
    }
  }

  return {
    ...existing,
    email: user.email ?? null
  };
}

async function ensureUsageCounterRow(supabase: ClientLike, userId: string) {
  const existing = await getUsageRow(supabase, userId);

  if (existing) {
    const now = new Date();
    const currentWindow = getUsageWindow(now);
    const currentEnd = Date.parse(existing.period_end);

    if (!Number.isNaN(currentEnd) && now.getTime() < currentEnd) {
      return existing;
    }

    const { data, error } = await supabase
      .from("usage_counters")
      .update({
        scans_used: 0,
        period_start: currentWindow.periodStart,
        period_end: currentWindow.periodEnd,
      })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const row = normalizeUsageRow(data);

    if (!row) {
      throw new Error("Could not reset the usage counter row.");
    }

    return row;
  }

  const { periodStart, periodEnd } = getUsageWindow();
  const { data, error } = await supabase
    .from("usage_counters")
    .insert({
      user_id: userId,
      scans_used: 0,
      period_start: periodStart,
      period_end: periodEnd
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const row = normalizeUsageRow(data);

  if (!row) {
    throw new Error("Could not create a usage counter row.");
  }

  return row;
}

export async function bootstrapAccountData(supabase: ClientLike, user: User): Promise<AccountDataSnapshot> {
  const profile = await ensureProfileRow(supabase, user);
  // Usage counters and onboarding answers are independent once the profile row
  // exists, so fetch them in parallel to avoid extra route latency.
  const [usage, onboarding, sitesTracked] = await Promise.all([
    ensureUsageCounterRow(supabase, user.id),
    getOnboardingRow(supabase, user.id),
    getTrackedSiteCount(supabase, user.id),
  ]);

  return {
    profile,
    usage,
    onboarding,
    sitesTracked,
  };
}

export function getAccountDashboardSnapshot(data: AccountDataSnapshot): AccountDashboardSnapshot {
  return {
    email: data.profile.email,
    username: data.profile.username,
    tier: data.profile.tier,
    isBeta: data.profile.is_beta,
    onboardingComplete: data.profile.onboarding_complete,
    scansUsed: data.usage.scans_used,
    sitesTracked: data.sitesTracked,
    periodStart: data.usage.period_start,
    periodEnd: data.usage.period_end
  };
}

export async function updateProfileUsername(supabase: ClientLike, userId: string, nextUsername: string) {
  const normalized = normalizeAccountUsernameInput(nextUsername);

  if (!normalized) {
    throw new Error("Username must include at least one letter or number.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ username: normalized })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const row = normalizeProfileRow(data);

  if (!row) {
    throw new Error("Could not update the username.");
  }

  return row;
}

export async function enrollAccountInPlusBeta(supabase: ClientLike, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      tier: "plus_beta",
      is_beta: true,
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const row = normalizeProfileRow(data);

  if (!row) {
    throw new Error("Could not update Plus Beta access.");
  }

  return row;
}

export async function incrementUsageCounter(supabase: ClientLike, userId: string) {
  const usage = await ensureUsageCounterRow(supabase, userId);
  const nextScansUsed = usage.scans_used + 1;

  const { data, error } = await supabase
    .from("usage_counters")
    .update({ scans_used: nextScansUsed })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const row = normalizeUsageRow(data);

  if (!row) {
    throw new Error("Could not increment the usage counter.");
  }

  return row;
}

export async function saveOnboardingAnswers(
  supabase: ClientLike,
  userId: string,
  answers: Omit<OnboardingAnswersRow, "user_id" | "created_at" | "updated_at">
) {
  const { error: answersError } = await supabase.from("onboarding_answers").upsert({
    user_id: userId,
    ...answers
  });

  if (answersError) {
    throw answersError;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ onboarding_complete: true })
    .eq("id", userId);

  if (profileError) {
    throw profileError;
  }
}

export async function skipOnboarding(supabase: ClientLike, userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_complete: true })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}
