"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Crown,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AccountPageClientProps = {
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
};

function getProviderLabel(provider: string) {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    default:
      return "Email";
  }
}

export function AccountPageClient({
  email,
  provider,
  emailConfirmed,
}: AccountPageClientProps) {
  const copy = authCopy.account;
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await supabase.auth.signOut();
      router.replace("/sign-in");
    });
  }

  return (
    <main className="auth-shell flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <div className="space-y-3 px-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </span>
          <h1 className="font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/70">{copy.subtitle}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dc5e5e] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
                  M
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">{copy.providerLabel}</p>
                  <h2 className="text-xl font-semibold text-white">{getProviderLabel(provider)}</h2>
                  <p className="text-sm text-white/60">{email ?? "No email available"}</p>
                </div>
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

            <div className="mt-8 grid gap-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
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
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
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
          </section>

          <aside className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dc5e5e]/12 text-[#ffb8b8]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.extensionTitle}</p>
                  <p className="text-sm font-medium text-white">{copy.extensionBody}</p>
                </div>
              </div>
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-2 font-medium text-[#ffb8b8] transition hover:text-white"
              >
                {copy.extensionCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                {isPending ? <LogOut className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                {copy.signOutLabel}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
