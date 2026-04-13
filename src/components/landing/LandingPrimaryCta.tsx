"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { frontFacingCopy } from "@/content/frontFacingCopy";
import { isDeletedUser } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LandingPrimaryCtaProps = {
  variant: "hero" | "solution" | "nav" | "mockup";
};

const CTA_LABELS = {
  hero: {
    signedOut: frontFacingCopy.hero.ctas.primary,
    signedIn: frontFacingCopy.hero.ctas.returningPrimary,
  },
  solution: {
    signedOut: frontFacingCopy.solution.primaryCta,
    signedIn: frontFacingCopy.solution.returningPrimaryCta,
  },
  nav: {
    signedOut: frontFacingCopy.nav.primaryCta,
    signedIn: frontFacingCopy.nav.returningCta,
  },
  mockup: {
    signedOut: frontFacingCopy.mockup.reportCta,
    signedIn: frontFacingCopy.mockup.returningReportCta,
  },
} as const;

export function LandingPrimaryCta({ variant }: LandingPrimaryCtaProps) {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch (error) {
      console.error("[Metis] landing primary cta auth client unavailable", error);
      return null;
    }
  }, []);
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  const labels = CTA_LABELS[variant];
  const href = isSignedIn ? "/account" : "/sign-up";
  const label = isSignedIn ? labels.signedIn : labels.signedOut;

  return (
    <Link
      href={href}
      style={{
        background: "#dc5e5e",
        color: "white",
        borderRadius: 999,
        padding: variant === "nav" ? "10px 18px" : "14px 28px",
        fontFamily: "var(--font-sans), sans-serif",
        fontSize: variant === "nav" ? 13 : 15,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        boxShadow: "0 20px 40px rgba(220,94,94,0.28)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  );
}
