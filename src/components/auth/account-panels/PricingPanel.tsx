"use client";

import { useState, useTransition } from "react";

import { CheckCircle2, Crown } from "lucide-react";

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

type FeatureGroup = {
  title: string;
  items: readonly string[];
};

function FeatureCard({
  title,
  body,
  badge,
  badgeIcon,
  groups,
  action,
}: {
  title: string;
  body: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  groups: readonly FeatureGroup[];
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <p style={{ margin: 0, fontFamily: FONT_SERIF, fontSize: 28, letterSpacing: "-0.03em", color: TXT }}>{title}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {badge ? (
            <Badge>
              {badgeIcon}
              {badge}
            </Badge>
          ) : null}
          {action}
        </div>
      </div>
      <p style={{ margin: "0 0 18px", fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.7, color: TXT_DIM }}>{body}</p>

      <div style={{ display: "grid", gap: 14 }}>
        {groups.map((group) => (
          <div
            key={group.title}
            style={{
              borderRadius: 14,
              border: `1px solid ${BD_SOFT}`,
              background: BG_CARD_2,
              padding: "14px 16px",
            }}
          >
            <p style={{ margin: 0, marginBottom: 10, fontFamily: FONT_SANS, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: TXT_FAINT }}>
              {group.title}
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {group.items.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12, lineHeight: 1.6, color: TXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

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
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <FeatureCard
          title={copy.freeTitle}
          body={copy.freeBody}
          badge={user.plan === "free" && !user.isBeta ? "Current plan" : undefined}
          groups={copy.freePillars}
        />

        <FeatureCard
          title={copy.plusTitle}
          body={copy.plusBody}
          badge={formatTierLabel(user.plan, user.isBeta)}
          badgeIcon={<Crown size={10} />}
          groups={copy.plusPillars}
          action={
            <button
              type="button"
              disabled={plusEnabled || isPending}
              onClick={handleUpgrade}
              style={{
                minWidth: 140,
                borderRadius: 10,
                border: plusEnabled ? `1px solid ${BD_SOFT}` : `1px solid ${ACCENT_BD}`,
                background: plusEnabled ? BG_CARD_2 : "rgba(220,94,94,0.14)",
                padding: "10px 14px",
                color: TXT,
                fontFamily: FONT_SANS,
                fontSize: 12,
                fontWeight: 700,
                cursor: plusEnabled || isPending ? "default" : "pointer",
                opacity: isPending ? 0.72 : 1,
              }}
            >
              {plusEnabled ? "Current tier" : isPending ? "Trying…" : "Try Metis+ Beta"}
            </button>
          }
        />
      </div>

      <p style={{ margin: "2px 0 0", fontFamily: FONT_SANS, fontSize: 12, lineHeight: 1.7, color: plusEnabled ? TXT_FAINT : TXT_DIM }}>
        {plusEnabled
          ? "This account already has Metis+ Beta. The website stays the source of truth, and the extension picks up the upgraded tier on the next sync."
          : "Plus Beta is gated and validated through the website. There is no billing surface here yet."}
      </p>

      {feedback ? (
        <p style={{ margin: "2px 0 0", fontFamily: FONT_SANS, fontSize: 12, color: plusEnabled ? TXT_DIM : ACCENT }}>
          {feedback}
        </p>
      ) : null}
    </PanelFrame>
  );
}
