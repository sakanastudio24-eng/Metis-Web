"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

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
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Cpu,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Layers,
  LogOut,
  Mail,
  Pencil,
  Settings2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserRound,
  WalletCards,
  Zap,
  Crown,
  X,
  AlertTriangle,
  Lock,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { clearTemporaryAuthSession } from "@/lib/temp-auth-client";
import { useTemporarySessionGuard } from "@/components/auth/useTemporarySessionGuard";

type AccountPageClientProps = {
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  isTemporary?: boolean;
};

type DashboardUser = {
  name: string;
  email: string;
  plan: "free" | "plus";
  provider: string;
};

type NavId = "account" | "settings" | "security" | "pricing";

const RED = "#dc5e5e";
const RED_DIM = "rgba(220,94,94,0.15)";
const RED_BD = "rgba(220,94,94,0.25)";
const RED_GLOW = "rgba(220,94,94,0.08)";
const BG = "#090b10";
const BG_CARD = "#0e1017";
const BG_CARD2 = "#13161f";
const BD = "rgba(255,255,255,0.07)";
const BD2 = "rgba(255,255,255,0.04)";
const TXT = "#eceef4";
const TXT_DIM = "rgba(236,238,244,0.52)";
const TXT_DIM2 = "rgba(236,238,244,0.28)";
const GREEN = "#22c55e";
const YELLOW = "#eab308";
const SIDEBAR_W = 228;

const NAV_ACTIVE: { id: NavId; icon: React.ElementType; label: string }[] = [
  { id: "account", icon: UserRound, label: "Account" },
  { id: "settings", icon: Settings2, label: "Settings" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "pricing", icon: CreditCard, label: "Pricing" },
];

const NAV_SOON = [
  { icon: BarChart3, label: "Analytics" },
  { icon: Globe, label: "CDN" },
  { icon: Layers, label: "Deployments" },
  { icon: Cpu, label: "Usage" },
  { icon: Sparkles, label: "AI insights" },
];

const ACTIVITY = [
  { id: 1, icon: CheckCircle2, type: "success", msg: "Signed in from Chrome / macOS", ts: "Just now", ip: "92.12.44.1" },
  { id: 2, icon: CheckCircle2, type: "success", msg: "Password changed successfully", ts: "2 days ago", ip: "92.12.44.1" },
  { id: 3, icon: AlertTriangle, type: "warning", msg: "Sign-in attempt from new location", ts: "5 days ago", ip: "185.220.101.3" },
  { id: 4, icon: CheckCircle2, type: "success", msg: "Two-factor authentication enabled", ts: "8 days ago", ip: "92.12.44.1" },
  { id: 5, icon: CheckCircle2, type: "success", msg: "API key generated — prod_k9xQmPz3w", ts: "12 days ago", ip: "92.12.44.1" },
  { id: 6, icon: AlertTriangle, type: "warning", msg: "3 failed sign-in attempts detected", ts: "14 days ago", ip: "45.33.32.156" },
] as const;

const USAGE_DATA = [
  { d: "Mon", scans: 12 },
  { d: "Tue", scans: 19 },
  { d: "Wed", scans: 8 },
  { d: "Thu", scans: 26 },
  { d: "Fri", scans: 34 },
  { d: "Sat", scans: 18 },
  { d: "Sun", scans: 22 },
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For individuals exploring Metis.",
    color: TXT_DIM,
    features: ["50 page scans / month", "3 tracked sites", "Core issue detection", "7-day history"],
    missing: ["AI scoring", "Team seats", "Priority support", "API access"],
    cta: "Current plan",
    current: true,
    highlight: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: "$12",
    period: "/ month",
    desc: "For power users and indie teams.",
    color: RED,
    features: [
      "Unlimited scans",
      "20 tracked sites",
      "AI scoring + fix suggestions",
      "90-day history",
      "3 team seats",
      "Priority support",
    ],
    missing: ["API access"],
    cta: "Upgrade to Plus",
    current: false,
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/ month",
    desc: "For growing engineering teams.",
    color: "#a78bfa",
    features: [
      "Everything in Plus",
      "Unlimited tracked sites",
      "Full API access",
      "15 team seats",
      "SSO / SAML",
      "Dedicated support",
    ],
    missing: [],
    cta: "Contact sales",
    current: false,
    highlight: false,
  },
] as const;

