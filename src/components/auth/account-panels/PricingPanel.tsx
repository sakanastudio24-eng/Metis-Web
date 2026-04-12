"use client";

import { useState, useTransition } from "react";

import { CheckCircle2, Crown, Sparkles } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import type { AccountDashboardSnapshot } from "@/lib/account-data";
import {
  ACCENT,
  ACCENT_BD,
  Badge,
  BD_SOFT,
  BG_CARD_2,
  Card,
  FONT_SANS,
  FONT_SERIF,
  GREEN,
  PanelFrame,
  TXT,
  TXT_DIM,
  TXT_FAINT,
  formatTierLabel,
  type DashboardUser,
} from "@/components/auth/account-panels/shared";

type PricingPanelProps = {
  user: DashboardUser;
  onAccountUpdated: (account: AccountDashboardSnapshot) => void;
};

const ACCESS_COMPARISON = [
  {
    label: "Without account",
    items: ["basic scan works", "limited scans", "no saved data", "no cross-device"],
  },
  {
    label: "With account",
    items: ["more scans", "saved usage", "extension sync", "future features"],
  },
] as const;

export function PricingPanel({ user, onAccountUpdated }: PricingPanelProps) {
  const copy = authCopy.dashboard.pricing;
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const plusEnabled = user.plan === "plus_beta" || user.plan === "paid" || user.isBeta;

  function handleUpgrade() {
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch("/api/account/plus-beta", {
        method: "POST",
      });

      const payload = (await response.json().catch(() => ({}))) as {
        account?: AccountDashboardSnapshot;
        detail?: string;
      };

      if (!response.ok || !payload.account) {
        setFeedback(payload.detail ?? "Could not enable Metis+ Beta right now.");
        return;
      }

      onAccountUpdated(payload.account);
      setFeedback("Metis+ Beta is now active on this account.");
    });
  }

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {ACCESS_COMPARISON.map((group, index) => (
          <Card key={group.label}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
              <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: index === 0 ? TXT_FAINT : ACCENT }}>
                {group.label}
              </p>
              {index === 1 ? (
                <Badge>
                  <Sparkles size={10} />
                  Website sync
                </Badge>
              ) : null}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {group.items.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={13} style={{ color: index === 0 ? TXT_FAINT : GREEN, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: index === 0 ? TXT_DIM : TXT }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: ACCENT }}>
                Metis+ Beta
              </p>
              <Badge>
                <Crown size={10} />
                {formatTierLabel(user.plan, user.isBeta)}
              </Badge>
            </div>

            <p style={{ margin: 0, fontFamily: FONT_SERIF, fontSize: 30, letterSpacing: "-0.03em", color: TXT }}>
              {plusEnabled ? "Advanced access is active" : "Upgrade to Metis+"}
            </p>
            <p style={{ margin: "10px 0 0", fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.7, color: TXT_DIM }}>
              {plusEnabled
                ? "This account is already in Metis+ Beta. The website remains the source of truth, and the extension picks up the upgraded tier on the next sync."
                : "Keep this simple in V1: request beta access on the website, unlock plus_beta for this account, and let the extension mirror the new tier on reconnect."}
            </p>
            <p style={{ margin: "12px 0 0", fontFamily: FONT_SANS, fontSize: 12, lineHeight: 1.7, color: TXT_FAINT }}>
              {plusEnabled
                ? "If beta access is removed later, advanced insights disappear and core functionality stays available."
                : "There is no billing surface here yet. No invoices, no checkout flow, no extra plan picker."}
            </p>
          </div>

          <button
            type="button"
            disabled={plusEnabled || isPending}
            onClick={handleUpgrade}
            style={{
              minWidth: 180,
              borderRadius: 12,
              border: plusEnabled ? `1px solid ${BD_SOFT}` : `1px solid ${ACCENT_BD}`,
              background: plusEnabled ? BG_CARD_2 : "rgba(220,94,94,0.14)",
              padding: "12px 16px",
              color: TXT,
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 700,
              cursor: plusEnabled || isPending ? "default" : "pointer",
              opacity: isPending ? 0.72 : 1,
            }}
          >
            {plusEnabled ? "Current tier" : isPending ? "Upgrading…" : "Upgrade"}
          </button>
        </div>

        {feedback ? (
          <p style={{ margin: "14px 0 0", fontFamily: FONT_SANS, fontSize: 12, color: plusEnabled ? TXT_DIM : ACCENT }}>
            {feedback}
          </p>
        ) : null}
      </Card>
    </PanelFrame>
  );
}
