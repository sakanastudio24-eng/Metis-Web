"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Crown,
  LayoutDashboard,
  LogOut,
  Mail,
  PanelsTopLeft,
  Settings2,
  ShieldCheck,
  Sparkles,
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

type DashboardSection = "overview" | "security" | "app-settings";

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
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [extensionMenuOpen, setExtensionMenuOpen] = useState(false);
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
    case "security":
      sectionMeta = {
        eyebrow: "Security",
        title: "Security settings",
        body: "Review how access works today and move into the deeper protection flow when you need it.",
      };
      break;
    case "app-settings":
      sectionMeta = {
        eyebrow: "App settings",
        title: "Extension menu",
        body: "This section opens the extension menu surface so you can review the lightweight browser controls.",
      };
      break;
    default:
      sectionMeta = {
        eyebrow: "Overview",
        title: "Metis dashboard",
        body: "A calmer account view with the essentials on the left and quick settings on the right.",
      };
      break;
  }

  const sections = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "security" as const, label: "Security", icon: ShieldCheck },
    { id: "app-settings" as const, label: "App settings", icon: Settings2 },
  ];

  const currentProviderLabel = getProviderLabel(provider);

  return (
    <main className="auth-shell flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div className="space-y-3 px-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </span>
          <h1 className="font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{sectionMeta.title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-white/70">{sectionMeta.body}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <aside className="rounded-[28px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
            <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Sections</p>
            <div className="space-y-2">
              {sections.map(({ id, label, icon: Icon }) => {
                const selected = activeSection === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveSection(id);
                      if (id === "app-settings") {
                        setExtensionMenuOpen(true);
                      }
                    }}
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
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
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

            {activeSection === "overview" ? (
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#dc5e5e] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
                      M
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.providerLabel}</p>
                      <h3 className="text-xl font-semibold text-white">{currentProviderLabel}</h3>
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
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.planLabel}</p>
                        <p className="text-sm font-medium text-white">{copy.planValue}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/62">{copy.planBody}</p>
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
                      Sign in, onboarding, account, and the extension menu preview are all available from this dashboard.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeSection === "security" ? (
              <div className="grid gap-4">
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

            {activeSection === "app-settings" ? (
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dc5e5e]/12 text-[#ffb8b8]">
                      <PanelsTopLeft className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.extensionTitle}</p>
                      <p className="text-sm font-medium text-white">{copy.extensionBody}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="mt-5 rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]"
                    onClick={() => setExtensionMenuOpen(true)}
                  >
                    Open extension menu
                  </Button>
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
                  onClick={() => setExtensionMenuOpen(true)}
                  className="flex w-full items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-left text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <div>
                    <p className="text-sm font-medium">App settings</p>
                    <p className="mt-1 text-sm text-white/50">Open the extension menu preview</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#ffb8b8]" />
                </button>

                <Link
                  href="/account/security"
                  className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <div>
                    <p className="text-sm font-medium">Security settings</p>
                    <p className="mt-1 text-sm text-white/50">Open the dedicated security screen</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#ffb8b8]" />
                </Link>
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

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Extension menu</p>
              {extensionMenuOpen ? (
                <div className="mt-4 rounded-[22px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/8 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dc5e5e] text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
                      <PanelsTopLeft className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Metis browser menu</p>
                      <p className="text-xs text-white/50">Quick controls preview</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["Open side panel", "Run scan", "Theme", "Notifications"].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-3 py-3">
                        <span className="text-sm text-white/80">{item}</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                          Menu
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[22px] border border-dashed border-white/15 bg-white/4 px-4 py-5 text-sm leading-6 text-white/55">
                  Open App settings to reveal the extension menu panel.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
