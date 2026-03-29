"use client";

/**
 * LandingPage.tsx — Metis Chrome Extension · Marketing Site
 * ──────────────────────────────────────────────────────────
 * Tech stack: Next.js · React · Python (FastAPI backend) · TypeScript
 *
 * Sections (scroll order):
 *   1. Hero            — full-width, centred; brand wordmark + live score chip
 *   2. Product         — 4-up feature grid; sticky mockup sidebar triggers here
 *   3. Problem         — stats + issues list; shows the pain before the fix
 *   4. Fixes           — ranked code-level fix cards with root-cause + solution
 *   5. Solution        — result card + CTA
 *
 * Layout pattern (sections 2–5):
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
  Github,
  Mail,
  ExternalLink,
} from "lucide-react";
import { frontFacingCopy, landingAnalysis, mockupStates, siteLinks } from "@/content/frontFacingCopy";
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
const FEATURE_ICONS = {
  activity: Activity,
  trendingDown: TrendingDown,
  zap: Zap,
  shield: Shield,
} as const;
const FOOTER_LINK_ICONS = {
  externalLink: ExternalLink,
  github: Github,
} as const;
const CHROME_WAITLIST_URL = siteLinks.waitlistUrl;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION KEYS
// Union type — every key maps to a mockup state + a nav label.
// Add new sections here first, then extend SECTION_STATES and NAV_SECTIONS.
// ─────────────────────────────────────────────────────────────────────────────
type SectionKey = "hero" | "product" | "problem" | "fixes" | "solution";

// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP STATES
// Each key maps to a snapshot of the ExtensionMockup's visible state.
// The sticky sidebar animates between these as the user scrolls.
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_STATES: Record<SectionKey, MockupState> = mockupStates;

// ─────────────────────────────────────────────────────────────────────────────
// NAV SECTIONS
// Drives the floating pill nav links (excludes "hero" — logo click goes there).
// ─────────────────────────────────────────────────────────────────────────────
const NAV_SECTIONS: readonly { key: SectionKey; label: string }[] = frontFacingCopy.nav.sections;

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
      className="metis-nav-shell"
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
        className="metis-nav-pill"
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
          className="metis-nav-brand"
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
            {frontFacingCopy.brand.name}
          </span>
        </button>

        {/* Thin vertical divider between logo and nav links */}
        <div className="metis-nav-divider" style={{ width: 1, height: 14, background: isHero ? "rgba(220,94,94,0.2)" : "rgba(255,255,255,0.14)", margin: "0 6px" }} />

        {/* ── Section links — spring pill highlights active item ── */}
        <div className="metis-nav-links" style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {NAV_SECTIONS.map(({ key, label }) => (
          <button
            className="metis-nav-link"
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
        </div>

        {/* Thin vertical divider before CTA */}
        <div className="metis-nav-divider" style={{ width: 1, height: 14, background: isHero ? "rgba(220,94,94,0.2)" : "rgba(255,255,255,0.14)", margin: "0 6px" }} />

        {/* ── CTA — always brand-red ── */}
        <motion.button
          className="metis-nav-cta"
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
          {frontFacingCopy.nav.primaryCta}
          <ArrowRight size={12} />
        </motion.button>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// Full-width, centred. Sits outside the two-col layout.
// Contains: wordmark → quote → CTAs → stats → scroll nudge
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const copy = frontFacingCopy.hero;

  return (
    <section
      id="hero"
      className="metis-hero"
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
        {frontFacingCopy.brand.name}
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
        &ldquo;{copy.quote[0]}
        <br />
        {copy.quote[1]}&rdquo;
      </motion.p>

      {/* Primary + secondary CTAs */}
      <motion.div
        className="metis-hero-actions"
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
          {copy.ctas.primary}
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
          {copy.ctas.secondary}
          <ChevronRight size={15} />
        </motion.button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="metis-hero-stats"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 52, flexWrap: "wrap", justifyContent: "center" }}
      >
        {copy.stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Jua, sans-serif", fontSize: 26, color: RED, lineHeight: 1 }}>{value}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_R_DIM, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll nudge — breathing opacity loop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.5 }}
        style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
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
          {copy.scrollNudge}
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
  const copy = frontFacingCopy.product;

  return (
    <section id="product" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>{copy.tag}</SectionTag>

        {/* h2Ref triggers the sticky sidebar via IntersectionObserver in LandingPage */}
        <motion.h2
          ref={h2Ref}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 560 }}
        >
          {copy.heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.6, margin: 0, marginBottom: 56, maxWidth: 480 }}
        >
          {copy.body}
        </motion.p>

        {/* 2-col grid — stagger animates each card in 80ms apart */}
        <div className="metis-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {copy.features.map(({ icon, title, desc }, i) => {
            const Icon = FEATURE_ICONS[icon];
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM SECTION
// Shows the "before Metis" state: raw stats + a live issues list.
// ─────────────────────────────────────────────────────────────────────────────
function ProblemSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const copy = frontFacingCopy.problem;

  return (
    <section id="problem" ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ padding: "100px 0" }}
    >
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>{copy.tag}</SectionTag>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 580 }}
        >
          {copy.heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 56, maxWidth: 520 }}
        >
          {copy.body}
        </motion.p>

        {/* 2×2 stat grid — scale-in on entry */}
        <div className="metis-grid-2-tight" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 48 }}>
          {copy.stats.map(({ value, unit, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "20px 22px" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "Jua, sans-serif", fontSize: 32, color: TEXT_W, lineHeight: 1 }}>{value}</span>
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
          <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.16)", borderBottom: "1px solid rgba(239,68,68,0.24)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={13} style={{ color: "#fff5f0", flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: "#fff5f0", letterSpacing: "0.01em" }}>
                5 issues detected
              </span>
            </div>
            <span style={{ borderRadius: 999, padding: "4px 10px", background: "rgba(255,245,240,0.12)", border: "1px solid rgba(255,245,240,0.16)", color: "#fff5f0", fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              High Risk
            </span>
          </div>
          {copy.issues.map((issue, i) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }} transition={{ delay: 0.05 * i, duration: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: i < copy.issues.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: issue.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,245,240,0.8)" }}>{issue.title}</span>
              <span style={{ borderRadius: 999, padding: "2px 8px", background: issue.color + "22", color: issue.color, fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 600 }}>
                {issue.severity}
              </span>
            </motion.div>
          ))}
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
  const copy = frontFacingCopy.fixes;

  return (
    <section id="fixes" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>{copy.tag}</SectionTag>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 4.5vw, 56px)", color: TEXT_W, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 16, maxWidth: 540 }}
        >
          {copy.heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 52, maxWidth: 480 }}
        >
          {copy.body}
        </motion.p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {copy.items.map(({ rank, title, color, saving, rootCause, fix }, i) => (
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
                    <span style={{ borderRadius: 999, padding: "2px 8px", background: "rgba(255,215,0,0.15)", color: "#ffd700", fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700 }}>{copy.fixFirstLabel}</span>
                  )}
                </div>
                {/* Monthly savings estimate */}
                <span style={{ borderRadius: 999, padding: "4px 10px", background: "rgba(34,197,94,0.15)", color: "#4ade80", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700 }}>
                  {copy.saveLabel(saving)}
                </span>
              </div>

              {/* Card body — root cause + fix */}
              <div style={{ padding: "14px 16px 16px", background: "rgba(0,0,0,0.14)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(255,245,240,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, marginBottom: 4 }}>{copy.rootCauseLabel}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,245,240,0.55)", lineHeight: 1.55, margin: 0 }}>{rootCause}</p>
                </div>
                {/* Left-border accent on fix block matches card's severity colour */}
                <div style={{ borderRadius: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${color}` }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, marginBottom: 4 }}>{copy.fixLabel}</p>
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
  const copy = frontFacingCopy.solution;

  return (
    <section id="solution" ref={sectionRef as React.RefObject<HTMLElement>} style={{ padding: "100px 0 80px" }}>
      <Divider />
      <div style={{ paddingTop: 80 }}>
        <SectionTag>{copy.tag}</SectionTag>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(36px, 5vw, 64px)", color: TEXT_W, lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0, marginBottom: 20, maxWidth: 560 }}
        >
          {copy.heading[0]}
          <br />
          {copy.heading[1]}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: TEXT_W_DIM, lineHeight: 1.65, margin: 0, marginBottom: 44, maxWidth: 460 }}
        >
          {copy.body}
        </motion.p>

        {/* Checklist — 4 value propositions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 44 }}
        >
          {copy.checklist.map((item, i) => (
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
              strokeDashoffset={2 * Math.PI * 23 * (1 - landingAnalysis.resultScore / 100)}
              strokeLinecap="round" transform="rotate(-90 30 30)"
            />
            <text x={30} y={30} textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize={14} fontFamily="Jua, sans-serif">{landingAnalysis.resultScore}</text>
          </svg>
          {/* Labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "Jua, sans-serif", fontSize: 28, color: TEXT_W, lineHeight: 1 }}>{landingAnalysis.resultScore}</span>
              <span style={{ borderRadius: 999, padding: "4px 12px", background: "rgba(34,197,94,0.2)", color: "#22c55e", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                {copy.resultCaption}
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W_DIM, margin: 0, lineHeight: 1 }}>
              {landingAnalysis.resultSummary}
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
            {copy.primaryCta}
            <ArrowRight size={16} />
          </motion.button>
          {copy.secondaryNote ? (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TEXT_W_DIM2 }}>
              {copy.secondaryNote}
            </span>
          ) : null}
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
  const copy = frontFacingCopy.footer;
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
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: RED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{copy.badge}</span>
            </div>

            <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(32px, 4vw, 52px)", color: CREAM, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0, marginBottom: 14 }}>
              {copy.heading[0]}
              <br />
              {copy.heading[1]}
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(255,245,240,0.5)", lineHeight: 1.6, margin: 0, marginBottom: 36, maxWidth: 400 }}>
              {copy.body}
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  className="metis-footer-form"
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
                      placeholder={copy.emailPlaceholder}
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
                    {copy.submitLabel}
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
                    {copy.successMessage}
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
                <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: CREAM, letterSpacing: "-0.02em" }}>{frontFacingCopy.brand.name}</span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,245,240,0.35)", margin: 0, lineHeight: 1.5 }}>
                {frontFacingCopy.brand.footerTagline}
                <br />
                {frontFacingCopy.brand.footerSubline}
              </p>
              {/* Tech stack micro-badges in footer */}
              <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                {copy.stackBadges.map(t => (
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
              {copy.links.map(({ label, href, icon }) => {
                const Icon = icon ? FOOTER_LINK_ICONS[icon] : null;
                return (
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
                );
              })}
            </div>

            {/* Copyright */}
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(255,245,240,0.2)", margin: 0 }}>
              {frontFacingCopy.brand.footerCopyright}
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
 *  4. Render the full page: Hero (full-width) + two-col layout (sections 2–5) + footer
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
  const problemRef = useRef<HTMLElement>(null);
  const fixesRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      product: productRef,
      problem: problemRef,
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
      className="metis-page"
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

      {/* ── TWO-COL LAYOUT — sections 2 → 5 ── */}
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
          <ProblemSection      sectionRef={sectionRefs.problem} />
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── FOOTER — full-width dark blue ── */}
      <BigFooter />
    </div>
  );
}
