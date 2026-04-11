import { ArrowRight } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import {
  Badge,
  Card,
  DANGER,
  DANGER_BD,
  DANGER_DIM,
  FONT_SANS,
  PanelFrame,
  SectionLabel,
  TXT,
  TXT_DIM,
} from "@/components/auth/account-panels/shared";

type SettingsPanelProps = {
  onOpenDelete: () => void;
};

export function SettingsPanel({ onOpenDelete }: SettingsPanelProps) {
  const copy = authCopy.dashboard.settings;

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <Card>
        <SectionLabel>{copy.removeAccountTitle}</SectionLabel>
        <button
          type="button"
          onClick={onOpenDelete}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            borderRadius: 14,
            border: `1px solid ${DANGER_BD}`,
            background: DANGER_DIM,
            padding: "16px 18px",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div>
            <p style={{ margin: 0, marginBottom: 4, fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: TXT }}>{copy.removeAccountTitle}</p>
            <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{copy.removeAccountBody}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Badge color="#ffb8b8" background="rgba(220,94,94,0.08)" border={DANGER_BD}>
              {copy.removeAccountState}
            </Badge>
            <ArrowRight size={16} style={{ color: DANGER }} />
          </div>
        </button>
      </Card>
    </PanelFrame>
  );
}