function titleCase(value: string) {
  return value
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        color: TXT_DIM2,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        margin: 0,
        marginBottom: 10,
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
        borderRadius: 16,
        background: BG_CARD,
        border: `1px solid ${BD}`,
        padding: "22px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function RedPill({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        borderRadius: 999,
        padding: "3px 10px",
        background: RED_DIM,
        border: `1px solid ${RED_BD}`,
      }}
    >
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        border: "none",
        background: on ? RED : "rgba(255,255,255,0.1)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: on ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function Avatar({ user, size = 40, fontSize = 16 }: { user: DashboardUser; size?: number; fontSize?: number }) {
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
        flexShrink: 0,
        background: `linear-gradient(135deg, ${RED}, rgba(220,94,94,0.78))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 2px 12px rgba(220,94,94,0.35)`,
        border: "2px solid rgba(255,255,255,0.15)",
      }}
    >
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize,
          fontWeight: 700,
          color: "white",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {initials}
      </span>
    </div>
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
        padding: "9px 13px",
        borderRadius: 9,
        border: "none",
        background: active ? RED_DIM : hovered && !soon ? "rgba(255,255,255,0.04)" : "transparent",
        cursor: soon ? "default" : "pointer",
        transition: "background 0.15s",
        outline: active ? `1px solid ${RED_BD}` : "none",
      }}
    >
      <Icon
        size={15}
        style={{
          color: active ? RED : soon ? TXT_DIM2 : hovered ? TXT : TXT_DIM,
          transition: "color 0.15s",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          flex: 1,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          color: active ? RED : soon ? TXT_DIM2 : hovered ? TXT : TXT_DIM,
          transition: "color 0.15s",
          textAlign: "left",
        }}
      >
        {label}
      </span>
      {active ? <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED, flexShrink: 0 }} /> : null}
      {soon ? (
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 8,
            fontWeight: 700,
            color: TXT_DIM2,
            background: BD2,
            borderRadius: 999,
            padding: "2px 6px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Soon
        </span>
      ) : null}
    </button>
  );
}

