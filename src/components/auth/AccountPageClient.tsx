"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Cpu,
  Crown,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Lock,
  LogOut,
  Mail,
  Menu,
  Rocket,
  Settings2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

import { useTemporarySessionGuard } from "@/components/auth/useTemporarySessionGuard";
import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { clearTemporaryAuthSession } from "@/lib/temp-auth-client";

type AccountPageClientProps = {
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  isTemporary?: boolean;
};

type DashboardUser = {
  name: string;
  email: string;
  plan: "free" | "plus_beta";
  provider: string;
};

type NavId = (typeof authCopy.dashboard.sectionOrder)[number]["id"];
type DashboardSection = (typeof authCopy.dashboard.sectionOrder)[number];
type PricingPlan = (typeof authCopy.dashboard.pricing.plans)[number];

const ACCENT = "#dc5e5e";
const ACCENT_DIM = "rgba(220,94,94,0.16)";
const ACCENT_BD = "rgba(220,94,94,0.34)";
const ACCENT_GLOW = "rgba(220,94,94,0.1)";
const DANGER = "#dc5e5e";
const DANGER_DIM = "rgba(220,94,94,0.12)";
const DANGER_BD = "rgba(220,94,94,0.25)";
const BG = "#090b10";
const BG_CARD = "#0e1017";
const BG_CARD_2 = "#13161f";
const BD = "rgba(255,255,255,0.08)";
const BD_SOFT = "rgba(255,255,255,0.05)";
const TXT = "#eceef4";
const TXT_DIM = "rgba(236,238,244,0.58)";
const TXT_FAINT = "rgba(236,238,244,0.3)";
const GREEN = "#22c55e";

const dashboardCopy = authCopy.dashboard;

const SECTION_ICONS: Record<NavId, React.ElementType> = {
  account: UserRound,
  api: Cpu,
  security: Shield,
  pricing: Crown,
  settings: Settings2,
};

const NAV_ACTIVE: Array<DashboardSection & { icon: React.ElementType }> = dashboardCopy.sectionOrder.map((section) => ({
  ...section,
  icon: SECTION_ICONS[section.id],
}));

// API Beta stays visible in the nav so the roadmap is honest, but the full panel
// remains staged until the beta backend surface is ready for review.
const NAV_VISIBLE = NAV_ACTIVE.map((section) =>
  section.id === "api"
    ? {
        ...section,
        soon: true,
      }
    : {
        ...section,
        soon: false,
      },
);

const NAV_SOON = [
  { icon: Sparkles, label: "AI insights" },
  { icon: Globe, label: "Reports" },
  { icon: Layers, label: "Deployments" },
];

const USAGE_DATA = [
  { day: "Mon", scans: 12 },
  { day: "Tue", scans: 19 },
  { day: "Wed", scans: 8 },
  { day: "Thu", scans: 26 },
  { day: "Fri", scans: 34 },
  { day: "Sat", scans: 18 },
  { day: "Sun", scans: 22 },
] as const;

function titleCase(value: string) {
  return value
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getProviderLabel(provider: string) {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "google-test":
      return "Google test account";
    default:
      return "Email";
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        marginBottom: 10,
        fontFamily: "Inter, sans-serif",
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

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
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

function Badge({
  children,
  color = ACCENT,
  background = ACCENT_DIM,
  border = ACCENT_BD,
}: {
  children: React.ReactNode;
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
        fontFamily: "Inter, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        color,
      }}
    >
      {children}
    </span>
  );
}

