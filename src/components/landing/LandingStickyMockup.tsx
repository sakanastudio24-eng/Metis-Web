"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { frontFacingCopy, mockupStates } from "@/content/frontFacingCopy";

type SectionKey = "product" | "problem" | "fixes" | "solution";

const SECTION_KEYS: SectionKey[] = ["product", "problem", "fixes", "solution"];

const PANEL_COPY: Record<SectionKey, { eyebrow: string; title: string; note: string }> = {
  product: {
    eyebrow: "Scan & detect",
    title: "Live page scan",
    note: "Metis reads the page structure and flags what matters first.",
  },
  problem: {
    eyebrow: "Understand cost",
    title: "Cost risk rising",
    note: "Waste shows up as estimated monthly impact before it becomes cleanup work.",
  },
  fixes: {
    eyebrow: "Act & improve",
    title: "Fix order",
    note: "Issues are ranked by likely cost impact, not by noise.",
  },
  solution: {
    eyebrow: "Report ready",
    title: "Cleaner result",
    note: "Open the report when you want the detail behind the summary.",
  },
};

function severityLabel(severity: "critical" | "moderate" | "low") {
  if (severity === "critical") {
    return "High";
  }

  if (severity === "moderate") {
    return "Medium";
  }

  return "Low";
}

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
  const panelCopy = PANEL_COPY[activeSection];
  const visibleIssues = activeState.issues.slice(0, 3);

  return (
    <aside className="metis-landing-sticky" aria-label="Metis scan preview">
      <div className="metis-landing-sticky__card">
        <div className="metis-landing-sticky__topline">
          <span>Metis report preview</span>
          <span>{activeState.riskLabel}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="metis-landing-sticky__content"
          >
            <div>
              <p className="metis-landing-sticky__eyebrow">{panelCopy.eyebrow}</p>
              <h3>{panelCopy.title}</h3>
              <p>{panelCopy.note}</p>
            </div>

            <div className="metis-landing-sticky__score-row">
              <div className="metis-landing-sticky__score">
                <span>{activeState.score}</span>
                <small>control score</small>
              </div>
              <div className="metis-landing-sticky__cost">
                <small>estimated monthly impact</small>
                <strong>${activeState.costMin}-${activeState.costMax}</strong>
              </div>
            </div>

            <div className="metis-landing-sticky__meter" aria-hidden="true">
              <motion.div
                key={activeState.score}
                initial={{ width: "8%" }}
                animate={{ width: `${activeState.score}%` }}
                transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="metis-landing-sticky__issues">
              <div className="metis-landing-sticky__section-label">Priority signals</div>
              {visibleIssues.length > 0 ? (
                visibleIssues.map((issue) => (
                  <div className="metis-landing-sticky__issue" key={issue.title}>
                    <span style={{ background: issue.color }} aria-hidden="true" />
                    <div>
                      <strong>{issue.title}</strong>
                      <small>{severityLabel(issue.severity)} risk - save about ${issue.saving}/mo</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="metis-landing-sticky__issue">
                  <span style={{ background: "#22c55e" }} aria-hidden="true" />
                  <div>
                    <strong>{frontFacingCopy.mockup.insightEmpty}</strong>
                    <small>Low cost risk detected in this scan.</small>
                  </div>
                </div>
              )}
            </div>

            <Link className="metis-landing-sticky__link" href="/sign-up">
              {frontFacingCopy.mockup.reportCta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
