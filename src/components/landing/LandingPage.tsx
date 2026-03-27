"use client";

/**
 * LandingPage.tsx — Metis Chrome Extension · Marketing Site
 * ──────────────────────────────────────────────────────────
 * Tech stack: Next.js · React · Python (FastAPI backend) · TypeScript
 *
 * Sections (scroll order):
 *   1. Hero            — full-width, centred; brand wordmark + live score chip
 *   2. Product         — 4-up feature grid; sticky mockup sidebar triggers here
 *   3. AI Guide        — step-by-step AI 1-to-1 migration guide (NEW)
 *   4. Problem         — stats + issues list; shows the pain before the fix
 *   5. Design System   — Metis colour tokens, type scale, spacing refs (NEW)
 *   6. Fixes           — ranked code-level fix cards with root-cause + solution
 *   7. Solution        — result card + CTA
 *
 * Layout pattern (sections 2–7):
 *   Left column  → prose + interactive content  (flex: 1)
 *   Right column → sticky ExtensionMockup (≥xl only), fades in at Product h2
 *
 * Navigation:
 *   Floating centred pill nav; active section highlighted with spring-animated
 *   background pill (layoutId="nav-pill"). Fades in at delay 1.6 s.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Zap,
  Activity,
  TrendingDown,
  Shield,
  AlertCircle,
  CheckCheck,
  ChevronRight,
  Crown,
  Github,
  Mail,
  ExternalLink,
  Bot,           // AI guide icon
  Palette,       // design system icon
  Code2,         // code block / migration
  Layers,        // stack icon
  MessageSquare, // chat / guide message
  Sparkles,      // AI sparkle
  Terminal,      // code terminal
  BookOpen,      // guide / docs
} from "lucide-react";
import { ExtensionMockup, MockupState } from "./ExtensionMockup";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// Keep all colour/spacing constants here so changes propagate globally.
// ─────────────────────────────────────────────────────────────────────────────
const RED         = "#dc5e5e";   // Metis brand red — primary CTA, accent
const CREAM       = "#FFF5F0";   // warm off-white — hero background
const DARK_BLUE   = "#0c1623";   // footer background
const TEXT_W      = "#FFF5F0";   // white-ish text used on red sections
const TEXT_W_DIM  = "rgba(255,245,240,0.65)";
const TEXT_W_DIM2 = "rgba(255,245,240,0.38)";
const TEXT_R      = "#dc5e5e";   // red text used on cream/hero section
const TEXT_R_DIM  = "rgba(180,50,50,0.6)";
const CARD_BG     = "rgba(0,0,0,0.10)";
const CARD_BD     = "rgba(255,255,255,0.18)";
const WARD_STUDIO_URL = "https://zward.studio";
const REPO_URL = "https://github.com/sakanastudio24-eng/Metis-Web";
const CHROME_WAITLIST_URL = "/sign-up";
const PRIVACY_URL = "/privacy";
const TERMS_URL = "/terms";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION KEYS
// Union type — every key maps to a mockup state + a nav label.
// Add new sections here first, then extend SECTION_STATES and NAV_SECTIONS.
// ─────────────────────────────────────────────────────────────────────────────
type SectionKey = "hero" | "product" | "guide" | "problem" | "design" | "fixes" | "solution";

// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP STATES
// Each key maps to a snapshot of the ExtensionMockup's visible state.
// The sticky sidebar animates between these as the user scrolls.
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_STATES: Record<SectionKey, MockupState> = {
  // Hero — first impression; moderate risk to set expectation
  hero: {
    score: 72, riskLabel: "Moderate Risk", riskColor: "#f97316",
    riskBg: "rgba(249,115,22,0.2)",
    quickInsight: "High request count and AI usage detected",
    costMin: 22, costMax: 40, sessionCost: "$0.0042",
    issues: [
      { title: "Duplicate API Requests", severity: "critical", color: "#ef4444", saving: 8 },
      { title: "Memory Leak Pattern",    severity: "critical", color: "#ef4444", saving: 5 },
      { title: "AI API Call Frequency",  severity: "moderate", color: "#f97316", saving: 11 },
    ],
  },
  // Product section — shows a slightly cleaned up state
  product: {
    score: 68, riskLabel: "Moderate Risk", riskColor: "#f97316",
    riskBg: "rgba(249,115,22,0.2)",
    quickInsight: "Moderate cost inefficiencies across 5 issues",
    costMin: 18, costMax: 34, sessionCost: "$0.0038",
    issues: [
      { title: "Duplicate API Requests", severity: "critical", color: "#ef4444", saving: 8 },
      { title: "Memory Leak Pattern",    severity: "critical", color: "#ef4444", saving: 5 },
      { title: "Unoptimized Images",     severity: "moderate", color: "#f97316", saving: 4 },
    ],
  },
  // AI Guide — calm, low issues: Metis is guiding the migration
  guide: {
    score: 55, riskLabel: "Moderate Risk", riskColor: "#f97316",
    riskBg: "rgba(249,115,22,0.2)",
    quickInsight: "AI guide active — migration in progress",
    costMin: 14, costMax: 26, sessionCost: "$0.0029",
    issues: [
      { title: "AI API Call Frequency",  severity: "moderate", color: "#f97316", saving: 11 },
      { title: "Missing Cache Headers",  severity: "low",      color: "#eab308", saving: 2 },
    ],
  },
  // Problem section — worst state; illustrates the pain point
  problem: {
    score: 88, riskLabel: "High Risk", riskColor: "#ef4444",
    riskBg: "rgba(239,68,68,0.2)",
    quickInsight: "Severe API overuse and memory pressure detected",
    costMin: 38, costMax: 71, sessionCost: "$0.0089",
    issues: [
      { title: "Duplicate API Requests", severity: "critical", color: "#ef4444", saving: 8 },
      { title: "Memory Leak Pattern",    severity: "critical", color: "#ef4444", saving: 5 },
      { title: "AI API Call Frequency",  severity: "moderate", color: "#f97316", saving: 11 },
      { title: "Unoptimized Images",     severity: "moderate", color: "#f97316", saving: 4 },
      { title: "Missing Cache Headers",  severity: "low",      color: "#eab308", saving: 2 },
    ],
  },
  // Design system section — clean, design-focused state
  design: {
    score: 42, riskLabel: "Low Risk", riskColor: "#eab308",
    riskBg: "rgba(234,179,8,0.2)",
    quickInsight: "Design system tokens loaded — 1 style issue",
    costMin: 8, costMax: 15, sessionCost: "$0.0018",
    issues: [
      { title: "Missing Cache Headers", severity: "low", color: "#eab308", saving: 2 },
    ],
  },
  // Fixes section — after applying top 2 fixes; improving
  fixes: {
    score: 44, riskLabel: "Low Risk", riskColor: "#eab308",
    riskBg: "rgba(234,179,8,0.2)",
    quickInsight: "2 minor issues remain — fixes applied to critical items",
    costMin: 9, costMax: 17, sessionCost: "$0.0021",
    issues: [
      { title: "AI API Call Frequency",  severity: "moderate", color: "#f97316", saving: 11 },
      { title: "Missing Cache Headers",  severity: "low",      color: "#eab308", saving: 2 },
    ],
  },
  // Solution — optimised; minimal risk; happy path
  solution: {
    score: 24, riskLabel: "Minimal Risk", riskColor: "#22c55e",
    riskBg: "rgba(34,197,94,0.2)",
    quickInsight: "Site is well-optimized — low cost risk detected",
    costMin: 3, costMax: 7, sessionCost: "$0.0008",
    issues: [],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NAV SECTIONS
// Drives the floating pill nav links (excludes "hero" — logo click goes there).
// ─────────────────────────────────────────────────────────────────────────────
const NAV_SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "product",  label: "Product"  },
  { key: "guide",    label: "AI Guide" },
  { key: "problem",  label: "Problem"  },
  { key: "design",   label: "Design"   },
  { key: "fixes",    label: "Fixes"    },
  { key: "solution", label: "Solution" },
];

// ─────────────────────────────────────────────────────────────────────────────
// TECH STACK
// Displayed as a scrolling strip in the Hero.
// Update this array when the stack changes.
// ─────────────────────────────────────────────────────────────────────────────
const TECH_STACK = [
  { label: "Next.js",     color: "#000000", bg: "rgba(0,0,0,0.08)",         border: "rgba(0,0,0,0.15)",         dot: "#000" },
  { label: "React",       color: "#61dafb", bg: "rgba(97,218,251,0.08)",    border: "rgba(97,218,251,0.25)",    dot: "#61dafb" },
  { label: "Python",      color: "#3b82f6", bg: "rgba(59,130,246,0.08)",    border: "rgba(59,130,246,0.25)",    dot: "#3b82f6" },
  { label: "TypeScript",  color: "#2563eb", bg: "rgba(37,99,235,0.08)",     border: "rgba(37,99,235,0.25)",     dot: "#2563eb" },
  { label: "FastAPI",     color: "#10b981", bg: "rgba(16,185,129,0.08)",    border: "rgba(16,185,129,0.25)",    dot: "#10b981" },
  { label: "Tailwind",    color: "#38bdf8", bg: "rgba(56,189,248,0.08)",    border: "rgba(56,189,248,0.25)",    dot: "#38bdf8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV
// ─────────────────────────────────────────────────────────────────────────────
/**
 * StickyNav — floating pill nav centred at top: 16px.
 *
 * Behaviour:
 * - Appears after 1.6 s stagger (lets hero animate in first)
 * - Pill background + border shift between hero (cream) and red sections
 * - Active link gets a spring-animated pill highlight (layoutId="nav-pill")
 * - "Try free" CTA always brand-red for visual consistency
 */
