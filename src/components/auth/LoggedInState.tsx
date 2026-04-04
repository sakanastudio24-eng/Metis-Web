"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Chrome, LoaderCircle, Sparkles, X } from "lucide-react";

import type { OnboardingAnswersRow } from "@/lib/account-data";
import { onboardingOptions, saveOnboardingAnswers, skipOnboarding } from "@/lib/account-data";
import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoggedInStateProps = {
  email: string | null;
  userId: string;
  initialAnswers: OnboardingAnswersRow | null;
};

type OnboardingFormState = {
  role: OnboardingAnswersRow["role"] | "";
  primary_goal: OnboardingAnswersRow["primary_goal"] | "";
  traffic_band: OnboardingAnswersRow["traffic_band"] | "";
  hosting_provider: OnboardingAnswersRow["hosting_provider"] | "";
  app_type: OnboardingAnswersRow["app_type"] | "";
  team_size: OnboardingAnswersRow["team_size"] | "";
  biggest_cost_pain: OnboardingAnswersRow["biggest_cost_pain"] | "";
};

const RED = "#dc5e5e";
const TEXT = "#FFF5F0";
const TEXT_DIM = "rgba(255,245,240,0.65)";
const TEXT_DIM_2 = "rgba(255,245,240,0.35)";
const BORDER = "rgba(255,255,255,0.12)";

const READY_ITEMS = [
  { key: "Account row ready", icon: CheckCircle2 },
  { key: "Usage counter ready", icon: CheckCircle2 },
  { key: "Chrome extension ready to install", icon: Chrome },
  { key: "Connected scans unlock after sign-in", icon: Sparkles }
] as const;

const EMPTY_FORM: OnboardingFormState = {
  role: "",
  primary_goal: "",
  traffic_band: "",
  hosting_provider: "",
  app_type: "",
  team_size: "",
  biggest_cost_pain: ""
};

function buildInitialForm(initialAnswers: OnboardingAnswersRow | null): OnboardingFormState {
  if (!initialAnswers) {
    return EMPTY_FORM;
  }

  return {
    role: initialAnswers.role,
    primary_goal: initialAnswers.primary_goal,
    traffic_band: initialAnswers.traffic_band,
    hosting_provider: initialAnswers.hosting_provider,
    app_type: initialAnswers.app_type,
    team_size: initialAnswers.team_size,
    biggest_cost_pain: initialAnswers.biggest_cost_pain
  };
}

