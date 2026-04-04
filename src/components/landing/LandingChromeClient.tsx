"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { frontFacingCopy, mockupStates } from "@/content/frontFacingCopy";
import { isDeletedUser } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const ExtensionMockup = dynamic(
  () => import("@/components/landing/ExtensionMockup").then((mod) => mod.ExtensionMockup),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: 380,
          height: 520,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(12,22,35,0.92)",
        }}
      />
    ),
  },
);

type LandingChromeClientProps = {
  mockupOnly?: boolean;
};

type SectionKey = keyof typeof mockupStates;

const SECTION_KEYS: SectionKey[] = ["hero", "product", "problem", "fixes", "solution"];

export function LandingChromeClient({ mockupOnly = false }: LandingChromeClientProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    let active = true;

    async function syncSession() {
      const { data } = await supabase.auth.getUser();
      if (!active) {
        return;
      }

      setIsSignedIn(Boolean(data.user) && !isDeletedUser(data.user));
    }

    syncSession().catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      await syncSession();
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
      <ExtensionMockup
        state={mockupStates[activeSection]}
        reportLabel={isSignedIn ? frontFacingCopy.mockup.returningReportCta : frontFacingCopy.mockup.reportCta}
        onOpenReport={() => {
          window.location.href = isSignedIn ? "/account" : "/sign-up";
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid rgba(220,94,94,0.14)",
          background: "rgba(255,245,240,0.76)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          pointerEvents: "auto",
          boxShadow: "0 18px 50px rgba(12,22,35,0.08)",
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
          <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 18, color: "#dc5e5e", letterSpacing: "-0.02em" }}>
            {frontFacingCopy.brand.name}
          </span>
        </div>

        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 6 }}>
          {frontFacingCopy.nav.sections.map((section) => {
            const active = activeSection === section.key;
            return (
              <Link
                key={section.key}
                href={`#${section.key}`}
                style={{
                  borderRadius: 999,
                  padding: "9px 14px",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans), sans-serif",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#dc5e5e" : "rgba(12,22,35,0.66)",
                  background: active ? "rgba(220,94,94,0.08)" : "transparent",
                }}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href={isSignedIn ? "/account" : "/sign-in"}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: 13,
              color: "rgba(12,22,35,0.66)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {isSignedIn ? "Account" : "Sign in"}
          </Link>
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
              padding: "10px 16px",
              whiteSpace: "nowrap",
            }}
          >
            {isSignedIn ? frontFacingCopy.nav.returningCta : frontFacingCopy.nav.primaryCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