function StickyNav({
  active, onNav, isHero,
}: {
  active: SectionKey;
  onNav: (id: string) => void;
  isHero: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  // Track scroll depth to add shadow once user has scrolled 80px
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Colours switch based on whether we're over the hero (cream bg) or sections (red bg)
  const pillBg       = isHero ? "rgba(255,245,240,0.88)" : "rgba(18,5,5,0.75)";
  const pillBd       = isHero ? "rgba(220,94,94,0.2)"    : "rgba(255,255,255,0.1)";
  const textMain     = isHero ? TEXT_R     : TEXT_W;
  const textDim      = isHero ? TEXT_R_DIM : TEXT_W_DIM;
  const activePillBg = isHero ? "rgba(220,94,94,0.1)"    : "rgba(255,255,255,0.12)";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 16, left: 0, right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none", // let clicks fall through to page outside the pill
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: 999,
          // Extra left padding so logo + divider have breathing room
          padding: "5px 6px 5px 14px",
          background: pillBg,
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
          border: `1px solid ${pillBd}`,
          boxShadow: scrolled
            ? isHero
              ? "0 4px 32px rgba(220,94,94,0.12), 0 1px 0 rgba(255,255,255,0.55) inset"
              : "0 4px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset"
            : isHero
              ? "0 2px 16px rgba(220,94,94,0.08)"
              : "0 2px 16px rgba(0,0,0,0.3)",
          transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
        }}
      >
        {/* ── Logo — clicking scrolls back to hero ── */}
        <button
          onClick={() => onNav("hero")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "4px 10px 4px 0",
            display: "flex", alignItems: "center", gap: 7,
          }}
        >
          {/* Small red square with "M" — mirrors the full hero wordmark */}
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: RED,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(220,94,94,0.35)",
          }}>
            <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 13, color: "white", lineHeight: 1 }}>M</span>
          </div>
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, color: textMain, letterSpacing: "-0.02em", lineHeight: 1 }}>
            Metis
          </span>
        </button>

        {/* Thin vertical divider between logo and nav links */}
        <div style={{ width: 1, height: 14, background: isHero ? "rgba(220,94,94,0.2)" : "rgba(255,255,255,0.14)", margin: "0 6px" }} />

        {/* ── Section links — spring pill highlights active item ── */}
        {NAV_SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onNav(key)}
            style={{
              position: "relative",
              background: "none",
              border: "none", cursor: "pointer",
              padding: "6px 13px", borderRadius: 999,
              fontFamily: "Inter, sans-serif", fontSize: 13,
              fontWeight: active === key ? 600 : 400,
              color: active === key ? textMain : textDim,
              transition: "color 0.2s",
            }}
          >
            {/* Shared layoutId lets Motion animate the pill between links */}
            {active === key && (
              <motion.div
                layoutId="nav-pill"
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: 999,
                  background: activePillBg,
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {label}
          </button>
        ))}

        {/* Thin vertical divider before CTA */}
        <div style={{ width: 1, height: 14, background: isHero ? "rgba(220,94,94,0.2)" : "rgba(255,255,255,0.14)", margin: "0 6px" }} />

        {/* ── CTA — always brand-red ── */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 4px 18px rgba(220,94,94,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.assign(CHROME_WAITLIST_URL)}
          style={{
            background: RED,
            border: "none",
            borderRadius: 999, padding: "7px 16px",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700,
            color: "white",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 2px 10px rgba(220,94,94,0.28)",
          }}
        >
          Try free
          <ArrowRight size={12} />
        </motion.button>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// Full-width, centred. Sits outside the two-col layout.
// Contains: badge → wordmark → quote → CTAs → live score chip →
//           stats → tech stack strip → scroll nudge
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section
      id="hero"
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
      }}
    >
      {/* Beta badge — animates in after Metis wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 36 }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: 999, padding: "5px 14px",
            background: "rgba(220,94,94,0.1)",
            border: "1px solid rgba(220,94,94,0.22)",
          }}
        >
          <Crown size={11} style={{ color: RED }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: RED }}>
            Now in beta — shaped around the extension that already exists
          </span>
        </div>
      </motion.div>

      {/* Wordmark — first element to appear (delay 0) */}
      <motion.h1
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "clamp(72px, 12vw, 128px)",
          color: RED,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          margin: 0,
          marginBottom: 28,
        }}
      >
        Metis
      </motion.h1>

      {/* Italic quote tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "DM Serif Display, serif",
          fontStyle: "italic",
          fontSize: "clamp(18px, 2.2vw, 26px)",
          color: TEXT_R_DIM,
          lineHeight: 1.5,
          margin: 0,
          marginBottom: 48,
          maxWidth: 560,
        }}
      >
        &ldquo;Every session has a price.
        <br />
        Most teams never see the bill.&rdquo;
      </motion.p>

      {/* Primary + secondary CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 52, flexWrap: "wrap", justifyContent: "center" }}
      >
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(220,94,94,0.25)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.assign(CHROME_WAITLIST_URL)}
          style={{
            background: RED, color: CREAM, border: "none",
            borderRadius: 999, padding: "14px 28px",
            fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}
        >
          Start for free
          <ArrowRight size={15} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "rgba(220,94,94,0.08)", color: TEXT_R,
            border: "1px solid rgba(220,94,94,0.22)",
            borderRadius: 999, padding: "14px 28px",
            fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}
          onClick={() => document.getElementById("product")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          Watch a scan
          <ChevronRight size={15} />
        </motion.button>
      </motion.div>

      {/* Live score chip — pulsing green dot + example score */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          borderRadius: 12, padding: "10px 16px",
          background: "rgba(220,94,94,0.07)",
          border: "1px solid rgba(220,94,94,0.18)",
        }}
      >
        {/* Breathing animation on the live indicator dot */}
        <motion.div
          style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}
          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_R_DIM }}>
          This page&apos;s current Metis score:&nbsp;
          <span style={{ fontFamily: "Jua, sans-serif", fontSize: 14, color: RED }}>42</span>
          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: "#22c55e" }}>Minimal Risk</span>
        </span>
        <div style={{ width: 1, height: 18, background: "rgba(220,94,94,0.18)" }} />
        <span style={{ fontSize: 11, color: TEXT_R_DIM }}>Live page sample</span>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 52, flexWrap: "wrap", justifyContent: "center" }}
      >
        {[
          { val: "< 2s", label: "time to first signal" },
          { val: "5+",   label: "pages sampled in a live run" },
          { val: "$0",   label: "to understand the first report" },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Jua, sans-serif", fontSize: 26, color: RED, lineHeight: 1 }}>{val}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_R_DIM, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Tech Stack Strip ──
          Shows the migration target stack: Next.js / React / Python / TypeScript.
          Uses pill badges with per-technology brand colour accents.
          TECH_STACK array at the top of this file controls what appears here. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
      >
        <span style={{
          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
          color: TEXT_R_DIM, textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          Product stack
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {TECH_STACK.map(({ label, color, bg, border, dot }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ duration: 0.15 }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                borderRadius: 999, padding: "6px 14px",
                background: bg,
                border: `1px solid ${border}`,
                cursor: "default",
              }}
            >
              {/* Colour dot replaces logo — keeps it lightweight */}
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color }}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll nudge — breathing opacity loop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.5 }}
        style={{ marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <motion.span
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            color: TEXT_R_DIM,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          keep going
        </motion.span>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Full-width 1px hairline used between sections */
function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.12)" }} />;
}

