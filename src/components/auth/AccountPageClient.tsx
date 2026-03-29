"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Crown,
  LogOut,
  Mail,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

  let sectionMeta: { eyebrow: string; title: string; body: string };

  switch (activeSection) {
    case "account":
      sectionMeta = {
        eyebrow: copy.accountSectionTitle,
        title: "Account",
        body: copy.accountSectionBody,
      };
      break;
    case "security":
      sectionMeta = {
        eyebrow: "Security",
        title: "Security settings",
        body: "Review how access works today and move into the deeper protection flow when you need it.",
      };
      break;
    case "pricing":
      sectionMeta = {
        eyebrow: copy.pricingSectionTitle,
        title: "Plan & Pricing",
        body: copy.pricingSectionBody,
      };
      break;
    case "settings":
      sectionMeta = {
        eyebrow: copy.settingsSectionTitle,
        title: "Metis settings",
        body: copy.settingsSectionBody,
      };
      break;
    default:
      sectionMeta = {
        eyebrow: copy.accountSectionTitle,
        title: "Account",
        body: copy.accountSectionBody,
      };
      break;
  }

  const sections = [
    { id: "account" as const, label: "Account", icon: UserRound },
    { id: "security" as const, label: "Security", icon: ShieldCheck },
    { id: "pricing" as const, label: "Plan & Pricing", icon: WalletCards },
    { id: "settings" as const, label: "Metis settings", icon: Settings2 },
  ];

  const currentProviderLabel = getProviderLabel(provider);

  return (
    <main className="auth-shell flex items-start justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="rounded-[28px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
            <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Sections</p>
            <div className="space-y-2">
              {sections.map(({ id, label, icon: Icon }) => {
                const selected = activeSection === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition ${
                      selected
                        ? "border border-[#dc5e5e]/35 bg-[#dc5e5e]/12 text-white"
                        : "border border-transparent bg-white/5 text-white/65 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{sectionMeta.eyebrow}</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">{sectionMeta.title}</h2>
                <p className="max-w-2xl text-sm leading-6 text-white/62">{sectionMeta.body}</p>
              </div>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  emailConfirmed
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-[#dc5e5e]/30 bg-[#dc5e5e]/10 text-[#ffb8b8]"
                }`}
              >
                {emailConfirmed ? copy.verifiedLabel : copy.unverifiedLabel}
              </span>
            </div>

            {activeSection === "account" ? (
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#dc5e5e] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
                      M
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.providerLabel}</p>
                      <h3 className="text-xl font-semibold text-white">{email ?? "No email available"}</h3>
                      <p className="text-sm text-white/60">{email ?? "No email available"}</p>
                      {isTemporary ? <p className="text-sm text-[#ffb8b8]">{copy.temporaryAccountBody}</p> : null}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/75">
                        <Crown className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Verification</p>
                        <p className="text-sm font-medium text-white">{emailConfirmed ? copy.verifiedLabel : copy.unverifiedLabel}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/62">
                      {emailConfirmed
                        ? "This account is verified and ready to move through the Metis web flow."
                        : "Finish verification to unlock the full production auth path."}
                    </p>
                    {isTemporary ? <p className="mt-3 text-sm font-medium text-[#ffb8b8]">{copy.temporaryAccountLabel}</p> : null}
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/75">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Status</p>
                        <p className="text-sm font-medium text-white">Account ready</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/62">
                      Sign in, onboarding, account, and the core dashboard sections are all available from this view.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeSection === "security" ? (
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/75">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.providerLabel}</p>
                      <p className="text-sm font-medium text-white">{currentProviderLabel}</p>
                      <p className="mt-1 text-sm text-white/55">{email ?? "No email available"}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/62">{copy.providerBody}</p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/75">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.securityTitle}</p>
                      <p className="text-sm font-medium text-white">{copy.securityBody}</p>
                    </div>
                  </div>
                  <Link
                    href="/account/security"
                    className="mt-4 inline-flex items-center gap-2 font-medium text-[#ffb8b8] transition hover:text-white"
                  >
                    {copy.securityCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : null}

            {activeSection === "pricing" ? (
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/75">
                      <WalletCards className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.planLabel}</p>
                      <p className="text-sm font-medium text-white">{copy.planValue}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/62">{copy.planBody}</p>
                  <div className="mt-5 rounded-[18px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/8 px-4 py-4">
                    <p className="text-sm font-medium text-white">Pricing stays visible</p>
                    <p className="mt-2 text-sm leading-6 text-white/62">
                      Free remains the starting point. Upgrade and billing controls can land here later without changing the dashboard structure.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeSection === "settings" ? (
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/75">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.appSettingsTitle}</p>
                      <p className="text-sm font-medium text-white">{copy.appSettingsBody}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-between rounded-[18px] border border-dashed border-white/15 bg-white/[0.04] px-4 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{copy.appSettingsLinkLabel}</p>
                      <p className="mt-1 text-sm text-white/50">{copy.appSettingsLinkState}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#ffb8b8]" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Settings</p>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveSection(activeSection === "account" ? "security" : "account")}
                  className="flex w-full items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-left text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <div>
                    <p className="text-sm font-medium">{activeSection === "account" ? "Open security" : "Back to account"}</p>
                    <p className="mt-1 text-sm text-white/50">
                      {activeSection === "account" ? "Review provider access and protection settings" : "Return to the main account section"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#ffb8b8]" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("settings")}
                  className="flex w-full items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-left text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <div>
                    <p className="text-sm font-medium">Metis settings</p>
                    <p className="mt-1 text-sm text-white/50">Open the extension settings placeholder section</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#ffb8b8]" />
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/70">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-white/62">
                  Account and security routes stay private and are excluded from public indexing.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8"
                onClick={handleSignOut}
                disabled={isPending}
              >
                <LogOut className="h-4 w-4" />
                {copy.signOutLabel}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
