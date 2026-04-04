"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Github,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { getAuthCallbackUrl } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SecurityPageClientProps = {
  email: string | null;
  provider: string;
};

type LinkableProvider = "google" | "github";

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

export function SecurityPageClient({
  email,
  provider,
}: SecurityPageClientProps) {
  const copy = authCopy.security;
  const supabase = createSupabaseBrowserClient();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [linkedProviders, setLinkedProviders] = useState<string[]>(provider ? [provider] : []);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSecurityState() {
      setIsLoading(true);
      const userResult = await supabase.auth.getUser();

      const nextLinkedProviders = new Set<string>();
      for (const identity of userResult.data.user?.identities ?? []) {
        if (typeof identity.provider === "string") {
          nextLinkedProviders.add(identity.provider);
        }
      }

      if (nextLinkedProviders.size === 0 && provider) {
        nextLinkedProviders.add(provider);
      }

      if (!cancelled) {
        setLinkedProviders(Array.from(nextLinkedProviders));
        setIsLoading(false);
      }
    }

    void loadSecurityState();

    return () => {
      cancelled = true;
    };
  }, [provider, supabase.auth]);

  const availableProviderLinks = useMemo(
    () =>
      ([
        { id: "google", label: copy.linkGoogleLabel },
        { id: "github", label: copy.linkGithubLabel },
      ] as const).filter((item) => !linkedProviders.includes(item.id)),
    [copy.linkGithubLabel, copy.linkGoogleLabel, linkedProviders],
  );

  async function startIdentityLink(nextProvider: LinkableProvider) {
    setFeedback(null);

    startTransition(async () => {
      const { error } = await supabase.auth.linkIdentity({
        provider: nextProvider,
        options: {
          redirectTo: getAuthCallbackUrl(window.location.origin, "/account/security"),
        },
      });

      if (error) {
        setFeedback({
          tone: "error",
          message: `${copy.linkMethodError} ${copy.linkMethodHint}`,
        });
        return;
      }

      setFeedback({ tone: "success", message: copy.linkMethodPending });
    });
  }

  return (
    <main className="auth-shell flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="space-y-3 px-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </span>
          <h1 className="font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/70">{copy.subtitle}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <section className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.currentProtectionTitle}</p>
              <p className="mt-2 text-sm leading-6 text-white/62">{copy.currentProtectionBody}</p>
              <div className="mt-5 grid gap-3">
                {copy.currentProtectionItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <p className="text-sm text-white/82">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dc5e5e] text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">{copy.nextProtectionTitle}</p>
                  <h2 className="text-xl font-semibold text-white">{copy.stateTitle}</h2>
                </div>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">{copy.stateBody}</p>

              <div className="mt-5 grid gap-3">
                {copy.nextProtectionItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-white/45" />
                    <p className="text-sm text-white/72">{item}</p>
                  </div>
                ))}
              </div>

              {feedback ? (
                <div
                  className={`mt-5 rounded-[22px] border px-4 py-3 text-sm ${
                    feedback.tone === "error"
                      ? "border-[#dc5e5e]/25 bg-[#dc5e5e]/10 text-[#ffb8b8]"
                      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  }`}
                >
                  {feedback.message}
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.providerSectionTitle}</p>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{getProviderLabel(provider)}</p>
                  <p className="text-sm text-white/55">{email ?? "No email available"}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-white/70">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/62">{copy.providerSectionBody}</p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.identitySectionTitle}</p>
              <p className="mt-3 text-sm leading-6 text-white/62">{copy.identitySectionBody}</p>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.linkedMethodsLabel}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {linkedProviders.map((linkedProvider) => (
                    <span
                      key={linkedProvider}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs font-semibold text-white/80"
                    >
                      {getProviderLabel(linkedProvider)}
                      {linkedProvider === provider ? (
                        <span className="rounded-full border border-[#dc5e5e]/30 bg-[#dc5e5e]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#ffb8b8]">
                          {copy.currentLabel}
                        </span>
                      ) : (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-200">
                          {copy.linkedLabel}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.availableMethodsLabel}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {availableProviderLinks.length > 0 ? (
                    availableProviderLinks.map((link) => (
                      <Button
                        key={link.id}
                        type="button"
                        variant="outline"
                        className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8"
                        onClick={() => startIdentityLink(link.id)}
                        disabled={isPending || isLoading}
                      >
                        {link.label}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-white/55">{copy.allMethodsConnectedBody}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.nextProtectionTitle}</p>
              <div className="mt-4 grid gap-3">
                {copy.nextProtectionItems.map((title) => (
                  <div key={title} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{title}</p>
                      <span className="rounded-full border border-white/12 bg-white/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                        {copy.nextProtectionTitle}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/62">{copy.nextProtectionBody}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-white/42">{copy.sessionNote}</p>
              <Link href="/account" className="mt-5 inline-flex items-center gap-2 font-medium text-[#ffb8b8] transition hover:text-white">
                {copy.backLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              id="remove-account"
              className="rounded-[30px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/8 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dc5e5e] text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">{copy.removeAccountTitle}</p>
                  <h2 className="text-xl font-semibold text-white">{copy.removeAccountTitle}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/78">{copy.removeAccountBody}</p>
              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-sm leading-6 text-white/62">{copy.removeAccountNote}</p>
              </div>
              <Link href="/account?section=settings&intent=delete-account" className="inline-flex">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 rounded-full border-[#dc5e5e]/25 bg-[#dc5e5e]/10 text-[#ffb8b8] hover:bg-[#dc5e5e]/14 hover:text-white"
                >
                  {copy.removeAccountCta}
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        {isLoading ? <p className="px-1 text-sm text-white/55">{copy.loadingLabel}</p> : null}
      </div>
    </main>
  );
}
