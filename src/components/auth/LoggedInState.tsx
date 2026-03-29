"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, CheckCircle2, Chrome, ChevronRight, Sparkles, X } from "lucide-react";

import { siteLinks } from "@/content/frontFacingCopy";
import { clearTemporaryAuthSession } from "@/lib/temp-auth-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useTemporarySessionGuard } from "@/components/auth/useTemporarySessionGuard";

type LoggedInStateProps = {
  email: string | null;
  isTemporary?: boolean;
};

const RED = "#dc5e5e";
const TEXT = "#FFF5F0";
const TEXT_DIM = "rgba(255,245,240,0.65)";
const TEXT_DIM_2 = "rgba(255,245,240,0.35)";
const BORDER = "rgba(255,255,255,0.12)";

const QUESTIONS = [
  {
    id: "type",
    prompt: "What are you building?",
    subtext: "We'll personalise your first scan for your project type.",
    options: [
      { id: "saas", label: "SaaS app", emoji: "🚀" },
      { id: "ecommerce", label: "E-commerce", emoji: "🛍️" },
      { id: "internal", label: "Internal tool", emoji: "🔧" },
      { id: "other", label: "Something else", emoji: "✨" },
    ],
  },
  {
    id: "team",
    prompt: "How big is your team?",
    subtext: "Helps us tune how we present team-level insights.",
    options: [
      { id: "solo", label: "Just me", emoji: "🧑‍💻" },
      { id: "small", label: "2 – 5", emoji: "👥" },
      { id: "mid", label: "6 – 20", emoji: "🏢" },
      { id: "large", label: "20+", emoji: "🏗️" },
    ],
  },
  {
    id: "concern",
    prompt: "What worries you most?",
    subtext: "We'll surface those insights first on your dashboard.",
    options: [
      { id: "api", label: "API costs", emoji: "💸" },
      { id: "perf", label: "Performance", emoji: "⚡" },
      { id: "ai", label: "AI spend", emoji: "🤖" },
      { id: "everything", label: "All of it", emoji: "😅" },
    ],
  },
] as const;

const READY_ITEMS = [
  { label: "Account created", icon: CheckCircle2 },
  { label: "Preferences saved", icon: CheckCircle2 },
  { label: "Chrome extension ready to install", icon: Chrome },
  { label: "First scan prepared", icon: Sparkles },
] as const;

export function LoggedInState({ email, isTemporary = false }: LoggedInStateProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const isResettingTemporarySession = useTemporarySessionGuard(isTemporary);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = QUESTIONS[currentIndex];
  const hasSelection = Boolean(answers[currentQuestion.id]);
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  const providerLabel = useMemo(() => {
    if (isTemporary) return "via Google";
    return "via email";
  }, [isTemporary]);

  function closeOverlay() {
    router.replace("/");
  }

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

  function handleNext() {
    if (!hasSelection) return;

    if (isLastQuestion) {
      setDone(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  if (isResettingTemporarySession) {
    return null;
  }

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
        border: "1px solid rgba(220,94,94,0.18)",
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
            {done ? (
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2 }}>All set ✓</span>
            ) : null}
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
                color: TEXT_DIM_2,
              }}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: "rgba(34,197,94,0.14)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <Check size={26} style={{ color: "#22c55e" }} />
              </motion.div>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  color: TEXT,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                You&apos;re all set.
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_DIM, lineHeight: 1.6, margin: 0, marginBottom: 28 }}>
                Welcome to Metis {providerLabel}. Here&apos;s what&apos;s ready for you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {READY_ITEMS.map(({ label, icon: Icon }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.09, duration: 0.3 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.22 + index * 0.09, type: "spring", stiffness: 300, damping: 18 }}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        flexShrink: 0,
                        background: "rgba(34,197,94,0.14)",
                        border: "1px solid rgba(34,197,94,0.28)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={12} style={{ color: "#4ade80" }} />
                    </motion.div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_DIM }}>{label}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "rgba(220,94,94,0.07)",
                  border: "1px solid rgba(220,94,94,0.18)",
                  marginBottom: 24,
                }}
              >
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_DIM, margin: 0, lineHeight: 1.55 }}>
                  <span style={{ color: TEXT, fontWeight: 600 }}>Next step: </span>
                  Pin the Metis extension, open any web app, and click the tab — your first cost score appears in under 2
                  seconds.
                </p>
              </motion.div>
              {isTemporary ? (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#ffb8b8", margin: "0 0 16px" }}>
                  Temporary local test account. Remove this flow before shipping.
                </p>
              ) : null}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <motion.button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "15px 28px",
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#fff5f0,#ffe8e8)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: RED,
                    cursor: "default",
                    boxShadow: "0 4px 20px rgba(255,255,255,0.1)",
                    pointerEvents: "none",
                  }}
                >
                  <Chrome size={15} style={{ color: RED }} />
                  Install extension — it&apos;s free
                  <ArrowRight size={14} />
                </motion.button>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/account"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "13px 28px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${BORDER}`,
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: TEXT_DIM,
                      textDecoration: "none",
                    }}
                  >
                    Go to my dashboard <ArrowRight size={14} />
                  </Link>
                </motion.div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isPending}
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
                  {isPending ? "Signing out" : "Sign out"}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
                {QUESTIONS.map((question, index) => (
                  <motion.div
                    key={question.id}
                    animate={{
                      width: index === currentIndex ? 22 : 7,
                      background:
                        index < currentIndex
                          ? "#22c55e"
                          : index === currentIndex
                            ? RED
                            : "rgba(255,255,255,0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ height: 5, borderRadius: 999 }}
                  />
                ))}
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_DIM_2, marginLeft: 2 }}>
                  {currentIndex + 1} / {QUESTIONS.length}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  color: TEXT,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  marginBottom: 6,
                }}
              >
                {currentQuestion.prompt}
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_DIM, margin: 0, marginBottom: 24 }}>
                {currentQuestion.subtext}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
                {currentQuestion.options.map((option) => {
                  const selected = answers[currentQuestion.id] === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "13px 14px",
                        borderRadius: 12,
                        cursor: "pointer",
                        background: selected ? "rgba(220,94,94,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selected ? "rgba(220,94,94,0.55)" : BORDER}`,
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{option.emoji}</span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13,
                          fontWeight: selected ? 600 : 400,
                          color: selected ? TEXT : TEXT_DIM,
                        }}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginLeft: "auto" }}>
                          <Check size={13} style={{ color: RED }} />
                        </motion.div>
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                type="button"
                whileHover={hasSelection ? { scale: 1.02 } : {}}
                whileTap={hasSelection ? { scale: 0.98 } : {}}
                onClick={handleNext}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: hasSelection ? RED : "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: hasSelection ? "pointer" : "not-allowed",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: hasSelection ? "white" : TEXT_DIM_2,
                  boxShadow: hasSelection ? "0 4px 18px rgba(220,94,94,0.3)" : "none",
                }}
              >
                {isLastQuestion ? "Finish setup" : "Next"} <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