/**
 * SectionTag — small pill label above each section's h2.
 * Accepts a plain string child. Example: <SectionTag>Product</SectionTag>
 */
function SectionTag({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center",
        borderRadius: 999, padding: "4px 12px",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.18)",
        marginBottom: 20,
      }}
    >
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: TEXT_W_DIM, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {children}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT SECTION
// 4-up feature grid. The h2 ref is passed up so LandingPage can use an
// IntersectionObserver to trigger the sticky mockup sidebar at the right time.
// ─────────────────────────────────────────────────────────────────────────────
function ProductSection({
  sectionRef,
  h2Ref,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  h2Ref: React.RefObject<HTMLHeadingElement | null>;
}) {
  // Feature cards — icon, title, description
  const features = [
    { icon: Activity,    title: "Hover-first workflow", desc: "Metis stays lightweight on the page, then opens the deeper workspace in the browser side panel when you want context." },
    { icon: TrendingDown,title: "Cost and control",     desc: "The product frames waste in plain language: what costs money now, what scales badly later, and what deserves attention first." },
    { icon: Zap,         title: "Stack-aware signals",  desc: "Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic." },
    { icon: Shield,      title: "Built for real teams", desc: "The website explains the product cleanly while the extension stays focused on scanning, scoring, and the side-panel workspace." },
  ];

  return (
    <section id="product" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>Product</SectionTag>

        {/* h2Ref triggers the sticky sidebar via IntersectionObserver in LandingPage */}
        <motion.h2
          ref={h2Ref}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 560 }}
        >
          The cost layer your frontend never had.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.6, margin: 0, marginBottom: 56, maxWidth: 480 }}
        >
          Metis was designed to feel calm on the page and serious in the report.
          It catches what a normal profiler rarely explains: what those requests mean for real spend.
        </motion.p>

        {/* 2-col grid — stagger animates each card in 80ms apart */}
        <div className="metis-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              style={{ background: CARD_BG, border: `1px solid ${CARD_BD}`, borderRadius: 16, padding: 24 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={16} style={{ color: TEXT_W }} />
              </div>
              <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, color: TEXT_W, margin: 0, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W_DIM, lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI GUIDE SECTION  (NEW)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * AIGuideSection — "Your AI 1-to-1 migration guide"
 *
 * Visualises the step-by-step AI-driven code migration flow:
 *   Scan → Analyse → Guide → Apply → Verify
 *
 * The mock chat thread shows what Metis's AI assistant actually says at each
 * step so visitors can feel the product without installing it.
 *
 * Tech context: the public site explains the future workflow without pretending
 * it is already live. The Python service scaffold sits beside the Next.js app
 * so auth, guidance, and protected product flows can be added cleanly later.
 */
function AIGuideSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  // Active step index — cycles on a 3 s timer to demo the guide automatically
  const [activeStep, setActiveStep] = useState(0);

  // Each step maps to a migration phase.
  // color  → accent used on the step indicator ring
  // msg    → what the AI assistant says at this phase
  // code   → the code snippet the AI suggests (TypeScript/Python snippet)
  const steps = [
    {
      icon: Activity,
      label: "1. Scan",
      detail: "The extension collects a short scan window and turns it into a clean session snapshot.",
      color: "#f97316",
      msg: "I've scanned 47 requests. Found 3 critical issues costing ~$26/mo.",
      code: `// next.config.ts — migrating from CRA to Next.js\nexport default { output: 'standalone' };`,
    },
    {
      icon: Bot,
      label: "2. Analyse",
      detail: "A future Python service can read the snapshot and map each issue to a likely root cause.",
      color: "#8b5cf6",
      msg: "Root cause: fetchUser() is called in 4 components with no shared cache key.",
      code: `# FastAPI endpoint — cost snapshot ingestion\n@app.post("/analyse")\nasync def analyse(snapshot: CostSnapshot) -> FixPlan: ...`,
    },
    {
      icon: Code2,
      label: "3. Guide",
      detail: "Metis turns the scan into ranked guidance shaped around the stack it detected.",
      color: "#3b82f6",
      msg: "Here's the fix for fetchUser — replace with SWR and a shared 'user' key:",
      code: `// Before (React)\nconst data = await fetchUser(id);\n\n// After (Next.js + SWR)\nconst { data } = useSWR(\`/api/user/\${id}\`, fetcher);`,
    },
    {
      icon: CheckCheck,
      label: "4. Apply",
      detail: "After you apply the fix, the next scan shows whether the score and issue list actually improved.",
      color: "#22c55e",
      msg: "Fix applied ✓ — request count dropped from 47 → 31. Score improved: 88 → 44.",
      code: `// TypeScript shared type (extension ↔ Next.js app)\nexport interface CostSnapshot {\n  score: number;\n  issues: Issue[];\n}`,
    },
  ];

  // Auto-advance through steps so the section feels alive even without interaction
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 3000);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <section id="guide" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>AI 1-to-1 Guide</SectionTag>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 560 }}
        >
          A calmer path from issue to fix.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 48, maxWidth: 500 }}
        >
          The website sets the expectation for the deeper product flow: detect the problem, explain why it matters,
          then hand the team a fix path that feels grounded in their stack.
        </motion.p>

        {/* ── Step indicator tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {steps.map(({ label, color }, i) => (
            <button
              key={label}
              onClick={() => setActiveStep(i)}
              style={{
                background: activeStep === i ? color + "22" : "rgba(255,255,255,0.06)",
                border: `1px solid ${activeStep === i ? color + "55" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 999, padding: "6px 14px",
                fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: activeStep === i ? 700 : 400,
                color: activeStep === i ? color : TEXT_W_DIM,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Active step card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: 18,
              overflow: "hidden",
              border: `1px solid ${steps[activeStep].color}33`,
              background: "rgba(0,0,0,0.18)",
              marginBottom: 24,
            }}
          >
            {/* Card header */}
            <div style={{
              padding: "12px 16px",
              background: steps[activeStep].color + "18",
              borderBottom: `1px solid ${steps[activeStep].color}22`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              {/* Step icon */}
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: steps[activeStep].color + "22",
                border: `1px solid ${steps[activeStep].color}44`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {(() => { const Icon = steps[activeStep].icon; return <Icon size={13} style={{ color: steps[activeStep].color }} />; })()}
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: TEXT_W }}>
                {steps[activeStep].label}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_W_DIM, marginLeft: 4 }}>
                — {steps[activeStep].detail}
              </span>
            </div>

            {/* AI chat bubble */}
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {/* AI avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sparkles size={12} style={{ color: "#a78bfa" }} />
                </div>
                <div style={{
                  flex: 1, borderRadius: "4px 14px 14px 14px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  padding: "10px 14px",
                }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W, margin: 0, lineHeight: 1.55 }}>
                    {steps[activeStep].msg}
                  </p>
                </div>
              </div>
            </div>

            {/* Code snippet — monospaced, syntax-coloured manually */}
            <div style={{ margin: "0 16px 16px", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{
                padding: "8px 12px",
                background: "rgba(0,0,0,0.3)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Terminal size={11} style={{ color: TEXT_W_DIM2 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: TEXT_W_DIM2, letterSpacing: "0.04em" }}>
                  AI-generated fix · {steps[activeStep].label}
                </span>
              </div>
              <pre style={{
                margin: 0, padding: "14px 16px",
                fontFamily: "JetBrains Mono, Fira Code, monospace", fontSize: 12,
                color: "rgba(255,245,240,0.75)", lineHeight: 1.65,
                background: "rgba(0,0,0,0.22)",
                overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {steps[activeStep].code}
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots below the card */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {steps.map((_, i) => (
            <motion.div
              key={i}
              onClick={() => setActiveStep(i)}
              animate={{ width: activeStep === i ? 20 : 6, background: activeStep === i ? steps[i].color : "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.3 }}
              style={{ height: 6, borderRadius: 999, cursor: "pointer" }}
            />
          ))}
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TEXT_W_DIM2, marginLeft: 8 }}>
            Auto-advancing · click to jump
          </span>
        </div>

        {/* Tech context note */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            marginTop: 32,
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "14px 16px",
            borderRadius: 12,
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <BookOpen size={14} style={{ color: "#a78bfa", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_W_DIM, margin: 0, lineHeight: 1.6 }}>
            <span style={{ color: TEXT_W, fontWeight: 600 }}>Under the hood:</span>{" "}
            The Python scaffold in this repo is where future auth, protected reports, and guided fix flows will
            land. Right now the site is honest about the shape of that system without claiming the automation is live.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM SECTION
// Shows the "before Metis" state: raw stats + a live issues list.
// ─────────────────────────────────────────────────────────────────────────────
function ProblemSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  // Stat cards — val + optional unit label + description
  const stats = [
    { val: "24",     unit: "avg", label: "API calls per page load" },
    { val: "3.2",    unit: "MB",  label: "avg payload per session" },
    { val: "$0.004", unit: "",    label: "avg session cost, unoptimised" },
    { val: "86%",    unit: "",    label: "of teams don't know their frontend cost" },
  ];

  return (
    <section id="problem" ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "100px 0" }}
    >
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>The Problem</SectionTag>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 580 }}
        >
          Your frontend is bleeding money every session.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 56, maxWidth: 520 }}
        >
          Unoptimised requests, noisy third-party scripts, and AI-heavy interactions compound quietly.
          Metis exists to make that waste legible before it becomes a postmortem.
        </motion.p>

        {/* 2×2 stat grid — scale-in on entry */}
        <div className="metis-grid-2-tight" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 48 }}>
          {stats.map(({ val, unit, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "20px 22px" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "Jua, sans-serif", fontSize: 32, color: TEXT_W, lineHeight: 1 }}>{val}</span>
                {unit && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_W_DIM }}>{unit}</span>}
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_W_DIM2, margin: 0, lineHeight: 1.4 }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Issues list — mirrors what Metis shows in the extension */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
          style={{ background: "rgba(0,0,0,0.18)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, overflow: "hidden" }}
        >
          {/* Header bar */}
          <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={12} style={{ color: "#ef4444" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              5 issues detected · High Risk
            </span>
          </div>
          {[
            { title: "Duplicate API Requests — 8× per load",       sev: "critical", color: "#ef4444" },
            { title: "Memory leak in 3 components",                 sev: "critical", color: "#ef4444" },
            { title: "OpenAI called on every keystroke",            sev: "moderate", color: "#f97316" },
            { title: "3 images over 2MB — no WebP conversion",     sev: "moderate", color: "#f97316" },
            { title: "Static assets without Cache-Control headers", sev: "low",      color: "#eab308" },
          ].map((issue, i) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }} transition={{ delay: 0.05 * i, duration: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: issue.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,245,240,0.8)" }}>{issue.title}</span>
              <span style={{ borderRadius: 999, padding: "2px 8px", background: issue.color + "22", color: issue.color, fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 600 }}>
                {issue.sev}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM SECTION  (NEW)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * DesignSystemSection — "Current Design System"
 *
 * Shows the Metis design language:
 *   • Colour tokens with hex values
 *   • Type scale (DM Serif Display headings / Inter body / Jua numerics)
 *   • Spacing scale (4-based grid)
 *   • Component examples (SectionTag pill, score ring, issue row)
 *
 * This section serves as living documentation — designers can point new
 * contributors here to understand the token system at a glance.
 */
function DesignSystemSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  // Colour tokens pulled from the constants at the top of this file
  const colourTokens = [
    { name: "--red",       hex: "#dc5e5e", label: "Brand Red",    usage: "CTAs, accents, wordmark" },
    { name: "--cream",     hex: "#FFF5F0", label: "Cream",        usage: "Hero background, text on red" },
    { name: "--dark-blue", hex: "#0c1623", label: "Dark Blue",    usage: "Footer background" },
    { name: "--text-dim",  hex: "rgba(255,245,240,0.65)", label: "Text Dim", usage: "Secondary body copy on red bg" },
    { name: "--card-bg",   hex: "rgba(0,0,0,0.10)",       label: "Card BG",   usage: "Feature + fix card backgrounds" },
    { name: "--green",     hex: "#22c55e", label: "Success Green", usage: "Minimal risk score, savings labels" },
    { name: "--orange",    hex: "#f97316", label: "Warning Orange", usage: "Moderate risk, AI issue severity" },
    { name: "--red-crit",  hex: "#ef4444", label: "Critical Red",  usage: "Critical severity issues" },
  ];

  // Type scale entries
  const typeScale = [
    { role: "Display",    family: "DM Serif Display", size: "clamp(36–128px)", usage: "h1, h2 headings" },
    { role: "Numeric",    family: "Jua",               size: "26–48px",         usage: "Scores, stats, large numbers" },
    { role: "Body",       family: "Inter",             size: "12–17px",         usage: "All prose, labels, UI copy" },
    { role: "Mono",       family: "JetBrains Mono",    size: "12px",            usage: "Code snippets in AI guide" },
  ];

  // 4-base spacing scale (px values)
  const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 100];

  return (
    <section id="design" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>Design System</SectionTag>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 540 }}
        >
          The Metis design language.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 52, maxWidth: 500 }}
        >
          Consistent tokens, type scale, and spacing so the site feels intentional,
          even before the full product account system lands.
        </motion.p>

        {/* ── Colour tokens ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Palette size={14} style={{ color: TEXT_W_DIM }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: TEXT_W, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Colour Tokens
            </span>
          </div>
          <div className="metis-grid-2-tight" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {colourTokens.map(({ name, hex, label, usage }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Colour swatch */}
                <div style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: hex,
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: RED, marginBottom: 2 }}>{name}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: TEXT_W, marginBottom: 1 }}>{label}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: TEXT_W_DIM2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{usage}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Type scale ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Layers size={14} style={{ color: TEXT_W_DIM }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: TEXT_W, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Type Scale
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            {typeScale.map(({ role, family, size, usage }, i) => (
              <div
                key={role}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px",
                  background: i % 2 === 0 ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.07)",
                  borderBottom: i < typeScale.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                {/* Role pill */}
                <span style={{
                  flexShrink: 0, minWidth: 64,
                  fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700,
                  color: RED, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {role}
                </span>
                {/* Family name */}
                <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W }}>{family}</span>
                {/* Size range */}
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: TEXT_W_DIM2 }}>{size}</span>
                {/* Usage context */}
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TEXT_W_DIM2, flexShrink: 0 }}>{usage}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Spacing scale ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <MessageSquare size={14} style={{ color: TEXT_W_DIM }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: TEXT_W, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Spacing Scale (4px base)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexWrap: "wrap" }}>
            {spacingScale.map((px) => (
              <div key={px} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {/* Bar height represents the spacing value proportionally (capped) */}
                <div style={{
                  width: 24,
                  height: Math.min(px, 60),
                  borderRadius: 4,
                  background: `rgba(220,94,94,${0.2 + Math.min(px / 100, 0.7)})`,
                  border: "1px solid rgba(220,94,94,0.3)",
                }} />
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: TEXT_W_DIM2 }}>{px}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIXES SECTION
// Ranked code-level fix cards with root cause + recommended solution.
// Each card maps severity → accent colour; rank 1 gets a "Fix First" badge.
// ─────────────────────────────────────────────────────────────────────────────
function FixesSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  // Fix data — rank drives sort order and badge visibility
  const fixes = [
    {
      rank: 1, title: "Duplicate API Requests", color: "#ef4444", saving: 8,
      rootCause: "Multiple components trigger the same fetch independently on mount with no deduplication.",
      fix: "Add SWR or React Query with a shared cache key. Concurrent callers share one in-flight request.",
    },
    {
      rank: 2, title: "AI API Call Frequency", color: "#f97316", saving: 11,
      rootCause: "AI completion handler fires on onChange with no debounce — each keystroke = one API call.",
      fix: "Debounce by 400ms with useDebouncedCallback. Cache identical prompts with a simple Map for 5 min.",
    },
    {
      rank: 3, title: "Memory Leak Pattern", color: "#ef4444", saving: 5,
      rootCause: "useEffect hooks add event listeners but return no cleanup function.",
      fix: "Return cleanup from each useEffect: return () => window.removeEventListener(...). Use AbortController for fetch.",
    },
  ];

  return (
    <section id="fixes" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>How it fixes it</SectionTag>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 540 }}
        >
          Here&apos;s exactly what to fix.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 52, maxWidth: 480 }}
        >
          Not vague advice. The product direction is clear: ranked fixes, grounded explanations, and a report that
          respects how engineering teams actually work.
        </motion.p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fixes.map(({ rank, title, color, saving, rootCause, fix }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.09 }}
              style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${rank === 1 ? color + "55" : color + "25"}`, boxShadow: rank === 1 ? `0 0 24px ${color}12` : "none" }}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: color + (rank === 1 ? "20" : "12") }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Rank badge circle */}
                  <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: rank === 1 ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.08)", border: rank === 1 ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.12)" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: rank === 1 ? "#ffd700" : "rgba(255,255,255,0.4)" }}>#{rank}</span>
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "white" }}>{title}</span>
                  {/* "Fix First" badge only on the top-ranked card */}
                  {rank === 1 && (
                    <span style={{ borderRadius: 999, padding: "2px 8px", background: "rgba(255,215,0,0.15)", color: "#ffd700", fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700 }}>Fix First</span>
                  )}
                </div>
                {/* Monthly savings estimate */}
                <span style={{ borderRadius: 999, padding: "4px 10px", background: "rgba(34,197,94,0.15)", color: "#4ade80", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700 }}>
                  Save ~${saving}/mo
                </span>
              </div>

              {/* Card body — root cause + fix */}
              <div style={{ padding: "14px 16px 16px", background: "rgba(0,0,0,0.14)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(255,245,240,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, marginBottom: 4 }}>Root Cause</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,245,240,0.55)", lineHeight: 1.55, margin: 0 }}>{rootCause}</p>
                </div>
                {/* Left-border accent on fix block matches card's severity colour */}
                <div style={{ borderRadius: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${color}` }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, marginBottom: 4 }}>Fix</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,245,240,0.7)", lineHeight: 1.55, margin: 0 }}>{fix}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION SECTION
