"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCheck, ChevronRight, Github, Mail, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { authCopy } from "@/content/authCopy";
import { siteLinks } from "@/content/frontFacingCopy";
import { getAuthCallbackUrl, getAuthErrorMessage, getMagicLinkCallbackUrl, isDeletedUser } from "@/lib/auth";
import { METIS_AUTH_SUCCESS_PATH, type MetisAuthSource, METIS_EXTENSION_SOURCE } from "@/lib/contracts/communication";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthScreenProps = {
  initialView: "signup" | "login";
  source?: MetisAuthSource | null;
  useLocalMagicLinkCallback?: boolean;
  initialError?: string | null;
  initialMessage?: string | null;
};

type ViewState = "auth" | "email-sent";

type FeedbackState =
  | {
      tone: "success" | "error";
      text: string;
    }
  | null;

const RED = "#dc5e5e";
const TEXT = "#FFF5F0";
const TEXT_DIM = "rgba(255,245,240,0.65)";
const TEXT_DIM_2 = "rgba(255,245,240,0.35)";
const BORDER = "rgba(255,255,255,0.12)";
const PANEL_BORDER = "rgba(220,94,94,0.18)";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `2px solid ${light ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)"}`,
        borderTopColor: light ? "#333" : "white",
      }}
    />
  );
}

