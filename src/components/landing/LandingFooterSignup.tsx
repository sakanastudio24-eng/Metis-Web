"use client";

import { FormEvent, useState } from "react";

import { frontFacingCopy } from "@/content/frontFacingCopy";

export function LandingFooterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const copy = frontFacingCopy.footer;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
      <div
        className="metis-footer-signup"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 10,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
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
            minWidth: 0,
            border: "none",
            background: "transparent",
            color: "#FFF5F0",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 15,
            padding: "10px 12px",
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

      {submitted ? (
        <p style={{ margin: 0, fontFamily: "var(--font-sans), sans-serif", fontSize: 13, color: "rgba(255,245,240,0.72)" }}>
          {copy.successMessage}
        </p>
      ) : null}
    </form>
  );
}
