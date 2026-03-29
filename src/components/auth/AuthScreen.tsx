"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  ChevronRight,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { authCopy } from "@/content/authCopy";
import { siteLinks } from "@/content/frontFacingCopy";
import { getAuthCallbackUrl, getAuthErrorMessage, getSupabaseAuthErrorCode } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { startTemporaryAuthSession } from "@/lib/temp-auth-client";

type AuthScreenProps = {
  initialView: "auth" | "signup" | "login";
  initialError?: string | null;
  initialMessage?: string | null;
};

type ViewState = "auth" | "signup" | "login" | "forgot" | "forgot-sent";

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
      <div style={{ maxHeight: "calc(100svh - 48px)", overflowY: "auto", padding: "36px 40px 40px" }}>
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

const LEGAL_LINK_STYLE = {
  color: "#dc8d72",
  textDecoration: "none",
  fontWeight: 600,
} as const;

function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2 }}>or</span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
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
  type = "text",
  error,
  autoComplete,
  right,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  type?: string;
  error?: string;
  autoComplete?: string;
  right?: React.ReactNode;
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
          type={type}
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
        {right}
      </div>
      {error ? <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#ef4444" }}>{error}</p> : null}
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <Field
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={Lock}
      type={show ? "text" : "password"}
      error={error}
      autoComplete={autoComplete}
      right={
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: TEXT_DIM_2 }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      }
    />
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
  auth: "Get started",
  signup: "Sign up",
  login: "Log in",
  forgot: "Reset password",
  "forgot-sent": "Reset password",
};

