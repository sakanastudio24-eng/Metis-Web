"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { frontFacingCopy } from "@/content/frontFacingCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const BENEFITS = {
  guest: [
    "basic scan works",
    "limited scans",
    "no saved data",
    "no cross-device sync",
  ],
  account: [
    "more scans",
    "saved usage",
    "extension sync",
    "future features",
  ],
} as const;

export function LandingFooterSignup() {
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch (error) {
      console.error("[Metis] landing footer auth client unavailable", error);
      return null;
    }
  }, []);
  const copy = frontFacingCopy.footer;
  const [email, setEmail] = useState("");
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!supabase) {
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!cancelled) {
        setConnectedEmail(session?.user?.email ?? null);
      }
    })();

    if (!supabase) {
      return () => {
        cancelled = true;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setConnectedEmail(session?.user?.email ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  function launchBetaAuthFlow() {
    const params = new URLSearchParams();
    params.set("intent", "plus_beta");

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail.length > 0) {
      params.set("email", normalizedEmail);
    }

    router.push(`/sign-up?${params.toString()}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!connectedEmail) {
      launchBetaAuthFlow();
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/account/plus-beta", {
        method: "POST",
      });

      const payload = (await response.json().catch(() => ({}))) as { detail?: string };

      if (!response.ok) {
        setFeedback(payload.detail ?? "Could not enable Metis+ Beta right now.");
        return;
      }

      setFeedback(copy.successMessage);
      router.push("/account?section=pricing");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 460 }}
    >
      <div
        className="metis-footer-signup"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: 14,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        {connectedEmail ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              borderRadius: 14,
              border: "1px solid rgba(220,94,94,0.16)",
              background: "rgba(220,94,94,0.08)",
              padding: "12px 14px",
            }}
          >
            <div>
              <p style={{ margin: 0, fontFamily: "var(--font-sans), sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffb8b8" }}>
                Connected account
              </p>
              <p style={{ margin: "6px 0 0", fontFamily: "var(--font-sans), sans-serif", fontSize: 13, color: "#FFF5F0" }}>
                {connectedEmail}
              </p>
            </div>
            <button
              type="submit"
              disabled={isPending}
              style={{
                border: "none",
                borderRadius: 999,
                background: "#dc5e5e",
                color: "white",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 18px",
                cursor: isPending ? "default" : "pointer",
                whiteSpace: "nowrap",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? "Enabling…" : copy.submitLabel}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{
                flex: 1,
                minWidth: 220,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "#FFF5F0",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 15,
                padding: "14px 16px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                borderRadius: 999,
                background: "#dc5e5e",
                color: "white",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 18px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {copy.submitLabel}
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              padding: "12px 14px",
            }}
          >
            <p style={{ margin: 0, marginBottom: 8, fontFamily: "var(--font-sans), sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,245,240,0.52)" }}>
              Without account
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {BENEFITS.guest.map((item) => (
                <p key={item} style={{ margin: 0, fontFamily: "var(--font-sans), sans-serif", fontSize: 13, color: "rgba(255,245,240,0.72)" }}>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(220,94,94,0.16)",
              background: "rgba(220,94,94,0.06)",
              padding: "12px 14px",
            }}
          >
            <p style={{ margin: 0, marginBottom: 8, fontFamily: "var(--font-sans), sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffb8b8" }}>
              With account
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {BENEFITS.account.map((item) => (
                <p key={item} style={{ margin: 0, fontFamily: "var(--font-sans), sans-serif", fontSize: 13, color: "#FFF5F0" }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 13,
            color: "rgba(255,245,240,0.72)",
          }}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