// The happy-path payoff: checklist → result card → CTA button.
// ─────────────────────────────────────────────────────────────────────────────
function SolutionSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section id="solution" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0 80px" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>The result</SectionTag>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 5vw, 64px)", color: TEXT_W, lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0, marginBottom: 20, maxWidth: 560 }}
        >
          Start free.
          <br />
          Fix in minutes.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 44, maxWidth: 460 }}
        >
          Install Metis, open a page, and get a clear read on where cost pressure starts. The website handles the
          story. The extension handles the scan.
        </motion.p>

        {/* Checklist — 4 value propositions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 44 }}
        >
          {[
            "Score any running page in under 2 seconds",
            "See exactly what's costing you, per session",
            "Get ranked code fixes with savings estimates",
            "Free to start, with room for Plus-style team workflows later",
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.05 * i, duration: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckCheck size={11} style={{ color: "#4ade80" }} />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TEXT_W_DIM }}>{item}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Result card — sits above CTA as a proof point */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "inline-flex", alignItems: "center",
            gap: 20, borderRadius: 18,
            padding: "18px 24px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            marginBottom: 40,
          }}
        >
          {/* Circular score ring — strokeDashoffset maps score 0–100 to arc length */}
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
            <circle cx={30} cy={30} r={23} fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth={5} />
            <circle
              cx={30} cy={30} r={23} fill="none" stroke="#22c55e" strokeWidth={5}
              strokeDasharray={2 * Math.PI * 23}
              strokeDashoffset={2 * Math.PI * 23 * (1 - 0.24)} // 0.24 = score / 100
              strokeLinecap="round" transform="rotate(-90 30 30)"
            />
            <text x={30} y={30} textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize={14} fontFamily="Jua, sans-serif">24</text>
          </svg>
          {/* Labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "Jua, sans-serif", fontSize: 28, color: TEXT_W, lineHeight: 1 }}>24</span>
              <span style={{ borderRadius: 999, padding: "4px 12px", background: "rgba(34,197,94,0.2)", color: "#22c55e", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                Minimal Risk
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W_DIM, margin: 0, lineHeight: 1 }}>
              After applying 3 fixes — $26/mo saved
            </p>
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 8px 36px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.assign(CHROME_WAITLIST_URL)}
            style={{ background: TEXT_W, color: RED, border: "none", borderRadius: 999, padding: "16px 32px", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            Get early access
            <ArrowRight size={16} />
          </motion.button>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W_DIM2 }}>
            Google auth and email/password will be wired in the next auth pass
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BIG FOOTER
// Email capture + brand block + links.
// Email state is local only — wire to a backend endpoint when ready.
// ─────────────────────────────────────────────────────────────────────────────
function BigFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Form submit — in production, POST to /api/beta-signup (Next.js route handler)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <footer
      style={{
        background: DARK_BLUE,
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial gradient blobs — purely decorative, pointer-events: none */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(220,94,94,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.05) 0%, transparent 50%)",
        }}
      />

      <div style={{ maxWidth: 1340, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="metis-footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left — email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            {/* Beta badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "4px 12px", background: "rgba(220,94,94,0.15)", border: "1px solid rgba(220,94,94,0.25)", marginBottom: 24 }}>
              <motion.div style={{ width: 5, height: 5, borderRadius: "50%", background: RED }} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: RED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Beta Access</span>
            </div>

            <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(32px, 4vw, 52px)", color: CREAM, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 14 }}>
              Get early access.
              <br />
              Free, always.
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(255,245,240,0.5)", lineHeight: 1.6, margin: 0, marginBottom: 36, maxWidth: 400 }}>
              Join the list and be first to hear when Metis opens up deeper auth flows, team-ready reports, and
              polished release builds.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", gap: 0, maxWidth: 420 }}
                >
                  <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px 0 0 12px", padding: "0 16px", gap: 10 }}>
                    <Mail size={14} style={{ color: "rgba(255,245,240,0.35)", flexShrink: 0 }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      style={{
                        flex: 1, background: "none", border: "none", outline: "none",
                        fontFamily: "Inter, sans-serif", fontSize: 14,
                        color: CREAM, padding: "14px 0",
                      }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: RED, color: CREAM, border: "none",
                      borderRadius: "0 12px 12px 0", padding: "14px 22px",
                      fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700,
                      cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    Join beta
                    <ArrowRight size={14} />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, maxWidth: 420 }}
                >
                  <CheckCheck size={16} style={{ color: "#4ade80" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(255,245,240,0.8)" }}>
                    You&apos;re on the list. We&apos;ll be in touch.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right — brand + links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
            {/* Logo */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: "white", lineHeight: 1 }}>M</span>
                </div>
                <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: CREAM, letterSpacing: "-0.02em" }}>Metis</span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,245,240,0.35)", margin: 0, lineHeight: 1.5 }}>
                Cost intelligence for the modern web.
                <br />
                A browser extension and reporting layer by zward.studio.
              </p>
              {/* Tech stack micro-badges in footer */}
              <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                {["Next.js", "React", "Python", "TypeScript"].map(t => (
                  <span key={t} style={{
                    fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600,
                    color: "rgba(255,245,240,0.35)",
                    padding: "3px 8px", borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "zward.studio", href: WARD_STUDIO_URL, icon: ExternalLink },
                { label: "GitHub",       href: REPO_URL, icon: Github },
                { label: "Get early access", href: CHROME_WAITLIST_URL, icon: ExternalLink },
                { label: "Privacy",      href: PRIVACY_URL, icon: null },
                { label: "Terms",        href: TERMS_URL, icon: null },
              ].map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "rgba(255,245,240,0.45)",
                    textDecoration: "none", padding: "8px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,245,240,0.85)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,245,240,0.45)")}
                >
                  {Icon && <Icon size={13} />}
                  {label}
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(255,245,240,0.2)", margin: 0 }}>
              © 2026 zward.studio · Metis is a live build in progress for the browser product already under active development.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — LandingPage
// ─────────────────────────────────────────────────────────────────────────────
/**
 * LandingPage — root orchestrator.
 *
 * Responsibilities:
 *  1. Maintain `activeSection` via scroll IntersectionObserver → drives nav + mockup state
 *  2. Maintain `mockupVisible` via a separate observer on the Product h2 ref
 *  3. Provide `scrollToSection` to StickyNav
 *  4. Render the full page: Hero (full-width) + two-col layout (sections 2–7) + footer
 *
 * Two-col layout:
 *   Left  → prose sections (flex: 1, min-width: 0)
 *   Right → sticky ExtensionMockup (xl only, width: 380, top: 80)
 */
export function LandingPage() {
  // Which section is closest to the viewport midpoint
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");

  // Whether the sticky mockup sidebar is visible yet (triggered by Product h2)
  const [mockupVisible, setMockupVisible] = useState(false);

  // One ref per section — keyed by SectionKey for easy lookup in the scroll handler
  const heroRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLElement>(null);
  const guideRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const designRef = useRef<HTMLElement>(null);
  const fixesRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      product: productRef,
      guide: guideRef,
      problem: problemRef,
      design: designRef,
      fixes: fixesRef,
      solution: solutionRef,
    }),
    [],
  );

  // Ref for the Product h2 — triggers the sticky mockup appearance
  const productH2Ref = useRef<HTMLHeadingElement>(null);

  // ── IntersectionObserver: show sticky mockup when Product h2 is 10% in view
  useEffect(() => {
    const el = productH2Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMockupVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Scroll handler: update activeSection based on which section midpoint is
  //    closest to 45% of the viewport height
  useEffect(() => {
    const handle = () => {
      const mid = window.scrollY + window.innerHeight * 0.45;
      let closest: SectionKey = "hero";
      let dist = Infinity;
      (Object.entries(sectionRefs) as [SectionKey, React.RefObject<HTMLElement>][]).forEach(
        ([id, ref]) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const absMid = window.scrollY + rect.top + rect.height / 2;
          const d = Math.abs(mid - absMid);
          if (d < dist) { dist = d; closest = id; }
        }
      );
      setActiveSection(closest);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle(); // run once on mount
    return () => window.removeEventListener("scroll", handle);
  }, [sectionRefs]);

  const scrollToSection = useCallback((id: string) => {
    sectionRefs[id as SectionKey]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sectionRefs]);

  // Derive hero state for background + nav colour logic
  const isHero       = activeSection === "hero";
  const currentState = SECTION_STATES[activeSection];

  return (
    <div
      style={{
        // Background transitions between cream (hero) and brand-red (all other sections)
        background: isHero ? CREAM : RED,
        minHeight: "100vh",
        position: "relative",
        transition: "background 0.7s cubic-bezier(0.83,0,0.17,1)",
      }}
    >
      {/* Floating pill nav — always fixed, centred */}
      <StickyNav active={activeSection} onNav={scrollToSection} isHero={isHero} />

      {/* ── HERO — full-width, outside the two-col layout ── */}
      <HeroSection sectionRef={sectionRefs.hero} />

      {/* ── TWO-COL LAYOUT — sections 2 → 7 ── */}
      <div
        className="metis-shell"
        style={{
          maxWidth: 1340, margin: "0 auto",
          padding: "0 24px",
          display: "flex", gap: 60, alignItems: "flex-start",
        }}
      >
        {/* Left column — scrollable content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProductSection      sectionRef={sectionRefs.product} h2Ref={productH2Ref} />
          <AIGuideSection      sectionRef={sectionRefs.guide}   />
          <ProblemSection      sectionRef={sectionRefs.problem} />
          <DesignSystemSection sectionRef={sectionRefs.design}  />
          <FixesSection        sectionRef={sectionRefs.fixes}   />
          <SolutionSection     sectionRef={sectionRefs.solution} />
        </div>

        {/* Right column — sticky extension mockup (xl screens only)
            Fades + slides in once productH2Ref intersects (mockupVisible = true).
            AnimatePresence + key={activeSection} cross-fades between mockup states. */}
        <div
          className="hidden xl:block"
          style={{
            width: 380, flexShrink: 0, position: "sticky", top: 80,
            paddingTop: 80, alignSelf: "flex-start",
            opacity: mockupVisible ? 1 : 0,
            transform: mockupVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
            transition: "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: mockupVisible ? "auto" : "none",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ExtensionMockup state={currentState} />
              {/* Section label below mockup */}
              <motion.div
                key={`lbl-${activeSection}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, paddingLeft: 4 }}
              >
                {/* Breathing colour dot matches current section's risk colour */}
                <motion.div
                  style={{ width: 6, height: 6, borderRadius: "50%", background: currentState.riskColor }}
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TEXT_W_DIM2 }}>
                  Showing{" "}
                  <span style={{ color: TEXT_W_DIM, fontWeight: 600 }}>
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                  </span>{" "}
                  state · score {currentState.score}/100
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── FOOTER — full-width dark blue ── */}
      <BigFooter />
    </div>
  );
}
