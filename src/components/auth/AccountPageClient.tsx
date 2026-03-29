"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Cpu,
  CreditCard,
  Globe,
  KeyRound,
  Layers,
  LogOut,
  Mail,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";

import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { clearTemporaryAuthSession } from "@/lib/temp-auth-client";
import { useTemporarySessionGuard } from "@/components/auth/useTemporarySessionGuard";

type AccountPageClientProps = {
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  isTemporary?: boolean;
};

type DashboardSection = "account" | "security" | "pricing" | "settings";

const NAV_ACTIVE = [
  { id: "account" as const, label: "Account", icon: UserRound },
  { id: "security" as const, label: "Security", icon: ShieldCheck },
  { id: "pricing" as const, label: "Plan & Pricing", icon: CreditCard },
  { id: "settings" as const, label: "Metis settings", icon: Settings2 },
];

const NAV_SOON = [
  { label: "Analytics", icon: BarChart3 },
  { label: "CDN", icon: Globe },
  { label: "Deployments", icon: Layers },
  { label: "Usage", icon: Cpu },
  { label: "AI insights", icon: Sparkles },
];

const USAGE_DATA = [
  { day: "Mon", scans: 12 },
  { day: "Tue", scans: 19 },
  { day: "Wed", scans: 8 },
  { day: "Thu", scans: 26 },
  { day: "Fri", scans: 34 },
  { day: "Sat", scans: 18 },
  { day: "Sun", scans: 22 },
];

const PLAN_CARDS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    detail: "forever",
    description: "For individuals exploring Metis.",
    highlight: false,
    current: true,
    features: ["50 page scans / month", "3 tracked sites", "Core issue detection", "7-day history"],
  },
  {
    id: "plus",
    name: "Plus",
    price: "$12",
    detail: "/ month",
    description: "For growing teams that want deeper review and faster fixes.",
    highlight: true,
    current: false,
    features: [
      "Unlimited scans",
      "20 tracked sites",
      "AI scoring + fix suggestions",
      "90-day history",
      "Priority support",
    ],
  },
];

function getProviderLabel(provider: string) {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "google-test":
      return "Google test account";
    default:
      return "Email";
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
      {children}
    </p>
  );
}