function FieldGroup({
  title,
  helper,
  value,
  onChange,
  options
}: {
  title: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${BORDER}`,
        background: "rgba(255,255,255,0.04)",
        padding: "16px 16px 18px"
      }}
    >
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: TEXT }}>{title}</p>
      <p style={{ margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.55, color: TEXT_DIM }}>
        {helper}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              style={{
                borderRadius: 999,
                border: active ? "1px solid rgba(220,94,94,0.38)" : `1px solid ${BORDER}`,
                background: active ? "rgba(220,94,94,0.16)" : "rgba(255,255,255,0.04)",
                color: active ? TEXT : TEXT_DIM,
                padding: "10px 13px",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: active ? 700 : 600,
                cursor: "pointer"
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LoggedInState({ email, userId, initialAnswers }: LoggedInStateProps) {
  const router = useRouter();
  const copy = authCopy.loggedIn;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [form, setForm] = useState<OnboardingFormState>(() => buildInitialForm(initialAnswers));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const signedInLine = email ? copy.readyForEmail(email) : null;

  const isComplete = Object.values(form).every(Boolean);

  function closeOverlay() {
    router.replace("/account");
  }

  function setField<Key extends keyof OnboardingFormState>(key: Key, value: OnboardingFormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function handleSave() {
    if (!isComplete) {
      setFeedback("Answer each setup question before continuing.");
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      try {
        await saveOnboardingAnswers(supabase, userId, form as Omit<OnboardingAnswersRow, "user_id" | "created_at" | "updated_at">);
        router.replace("/account");
      } catch {
        setFeedback("Setup could not be saved. Try again.");
      }
    });
  }

  function handleSkip() {
    setFeedback(null);

    startTransition(async () => {
      try {
        await skipOnboarding(supabase, userId);
        router.replace("/account");
      } catch {
        setFeedback("Setup could not be skipped right now. Try again.");
      }
    });
  }

  return (
    <motion.div
      className="metis-auth-overlay"
      initial={{ scale: 0.93, y: 24 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.93, y: 16 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 760,
        background: "rgba(20,6,6,0.98)",
        border: "1px solid rgba(220,94,94,0.18)",
        borderRadius: 24,
        boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03) inset",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(220,94,94,0.1) 0%,transparent 70%)",
          pointerEvents: "none"
        }}
      />
      <div
        className="metis-auth-overlay-body"
        style={{ maxHeight: "calc(100svh - 48px)", overflowY: "auto", padding: "36px 40px 40px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(220,94,94,0.4)"
              }}
            >
              <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 14, color: "white", lineHeight: 1 }}>M</span>
            </div>
            <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, color: TEXT, letterSpacing: "-0.02em" }}>
              Metis
            </span>
          </div>
          <button
            type="button"
            onClick={closeOverlay}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: TEXT_DIM_2
            }}
          >
            <X size={13} />
          </button>
        </div>

        <div style={{ display: "grid", gap: 24, alignItems: "start", gridTemplateColumns: "minmax(0,1.2fr) minmax(260px,0.8fr)" }}>
          <div>
            <p
              style={{
                margin: 0,
                marginBottom: 10,
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: TEXT_DIM_2
              }}
            >
              {copy.eyebrow}
            </p>
            <h2
              style={{
                margin: 0,
                marginBottom: 10,
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(28px, 3.4vw, 42px)",
                color: TEXT,
                lineHeight: 1.08,
                letterSpacing: "-0.03em"
              }}
            >
              {copy.title}
            </h2>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.65, color: TEXT_DIM }}>
              Answer the current setup questions once. Metis stores these in your website account so the extension can stay lightweight.
            </p>
            {signedInLine ? (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2, margin: "16px 0 0" }}>{signedInLine}</p>
            ) : null}

            <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
              <FieldGroup
                title="What role best matches you?"
                helper="This shapes how Metis frames the first account recommendations."
                value={form.role}
                onChange={(value) => setField("role", value as OnboardingFormState["role"])}
                options={onboardingOptions.role}
              />
              <FieldGroup
                title="What matters most first?"
                helper="Metis uses this to bias the dashboard and report language."
                value={form.primary_goal}
                onChange={(value) => setField("primary_goal", value as OnboardingFormState["primary_goal"])}
                options={onboardingOptions.primaryGoal}
              />
              <FieldGroup
                title="What traffic band are you in?"
                helper="This keeps scan and cost context grounded in real volume."
                value={form.traffic_band}
                onChange={(value) => setField("traffic_band", value as OnboardingFormState["traffic_band"])}
                options={onboardingOptions.trafficBand}
              />
              <FieldGroup
                title="Where are you hosting now?"
                helper="Hosting context helps Metis frame CDN and platform suggestions correctly."
                value={form.hosting_provider}
                onChange={(value) => setField("hosting_provider", value as OnboardingFormState["hosting_provider"])}
                options={onboardingOptions.hostingProvider}
              />
              <FieldGroup
                title="What kind of product is this?"
                helper="This keeps the first setup tied to the surface you actually ship."
                value={form.app_type}
                onChange={(value) => setField("app_type", value as OnboardingFormState["app_type"])}
                options={onboardingOptions.appType}
              />
              <FieldGroup
                title="How large is the team?"
                helper="Team size helps shape how collaborative features are presented later."
                value={form.team_size}
                onChange={(value) => setField("team_size", value as OnboardingFormState["team_size"])}
                options={onboardingOptions.teamSize}
              />
              <FieldGroup
                title="Where does cost feel most painful?"
                helper="This drives which cost surfaces get emphasized first."
                value={form.biggest_cost_pain}
                onChange={(value) => setField("biggest_cost_pain", value as OnboardingFormState["biggest_cost_pain"])}
                options={onboardingOptions.biggestCostPain}
              />
            </div>

            {feedback ? (
              <div
                style={{
                  marginTop: 18,
                  borderRadius: 14,
                  border: `1px solid ${BORDER}`,
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px 14px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: TEXT_DIM
                }}
              >
                {feedback}
              </div>
            ) : null}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "15px 24px",
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#fff5f0,#ffe8e8)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#2b100e",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isPending ? "progress" : "pointer"
                }}
              >
                {isPending ? <LoaderCircle size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                {copy.finishLabel}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "15px 22px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT_DIM,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isPending ? "progress" : "pointer"
                }}
              >
                {copy.skipLabel}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                borderRadius: 20,
                border: `1px solid ${BORDER}`,
                background: "rgba(255,255,255,0.04)",
                padding: "18px 18px 20px"
              }}
            >
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEXT_DIM_2 }}>
                What this changes
              </p>
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                {READY_ITEMS.map(({ key, icon: Icon }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 14,
                      border: `1px solid ${BORDER}`,
                      background: "rgba(255,255,255,0.04)",
                      padding: "12px 14px"
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: "rgba(34,197,94,0.14)",
                        border: "1px solid rgba(34,197,94,0.28)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon size={12} style={{ color: "#4ade80" }} />
                    </div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_DIM }}>{key}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: 20,
                border: `1px solid ${BORDER}`,
                background: "rgba(255,255,255,0.04)",
                padding: "18px 18px 20px"
              }}
            >
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEXT_DIM_2 }}>
                After setup
              </p>
              <p style={{ margin: "12px 0 0", fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.65, color: TEXT_DIM }}>
                Your account, beta access, and security controls stay on the website. Scan controls and local history stay in the extension.
              </p>
              <Link
                href="/account"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 14,
                  color: "#ffb8b8",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                Open account now
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
