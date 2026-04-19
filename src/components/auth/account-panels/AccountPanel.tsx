"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { Crown, Globe, Link2, LogOut, Mail, TrendingUp } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import type { AccountDashboardSnapshot } from "@/lib/account-data";
import {
  Avatar,
  Badge,
  BG_CARD_2,
  BD_SOFT,
  Card,
  DANGER,
  DANGER_BD,
  DANGER_DIM,
  FONT_SANS,
  FONT_SERIF,
  GREEN,
  PanelFrame,
  SectionLabel,
  TXT,
  TXT_DIM,
  TXT_FAINT,
  formatTierLabel,
  formatUsageWindow,
  type DashboardUser,
} from "@/components/auth/account-panels/shared";

type AccountPanelProps = {
  user: DashboardUser;
  account: AccountDashboardSnapshot;
  emailConfirmed: boolean;
  onSignOut: () => void;
  onConnectExtension: () => void;
  onAccountUpdated: (account: AccountDashboardSnapshot) => void;
  showConnectAction?: boolean;
};

export function AccountPanel({
  user,
  account,
  emailConfirmed,
  onSignOut,
  onConnectExtension,
  onAccountUpdated,
  showConnectAction = true,
}: AccountPanelProps) {
  const copy = authCopy.dashboard.account;
  const [draftUsername, setDraftUsername] = useState(account.username);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setDraftUsername(account.username);
  }, [account.username]);

  const normalizedDraft = useMemo(() => draftUsername.trim().toLowerCase(), [draftUsername]);

  function handleSaveUsername() {
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: normalizedDraft,
        }),
      });

      const payload = (await response.json()) as { detail?: string; account?: AccountDashboardSnapshot };

      if (!response.ok || !payload.account) {
        setFeedback(payload.detail ?? "Could not update the username.");
        return;
      }

      onAccountUpdated(payload.account);
      setFeedback("Username updated.");
    });
  }

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar user={user} size={66} fontSize={22} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT_SERIF, fontSize: 24, color: TXT, letterSpacing: "-0.02em" }}>{user.name}</span>
                <Badge
                  color={emailConfirmed ? GREEN : DANGER}
                  background={emailConfirmed ? "rgba(34,197,94,0.08)" : DANGER_DIM}
                  border={emailConfirmed ? "rgba(34,197,94,0.22)" : DANGER_BD}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: emailConfirmed ? GREEN : DANGER }} />
                  {emailConfirmed ? "Verified" : "Verification pending"}
                </Badge>
                <Badge>
                  <Crown size={10} />
                  {formatTierLabel(user.plan, user.isBeta)}
                </Badge>
              </div>
              <p style={{ margin: "4px 0 0", fontFamily: FONT_SANS, fontSize: 13, color: TXT_DIM }}>{user.email ?? "No email returned"}</p>
              <p style={{ margin: "10px 0 0", fontFamily: FONT_SANS, fontSize: 12, color: TXT_FAINT }}>{copy.profileStatusLabel}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {showConnectAction ? (
              <button
                type="button"
                onClick={onConnectExtension}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  borderRadius: 10,
                  border: "1px solid rgba(220,94,94,0.34)",
                  background: "rgba(220,94,94,0.12)",
                  padding: "9px 14px",
                  color: TXT,
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <Link2 size={14} />
                {copy.connectAppLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onSignOut}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                padding: "9px 14px",
                color: TXT_DIM,
                fontFamily: FONT_SANS,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Card>
          <SectionLabel>Profile</SectionLabel>
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${BD_SOFT}`,
              background: BG_CARD_2,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <label style={{ display: "block", margin: 0, fontFamily: FONT_SANS, fontSize: 11, color: TXT_FAINT, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Username
            </label>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
              <input
                value={draftUsername}
                onChange={(event) => setDraftUsername(event.target.value)}
                style={{
                  flex: 1,
                  minWidth: 180,
                  borderRadius: 10,
                  border: `1px solid ${BD_SOFT}`,
                  background: "rgba(255,255,255,0.04)",
                  color: TXT,
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  padding: "10px 12px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleSaveUsername}
                disabled={isPending || normalizedDraft.length === 0 || normalizedDraft === account.username}
                style={{
                  borderRadius: 10,
                  border: "1px solid rgba(220,94,94,0.34)",
                  background: "rgba(220,94,94,0.12)",
                  padding: "10px 14px",
                  color: TXT,
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  cursor: isPending ? "default" : "pointer",
                  opacity: isPending || normalizedDraft.length === 0 || normalizedDraft === account.username ? 0.6 : 1,
                }}
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
            <p style={{ margin: "8px 0 0", fontFamily: FONT_SANS, fontSize: 12, color: feedback === "Username updated." ? GREEN : TXT_FAINT }}>
              {feedback ?? "Lowercase letters, numbers, dots, dashes, and underscores only."}
            </p>
          </div>

          <SectionLabel>{copy.connectedAccountsTitle}</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: Mail, label: "Email", value: user.email, state: copy.primaryLabel, linked: true },
              { icon: Globe, label: "GitHub", value: user.provider === "github" ? "Connected" : copy.notConnectedLabel, state: user.provider === "github" ? copy.connectedLabel : copy.notConnectedLabel, linked: user.provider === "github" },
              { icon: Globe, label: "Google", value: user.provider === "google" ? "Connected" : copy.notConnectedLabel, state: user.provider === "google" ? copy.connectedLabel : copy.notConnectedLabel, linked: user.provider === "google" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 12,
                  border: `1px solid ${BD_SOFT}`,
                  background: BG_CARD_2,
                  padding: "12px 14px",
                }}
              >
                <item.icon size={15} style={{ color: item.linked ? "#dc5e5e" : TXT_FAINT, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, marginBottom: 2, fontFamily: FONT_SANS, fontSize: 11, color: TXT_FAINT }}>{item.label}</p>
                  <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 12, color: TXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.value}</p>
                </div>
                <Badge
                  color={item.linked ? "#dc5e5e" : TXT_DIM}
                  background={item.linked ? "rgba(220,94,94,0.16)" : "rgba(255,255,255,0.04)"}
                  border={item.linked ? "rgba(220,94,94,0.34)" : BD_SOFT}
                >
                  {item.state}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionLabel>{copy.usageTitle}</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontFamily: FONT_SERIF, fontSize: 28, letterSpacing: "-0.03em", color: TXT }}>{user.scansUsed}</p>
              <p style={{ margin: "4px 0 0", fontFamily: FONT_SANS, fontSize: 12, color: TXT_DIM }}>
                {formatUsageWindow(user.periodStart, user.periodEnd)}
              </p>
            </div>
            <Badge color={TXT} background="rgba(255,255,255,0.04)" border={BD_SOFT}>
              <TrendingUp size={11} />
              Current account window
            </Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                borderRadius: 12,
                border: `1px solid ${BD_SOFT}`,
                background: BG_CARD_2,
                padding: "14px 16px",
              }}
            >
              <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 11, color: TXT_FAINT, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Sites tracked
              </p>
              <p style={{ margin: "8px 0 0", fontFamily: FONT_SERIF, fontSize: 24, letterSpacing: "-0.03em", color: TXT }}>{user.sitesTracked}</p>
            </div>
          </div>
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${BD_SOFT}`,
              background: BG_CARD_2,
              padding: "14px 16px",
            }}
          >
            <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 11, color: TXT_FAINT, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Account-backed usage
            </p>
            <p style={{ margin: "8px 0 0", fontFamily: FONT_SANS, fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>
              Scan usage and tracked sites now come from the website account record and sync back into the extension on reconnect.
            </p>
          </div>
        </Card>
      </div>
    </PanelFrame>
  );
}
