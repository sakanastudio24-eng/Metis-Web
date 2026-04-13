"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ExtensionMockup } from "@/components/landing/ExtensionMockup";
import { frontFacingCopy, mockupStates } from "@/content/frontFacingCopy";
import { isDeletedUser } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LandingChromeClientProps = {
  mockupOnly?: boolean;
};

type SectionKey = keyof typeof mockupStates;

const SECTION_KEYS: SectionKey[] = ["hero", "product", "problem", "fixes", "solution"];

export function LandingChromeClient({ mockupOnly = false }: LandingChromeClientProps) {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch (error) {
      console.error("[Metis] landing chrome auth client unavailable", error);
      return null;
    }
  }, []);
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isHero = activeSection === "hero";

  const chromeStyles = isHero
    ? {
        background: "rgba(255,245,240,0.82)",
        border: "rgba(220,94,94,0.16)",
        shadow: "0 18px 50px rgba(12,22,35,0.08)",
        text: "rgba(12,22,35,0.66)",
        activeBg: "rgba(220,94,94,0.1)",
        activeText: "#dc5e5e",
        hoverBg: "rgba(220,94,94,0.06)",
        brand: "#dc5e5e",
      }
    : {
        background: "rgba(12,22,35,0.78)",
        border: "rgba(255,245,240,0.14)",
        shadow: "0 22px 56px rgba(0,0,0,0.24)",
        text: "rgba(255,245,240,0.72)",
        activeBg: "rgba(255,245,240,0.14)",
        activeText: "#FFF5F0",
        hoverBg: "rgba(255,245,240,0.08)",
        brand: "#FFF5F0",
      };

  useEffect(() => {
    let active = true;

    async function syncSession() {
      if (!supabase) {
        setIsSignedIn(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) {
        return;
      }

      setIsSignedIn(Boolean(session?.user) && !isDeletedUser(session?.user ?? null));
    }

    syncSession().catch(() => {});

    if (!supabase) {
      return () => {
        active = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      setIsSignedIn(Boolean(session?.user) && !isDeletedUser(session?.user ?? null));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const sectionNodes = SECTION_KEYS.map((key) => document.getElementById(key)).filter(Boolean) as HTMLElement[];
    if (sectionNodes.length === 0) {
      return;
    }

    function updateActiveSection() {
      const offset = window.scrollY + window.innerHeight * 0.3;

      let current: SectionKey = "hero";
      for (const node of sectionNodes) {
        if (node.offsetTop <= offset) {
          current = node.id as SectionKey;
        }
      }

      setActiveSection(current);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  if (mockupOnly) {
    // The sticky mockup stays client-side so the server landing shell does not
    // have to hydrate the whole page just to react to scroll state.
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
        >
          <ExtensionMockup
            state={mockupStates[activeSection]}
            reportLabel={isSignedIn ? frontFacingCopy.mockup.returningReportCta : frontFacingCopy.mockup.reportCta}
            onOpenReport={() => {
              window.location.href = isSignedIn ? "/account" : "/sign-up";
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div
      className="metis-nav-shell"
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <motion.div
        className="metis-nav-pill"
        animate={{
          backgroundColor: chromeStyles.background,
          borderColor: chromeStyles.border,
          boxShadow: chromeStyles.shadow,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "8px 14px",
          borderRadius: 999,
          border: "1px solid transparent",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          pointerEvents: "auto",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              background: "#dc5e5e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 16, color: "white", lineHeight: 1 }}>M</span>
          </div>
          <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 18, color: chromeStyles.brand, letterSpacing: "-0.02em", transition: "color 220ms ease" }}>
            {frontFacingCopy.brand.name}
          </span>
        </div>

        <nav
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: 4,
            padding: 3,
            borderRadius: 999,
            background: isHero ? "rgba(220,94,94,0.04)" : "rgba(255,245,240,0.06)",
            border: `1px solid ${isHero ? "rgba(220,94,94,0.1)" : "rgba(255,245,240,0.08)"}`,
          }}
        >
          {frontFacingCopy.nav.sections.map((section) => {
            const active = activeSection === section.key;
            return (
              <motion.div
                key={section.key}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
              >
                <Link
                  href={`#${section.key}`}
                  style={{
                    borderRadius: 999,
                    padding: "8px 12px",
                    textDecoration: "none",
                    fontFamily: "var(--font-sans), sans-serif",
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? chromeStyles.activeText : chromeStyles.text,
                    background: active ? chromeStyles.activeBg : "transparent",
                    transition: "background-color 180ms ease, color 180ms ease",
                    display: "block",
                  }}
                  onMouseEnter={(event) => {
                    if (!active) {
                      event.currentTarget.style.background = chromeStyles.hoverBg;
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!active) {
                      event.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {section.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.16 }}>
            <Link
              href={isSignedIn ? "/account" : "/sign-in"}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 13,
                color: chromeStyles.text,
                textDecoration: "none",
                whiteSpace: "nowrap",
                padding: "8px 10px",
                borderRadius: 999,
                transition: "background-color 180ms ease, color 180ms ease",
                display: "block",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = chromeStyles.hoverBg;
                event.currentTarget.style.color = chromeStyles.activeText;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
                event.currentTarget.style.color = chromeStyles.text;
              }}
            >
              {isSignedIn ? "Account" : "Sign in"}
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.16 }}>
            <Link
              href={isSignedIn ? "/account" : "/sign-up"}
              style={{
                borderRadius: 999,
                background: "#dc5e5e",
                color: "white",
                textDecoration: "none",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 13,
                fontWeight: 700,
                padding: "8px 14px",
                whiteSpace: "nowrap",
                display: "block",
                boxShadow: "0 14px 28px rgba(220,94,94,0.28)",
              }}
            >
              {isSignedIn ? frontFacingCopy.nav.returningCta : frontFacingCopy.nav.primaryCta}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