function NavLink({
  icon: Icon,
  label,
  active,
  onClick,
  soon = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  soon?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soon}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 13px",
        borderRadius: 10,
        border: "none",
        background: active ? ACCENT_DIM : hovered && !soon ? "rgba(255,255,255,0.04)" : "transparent",
        outline: active ? `1px solid ${ACCENT_BD}` : "none",
        cursor: soon ? "default" : "pointer",
        transition: "background 0.18s ease",
      }}
    >
      <Icon size={15} style={{ color: active ? ACCENT : soon ? TXT_FAINT : hovered ? TXT : TXT_DIM, flexShrink: 0 }} />
      <span
        style={{
          flex: 1,
          textAlign: "left",
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          color: active ? ACCENT : soon ? TXT_FAINT : hovered ? TXT : TXT_DIM,
        }}
      >
        {label}
      </span>
      {active ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} /> : null}
      {soon ? (
        <span
          style={{
            borderRadius: 999,
            background: BG_CARD_2,
            padding: "2px 7px",
            fontFamily: "Inter, sans-serif",
            fontSize: 8,
            fontWeight: 700,
            color: TXT_FAINT,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {dashboardCopy.navSoonLabel}
        </span>
      ) : null}
    </button>
  );
}

function Avatar({ user, size = 42, fontSize = 16 }: { user: DashboardUser; size?: number; fontSize?: number }) {
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
        boxShadow: "0 14px 30px rgba(79,70,229,0.25)",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: "Inter, sans-serif", fontSize, fontWeight: 700, color: "white" }}>{initials}</span>
    </div>
  );
}

function PanelFrame({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            marginBottom: 6,
            fontFamily: "DM Serif Display, serif",
            fontSize: 28,
            letterSpacing: "-0.03em",
            color: TXT,
          }}
        >
          {title}
        </h2>
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, color: TXT_DIM, lineHeight: 1.6 }}>{body}</p>
      </div>
      {children}
    </motion.div>
  );
}

function AccountPanel({
  user,
  emailConfirmed,
  onSignOut,
}: {
  user: DashboardUser;
  emailConfirmed: boolean;
  onSignOut: () => void;
}) {
  const copy = dashboardCopy.account;

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar user={user} size={66} fontSize={22} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: TXT, letterSpacing: "-0.02em" }}>{user.name}</span>
                <Badge color={emailConfirmed ? GREEN : DANGER} background={emailConfirmed ? "rgba(34,197,94,0.08)" : DANGER_DIM} border={emailConfirmed ? "rgba(34,197,94,0.22)" : DANGER_BD}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: emailConfirmed ? GREEN : DANGER }} />
                  {emailConfirmed ? "Verified" : "Verification pending"}
                </Badge>
                <Badge>
                  <Crown size={10} />
                  {user.plan === "plus_beta" ? copy.plusBetaLabel : copy.freePlanLabel}
                </Badge>
              </div>
              <p style={{ margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM }}>{user.email}</p>
              <p style={{ margin: "10px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_FAINT }}>{copy.profileStatusLabel}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 10,
              border: `1px solid ${BD}`,
              background: "transparent",
              padding: "9px 14px",
              color: TXT_DIM,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Card>
          <SectionLabel>{copy.connectedAccountsTitle}</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: Mail, label: "Email", value: user.email, state: copy.primaryLabel, linked: true },
              { icon: Globe, label: "GitHub", value: user.provider === "github" ? "Connected" : "Available", state: user.provider === "github" ? copy.connectedLabel : copy.availableLabel, linked: user.provider === "github" },
              { icon: Globe, label: "Google", value: user.provider === "google" || user.provider === "google-test" ? "Connected" : "Available", state: user.provider === "google" || user.provider === "google-test" ? copy.connectedLabel : copy.availableLabel, linked: user.provider === "google" || user.provider === "google-test" },
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
                <item.icon size={15} style={{ color: item.linked ? ACCENT : TXT_FAINT, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, marginBottom: 2, fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_FAINT }}>{item.label}</p>
                  <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.value}</p>
                </div>
                <Badge color={item.linked ? ACCENT : TXT_DIM} background={item.linked ? ACCENT_DIM : "rgba(255,255,255,0.04)"} border={item.linked ? ACCENT_BD : BD_SOFT}>
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
              <p style={{ margin: 0, fontFamily: "DM Serif Display, serif", fontSize: 28, letterSpacing: "-0.03em", color: TXT }}>{copy.usageSummary}</p>
              <p style={{ margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM }}>{copy.usageDetail}</p>
            </div>
            <Badge>
              <TrendingUp size={11} />
              {copy.usageDelta}
            </Badge>
          </div>
          <div style={{ height: 92 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USAGE_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="metisDashUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={BD_SOFT} vertical={false} />
                <XAxis dataKey="day" tick={{ fontFamily: "monospace", fontSize: 9, fill: TXT_FAINT }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "monospace", fontSize: 9, fill: TXT_FAINT }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: BG_CARD_2, border: `1px solid ${BD}`, borderRadius: 10, color: TXT, fontFamily: "monospace", fontSize: 11 }} />
                <Area type="monotone" dataKey="scans" stroke={ACCENT} strokeWidth={2.2} fill="url(#metisDashUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PanelFrame>
  );
}