function AccountPanel({
  user,
  onSignOut,
}: {
  user: DashboardUser;
  onSignOut: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiKey = "sk_live_m3t1s_9xQmPz3w4aHdKjL7rNbVcYe";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key="account"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <Avatar user={user} size={68} fontSize={24} />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: RED,
                border: `2px solid ${BG_CARD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Pencil size={9} style={{ color: "white" }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  style={{
                    background: BG_CARD2,
                    border: `1px solid ${RED_BD}`,
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 16,
                    color: TXT,
                    outline: "none",
                    fontWeight: 600,
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    border: "none",
                    background: RED,
                    borderRadius: 8,
                    padding: "6px 14px",
                    color: "white",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    border: `1px solid ${BD}`,
                    background: "transparent",
                    borderRadius: 8,
                    padding: "6px 12px",
                    color: TXT_DIM,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: TXT, letterSpacing: "-0.02em" }}>
                  {name}
                </span>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: TXT_DIM2, padding: 2 }}
                >
                  <Pencil size={13} />
                </button>
              </div>
            )}
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, margin: "4px 0 0" }}>{user.email}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <RedPill>
                <Crown size={9} style={{ color: RED }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, color: RED }}>
                  {user.plan === "plus" ? "Plus" : "Free plan"}
                </span>
              </RedPill>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  borderRadius: 999,
                  padding: "3px 10px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: GREEN }}>Active</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            style={{
              border: `1px solid ${BD}`,
              background: "transparent",
              borderRadius: 10,
              padding: "8px 16px",
              color: TXT_DIM,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionLabel>Connected accounts</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: Mail, label: "Email", value: user.email, linked: true },
              { icon: Globe, label: "GitHub", value: user.provider === "github" ? "Connected" : "Not connected", linked: user.provider === "github" },
              { icon: Globe, label: "Google", value: user.provider === "google" || user.provider === "google-test" ? "Connected" : "Not connected", linked: user.provider === "google" || user.provider === "google-test" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 10,
                  background: BG_CARD2,
                  border: `1px solid ${BD2}`,
                }}
              >
                <row.icon size={15} style={{ color: row.linked ? RED : TXT_DIM2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_DIM2, margin: 0 }}>{row.label}</p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      color: row.linked ? TXT : TXT_DIM2,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.value}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    color: row.linked ? GREEN : TXT_DIM2,
                    borderRadius: 999,
                    padding: "2px 8px",
                    background: row.linked ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${row.linked ? "rgba(34,197,94,0.2)" : BD2}`,
                  }}
                >
                  {row.linked ? "Linked" : "Connect"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionLabel>API access</SectionLabel>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, margin: 0, marginBottom: 12, lineHeight: 1.5 }}>
              Use your API key to integrate Metis into CI, deploy checks, or your own tooling.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                borderRadius: 10,
                overflow: "hidden",
                border: `1px solid ${BD}`,
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: BG_CARD2,
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: TXT_DIM,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {showKey ? apiKey : "sk_live_m3t1s_••••••••••••••••••••••"}
              </div>
              <button
                type="button"
                onClick={() => setShowKey((value) => !value)}
                style={{ padding: "10px 12px", background: BG_CARD2, border: "none", borderLeft: `1px solid ${BD}`, cursor: "pointer", color: TXT_DIM }}
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button
                type="button"
                onClick={copyKey}
                style={{
                  padding: "10px 14px",
                  background: copied ? RED_DIM : BG_CARD2,
                  border: "none",
                  borderLeft: `1px solid ${BD}`,
                  cursor: "pointer",
                  color: copied ? RED : TXT_DIM,
                  transition: "background 0.2s",
                }}
              >
                {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 10,
              background: RED_GLOW,
              border: `1px solid ${RED_BD}`,
            }}
          >
            <AlertTriangle size={12} style={{ color: RED, flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_DIM }}>
              Never share your API key. Rotate it immediately if exposed.
            </span>
          </div>
          <button
            type="button"
            style={{
              marginTop: 12,
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              border: `1px solid ${RED_BD}`,
              background: RED_DIM,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: RED,
              cursor: "pointer",
            }}
          >
            Regenerate key
          </button>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <SectionLabel>Scan usage — last 7 days</SectionLabel>
            <p style={{ fontFamily: "DM Serif Display, serif", fontSize: 26, color: TXT, margin: 0, letterSpacing: "-0.02em" }}>
              139{" "}
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TXT_DIM, letterSpacing: 0, fontWeight: 400 }}>
                of 50 scans
              </span>
            </p>
          </div>
          <RedPill>
            <TrendingUp size={10} style={{ color: RED }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: RED }}>+18% vs last week</span>
          </RedPill>
        </div>
        <div style={{ height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USAGE_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={RED} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={BD2} strokeDasharray="3 0" vertical={false} />
              <XAxis dataKey="d" tick={{ fontFamily: "monospace", fontSize: 9, fill: TXT_DIM2 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "monospace", fontSize: 9, fill: TXT_DIM2 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: BG_CARD2, border: `1px solid ${BD}`, borderRadius: 8, fontFamily: "monospace", fontSize: 11, color: TXT }} />
              <Area type="monotone" dataKey="scans" stroke={RED} strokeWidth={2} fill="url(#scanGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}

function SettingsPanel() {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    weekly: false,
    critical: true,
  });
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [scanDepth, setScanDepth] = useState<"fast" | "standard" | "deep">("standard");

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <Card>
        <SectionLabel>Notifications</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { key: "email", label: "Email alerts", sub: "Receive scan results and issue alerts by email" },
            { key: "browser", label: "Browser notifications", sub: "Show desktop alerts when a scan completes" },
            { key: "weekly", label: "Weekly digest", sub: "Summary email every Monday with usage highlights" },
            { key: "critical", label: "Critical issue alerts", sub: "Immediate email for severity: critical findings" },
          ].map((row, index) => (
            <div
              key={row.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 0",
                borderBottom: index < 3 ? `1px solid ${BD2}` : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT, margin: 0, marginBottom: 2 }}>{row.label}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, margin: 0 }}>{row.sub}</p>
              </div>
              <Toggle
                on={notifications[row.key as keyof typeof notifications]}
                onChange={() =>
                  setNotifications((current) => ({
                    ...current,
                    [row.key]: !current[row.key as keyof typeof current],
                  }))
                }
              />
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionLabel>Appearance</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(["dark", "light", "system"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: theme === option ? RED_DIM : BG_CARD2,
                  outline: theme === option ? `1px solid ${RED_BD}` : `1px solid ${BD2}`,
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `2px solid ${theme === option ? RED : TXT_DIM2}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {theme === option ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: RED }} /> : null}
                </div>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: theme === option ? 600 : 400,
                    color: theme === option ? RED : TXT_DIM,
                    textTransform: "capitalize",
                  }}
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionLabel>Scan depth</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {([
              { id: "fast", label: "Fast", sub: "~2s · Core checks only" },
              { id: "standard", label: "Standard", sub: "~6s · Recommended" },
              { id: "deep", label: "Deep", sub: "~18s · All detectors + AI" },
            ] as const).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setScanDepth(option.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: scanDepth === option.id ? RED_DIM : BG_CARD2,
                  outline: scanDepth === option.id ? `1px solid ${RED_BD}` : `1px solid ${BD2}`,
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `2px solid ${scanDepth === option.id ? RED : TXT_DIM2}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {scanDepth === option.id ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: RED }} /> : null}
                </div>
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: scanDepth === option.id ? 600 : 400, color: scanDepth === option.id ? RED : TXT_DIM, margin: 0 }}>
                    {option.label}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_DIM2, margin: 0 }}>{option.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ border: `1px solid rgba(220,94,94,0.2)`, background: RED_GLOW }}>
        <SectionLabel>Danger zone</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT, margin: 0, marginBottom: 2 }}>Delete account</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, margin: 0 }}>Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
          <button
            type="button"
            style={{
              flexShrink: 0,
              marginLeft: 24,
              padding: "9px 18px",
              borderRadius: 10,
              border: `1px solid ${RED_BD}`,
              background: "transparent",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: RED,
              cursor: "pointer",
            }}
          >
            Delete account
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

