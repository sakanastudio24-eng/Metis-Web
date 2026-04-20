"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { frontFacingCopy, mockupStates } from "@/content/frontFacingCopy";

type SectionKey = "product" | "problem" | "fixes" | "solution";

const SECTION_KEYS: SectionKey[] = ["product", "problem", "fixes", "solution"];

const CONTROL_SCORE: Record<SectionKey, number> = {
  product: 42,
  problem: 31,
  fixes: 58,
  solution: 82,
};

const STACK_CHIPS = ["Next.js", "React", "OpenAI", "Stripe", "Vercel"];

function useActiveLandingSection() {
  const [activeSection, setActiveSection] = useState<SectionKey>("product");

  useEffect(() => {
    const sectionNodes = SECTION_KEYS.map((key) => document.getElementById(key)).filter(Boolean) as HTMLElement[];

    if (sectionNodes.length === 0) {
      return;
    }

    function updateActiveSection() {
      const offset = window.scrollY + window.innerHeight * 0.36;
      let current: SectionKey = "product";

      for (const node of sectionNodes) {
        if (node.offsetTop <= offset) {
          current = node.id as SectionKey;
        }
      }

      setActiveSection((previous) => (previous === current ? previous : current));
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return activeSection;
}

export function LandingStickyMockup() {
  const activeSection = useActiveLandingSection();
  const activeState = mockupStates[activeSection];
  const visibleIssues = activeState.issues.slice(0, 3);
  const controlScore = CONTROL_SCORE[activeSection];
  const combinedScore = Math.round((activeState.score + controlScore) / 2);
  const controlLabel = controlScore >= 70 ? "Controlled" : controlScore >= 45 ? "Mixed" : "Uncontrolled";

  return (
    <aside className="metis-landing-sticky" aria-label="Metis side panel preview">
      <div className="metis-sidepanel-preview">
        <div className="metis-sidepanel-preview__header">
          <div>
            <div className="metis-sidepanel-preview__brand">Metis</div>
            <div className="metis-sidepanel-preview__host">checkout.example.com</div>
          </div>
          <div className="metis-sidepanel-preview__profile" aria-hidden="true">
            M
          </div>
        </div>

        <div className="metis-sidepanel-preview__scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="metis-sidepanel-preview__body"
            >
              <div className="metis-sidepanel-preview__combined">
                <div className="metis-sidepanel-preview__ring" style={{ "--score": `${combinedScore}%` } as CSSProperties}>
                  <span>{combinedScore}</span>
                </div>
                <div>
                  <div className="metis-sidepanel-preview__label">Combined Score</div>
                  <div className="metis-sidepanel-preview__value">{combinedScore}/100</div>
                  <div className="metis-sidepanel-preview__pills">
                    <span>Score {activeState.score}/100</span>
                    <span>Control {controlScore}/100</span>
                  </div>
                </div>
              </div>

              <div className="metis-sidepanel-preview__split">
                <div className="metis-sidepanel-preview__summary-card">
                  <div className="metis-sidepanel-preview__summary-label">Cost risk</div>
                  <div className="metis-sidepanel-preview__summary-score">{activeState.score}<small>/100</small></div>
                  <p>{activeState.riskLabel}</p>
                </div>
                <div className="metis-sidepanel-preview__summary-card">
                  <div className="metis-sidepanel-preview__summary-label">Control</div>
                  <div className="metis-sidepanel-preview__summary-score">{controlScore}<small>/100</small></div>
                  <p>{controlLabel}</p>
                </div>
              </div>

              <div className="metis-sidepanel-preview__insight">{activeState.quickInsight}</div>

              <div className="metis-sidepanel-preview__cost-block">
                <div className="metis-sidepanel-preview__cost-head">
                  <span>checkout.example.com</span>
                  <span>4 pages sampled</span>
                  <span>Saved locally</span>
                </div>
                <div className="metis-sidepanel-preview__cost-row">
                  <div>
                    <span>Current session cost</span>
                    <small>Counting as page loads - estimated</small>
                  </div>
                  <strong>{activeState.sessionCost}</strong>
                </div>
                <div className="metis-sidepanel-preview__scale-row">
                  <span>At 10k users -&gt;</span>
                  <strong>${activeState.costMin * 10}/mo</strong>
                </div>
              </div>

              <div className="metis-sidepanel-preview__issues">
                <div className="metis-sidepanel-preview__section-title">Top Issues</div>
                {visibleIssues.length > 0 ? (
                  visibleIssues.map((issue) => (
                    <div className="metis-sidepanel-preview__issue" key={issue.title}>
                      <span style={{ background: issue.color }} aria-hidden="true" />
                      <strong>{issue.title}</strong>
                      <em>{issue.severity}</em>
                    </div>
                  ))
                ) : (
                  <div className="metis-sidepanel-preview__empty">No major issues surfaced in the current scan.</div>
                )}
              </div>

              <div className="metis-sidepanel-preview__stack">
                <div className="metis-sidepanel-preview__section-title">Detected Stack</div>
                <div>
                  {STACK_CHIPS.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="metis-sidepanel-preview__footer">
          <div>
            <strong>Basic scan complete</strong>
            <span>Deeper insights are available with expanded access on this site.</span>
          </div>
          <Link href="/sign-up">
            {frontFacingCopy.mockup.reportCta}
          </Link>
        </div>
      </div>
    </aside>
  );
}
