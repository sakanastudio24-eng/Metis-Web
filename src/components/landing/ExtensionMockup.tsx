"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Zap,
  FileText,
  ChevronRight,
  Shield,
  Crown,
  Activity,
} from "lucide-react";
import { frontFacingCopy } from "@/content/frontFacingCopy";

const METIS_RED = "#dc5e5e";
const DARK_BG = "#0c1623";
const PANEL_BG = "#111d2b";

export type MockupState = {
  score: number;
  riskLabel: string;
  riskColor: string;
  riskBg: string;
  quickInsight: string;
  costMin: number;
  costMax: number;
  sessionCost: string;
  issues: { title: string; severity: "critical" | "moderate" | "low"; color: string; saving: number }[];
};

// Animated score ring — RAF cubic ease-out
function MockScoreCircle({
  score,
  riskColor,
  size = 88,
}: {
  score: number;
  riskColor: string;
  size?: number;
}) {
  const [displayed, setDisplayed] = useState(score);
  const prevRef = useRef(score);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = score;
    prevRef.current = to;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (from === to) return;

    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [score]);

  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={riskColor}
        strokeWidth="5.5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.04s linear, stroke 0.6s ease" }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fill="white"
        fontSize={size * 0.24}
        fontFamily="Jua, sans-serif"
        fontWeight="bold"
      >
        {displayed}
      </text>
    </svg>
  );
}

const SEVERITY_ICONS = {
  critical: AlertCircle,
  moderate: AlertTriangle,
  low: Info,
};

export function ExtensionMockup({ state }: { state: MockupState }) {
  const copy = frontFacingCopy.mockup;

  return (
    <div
      style={{
        width: 380,
        background: PANEL_BG,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: DARK_BG,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: METIS_RED,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "Jua, sans-serif", fontSize: 16, color: "white" }}>M</span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "Jua, sans-serif", fontSize: 13, color: "white" }}>{copy.title}</span>
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0, marginTop: 1 }}>
              {copy.subtitle}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Live pulse dot */}
          <motion.div
            style={{ width: 6, height: 6, borderRadius: "50%", background: state.riskColor, flexShrink: 0 }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <Activity size={11} style={{ color: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>

      {/* Score section */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <MockScoreCircle score={state.score} riskColor={state.riskColor} size={86} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={state.score}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontFamily: "Jua, sans-serif", fontSize: 26, color: "white", lineHeight: 1 }}
                >
                  {state.score}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.riskLabel}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    borderRadius: 999,
                    padding: "3px 10px",
                    background: state.riskBg,
                  }}
                >
                  <motion.div
                    style={{ width: 6, height: 6, borderRadius: "50%", background: state.riskColor, flexShrink: 0 }}
                    animate={{ opacity: [1, 0.35, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 600, color: state.riskColor }}>{state.riskLabel}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0, marginBottom: 4 }}>
              {copy.scoreLabel}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${state.costMin}-${state.costMax}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}
              >
                {copy.monthlyWastePrefix}
                <span style={{ color: "white", fontWeight: 600 }}>${state.costMin}–${state.costMax}</span>
                {copy.monthlyWasteSuffix}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Quick insight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.quickInsight}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              marginTop: 12,
              borderRadius: 10,
              padding: "8px 12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>
              {state.quickInsight}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Session cost block */}
      <div
        style={{
          margin: "0 16px",
          marginTop: 12,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <motion.div
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366f1" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
            {copy.liveSampleLabel}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{copy.sessionCostLabel}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={state.sessionCost}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: "Jua, sans-serif", fontSize: 13, color: "white" }}
            >
              {state.sessionCost}
            </motion.span>
          </AnimatePresence>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: "rgba(99,102,241,0.07)",
            borderTop: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <Zap size={9} style={{ color: "#6366f1", flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{copy.scaleProjectionLabel}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={state.costMin}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontFamily: "Jua, sans-serif", fontSize: 10, color: "#a5b4fc" }}
            >
              {copy.monthlyProjectionValue(state.costMin)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Issues */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Shield size={10} style={{ color: "rgba(255,255,255,0.28)" }} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.28)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {state.issues.length > 0 ? copy.issuesLabel.withIssues(state.issues.length) : copy.issuesLabel.empty}
          </span>
        </div>

        <div style={{ minHeight: 80 }}>
          <AnimatePresence>
            {state.issues.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  marginBottom: 8,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{copy.insightEmpty}</span>
              </motion.div>
            ) : (
              state.issues.map((issue, i) => {
                const Icon = SEVERITY_ICONS[issue.severity];
                return (
                  <motion.div
                    key={issue.title}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 0",
                      borderBottom: i < state.issues.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      overflow: "hidden",
                    }}
                  >
                    <Icon size={11} style={{ color: issue.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                      {issue.title}
                    </span>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "2px 7px",
                        background: issue.color + "22",
                        color: issue.color,
                        fontSize: 8,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {issue.severity}
                    </span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 10,
            background: METIS_RED,
            cursor: "pointer",
          }}
        >
          <FileText size={11} style={{ color: "white" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: "white" }}>
            Open Full Report
          </span>
          <ChevronRight size={11} style={{ color: "white" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              borderRadius: 999,
              padding: "3px 8px",
              background: "rgba(16,163,127,0.12)",
              border: "1px solid rgba(16,163,127,0.25)",
            }}
          >
            <span style={{ fontSize: 8 }}>🤖</span>
            <span style={{ fontSize: 9, color: "#10a37f" }}>AI detected · OpenAI</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              borderRadius: 999,
              padding: "3px 8px",
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <span style={{ fontSize: 8 }}>⚡</span>
            <span style={{ fontSize: 9, color: "#f97316" }}>12 API calls/load</span>
          </div>
        </div>
      </div>
    </div>
  );
}
