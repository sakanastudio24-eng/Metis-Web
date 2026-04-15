"use client";

import { useEffect, useMemo, useState } from "react";

import { frontFacingCopy } from "@/content/frontFacingCopy";
import { isDeletedUser } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LandingHeroSupport() {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch (error) {
      console.error("[Metis] landing hero support auth client unavailable", error);
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

  return (
    <p
      style={{
        fontFamily: "var(--font-sans), sans-serif",
        fontSize: "clamp(15px, 1.8vw, 18px)",
        color: "rgba(180,50,50,0.72)",
        lineHeight: 1.6,
        margin: 0,
        marginBottom: 24,
        maxWidth: 560,
      }}
    >
      {isSignedIn ? frontFacingCopy.hero.returningSupportingLine : frontFacingCopy.hero.supportingLine}
    </p>
  );
}