function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border border-white/8 bg-[#0f1219] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.32)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AccountPageClient({
  email,
  provider,
  emailConfirmed,
  isTemporary = false,
}: AccountPageClientProps) {
  const copy = authCopy.account;
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const isResettingTemporarySession = useTemporarySessionGuard(isTemporary);
  const [activeSection, setActiveSection] = useState<DashboardSection>("account");
  const [isPending, startTransition] = useTransition();

  const currentProviderLabel = useMemo(() => getProviderLabel(provider), [provider]);
  const usagePeak = Math.max(...USAGE_DATA.map((point) => point.scans));

  function handleSignOut() {
    startTransition(async () => {
      if (isTemporary) {
        await clearTemporaryAuthSession();
      } else {
        await supabase.auth.signOut();
      }
      router.replace("/sign-in");
    });
  }

  if (isResettingTemporarySession) {
    return null;
  }

  const sectionMeta: Record<DashboardSection, { eyebrow: string; title: string; body: string }> = {
    account: {
      eyebrow: copy.accountSectionTitle,
      title: "Account overview",
      body: "A dashboard-first view of identity, access state, and the activity Metis is already shaping around your setup.",
    },
    security: {
      eyebrow: copy.securityTitle,
      title: "Security",
      body: "See what is active, what sign-in method is in use, and where the deeper security controls open next.",
    },
    pricing: {
      eyebrow: copy.pricingSectionTitle,
      title: "Plan & Pricing",
      body: "Keep plan state and upgrade visibility in one place without turning the dashboard into a billing app.",
    },
    settings: {
      eyebrow: copy.settingsSectionTitle,
      title: "Metis settings",
      body: "Keep the browser extension as the settings entry point while the web dashboard stays focused on account review.",
    },
  };

  return (
    <main className="min-h-screen bg-[#090b10] px-4 py-6 text-[#eceef4] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4">
        <div className="flex items-center justify-between rounded-[18px] border border-white/8 bg-[#0f1219] px-5 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dc5e5e] text-sm font-semibold text-white shadow-[0_12px_28px_rgba(220,94,94,0.32)]">
              M
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Metis dashboard</p>
              <p className="text-xs text-white/40">Account, security, pricing, and extension settings</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Private route
            </div>
            <div
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                emailConfirmed
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                  : "border-[#dc5e5e]/25 bg-[#dc5e5e]/10 text-[#ffb8b8]"
              }`}
            >
              {emailConfirmed ? copy.verifiedLabel : copy.unverifiedLabel}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[228px_minmax(0,1fr)_300px]">
          <aside className="rounded-[22px] border border-white/8 bg-[#0d1016] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <SectionLabel>Sections</SectionLabel>
            <div className="mt-3 space-y-1.5">
              {NAV_ACTIVE.map(({ id, label, icon: Icon }) => {
                const selected = activeSection === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition ${
                      selected
                        ? "border border-[#dc5e5e]/30 bg-[#dc5e5e]/12 text-white"
                        : "border border-transparent bg-transparent text-white/60 hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <SectionLabel>Coming soon</SectionLabel>
              <div className="mt-3 space-y-1.5">
                {NAV_SOON.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[14px] border border-transparent px-3 py-3 text-white/28"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-[22px] border border-white/8 bg-[#0d1016] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/8 pb-5">
              <div className="space-y-2">
                <SectionLabel>{sectionMeta[activeSection].eyebrow}</SectionLabel>
                <h1 className="font-serif text-4xl tracking-[-0.04em] text-white">{sectionMeta[activeSection].title}</h1>
                <p className="max-w-2xl text-sm leading-6 text-white/55">{sectionMeta[activeSection].body}</p>
              </div>
              {isTemporary ? (
                <div className="max-w-[240px] rounded-[14px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 px-4 py-3 text-sm leading-6 text-[#ffb8b8]">
                  {copy.temporaryAccountBody}
                </div>
              ) : null}
            </div>

            {activeSection === "account" ? (
              <div className="flex flex-col gap-5">
                <DashboardCard className="bg-[linear-gradient(180deg,#131720,#0f1219)]">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#dc5e5e]/30 bg-[#dc5e5e]/15 text-xl font-semibold text-white shadow-[0_18px_40px_rgba(220,94,94,0.2)]">
                        M
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-serif text-[30px] tracking-[-0.03em] text-white">{email ?? "No email available"}</h2>
                          <div className="rounded-full border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffb8b8]">
                            {copy.planValue}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-white/50">{copy.accountSectionBody}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                            {currentProviderLabel}
                          </div>
                          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                            Account ready
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px]">
                      <div className="rounded-[16px] border border-white/8 bg-[#121621] px-4 py-4">
                        <SectionLabel>Verification</SectionLabel>
                        <p className="mt-2 text-base font-medium text-white">
                          {emailConfirmed ? copy.verifiedLabel : copy.unverifiedLabel}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/45">
                          {emailConfirmed
                            ? "This account can move through the full web flow."
                            : "Finish email verification to unlock the full production auth path."}
                        </p>
                      </div>
                      <div className="rounded-[16px] border border-white/8 bg-[#121621] px-4 py-4">
                        <SectionLabel>First signal</SectionLabel>
                        <p className="mt-2 text-base font-medium text-white">Dashboard live</p>
                        <p className="mt-2 text-sm leading-6 text-white/45">
                          The account dashboard, security review, and plan surface are ready from this view.
                        </p>
                      </div>
                    </div>
                  </div>
                </DashboardCard>

                <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                  <DashboardCard>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <SectionLabel>Scan usage</SectionLabel>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                          139 <span className="text-sm font-normal tracking-normal text-white/45">signals reviewed this week</span>
                        </p>
                      </div>
                      <div className="rounded-full border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffb8b8]">
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          +18% vs last week
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-7 gap-3">
                      {USAGE_DATA.map((point) => (
                        <div key={point.day} className="flex flex-col items-center gap-3">
                          <div className="flex h-28 w-full items-end justify-center rounded-[14px] border border-white/6 bg-[#121621] px-2 pb-2">
                            <div
                              className="w-full rounded-[10px] bg-[linear-gradient(180deg,rgba(220,94,94,0.95),rgba(220,94,94,0.18))]"
                              style={{ height: `${Math.max((point.scans / usagePeak) * 88, 14)}px` }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-[11px] font-medium text-white/40">{point.day}</p>
                            <p className="text-xs text-white/60">{point.scans}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <SectionLabel>Connected access</SectionLabel>
                    <div className="mt-4 space-y-3">
                      {[
                        { label: "Email", value: email ?? "No email available", active: true, icon: Mail },
                        { label: "GitHub", value: provider === "github" ? "Connected" : "Not connected", active: provider === "github", icon: Globe },
                        { label: "Google", value: provider === "google" || provider === "google-test" ? "Connected" : "Not connected", active: provider === "google" || provider === "google-test", icon: Globe },
                      ].map(({ label, value, active, icon: Icon }) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 rounded-[14px] border border-white/8 bg-[#121621] px-4 py-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/50">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">{label}</p>
                            <p className="truncate text-sm text-white/70">{value}</p>
                          </div>
                          <div
                            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                              active
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                : "border-white/10 bg-white/[0.04] text-white/35"
                            }`}
                          >
                            {active ? "Linked" : "Idle"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                </div>
              </div>
            ) : null}

            {activeSection === "security" ? (
              <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <DashboardCard>
                  <SectionLabel>{copy.providerLabel}</SectionLabel>
                  <div className="mt-4 flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dc5e5e]/12 text-[#ffb8b8]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">{currentProviderLabel}</h3>
                      <p className="text-sm text-white/55">{email ?? "No email available"}</p>
                      <p className="text-sm leading-6 text-white/45">{copy.providerBody}</p>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard>
                  <SectionLabel>Protection summary</SectionLabel>
                  <div className="mt-4 space-y-3">
                    {["Supabase session handling", "Email verification checks", "Password recovery with callback validation"].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-[14px] border border-white/8 bg-[#121621] px-4 py-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                        <p className="text-sm text-white/72">{item}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/account/security"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#ffb8b8] transition hover:text-white"
                  >
                    {copy.securityCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </DashboardCard>
              </div>
            ) : null}

            {activeSection === "pricing" ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {PLAN_CARDS.map((plan) => (
                  <DashboardCard
                    key={plan.id}
                    className={plan.highlight ? "border-[#dc5e5e]/20 bg-[linear-gradient(180deg,rgba(220,94,94,0.08),#0f1219)]" : ""}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <SectionLabel>{plan.name}</SectionLabel>
                        <div className="mt-2 flex items-end gap-1">
                          <span className={`text-4xl font-semibold tracking-[-0.04em] ${plan.highlight ? "text-[#ffb8b8]" : "text-white"}`}>
                            {plan.price}
                          </span>
                          <span className="pb-1 text-sm text-white/45">{plan.detail}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/45">{plan.description}</p>
                      </div>
                      <div
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          plan.current
                            ? "border-white/10 bg-white/[0.04] text-white/45"
                            : "border-[#dc5e5e]/20 bg-[#dc5e5e]/10 text-[#ffb8b8]"
                        }`}
                      >
                        {plan.current ? "Current" : "Upgrade"}
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 rounded-[14px] border border-white/8 bg-[#121621] px-4 py-3">
                          <CheckCircle2 className={`mt-0.5 h-4 w-4 ${plan.highlight ? "text-[#ffb8b8]" : "text-emerald-300"}`} />
                          <p className="text-sm text-white/72">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                ))}
              </div>
            ) : null}

            {activeSection === "settings" ? (
              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <DashboardCard>
                  <SectionLabel>{copy.appSettingsTitle}</SectionLabel>
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-between rounded-[18px] border border-white/8 bg-[#121621] px-5 py-5 text-left transition hover:border-white/12 hover:bg-[#151925]"
                  >
                    <div>
                      <p className="text-base font-medium text-white">{copy.appSettingsLinkLabel}</p>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">{copy.appSettingsBody}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/28">
                        {copy.appSettingsLinkState}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#ffb8b8]" />
                  </button>
                </DashboardCard>

                <DashboardCard>
                  <SectionLabel>Settings note</SectionLabel>
                  <div className="mt-4 rounded-[16px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 px-4 py-4">
                    <p className="text-sm leading-6 text-[#ffb8b8]">
                      The browser extension remains the source of in-product settings. The web dashboard keeps the entry visible without faking a live settings panel here.
                    </p>
                  </div>
                </DashboardCard>
              </div>
            ) : null}
          </section>

          <aside className="space-y-4">
            <DashboardCard className="bg-[#0d1016]">
              <SectionLabel>Quick actions</SectionLabel>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveSection("security")}
                  className="flex w-full items-center justify-between rounded-[14px] border border-white/8 bg-[#121621] px-4 py-3 text-left transition hover:border-white/12 hover:bg-[#151925]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">Open security</p>
                    <p className="mt-1 text-sm text-white/40">Review sign-in method and deeper protection</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#ffb8b8]" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("pricing")}
                  className="flex w-full items-center justify-between rounded-[14px] border border-white/8 bg-[#121621] px-4 py-3 text-left transition hover:border-white/12 hover:bg-[#151925]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">Review plan</p>
                    <p className="mt-1 text-sm text-white/40">Keep pricing visible without leaving the dashboard</p>
                  </div>
                  <WalletCards className="h-4 w-4 text-[#ffb8b8]" />
                </button>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-[#0d1016]">
              <SectionLabel>Route privacy</SectionLabel>
              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-white/50">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-white/45">
                  Account and security routes stay private and are excluded from public indexing.
                </p>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-[#0d1016]">
              <SectionLabel>Session</SectionLabel>
              <div className="mt-4 space-y-3">
                <div className="rounded-[14px] border border-white/8 bg-[#121621] px-4 py-3">
                  <p className="text-sm font-medium text-white">{currentProviderLabel}</p>
                  <p className="mt-1 text-sm text-white/40">{email ?? "No email available"}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 px-4 py-3 text-sm font-medium text-[#ffb8b8] transition hover:bg-[#dc5e5e]/14 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {copy.signOutLabel}
                </button>
              </div>
            </DashboardCard>
          </aside>
        </div>
      </div>
    </main>
  );
}