function ApiBetaPanel({ user }: { user: DashboardUser }) {
  const copy = dashboardCopy.apiBeta;
  const isEnabled = user.plan === "plus_beta";
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const placeholderKey = copy.keyPlaceholder;

  function handleCopy() {
    navigator.clipboard.writeText(placeholderKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <Card style={{ background: `linear-gradient(135deg, ${BG_CARD} 0%, ${ACCENT_GLOW} 100%)`, border: `1px solid ${ACCENT_BD}` }}>
          <SectionLabel>{copy.accessTitle}</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ margin: 0, marginBottom: 6, fontFamily: "DM Serif Display, serif", fontSize: 26, color: TXT, letterSpacing: "-0.03em" }}>
                {isEnabled ? copy.enabledLabel : copy.pendingLabel}
              </p>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.accessBody}</p>
            </div>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                background: ACCENT_DIM,
                border: `1px solid ${ACCENT_BD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Rocket size={24} style={{ color: ACCENT }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <Badge>
                <ShieldCheck size={11} />
                {copy.gatedLabel}
              </Badge>
              <Badge color={TXT_DIM} background="rgba(255,255,255,0.04)" border={BD}>
                {copy.scopeNote}
              </Badge>
          </div>
        </Card>

        <Card>
          <SectionLabel>{copy.keyTitle}</SectionLabel>
          <p style={{ margin: 0, marginBottom: 12, fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.keyBody}</p>
          <div style={{ display: "flex", alignItems: "stretch", overflow: "hidden", borderRadius: 12, border: `1px solid ${BD}` }}>
            <div style={{ flex: 1, background: BG_CARD_2, padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: TXT_DIM, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {showKey ? placeholderKey : "beta_key_••••••••••••••••••"}
            </div>
            <button type="button" onClick={() => setShowKey((value) => !value)} style={{ border: "none", borderLeft: `1px solid ${BD}`, background: BG_CARD_2, padding: "0 12px", color: TXT_DIM, cursor: "pointer" }}>
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button type="button" onClick={handleCopy} style={{ border: "none", borderLeft: `1px solid ${BD}`, background: copied ? ACCENT_DIM : BG_CARD_2, padding: "0 14px", color: copied ? ACCENT : TXT_DIM, cursor: "pointer" }}>
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div style={{ marginTop: 14, borderRadius: 12, border: `1px solid ${DANGER_BD}`, background: DANGER_DIM, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 8 }}>
            <AlertTriangle size={13} style={{ color: DANGER, marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{copy.securityNote}</span>
          </div>
        </Card>
      </div>

      <Card>
        <SectionLabel>{copy.docsTitle}</SectionLabel>
        <p style={{ margin: 0, marginBottom: 18, fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.docsBody}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            style={{
              borderRadius: 11,
              border: "none",
              background: ACCENT,
              padding: "11px 16px",
              color: "white",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(220,94,94,0.28)",
            }}
          >
            {copy.primaryCta}
          </button>
          <button
            type="button"
            style={{
              borderRadius: 11,
              border: `1px solid ${BD}`,
              background: BG_CARD_2,
              padding: "11px 16px",
              color: TXT_DIM,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "default",
            }}
          >
            {copy.secondaryCta}
          </button>
        </div>
      </Card>
    </PanelFrame>
  );
}

function SecurityPanel({ provider, onOpenDetails }: { provider: string; onOpenDetails: () => void }) {
  const copy = dashboardCopy.security;

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <Card style={{ background: `linear-gradient(135deg, ${BG_CARD} 0%, ${ACCENT_GLOW} 100%)`, border: `1px solid ${ACCENT_BD}` }}>
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
              <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: TXT, lineHeight: 1 }}>78</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: TXT_FAINT }}>/100</span>
            </div>
          </div>
          <div>
            <p style={{ margin: 0, marginBottom: 6, fontFamily: "DM Serif Display, serif", fontSize: 22, color: TXT, letterSpacing: "-0.02em" }}>{copy.scoreTitle}</p>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.scoreBody}</p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>{copy.providerTitle}</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderRadius: 12, border: `1px solid ${BD_SOFT}`, background: BG_CARD_2, padding: "12px 14px", marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, marginBottom: 2, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT }}>{getProviderLabel(provider)}</p>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_FAINT }}>{copy.providerBody}</p>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: ACCENT_DIM, border: `1px solid ${ACCENT_BD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={16} style={{ color: ACCENT }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          style={{
            borderRadius: 11,
            border: "none",
            background: ACCENT,
            padding: "11px 14px",
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Review security settings
        </button>
      </Card>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {[copy.activeSessionsTitle, copy.auditLogTitle].map((title) => (
          <Card key={title}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <SectionLabel>{title}</SectionLabel>
              <Badge>{copy.comingSoonLabel}</Badge>
            </div>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, lineHeight: 1.6 }}>{copy.comingSoonBody}</p>
          </Card>
        ))}
      </div>
    </PanelFrame>
  );
}

