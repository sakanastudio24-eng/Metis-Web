"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  KeyRound,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { useTemporarySessionGuard } from "@/components/auth/useTemporarySessionGuard";

type SecurityPageClientProps = {
  email: string | null;
  provider: string;
  isTemporary?: boolean;
};

const PREVIEW_STEP_CONTENT = [
  {
    title: "Intro",
    body: "Start with an authenticator app and review the setup secret before enabling two-factor protection.",
  },
  {
    title: "Verify",
    body: "Confirm the six-digit code from the authenticator app before the account is marked as protected.",
  },
  {
    title: "Backup",
    body: "Save recovery codes somewhere secure so you still have a fallback if a device is lost.",
  },
  {
    title: "Done",
    body: "Once backend activation is ready, this flow will end with a live 2FA confirmation state.",
  },
] as const;

const MOCK_SECRET = "JBSW Y3DP EHPK 3PXP";
const BACKUP_CODES = ["7F2A-K9PL", "3BXQ-N8RT", "MK4J-2WDE", "PQ7C-H5SA", "9NVR-L1TF", "XB2G-Y6MK", "T5ZD-3WCE", "6HQP-A8NJ"] as const;

function PreviewProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 rounded-full transition-all ${index === current ? "w-6 bg-[#dc5e5e]" : index < current ? "w-3 bg-emerald-400" : "w-3 bg-white/15"}`}
        />
      ))}
      <span className="ml-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
        {current + 1} / {total}
      </span>
    </div>
  );
}

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

export function SecurityPageClient({ email, provider, isTemporary = false }: SecurityPageClientProps) {
  const copy = authCopy.security;
  const isResettingTemporarySession = useTemporarySessionGuard(isTemporary);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [secretCopied, setSecretCopied] = useState(false);

  const step = useMemo(() => PREVIEW_STEP_CONTENT[stepIndex], [stepIndex]);

  if (isResettingTemporarySession) {
    return null;
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
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">{copy.previewLocked}</p>
                  <h2 className="text-xl font-semibold text-white">{copy.previewTitle}</h2>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">{copy.previewBody}</p>
              <Button
                type="button"
                className="mt-5 rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]"
                onClick={() => setPreviewOpen(true)}
              >
                {copy.previewCta}
              </Button>
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{copy.nextProtectionTitle}</p>
              <div className="mt-4 grid gap-3">
                {copy.nextProtectionItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                    <KeyRound className="mt-0.5 h-4 w-4 text-[#ffb8b8]" />
                    <p className="text-sm text-white/82">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-white/62">{copy.nextProtectionBody}</p>
              <p className="mt-4 text-sm leading-6 text-white/42">{copy.sessionNote}</p>
              <Link
                href="/account"
                className="mt-5 inline-flex items-center gap-2 font-medium text-[#ffb8b8] transition hover:text-white"
              >
                {copy.backLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>

        {previewOpen ? (
          <div
            className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 px-4 backdrop-blur-lg"
            onClick={() => setPreviewOpen(false)}
          >
            <div
              className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-[rgba(12,22,35,0.98)] p-6 shadow-[0_48px_120px_rgba(0,0,0,0.66)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">{copy.previewLocked}</p>
                  <h2 className="mt-2 font-serif text-4xl leading-none tracking-[-0.04em] text-white">
                    {copy.previewTitle}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">{copy.previewBody}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8"
                  onClick={() => setPreviewOpen(false)}
                >
                  Close
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {copy.previewSteps.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStepIndex(index)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      stepIndex === index
                        ? "border-[#dc5e5e] bg-[#dc5e5e] text-white"
                        : "border-white/12 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <PreviewProgress current={stepIndex} total={copy.previewSteps.length} />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-52 items-center justify-center rounded-[20px] border border-dashed border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 36 }).map((_, index) => (
                        <div
                          key={index}
                          className={`h-5 w-5 rounded-[5px] ${index % 3 === 0 ? "bg-white" : "bg-white/10"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {stepIndex === 0 ? (
                    <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Manual key</p>
                          <p className="mt-1 text-sm font-medium tracking-[0.18em] text-white">{MOCK_SECRET}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(MOCK_SECRET).catch(() => {});
                            setSecretCopied(true);
                            setTimeout(() => setSecretCopied(false), 1800);
                          }}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                            secretCopied
                              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                              : "border-white/12 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          {secretCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {secretCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/35">Preview only</p>
                  )}
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-white/50">
                    <ChevronRight className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">{step.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">{step.body}</p>

                  <div className="mt-5 grid gap-2">
                    {stepIndex === 0 ? (
                      <>
                        <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/82">
                          Google Authenticator, Authy, or 1Password
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/82">
                          Use the manual key if you cannot scan the code
                        </div>
                      </>
                    ) : null}
                    {stepIndex === 1 ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <div
                              key={index}
                              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/4 text-lg font-semibold text-white"
                            >
                              {index < 3 ? index + 2 : ""}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Enter the six-digit code from your authenticator app
                        </p>
                      </div>
                    ) : null}
                    {stepIndex === 2 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {BACKUP_CODES.map((code) => (
                            <div
                              key={code}
                              className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm font-medium text-white/82"
                            >
                              {code}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Save these offline so recovery still works if a device is lost
                        </p>
                      </div>
                    ) : null}
                    {stepIndex === 3 ? (
                      <div className="space-y-3">
                        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                          This confirmation state will go live after backend activation.
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/72">
                          The V4 flow ends with a final protected-state review before closing the modal.
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