function OverlayShell({
  viewLabel,
  onClose,
  children,
}: {
  viewLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
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
        maxWidth: 500,
        background: "rgba(20,6,6,0.98)",
        border: `1px solid ${PANEL_BORDER}`,
        borderRadius: 24,
        boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03) inset",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(220,94,94,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="metis-auth-overlay-body" style={{ maxHeight: "calc(100svh - 48px)", overflowY: "auto", padding: "36px 40px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
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
                boxShadow: "0 2px 8px rgba(220,94,94,0.4)",
              }}
            >
              <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 14, color: "white", lineHeight: 1 }}>M</span>
            </div>
            <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, color: TEXT, letterSpacing: "-0.02em" }}>
              Metis
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2 }}>{viewLabel}</span>
            <button
              type="button"
              onClick={onClose}
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
                color: TEXT_DIM_2,
              }}
            >
              <X size={13} />
            </button>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2 }}>or</span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "10px 0",
        marginTop: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        color: TEXT_DIM_2,
        width: "100%",
      }}
    >
      <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} />
      {label}
    </motion.button>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  error?: string;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: TEXT_DIM,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 14px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${error ? "#ef4444" : focused ? "rgba(220,94,94,0.5)" : BORDER}`,
          boxShadow: focused ? "0 0 0 3px rgba(220,94,94,0.1)" : "none",
        }}
      >
        {Icon ? <Icon size={14} style={{ color: error ? "#ef4444" : focused ? RED : TEXT_DIM_2, flexShrink: 0 }} /> : null}
        <input
          type="email"
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: TEXT,
            padding: "13px 0",
          }}
        />
      </div>
      {error ? <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#ef4444" }}>{error}</p> : null}
    </div>
  );
}

function PrimaryButton({
  children,
  loading = false,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      whileHover={!loading ? { scale: 1.02, boxShadow: "0 6px 24px rgba(220,94,94,0.35)" } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "15px 24px",
        borderRadius: 14,
        border: "none",
        background: loading ? "rgba(220,94,94,0.5)" : RED,
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        fontWeight: 700,
        color: "white",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 4px 20px rgba(220,94,94,0.25)",
      }}
    >
      {loading ? <Spinner /> : children}
    </motion.button>
  );
}

const OVERLAY_LABELS: Record<ViewState, string> = {
  auth: "Access",
  "email-sent": "Check your email",
};

const OAUTH_PROVIDERS = [
  { id: "google", labelKey: "googleLabel" as const },
  { id: "github", labelKey: "githubLabel" as const },
] as const;

export function AuthScreen({
  initialView,
  source = null,
  useLocalMagicLinkCallback = false,
  initialError = null,
  initialMessage = null,
}: AuthScreenProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const sharedCopy = authCopy.shared;
  const routeCopy = initialView === "signup" ? authCopy.signUp : authCopy.signIn;
  const [view, setView] = useState<ViewState>("auth");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [isPending, startTransition] = useTransition();
  const callbackNextPath = source === METIS_EXTENSION_SOURCE ? METIS_AUTH_SUCCESS_PATH : undefined;
  const alternateRouteHref =
    source === METIS_EXTENSION_SOURCE ? `${routeCopy.alternateHref}?source=${METIS_EXTENSION_SOURCE}` : routeCopy.alternateHref;
  const intro = source === METIS_EXTENSION_SOURCE ? routeCopy.extensionIntro : routeCopy.intro;

  useEffect(() => {
    const errorMessage = getAuthErrorMessage(initialError);

    if (initialMessage) {
      setFeedback({ tone: "success", text: initialMessage });
      return;
    }

    if (errorMessage) {
      setFeedback({ tone: "error", text: errorMessage });
    }
  }, [initialError, initialMessage]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getUser();

      if (!cancelled && isDeletedUser(data.user)) {
        await supabase.auth.signOut();
        router.replace("/account-deleted");
        return;
      }

      if (!cancelled && data.user) {
        router.replace("/account");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  function closeOverlay() {
    router.replace("/");
  }

  function showNotice(text: string, tone: "success" | "error") {
    setFeedback({ text, tone });

    if (tone === "success") {
      toast.success(text);
      return;
    }

    toast.error(text);
  }

  function clearFormFeedback() {
    setFeedback(null);
  }

  function handleProvider(provider: "google" | "github") {
    clearFormFeedback();
    setOauthLoading(provider);

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getAuthCallbackUrl(window.location.origin, callbackNextPath, source),
        },
      });

      if (error) {
        showNotice(sharedCopy.providerLaunchError, "error");
        setOauthLoading(null);
      }
    });
  }

  function handleMagicLinkRequest(targetEmail = email) {
    clearFormFeedback();

    if (!targetEmail.includes("@")) {
      setEmailError(sharedCopy.invalidEmailError);
      return;
    }

    setEmailError("");

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail,
        options: {
          // Magic links default to the deployed site callback so the newest
          // email can be opened on another device. Localhost stays opt-in.
          emailRedirectTo: getMagicLinkCallbackUrl(callbackNextPath, source, useLocalMagicLinkCallback),
        },
      });

      if (error) {
        showNotice(sharedCopy.magicLinkError, "error");
        return;
      }

      setSentTo(targetEmail);
      setView("email-sent");
      showNotice(sharedCopy.magicLinkSuccess, "success");
    });
  }

  return (
    <OverlayShell viewLabel={OVERLAY_LABELS[view]} onClose={closeOverlay}>
      <AnimatePresence mode="wait">
        {view === "auth" ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(220,94,94,0.14)",
                border: "1px solid rgba(220,94,94,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Sparkles size={20} style={{ color: RED }} />
            </div>

            <p style={{ margin: 0, marginBottom: 8, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEXT_DIM_2 }}>
              {routeCopy.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                color: TEXT,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                margin: 0,
                marginBottom: 8,
              }}
            >
              {routeCopy.title}
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, lineHeight: 1.65, margin: 0, marginBottom: 24 }}>
              {intro}
            </p>

            {feedback ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 14px",
                  borderRadius: 10,
                  background: feedback.tone === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.15)",
                  border:
                    feedback.tone === "error" ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(34,197,94,0.3)",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: feedback.tone === "error" ? "#f87171" : "#86efac",
                  }}
                >
                  {feedback.text}
                </span>
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 10, marginTop: 4, marginBottom: 14 }}>
              {OAUTH_PROVIDERS.map((provider) => (
                <motion.button
                  key={provider.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleProvider(provider.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${BORDER}`,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: TEXT_DIM,
                    cursor: "pointer",
                  }}
                >
                  {provider.id === "google" ? <GoogleIcon size={14} /> : <Github size={14} />}
                  {sharedCopy[provider.labelKey]}
                </motion.button>
              ))}
            </div>

            <OrDivider />

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
              <Field
                label={sharedCopy.emailLabel}
                placeholder={sharedCopy.emailPlaceholder}
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setEmailError("");
                  clearFormFeedback();
                }}
                icon={Mail}
                error={emailError}
                autoComplete="email"
              />

              <div
                style={{
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  background: "rgba(255,255,255,0.04)",
                  padding: "14px 16px",
                }}
              >
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2, lineHeight: 1.6 }}>
                  {sharedCopy.magicLinkHelper}
                </p>
                <div style={{ marginTop: 12 }}>
                  <PrimaryButton loading={isPending} onClick={() => handleMagicLinkRequest()}>
                    {sharedCopy.magicLinkLabel} <Send size={14} />
                  </PrimaryButton>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2 }}>{routeCopy.footerPrompt}</p>
              <Link href={alternateRouteHref} style={{ color: "#ffb8b8", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}>
                {routeCopy.alternateLabel}
              </Link>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, color: TEXT_DIM_2 }}>{sharedCopy.legalBlurb}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link href={siteLinks.termsUrl} style={{ color: "#dc8d72", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 12 }}>
                  Terms
                </Link>
                <Link href={siteLinks.privacyUrl} style={{ color: "#dc8d72", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 12 }}>
                  Privacy
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}

        {view === "email-sent" ? (
          <motion.div
            key="email-sent"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <CheckCheck size={22} style={{ color: "#4ade80" }} />
            </motion.div>
            <h2
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(24px, 3vw, 34px)",
                color: TEXT,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 10,
              }}
            >
              {sharedCopy.magicLinkSentTitle}
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, lineHeight: 1.65, margin: 0, marginBottom: 14, maxWidth: 340 }}>
              {sharedCopy.magicLinkSentBody(sentTo)}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
              {sharedCopy.magicLinkExpiryLabel}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PrimaryButton loading={isPending} onClick={() => handleMagicLinkRequest(sentTo)}>
                {sharedCopy.magicLinkResendLabel} <Send size={14} />
              </PrimaryButton>
              <BackButton onClick={() => setView("auth")} label={sharedCopy.useAnotherEmailLabel} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </OverlayShell>
  );
}