function SecurityPanel({ onOpenDetails }: { onOpenDetails: () => void }) {
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <Card style={{ background: `linear-gradient(135deg, ${BG_CARD} 0%, rgba(220,94,94,0.05) 100%)`, border: `1px solid ${RED_BD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={88} height={88} viewBox="0 0 88 88">
              <circle cx={44} cy={44} r={36} fill="none" stroke={BD} strokeWidth={7} />
              <circle
                cx={44}
                cy={44}
                r={36}
                fill="none"
                stroke={RED}
                strokeWidth={7}
                strokeDasharray={`${2 * Math.PI * 36 * 0.78} ${2 * Math.PI * 36 * 0.22}`}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
                strokeOpacity={0.9}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: TXT, lineHeight: 1 }}>78</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: TXT_DIM2 }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, color: TXT, margin: 0, marginBottom: 4, letterSpacing: "-0.01em" }}>Good security posture</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM, margin: 0, marginBottom: 14 }}>
              Your account is well-protected. Enable 2FA and rotate your API key to reach 100.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Password", ok: true },
                { label: "2FA", ok: false },
                { label: "Email", ok: true },
                { label: "API key", ok: true },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    borderRadius: 999,
                    padding: "4px 10px",
                    background: item.ok ? "rgba(34,197,94,0.08)" : RED_DIM,
                    border: `1px solid ${item.ok ? "rgba(34,197,94,0.2)" : RED_BD}`,
                  }}
                >
                  {item.ok ? <CheckCircle2 size={10} style={{ color: GREEN }} /> : <AlertTriangle size={10} style={{ color: RED }} />}
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: item.ok ? GREEN : RED }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: RED_DIM,
                border: `1px solid ${RED_BD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Smartphone size={15} style={{ color: RED }} />
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT, margin: 0 }}>Two-factor authentication</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: YELLOW, margin: 0 }}>Not enabled</p>
            </div>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, margin: 0, marginBottom: 14, lineHeight: 1.55 }}>
            Add a second layer of security using an authenticator app like Authy or Google Authenticator.
          </p>
          <button
            type="button"
            onClick={onOpenDetails}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 10,
              border: `1px solid ${RED_BD}`,
              background: RED_DIM,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: RED,
              cursor: "pointer",
            }}
          >
            Enable 2FA
          </button>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={15} style={{ color: GREEN }} />
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT, margin: 0 }}>Password</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: GREEN, margin: 0 }}>Last changed 8 days ago</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Current password", "New password", "Confirm new password"].map((placeholder) => (
              <div
                key={placeholder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 9,
                  background: BG_CARD2,
                  border: `1px solid ${BD}`,
                  overflow: "hidden",
                }}
              >
                <input
                  type="password"
                  placeholder={placeholder}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    padding: "9px 12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: TXT,
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            style={{
              marginTop: 10,
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              border: `1px solid ${RED_BD}`,
              background: RED_DIM,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: RED,
              cursor: "pointer",
            }}
          >
            Update password
          </button>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <SectionLabel>Active sessions</SectionLabel>
          <button type="button" style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: RED, background: "none", border: "none", cursor: "pointer" }}>
            Revoke all other sessions
          </button>
        </div>
        {[
          { device: "Chrome / macOS", loc: "London, UK", ip: "92.12.44.1", current: true, ts: "Active now" },
          { device: "Safari / iPhone", loc: "London, UK", ip: "92.12.44.2", current: false, ts: "2 hours ago" },
          { device: "Firefox / Linux", loc: "Amsterdam, NL", ip: "185.220.101.3", current: false, ts: "3 days ago" },
        ].map((session, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: index < 2 ? `1px solid ${BD2}` : "none" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: session.current ? RED_DIM : BG_CARD2,
                border: `1px solid ${session.current ? RED_BD : BD2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Globe size={14} style={{ color: session.current ? RED : TXT_DIM2 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT, margin: 0, marginBottom: 2 }}>{session.device}</p>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: TXT_DIM2, margin: 0 }}>{session.ip} · {session.loc} · {session.ts}</p>
            </div>
            {session.current ? (
              <span
                style={{
                  borderRadius: 999,
                  padding: "3px 10px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  color: GREEN,
                }}
              >
                This device
              </span>
            ) : (
              <button
                type="button"
                style={{
                  border: `1px solid ${BD}`,
                  background: "none",
                  borderRadius: 8,
                  padding: "5px 12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: TXT_DIM,
                  cursor: "pointer",
                }}
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <SectionLabel>Audit log</SectionLabel>
          <button type="button" style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: RED, background: "none", border: "none", cursor: "pointer" }}>
            Export log →
          </button>
        </div>
        <div>
          {ACTIVITY.map((event, index) => {
            const Icon = event.icon;
            const color = event.type === "success" ? GREEN : YELLOW;

            return (
              <div key={event.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: index < ACTIVITY.length - 1 ? `1px solid ${BD2}` : "none" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: event.type === "success" ? "rgba(34,197,94,0.08)" : RED_DIM,
                    border: `1px solid ${event.type === "success" ? "rgba(34,197,94,0.2)" : RED_BD}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={12} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT, margin: 0 }}>{event.msg}</p>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: TXT_DIM2, margin: 0, marginTop: 2 }}>{event.ip} · {event.ts}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

