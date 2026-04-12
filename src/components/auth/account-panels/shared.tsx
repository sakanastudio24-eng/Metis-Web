import type { CSSProperties, ElementType, ReactNode } from "react";

export type DashboardUser = {
  name: string;
  email: string | null;
  plan: "free" | "plus_beta" | "paid";
  isBeta: boolean;
  scansUsed: number;
  sitesTracked: number;
  periodStart: string;
  periodEnd: string;
  provider: string;
};

export const ACCENT = "#dc5e5e";
export const ACCENT_DIM = "rgba(220,94,94,0.16)";
export const ACCENT_BD = "rgba(220,94,94,0.34)";
export const DANGER = "#dc5e5e";
export const DANGER_DIM = "rgba(220,94,94,0.12)";
export const DANGER_BD = "rgba(220,94,94,0.25)";
export const BG_CARD = "#0e1017";
export const BG_CARD_2 = "#13161f";
export const BD = "rgba(255,255,255,0.08)";
export const BD_SOFT = "rgba(255,255,255,0.05)";
export const TXT = "#eceef4";
export const TXT_DIM = "rgba(236,238,244,0.58)";
export const TXT_FAINT = "rgba(236,238,244,0.3)";
export const GREEN = "#22c55e";
export const FONT_SANS = "var(--font-sans), sans-serif";
export const FONT_SERIF = "var(--font-serif), serif";

export function getProviderLabel(provider: string) {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    default:
      return "Email";
  }
}

export function formatTierLabel(plan: DashboardUser["plan"], isBeta: boolean) {
  if (plan === "paid") {
    return "Paid";
  }

  if (plan === "plus_beta" || isBeta) {
    return "Plus Beta";
  }

  return "Free";
}

export function formatUsageWindow(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} to ${endDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        marginBottom: 10,
        fontFamily: FONT_SANS,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: TXT_FAINT,
      }}
    >
      {children}
    </p>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${BD}`,
        background: BG_CARD,
        padding: "22px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  color = ACCENT,
  background = ACCENT_DIM,
  border = ACCENT_BD,
}: {
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        border: `1px solid ${border}`,
        background,
        padding: "4px 10px",
        fontFamily: FONT_SANS,
        fontSize: 10,
        fontWeight: 700,
        color,
      }}
    >
      {children}
    </span>
  );
}

export function Avatar({ user, size = 42, fontSize = 16 }: { user: DashboardUser; size?: number; fontSize?: number }) {
  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${ACCENT}, rgba(220,94,94,0.78))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 14px 30px rgba(220,94,94,0.25)",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: FONT_SANS, fontSize, fontWeight: 700, color: "white" }}>{initials}</span>
    </div>
  );
}

export function PanelFrame({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2
          style={{
            margin: 0,
            marginBottom: 6,
            fontFamily: FONT_SERIF,
            fontSize: 28,
            letterSpacing: "-0.03em",
            color: TXT,
          }}
        >
          {title}
        </h2>
        <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 14, color: TXT_DIM, lineHeight: 1.6 }}>{body}</p>
      </div>
      {children}
    </div>
  );
}

export function PanelLoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ height: 12, width: "54%", borderRadius: 999, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 12, width: "78%", borderRadius: 999, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ height: 140, borderRadius: 16, background: "rgba(255,255,255,0.03)" }} />
      </div>
    </Card>
  );
}

export type NavIcon = ElementType;