function PricingPanel({ user }: { user: DashboardUser }) {
  const copy = dashboardCopy.pricing;
  const plans = copy.plans.map((plan) => ({
    ...plan,
    current: user.plan === plan.id,
  })) as PricingPlan[];

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              borderRadius: 18,
              border: plan.highlight ? `1.5px solid ${ACCENT_BD}` : `1px solid ${BD}`,
              background: plan.highlight ? `linear-gradient(155deg, ${ACCENT_GLOW} 0%, ${BG_CARD} 65%)` : BG_CARD,
              padding: "24px 22px",
            }}
          >
            {plan.highlight ? <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} /> : null}

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: plan.highlight ? ACCENT : TXT_DIM }}>{plan.name}</p>
                {plan.highlight ? (
                  <Badge>
                    <Crown size={10} />
                    Beta
                  </Badge>
                ) : null}
              </div>
              {plan.price ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 36, letterSpacing: "-0.03em", color: TXT }}>
                    {plan.price}
                  </span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM }}>{plan.period}</span>
                </div>
              ) : null}
              <p style={{ margin: "8px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{plan.desc}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {plan.features.map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={13} style={{ color: plan.highlight ? ACCENT : GREEN, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM }}>{feature}</span>
                </div>
              ))}
              {plan.missing.map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <AlertTriangle size={13} style={{ color: TXT_FAINT, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_FAINT }}>{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              style={{
                width: "100%",
                borderRadius: 11,
                border: plan.current ? `1px solid ${BD}` : "none",
                background: plan.highlight ? ACCENT : plan.current ? BG_CARD_2 : BG_CARD_2,
                padding: "11px 0",
                color: plan.highlight ? "white" : plan.current ? TXT_FAINT : TXT,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: plan.current ? "default" : "pointer",
                boxShadow: plan.highlight ? "0 12px 28px rgba(79,70,229,0.25)" : "none",
              }}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <Card>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {copy.faq.map((item) => (
            <div key={item.q}>
              <p style={{ margin: 0, marginBottom: 6, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT }}>{item.q}</p>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </PanelFrame>
  );
}

function SettingsPanel() {
  const copy = dashboardCopy.settings;

  return (
    <PanelFrame title={copy.title} body={copy.body}>
      <Card>
        <SectionLabel>{copy.appSettingsTitle}</SectionLabel>
        <button
          type="button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            borderRadius: 14,
            border: `1px solid ${BD}`,
            background: BG_CARD_2,
            padding: "16px 18px",
            cursor: "default",
            textAlign: "left",
          }}
        >
          <div>
            <p style={{ margin: 0, marginBottom: 4, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT }}>{copy.appSettingsTitle}</p>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{copy.appSettingsBody}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Badge color={TXT_DIM} background="rgba(255,255,255,0.04)" border={BD}>{copy.appSettingsState}</Badge>
            <ArrowRight size={16} style={{ color: ACCENT }} />
          </div>
        </button>
      </Card>
    </PanelFrame>
  );
}

export function AccountPageClient({
  email,
  provider,
  emailConfirmed,
  isTemporary = false,
}: AccountPageClientProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const isResettingTemporarySession = useTemporarySessionGuard(isTemporary);
  const [active, setActive] = useState<NavId>("account");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPending, startTransition] = useTransition();

  const user = useMemo<DashboardUser>(() => {
    const baseName = email ? titleCase(email.split("@")[0] ?? "Metis User") : "Metis User";

    return {
      name: isTemporary ? "Testing Account" : baseName,
      email: email ?? "user@example.com",
      plan: "free",
      provider,
    };
  }, [email, isTemporary, provider]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 980px)");

    function updateViewport() {
      setIsMobileViewport(media.matches);
      if (!media.matches) {
        setIsMobileNavOpen(false);
      }
    }

    updateViewport();
    media.addEventListener("change", updateViewport);

    return () => {
      media.removeEventListener("change", updateViewport);
    };
  }, []);

  function handleSelectSection(id: NavId) {
    if (id === "api") {
      return;
    }

    setActive(id);
    setIsMobileNavOpen(false);
  }

  function handleSignOut() {
    startTransition(async () => {
      if (isTemporary) {
        await clearTemporaryAuthSession();
      } else {
        await supabase.auth.signOut();
      }
      router.replace("/sign-in");
    });
  }

  if (isResettingTemporarySession) {
    return null;
  }

  const activeSection = NAV_ACTIVE.find((section) => section.id === active && section.id !== "api") ?? NAV_ACTIVE[0];

  const navigationContent = (
    <>
      <div style={{ padding: "20px 6px 16px", marginBottom: 12, borderBottom: `1px solid ${BD_SOFT}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(220,94,94,0.28)" }}>
            <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, color: "white", lineHeight: 1 }}>M</span>
          </div>
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 17, letterSpacing: "-0.02em", color: TXT }}>{dashboardCopy.brandLabel}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, border: `1px solid ${BD}`, background: BG_CARD_2, padding: "10px 12px" }}>
          <Avatar user={user} size={30} fontSize={12} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: TXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
            <p style={{ margin: "2px 0 0", fontFamily: "Inter, sans-serif", fontSize: 10, color: TXT_FAINT }}>
              {user.plan === "plus_beta" ? dashboardCopy.betaBadge : dashboardCopy.account.freePlanLabel}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_VISIBLE.map((section) => (
          <NavLink
            key={section.id}
            icon={section.icon}
            label={section.label}
            active={active === section.id && !section.soon}
            soon={section.soon}
            onClick={section.soon ? undefined : () => handleSelectSection(section.id)}
          />
        ))}
      </div>

      <div style={{ margin: "12px 0 8px", padding: "0 13px" }}>
        <div style={{ height: 1, background: BD_SOFT, marginBottom: 12 }} />
        <p style={{ margin: 0, marginBottom: 8, fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TXT_FAINT }}>
          {dashboardCopy.moreSectionsLabel}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_SOON.map((item) => (
          <NavLink key={item.label} icon={item.icon} label={item.label} soon />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ borderTop: `1px solid ${BD_SOFT}`, paddingTop: 10, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => {
            setIsMobileNavOpen(false);
            router.push("/");
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 13px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: TXT_DIM,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13 }}>{dashboardCopy.backToSiteLabel}</span>
        </button>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        background: BG,
        color: TXT,
        overflow: "hidden",
      }}
    >
      {!isMobileViewport ? (
        <aside
          style={{
            width: 232,
            flexShrink: 0,
            borderRight: `1px solid ${BD}`,
            background: BG_CARD,
            padding: "0 12px 16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {navigationContent}
        </aside>
      ) : null}

      <AnimatePresence>
        {isMobileViewport && isMobileNavOpen ? (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                border: "none",
                background: "rgba(2,4,8,0.7)",
                zIndex: 30,
                cursor: "pointer",
              }}
            />
            <motion.aside
              key="mobile-nav-panel"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: "fixed",
                top: 12,
                left: 12,
                bottom: 12,
                width: "min(296px, calc(100vw - 24px))",
                zIndex: 40,
                borderRadius: 20,
                border: `1px solid ${BD}`,
                background: BG_CARD,
                padding: "0 12px 16px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 28px 80px rgba(0,0,0,0.44)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 4px 0" }}>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    border: `1px solid ${BD}`,
                    background: BG_CARD_2,
                    color: TXT_DIM,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={15} />
                </button>
              </div>
              {navigationContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 16,
            height: 62,
            padding: isMobileViewport ? "0 18px" : "0 32px",
            background: `${BG}ee`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: `1px solid ${BD}`,
          }}
        >
          {isMobileViewport ? (
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                border: `1px solid ${BD}`,
                background: BG_CARD,
                color: TXT_DIM,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Menu size={16} />
            </button>
          ) : null}
          <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 3, borderRadius: "0 3px 3px 0", background: ACCENT }} />
          <div>
            <p style={{ margin: 0, fontFamily: "DM Serif Display, serif", fontSize: 18, letterSpacing: "-0.01em", color: TXT }}>{activeSection.label}</p>
            <p style={{ margin: "2px 0 0", fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_FAINT }}>{activeSection.subtitle}</p>
          </div>
          <div style={{ flex: 1 }} />
          {user.plan === "plus_beta" ? (
            <Badge>
              <Crown size={10} />
              {dashboardCopy.betaBadge}
            </Badge>
          ) : null}
        </div>

        <div style={{ padding: isMobileViewport ? "22px 18px 36px" : "28px 32px 48px" }}>
          <AnimatePresence mode="wait">
            {active === "account" ? <AccountPanel key="account" user={user} emailConfirmed={emailConfirmed} onSignOut={handleSignOut} /> : null}
            {/* The API Beta panel stays implemented in code, but it is intentionally
                withheld from the main dashboard flow until the beta launch pass. */}
            {active === "security" ? <SecurityPanel key="security" provider={provider} onOpenDetails={() => router.push("/account/security")} /> : null}
            {active === "pricing" ? <PricingPanel key="pricing" user={user} /> : null}
            {active === "settings" ? <SettingsPanel key="settings" /> : null}
          </AnimatePresence>

          {isTemporary ? (
            <div
              style={{
                marginTop: 20,
                borderRadius: 12,
                border: `1px solid ${DANGER_BD}`,
                background: DANGER_DIM,
                padding: "12px 14px",
                color: "#ffb8b8",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {dashboardCopy.temporaryAccountBody}
            </div>
          ) : null}

          {!emailConfirmed ? (
            <div
              style={{
                marginTop: 12,
                borderRadius: 12,
                border: `1px solid ${DANGER_BD}`,
                background: DANGER_DIM,
                padding: "12px 14px",
                color: "#ffb8b8",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {dashboardCopy.unverifiedBody}
            </div>
          ) : null}

          {isPending ? <div style={{ marginTop: 12, fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_FAINT }}>Updating session…</div> : null}
        </div>
      </main>
    </motion.div>
  );
}