export function AuthScreen({ initialView, initialError = null, initialMessage = null }: AuthScreenProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const sharedCopy = authCopy.shared;
  const isTemporaryGoogleEnabled = process.env.NODE_ENV === "development";
  const [view, setView] = useState<ViewState>(initialError ? "login" : initialView);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [isPending, startTransition] = useTransition();

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

      // Real signed-in users should land in account, not back in the overlay.
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
    } else {
      toast.error(text);
    }
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
          redirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        showNotice(sharedCopy.providerLaunchError, "error");
        setOauthLoading(null);
      }
    });
  }

  function handleTemporaryTestingAccess() {
    clearFormFeedback();

    startTransition(async () => {
      try {
        // This bypass is for local UI review only. It never replaces provider auth
        // in production and it never crosses the backend trust boundary.
        await startTemporaryAuthSession();
        router.replace("/logged-in");
      } catch {
        showNotice(sharedCopy.temporaryAccessError, "error");
      }
    });
  }

  function handleEmailSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFormFeedback();

    const nextErrors: Record<string, string> = {};
    if (!signupName.trim()) nextErrors.name = sharedCopy.requiredNameError;
    if (!signupEmail.includes("@")) nextErrors.email = sharedCopy.invalidEmailError;
    if (signupPassword.length < 8) nextErrors.password = sharedCopy.shortPasswordError;
    if (!acceptedLegal) nextErrors.legal = sharedCopy.legalAcceptanceError;
    setSignupErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
          data: { full_name: signupName },
        },
      });

      if (error) {
        showNotice(sharedCopy.createAccountError, "error");
        return;
      }

      await supabase.auth.signOut();
      router.replace(`/verify?email=${encodeURIComponent(signupEmail)}`);
    });
  }

  function handleSignUpProvider(provider: "google" | "github") {
    if (!acceptedLegal) {
      setSignupErrors((current) => ({
        ...current,
        legal: sharedCopy.legalAcceptanceError,
      }));
      return;
    }

    handleProvider(provider);
  }

  function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFormFeedback();

    const nextErrors: Record<string, string> = {};
    if (!loginEmail.includes("@")) nextErrors.email = sharedCopy.invalidEmailError;
    if (!loginPassword) nextErrors.password = sharedCopy.missingPasswordError;
    setLoginErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        const errorCode = getSupabaseAuthErrorCode(error);
        showNotice(getAuthErrorMessage(errorCode) ?? "Incorrect email or password. Try again.", "error");
        return;
      }

      router.replace("/logged-in");
    });
  }

  function handleForgotSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFormFeedback();

    if (!forgotEmail.includes("@")) {
      setForgotError(sharedCopy.invalidEmailError);
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: getAuthCallbackUrl(window.location.origin, "/reset-password"),
      });

      if (error) {
        showNotice(sharedCopy.resetRequestError, "error");
        return;
      }

      setSentTo(forgotEmail);
      setForgotError("");
      setView("forgot-sent");
    });
  }

  const passwordStrength = useMemo(() => {
    if (!signupPassword) return 0;
    if (signupPassword.length < 6) return 1;
    if (signupPassword.length < 8) return 2;
    if (/[A-Z]/.test(signupPassword) && /[0-9]/.test(signupPassword)) return 4;
    return 3;
  }, [signupPassword]);

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
              Start with Metis
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: TEXT_DIM,
                lineHeight: 1.6,
                margin: 0,
                marginBottom: 28,
              }}
            >
              Create your free account and move into your first setup without leaving the page.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "14px 16px",
                marginBottom: 18,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  background: "rgba(220,94,94,0.12)",
                  border: "1px solid rgba(220,94,94,0.24)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ArrowRight size={14} style={{ color: RED }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: TEXT_DIM,
                  }}
                >
                  {sharedCopy.stageTitle}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: TEXT_DIM,
                  }}
                >
                  {sharedCopy.stageBody}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {isTemporaryGoogleEnabled ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTemporaryTestingAccess}
                  disabled={isPending || oauthLoading !== null}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "rgba(220,94,94,0.08)",
                    border: "1px dashed rgba(220,94,94,0.38)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#ffb8b8",
                    cursor: isPending || oauthLoading !== null ? "not-allowed" : "pointer",
                    opacity: isPending || oauthLoading !== null ? 0.65 : 1,
                  }}
                >
                  <CheckCheck size={14} />
                  Testing login
                </motion.button>
              ) : null}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProvider("google")}
                disabled={oauthLoading !== null}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.97)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  cursor: oauthLoading !== null ? "not-allowed" : "pointer",
                  opacity: oauthLoading === "github" ? 0.5 : 1,
                }}
              >
                {oauthLoading === "google" ? <Spinner light /> : <GoogleIcon />}
                Continue with Google
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProvider("github")}
                disabled={oauthLoading !== null}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${BORDER}`,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: TEXT,
                  cursor: oauthLoading !== null ? "not-allowed" : "pointer",
                  opacity: oauthLoading === "google" ? 0.5 : 1,
                }}
              >
                {oauthLoading === "github" ? <Spinner /> : <Github size={16} />}
                Continue with GitHub
              </motion.button>
            </div>
            <OrDivider />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("signup")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${BORDER}`,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: TEXT,
                  cursor: "pointer",
                }}
              >
                <Mail size={15} />
                Sign up with email
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("login")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${BORDER}`,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: TEXT_DIM,
                  cursor: "pointer",
                }}
              >
                Log in
              </motion.button>
            </div>
            {feedback ? (
              <div
                style={{
                  marginTop: 16,
                  padding: "11px 14px",
                  borderRadius: 10,
                  background: feedback.tone === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.15)",
                  border:
                    feedback.tone === "error" ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(34,197,94,0.3)",
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
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TEXT_DIM_2, marginTop: 20, lineHeight: 1.5 }}>
              {sharedCopy.websiteBoundaryNote}
            </p>
          </motion.div>
        ) : null}

        {view === "signup" ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(24px, 3vw, 34px)",
                color: TEXT,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 6,
              }}
            >
              Create your account.
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, margin: 0, marginBottom: 28 }}>
              Already have one?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                style={{ background: "none", border: "none", cursor: "pointer", color: RED, font: "inherit", fontWeight: 600, padding: 0 }}
              >
                Log in
              </button>
            </p>
            <form onSubmit={handleEmailSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field
                label="Full name"
                placeholder="Ada Lovelace"
                value={signupName}
                onChange={(value) => {
                  setSignupName(value);
                  setSignupErrors((current) => ({ ...current, name: "" }));
                }}
                icon={User}
                error={signupErrors.name}
                autoComplete="name"
              />
              <Field
                label="Email address"
                placeholder="ada@company.com"
                value={signupEmail}
                onChange={(value) => {
                  setSignupEmail(value);
                  setSignupErrors((current) => ({ ...current, email: "" }));
                }}
                icon={Mail}
                type="email"
                error={signupErrors.email}
                autoComplete="email"
              />
              <PasswordField
                label="Password"
                placeholder="Min. 8 characters"
                value={signupPassword}
                onChange={(value) => {
                  setSignupPassword(value);
                  setSignupErrors((current) => ({ ...current, password: "" }));
                }}
                error={signupErrors.password}
                autoComplete="new-password"
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${signupErrors.legal ? "#ef4444" : BORDER}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(event) => {
                    setAcceptedLegal(event.target.checked);
                    setSignupErrors((current) => ({ ...current, legal: "" }));
                  }}
                  style={{ marginTop: 2 }}
                />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>
                  {sharedCopy.legalAcceptanceLabel}{" "}
                  <Link href={siteLinks.termsUrl} style={LEGAL_LINK_STYLE}>
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href={siteLinks.privacyUrl} style={LEGAL_LINK_STYLE}>
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {signupErrors.legal ? (
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#ef4444" }}>
                  {signupErrors.legal}
                </p>
              ) : null}
              {signupPassword ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <div style={{ display: "flex", gap: 4, marginTop: -4 }}>
                    {[1, 2, 3, 4].map((index) => {
                      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
                      return (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 999,
                            background: index <= passwordStrength ? colors[Math.max(passwordStrength - 1, 0)] : "rgba(255,255,255,0.1)",
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
              <PrimaryButton loading={isPending} type="submit">
                Create account <ArrowRight size={15} />
              </PrimaryButton>
            </form>
            <OrDivider />
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {["google", "github"].map((provider) => (
                <motion.button
                  key={provider}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSignUpProvider(provider as "google" | "github")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${BORDER}`,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: TEXT_DIM,
                    cursor: "pointer",
                  }}
                >
                  {provider === "google" ? <GoogleIcon size={14} /> : <Github size={14} />}
                  {provider === "google" ? "Google" : "GitHub"}
                </motion.button>
              ))}
            </div>
            {isTemporaryGoogleEnabled ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTemporaryTestingAccess}
                disabled={isPending || oauthLoading !== null}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 18,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(220,94,94,0.08)",
                  border: "1px dashed rgba(220,94,94,0.38)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#ffb8b8",
                  cursor: isPending || oauthLoading !== null ? "not-allowed" : "pointer",
                  opacity: isPending || oauthLoading !== null ? 0.65 : 1,
                }}
              >
                <CheckCheck size={14} />
                {sharedCopy.temporaryAccessAction}
              </motion.button>
            ) : null}
            <BackButton onClick={() => setView("auth")} />
          </motion.div>
        ) : null}

        {view === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(24px, 3vw, 34px)",
                color: TEXT,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 6,
              }}
            >
              Welcome back.
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, margin: 0, marginBottom: 28 }}>
              No account yet?{" "}
              <button
                type="button"
                onClick={() => setView("signup")}
                style={{ background: "none", border: "none", cursor: "pointer", color: RED, font: "inherit", fontWeight: 600, padding: 0 }}
              >
                Sign up free
              </button>
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
            <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field
                label="Email address"
                placeholder="ada@company.com"
                value={loginEmail}
                onChange={(value) => {
                  setLoginEmail(value);
                  setLoginErrors((current) => ({ ...current, email: "" }));
                  clearFormFeedback();
                }}
                icon={Mail}
                type="email"
                error={loginErrors.email}
                autoComplete="email"
              />
              <div>
                <PasswordField
                  label="Password"
                  placeholder="Your password"
                  value={loginPassword}
                  onChange={(value) => {
                    setLoginPassword(value);
                    setLoginErrors((current) => ({ ...current, password: "" }));
                    clearFormFeedback();
                  }}
                  error={loginErrors.password}
                  autoComplete="current-password"
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: TEXT_DIM_2,
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <PrimaryButton loading={isPending} type="submit">
                Log in <ArrowRight size={15} />
              </PrimaryButton>
            </form>
            <OrDivider />
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {["google", "github"].map((provider) => (
                <motion.button
                  key={provider}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleProvider(provider as "google" | "github")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${BORDER}`,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: TEXT_DIM,
                    cursor: "pointer",
                  }}
                >
                  {provider === "google" ? <GoogleIcon size={14} /> : <Github size={14} />}
                  {provider === "google" ? "Google" : "GitHub"}
                </motion.button>
              ))}
            </div>
            <BackButton onClick={() => setView("auth")} />
          </motion.div>
        ) : null}

        {view === "forgot" ? (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Mail size={20} style={{ color: "#818cf8" }} />
            </div>
            <h2
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(24px, 3vw, 34px)",
                color: TEXT,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 8,
              }}
            >
              Forgot your password?
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, lineHeight: 1.6, margin: 0, marginBottom: 28 }}>
              No problem. Enter your email and we&apos;ll send a reset link — it expires in 15 minutes.
            </p>
            <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field
                label="Email address"
                placeholder="ada@company.com"
                value={forgotEmail}
                onChange={(value) => {
                  setForgotEmail(value);
                  setForgotError("");
                }}
                icon={Mail}
                type="email"
                error={forgotError}
                autoComplete="email"
              />
              <PrimaryButton loading={isPending} type="submit">
                Send reset link <Send size={14} />
              </PrimaryButton>
            </form>
            <BackButton onClick={() => setView("login")} label="Back to log in" />
          </motion.div>
        ) : null}

        {view === "forgot-sent" ? (
          <motion.div
            key="forgot-sent"
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
              Check your inbox.
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, lineHeight: 1.65, margin: 0, marginBottom: 28, maxWidth: 340 }}>
              We&apos;ve sent a reset link to <span style={{ color: TEXT, fontWeight: 600 }}>{sentTo}</span>. Check your spam folder if it
              doesn&apos;t arrive within a minute.
            </p>
            <button
              type="button"
              onClick={() => setView("forgot")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: TEXT_DIM_2,
                padding: 0,
                marginBottom: 24,
              }}
            >
              Didn&apos;t get it? Try a different email →
            </button>
            <BackButton onClick={() => setView("login")} label="Back to log in" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </OverlayShell>
  );
}
