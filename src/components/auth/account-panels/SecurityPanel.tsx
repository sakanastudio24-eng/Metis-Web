import { Lock } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import {
  ACCENT,
  ACCENT_BD,
  ACCENT_DIM,
  Badge,
  BD,
  BG_CARD_2,
  Card,
  FONT_SANS,
  FONT_SERIF,
  PanelFrame,
  SectionLabel,
  TXT,
  TXT_DIM,
  TXT_FAINT,
  getProviderLabel,
} from "@/components/auth/account-panels/shared";

type SecurityPanelProps = {
  provider: string;
};

export function SecurityPanel({ provider }: SecurityPanelProps) {
  const copy = authCopy.dashboard.security;

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <Card style={{ background: "linear-gradient(135deg, #0e1017 0%, rgba(220,94,94,0.1) 100%)", border: `1px solid ${ACCENT_BD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={86} height={86} viewBox="0 0 86 86">
              <circle cx={43} cy={43} r={34} fill="none" stroke={BD} strokeWidth={7} />
              <circle
                cx={43}
                cy={43}
                r={34}
                fill="none"
                stroke={ACCENT}
                strokeWidth={7}
                strokeDasharray={`${2 * Math.PI * 34 * 0.78} ${2 * Math.PI * 34 * 0.22}`}
                strokeLinecap="round"
                transform="rotate(-90 43 43)"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: FONT_SERIF, fontSize: 22, color: TXT, lineHeight: 1 }}>78</span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: TXT_FAINT }}>/100</span>
            </div>
          </div>
          <div>
            <p style={{ margin: 0, marginBottom: 6, fontFamily: FONT_SERIF, fontSize: 22, color: TXT, letterSpacing: "-0.02em" }}>{copy.scoreTitle}</p>
            <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.scoreBody}</p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>{copy.providerTitle}</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", background: BG_CARD_2, padding: "12px 14px", marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, marginBottom: 2, fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: TXT }}>{getProviderLabel(provider)}</p>
            <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 11, color: TXT_FAINT }}>{copy.providerBody}</p>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: ACCENT_DIM, border: `1px solid ${ACCENT_BD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={16} style={{ color: ACCENT }} />
          </div>
        </div>
        <div
          style={{
            borderRadius: 11,
            border: `1px solid ${BD}`,
            background: BG_CARD_2,
            padding: "11px 14px",
            color: TXT_DIM,
            fontFamily: FONT_SANS,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Security details stay inside this dashboard section.
        </div>
      </Card>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {[copy.activeSessionsTitle, copy.auditLogTitle].map((title) => (
          <Card key={title}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <SectionLabel>{title}</SectionLabel>
              <Badge>{copy.comingSoonLabel}</Badge>
            </div>
            <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.comingSoonBody}</p>
          </Card>
        ))}
      </div>
    </PanelFrame>
  );
}