function PricingPanel() {
  const [annual, setAnnual] = useState(false);

  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div>
        <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: 30, color: TXT, margin: 0, marginBottom: 6, letterSpacing: "-0.025em" }}>
          Simple, honest pricing.
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: TXT_DIM, margin: 0 }}>No hidden fees. Cancel anytime.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: !annual ? TXT : TXT_DIM }}>Monthly</span>
          <Toggle on={annual} onChange={() => setAnnual((value) => !value)} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: annual ? TXT : TXT_DIM }}>Annual</span>
          {annual ? (
            <RedPill>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, color: RED }}>2 months free</span>
            </RedPill>
          ) : null}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            style={{
              borderRadius: 18,
              background: plan.highlight ? `linear-gradient(155deg, rgba(220,94,94,0.1) 0%, ${BG_CARD} 60%)` : BG_CARD,
              border: plan.highlight ? `1.5px solid ${RED_BD}` : `1px solid ${BD}`,
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              boxShadow: plan.highlight ? `0 0 40px rgba(220,94,94,0.08)` : "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {plan.highlight ? <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)` }} /> : null}
            {plan.highlight ? (
              <div style={{ position: "absolute", top: 14, right: 14 }}>
                <RedPill>
                  <Crown size={8} style={{ color: RED }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: RED }}>POPULAR</span>
                </RedPill>
              </div>
            ) : null}

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.color, margin: 0, marginBottom: 10 }}>
              {plan.name}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 36, color: TXT, letterSpacing: "-0.03em" }}>
                {annual && plan.id !== "free" ? `$${Math.round(Number(plan.price.replace("$", "")) * 0.83)}` : plan.price}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM }}>{plan.period}</span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, margin: 0, marginBottom: 20 }}>{plan.desc}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, marginBottom: 20 }}>
              {plan.features.map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={13} style={{ color: plan.highlight ? RED : GREEN, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM }}>{feature}</span>
                </div>
              ))}
              {plan.missing.map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <X size={13} style={{ color: TXT_DIM2, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM2 }}>{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              style={{
                width: "100%",
                padding: "11px 0",
                borderRadius: 11,
                border: plan.current ? `1px solid ${BD}` : plan.highlight ? "none" : `1px solid ${BD}`,
                cursor: plan.current ? "default" : "pointer",
                background: plan.highlight ? RED : plan.current ? BD2 : BG_CARD2,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: plan.highlight ? "white" : plan.current ? TXT_DIM2 : TXT_DIM,
                boxShadow: plan.highlight ? "0 4px 20px rgba(220,94,94,0.35)" : "none",
              }}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { q: "Can I switch plans?", a: "Yes — upgrade or downgrade at any time. Billing is prorated automatically." },
            { q: "What counts as a scan?", a: "A full page analysis triggered by the extension or API. Background checks don't count." },
            { q: "Is there a free trial?", a: "Free plan is available forever. Plus has a 14-day money-back guarantee." },
          ].map((item) => (
            <div key={item.q} style={{ flex: 1 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: TXT, margin: 0, marginBottom: 5 }}>{item.q}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TXT_DIM, margin: 0, lineHeight: 1.55 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
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

  const titles: Record<NavId, string> = {
    account: "Account",
    settings: "Settings",
    security: "Security",
    pricing: "Pricing",
  };

  const subtitles: Record<NavId, string> = {
    account: "Manage your profile, API keys, and usage",
    settings: "Preferences, notifications, and scan behaviour",
    security: "Password, 2FA, sessions, and audit log",
    pricing: "Current plan, usage limits, and upgrade options",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: SIDEBAR_W,
          flexShrink: 0,
          background: BG_CARD,
          borderRight: `1px solid ${BD}`,
          display: "flex",
          flexDirection: "column",
          padding: "0 10px 16px",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "20px 6px 16px", borderBottom: `1px solid ${BD2}`, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 12px rgba(220,94,94,0.35)`,
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, color: "white", lineHeight: 1 }}>M</span>
            </div>
            <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 17, color: TXT, letterSpacing: "-0.02em" }}>Metis</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 10, background: BG_CARD2, border: `1px solid ${BD}` }}>
            <Avatar user={user} size={28} fontSize={11} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: TXT, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Crown size={8} style={{ color: RED }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: RED, textTransform: "uppercase" }}>{user.plan}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 6 }}>
          {NAV_ACTIVE.map((item) => (
            <NavLink key={item.id} icon={item.icon} label={item.label} active={active === item.id} onClick={() => setActive(item.id)} />
          ))}
        </div>

        <div style={{ margin: "10px 0 8px", padding: "0 13px" }}>
          <div style={{ height: 1, background: BD2, marginBottom: 12 }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: TXT_DIM2, margin: 0, marginBottom: 8 }}>
            More sections coming soon
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_SOON.map((item) => (
            <NavLink key={item.label} icon={item.icon} label={item.label} soon />
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ borderTop: `1px solid ${BD2}`, paddingTop: 10, marginTop: 10 }}>
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", borderRadius: 9, border: "none", background: "transparent", cursor: "pointer" }}
          >
            <ArrowLeft size={14} style={{ color: TXT_DIM }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: TXT_DIM }}>Back to site</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minWidth: 0 }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: `${BG}ee`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: `1px solid ${BD}`,
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            height: 58,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 3, borderRadius: "0 3px 3px 0", background: RED }} />

          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${active}-title`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{ fontFamily: "DM Serif Display, serif", fontSize: 18, color: TXT, margin: 0, letterSpacing: "-0.01em", lineHeight: 1 }}
              >
                {titles[active]}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${active}-sub`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.05 }}
                style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: TXT_DIM2, margin: 0, marginTop: 2 }}
              >
                {subtitles[active]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 8, padding: "5px 12px", background: RED_GLOW, border: `1px solid ${RED_BD}` }}>
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: RED }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: RED }}>Metis Beta</span>
          </div>
        </div>

        <div style={{ padding: "28px 32px 48px", flex: 1 }}>
          <AnimatePresence mode="wait">
            {active === "account" ? <AccountPanel key="account" user={user} onSignOut={handleSignOut} /> : null}
            {active === "settings" ? <SettingsPanel key="settings" /> : null}
            {active === "security" ? <SecurityPanel key="security" onOpenDetails={() => router.push("/account/security")} /> : null}
            {active === "pricing" ? <PricingPanel key="pricing" /> : null}
          </AnimatePresence>

          {isTemporary ? (
            <div
              style={{
                marginTop: 20,
                borderRadius: 12,
                border: `1px solid ${RED_BD}`,
                background: RED_GLOW,
                padding: "12px 14px",
                color: "#ffb8b8",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              Temporary local account. This dashboard is for review only and does not grant backend API access.
            </div>
          ) : null}

          {!emailConfirmed ? (
            <div
              style={{
                marginTop: 12,
                borderRadius: 12,
                border: `1px solid ${RED_BD}`,
                background: "rgba(220,94,94,0.1)",
                padding: "12px 14px",
                color: "#ffb8b8",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              Email verification is still pending. This preview stays visible, but the full production auth path requires a confirmed address.
            </div>
          ) : null}

          {isPending ? (
            <div style={{ marginTop: 12, color: TXT_DIM2, fontFamily: "Inter, sans-serif", fontSize: 12 }}>Updating session…</div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
