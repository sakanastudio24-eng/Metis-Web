"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Github,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { getAuthCallbackUrl } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useTemporarySessionGuard } from "@/components/auth/useTemporarySessionGuard";

type SecurityPageClientProps = {
  email: string | null;
  provider: string;
  isTemporary?: boolean;
};

type VerifiedFactor = {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
};

type EnrollmentState = {
  id: string;
  qrCode: string;
  secret: string;
  uri: string;
  friendlyName: string;
};

type LinkableProvider = "google" | "github";

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

function maskSecret(secret: string) {
  if (secret.length <= 8) {
    return secret;
  }

  return `${secret.slice(0, 4)} ${secret.slice(4)}`;
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            index === current ? "w-6 bg-[#dc5e5e]" : index < current ? "w-3 bg-emerald-400" : "w-3 bg-white/15"
          }`}
        />
      ))}
      <span className="ml-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
        {current + 1} / {total}
      </span>
    </div>
  );
}

export function SecurityPageClient({ email, provider, isTemporary = false }: SecurityPageClientProps) {
  const copy = authCopy.security;
  const supabase = createSupabaseBrowserClient();
  const isResettingTemporarySession = useTemporarySessionGuard(isTemporary);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedFactor, setVerifiedFactor] = useState<VerifiedFactor | null>(null);
  const [unverifiedFactorId, setUnverifiedFactorId] = useState<string | null>(null);
  const [aalLevel, setAalLevel] = useState<string | null>(null);
  const [nextAalLevel, setNextAalLevel] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [code, setCode] = useState("");
  const [linkedProviders, setLinkedProviders] = useState<string[]>(provider ? [provider] : []);
  const [secretCopied, setSecretCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const loadMfaState = useCallback(async () => {
    if (isTemporary) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const [factorsResult, aalResult, userResult] = await Promise.all([
      supabase.auth.mfa.listFactors(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.auth.getUser(),
    ]);

    if (factorsResult.error) {
      setFeedback({ tone: "error", message: copy.loadError });
      setIsLoading(false);
      return;
    }

    if (aalResult.error) {
      setFeedback({ tone: "error", message: copy.loadError });
      setIsLoading(false);
      return;
    }

    const verified = factorsResult.data.totp?.[0] ?? null;
    const unverified = factorsResult.data.all.find((factor) => factor.factor_type === "totp" && factor.status === "unverified") ?? null;

    setVerifiedFactor(
      verified
        ? {
            id: verified.id,
            friendly_name: verified.friendly_name,
            factor_type: verified.factor_type,
            status: verified.status,
          }
        : null,
    );
    setUnverifiedFactorId(unverified?.id ?? null);
    setAalLevel(aalResult.data.currentLevel);
    setNextAalLevel(aalResult.data.nextLevel);

    const nextLinkedProviders = new Set<string>();
    for (const identity of userResult.data.user?.identities ?? []) {
      if (typeof identity.provider === "string") {
        nextLinkedProviders.add(identity.provider);
      }
    }

    if (nextLinkedProviders.size === 0 && provider) {
      nextLinkedProviders.add(provider);
    }

    setLinkedProviders(Array.from(nextLinkedProviders));
    setIsLoading(false);
  }, [copy.loadError, isTemporary, provider, supabase.auth]);

  useEffect(() => {
    void loadMfaState();
  }, [loadMfaState]);

  const flowStep = useMemo(() => {
    if (verifiedFactor) {
      return 2;
    }

    if (enrollment || unverifiedFactorId) {
      return 1;
    }

    return 0;
  }, [enrollment, unverifiedFactorId, verifiedFactor]);

  const availableProviderLinks = useMemo(
    () =>
      ([
        { id: "google", label: copy.linkGoogleLabel },
        { id: "github", label: copy.linkGithubLabel },
      ] as const).filter((item) => !linkedProviders.includes(item.id)),
    [copy.linkGithubLabel, copy.linkGoogleLabel, linkedProviders],
  );

  async function startEnrollment() {
    setFeedback(null);

    startTransition(async () => {
      if (unverifiedFactorId) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: unverifiedFactorId });

        if (unenrollError) {
          setFeedback({ tone: "error", message: copy.restartError });
          return;
        }
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: copy.defaultFactorName,
        issuer: copy.issuer,
      });

      if (error || !data) {
        setFeedback({ tone: "error", message: copy.enrollError });
        return;
      }

      setEnrollment({
        id: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
        friendlyName: data.friendly_name ?? copy.defaultFactorName,
      });
      setCode("");
      setFeedback({ tone: "success", message: copy.enrollSuccess });
      setUnverifiedFactorId(data.id);
      await loadMfaState();
    });
  }

  async function verifyEnrollment() {
    if (!enrollment) {
      return;
    }

    const trimmed = code.trim();

    if (trimmed.length !== 6) {
      setFeedback({ tone: "error", message: copy.invalidCode });
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollment.id,
        code: trimmed,
      });

      if (error) {
        setFeedback({ tone: "error", message: copy.verifyError });
        return;
      }

      setFeedback({ tone: "success", message: copy.verifySuccess });
      setEnrollment(null);
      setCode("");
      await loadMfaState();
    });
  }

  async function disableFactor() {
    if (!verifiedFactor) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: verifiedFactor.id });

      if (error) {
        setFeedback({ tone: "error", message: copy.disableError });
        return;
      }

      setFeedback({ tone: "success", message: copy.disableSuccess });
      await loadMfaState();
    });
  }

  async function copySecret() {
    if (!enrollment) {
      return;
    }

    await navigator.clipboard.writeText(enrollment.secret).catch(() => {});
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 1800);
  }

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

  if (isResettingTemporarySession) {
    return null;
  }

  const currentProtectionItems: string[] = [...copy.currentProtectionItems];
  if (verifiedFactor) {
    currentProtectionItems.push(copy.twoFactorEnabledListItem);
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
          {isTemporary ? <p className="max-w-2xl text-sm leading-7 text-[#ffb8b8]">{copy.temporaryAccountBody}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <section className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.currentProtectionTitle}</p>
              <p className="mt-2 text-sm leading-6 text-white/62">{copy.currentProtectionBody}</p>
              <div className="mt-5 grid gap-3">
                {currentProtectionItems.map((item) => (
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
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">
                    {isTemporary ? copy.previewLocked : verifiedFactor ? copy.enabledBadge : copy.setupBadge}
                  </p>
                  <h2 className="text-xl font-semibold text-white">{copy.previewTitle}</h2>
                </div>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">
                {isTemporary
                  ? copy.previewBody
                  : verifiedFactor
                    ? copy.enabledBody(verifiedFactor.friendly_name ?? copy.defaultFactorName)
                    : copy.setupBody}
              </p>

              <div className="mt-6">
                <Progress current={flowStep} total={3} />
              </div>

              {isTemporary ? (
                <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/72">
                  {copy.previewOnlyBody}
                </div>
              ) : null}

              {!isTemporary && !verifiedFactor && !enrollment && !unverifiedFactorId ? (
                <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.startTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-white/72">{copy.startBody}</p>
                  <Button type="button" className="mt-5 rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]" onClick={startEnrollment} disabled={isPending || isLoading}>
                    {copy.startCta}
                  </Button>
                </div>
              ) : null}

              {!isTemporary && !verifiedFactor && (enrollment || unverifiedFactorId) ? (
                <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    {enrollment?.qrCode ? (
                      <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white p-4">
                        <Image src={enrollment.qrCode} alt={enrollment.uri} width={224} height={224} unoptimized className="mx-auto h-56 w-56 object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center rounded-[20px] border border-dashed border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 text-center text-sm leading-6 text-white/65">
                        {copy.restartBody}
                      </div>
                    )}

                    {enrollment ? (
                      <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.manualKeyLabel}</p>
                            <p className="mt-1 text-sm font-medium tracking-[0.18em] text-white">{maskSecret(enrollment.secret)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={copySecret}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                              secretCopied
                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                : "border-white/12 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/8 hover:text-white"
                            }`}
                          >
                            {secretCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {secretCopied ? copy.copiedLabel : copy.copyLabel}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-white/50">
                      <KeyRound className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{copy.verifyTitle}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/72">{copy.verifyBody}</p>
                    <div className="mt-5 flex gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/4 text-lg font-semibold text-white"
                        >
                          {code[index] ?? ""}
                        </div>
                      ))}
                    </div>
                    <input
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder={copy.codePlaceholder}
                      className="mt-4 h-12 w-full rounded-2xl border border-white/12 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/35"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button type="button" className="rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]" onClick={verifyEnrollment} disabled={isPending || isLoading}>
                        {copy.verifyCta}
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8" onClick={startEnrollment} disabled={isPending || isLoading}>
                        {copy.restartCta}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {!isTemporary && verifiedFactor ? (
                <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.enabledTitle}</p>
                      <p className="mt-2 text-sm font-medium text-white">{verifiedFactor.friendly_name ?? copy.defaultFactorName}</p>
                      <p className="mt-2 text-sm leading-6 text-white/72">{copy.enabledSummary}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {copy.enabledBadge}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button type="button" className="rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]" onClick={onOpenSecurityDetails} disabled={isPending}>
                      {copy.reverifyCta}
                    </Button>
                    <Button type="button" variant="outline" className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8" onClick={disableFactor} disabled={isPending}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {copy.disableCta}
                    </Button>
                  </div>
                </div>
              ) : null}

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

              {isTemporary ? (
                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/62">
                  {copy.temporaryAccountBody}
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.assuranceTitle}</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.currentLevelLabel}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{aalLevel ?? "aal1"}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.nextLevelLabel}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{nextAalLevel ?? "aal2"}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/62">{copy.assuranceBody}</p>
              <p className="mt-4 text-sm leading-6 text-white/42">{copy.sessionNote}</p>
              <Link href="/account" className="mt-5 inline-flex items-center gap-2 font-medium text-[#ffb8b8] transition hover:text-white">
                {copy.backLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>

        {isLoading ? <p className="px-1 text-sm text-white/55">{copy.loadingLabel}</p> : null}
      </div>
    </main>
  );

  function onOpenSecurityDetails() {
    setFeedback({ tone: "success", message: copy.enabledPreviewMessage });
  }
}
