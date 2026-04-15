"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Cpu,
  Crown,
  Globe,
  Layers,
  Menu,
  Settings2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { authCopy } from "@/content/authCopy";
import type { AccountDashboardSnapshot } from "@/lib/account-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  ACCENT,
  ACCENT_BD,
  ACCENT_DIM,
  Avatar,
  Badge,
  BD,
  BD_SOFT,
  BG_CARD,
  BG_CARD_2,
  DANGER_BD,
  DANGER_DIM,
  FONT_SANS,
  FONT_SERIF,
  PanelLoadingCard,
  TXT,
  TXT_DIM,
  TXT_FAINT,
  formatTierLabel,
  type DashboardUser,
} from "@/components/auth/account-panels/shared";

type AccountPageClientProps = {
  provider: string;
  emailConfirmed: boolean;
  account: AccountDashboardSnapshot;
  initialSection: Exclude<NavId, "api">;
  initialDeleteOpen: boolean;
  authConfirmed: boolean;
};

type NavId = (typeof authCopy.dashboard.sectionOrder)[number]["id"];
type DashboardSection = (typeof authCopy.dashboard.sectionOrder)[number];

const DeleteAccountOverlay = dynamic(
  () => import("@/components/auth/DeleteAccountOverlay").then((mod) => mod.DeleteAccountOverlay),
  { ssr: false },
);

const AccountPanel = dynamic(
  () => import("@/components/auth/account-panels/AccountPanel").then((mod) => mod.AccountPanel),
  {
    loading: () => <PanelLoadingCard title="Loading account" />,
  },
);

const PricingPanel = dynamic(
  () => import("@/components/auth/account-panels/PricingPanel").then((mod) => mod.PricingPanel),
  {
    loading: () => <PanelLoadingCard title="Loading pricing" />,
  },
);

const SettingsPanel = dynamic(
  () => import("@/components/auth/account-panels/SettingsPanel").then((mod) => mod.SettingsPanel),
  {
    loading: () => <PanelLoadingCard title="Loading settings" />,
  },
);

const dashboardCopy = authCopy.dashboard;

const SECTION_ICONS: Record<NavId, React.ElementType> = {
  account: UserRound,
  api: Cpu,
  pricing: Crown,
  settings: Settings2,
};

const NAV_ACTIVE: Array<DashboardSection & { icon: React.ElementType }> = dashboardCopy.sectionOrder.map((section) => ({
  ...section,
  icon: SECTION_ICONS[section.id],
}));

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
const NAV_PRIMARY = NAV_VISIBLE.filter((section) => section.id !== "api");

const NAV_SOON = [
  { icon: Cpu, label: "API Beta" },
  { icon: Globe, label: "Reports" },
  { icon: Sparkles, label: "Security" },
  { icon: Sparkles, label: "AI insights" },
  { icon: Layers, label: "Deployments" },
];

const SECTION_HREFS: Record<Exclude<NavId, "api">, string> = {
  account: "/account",
  pricing: "/account?section=pricing",
  settings: "/account?section=settings",
};

function titleCase(value: string) {
  return value
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
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
          fontFamily: FONT_SANS,
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
            fontFamily: FONT_SANS,
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

function renderPanel({
  active,
  user,
  emailConfirmed,
  onSignOut,
  onConnectExtension,
  showConnectAction = true,
  onOpenDelete,
  account,
  onAccountUpdated,
}: {
  active: Exclude<NavId, "api">;
  user: DashboardUser;
  emailConfirmed: boolean;
  onSignOut: () => void;
  onConnectExtension: () => void;
  showConnectAction?: boolean;
  onOpenDelete: () => void;
  account: AccountDashboardSnapshot;
  onAccountUpdated: (account: AccountDashboardSnapshot) => void;
}) {
  // Only one dashboard panel is visible at a time, so the heavy panel modules
  // stay split until the matching section is actually opened.
  switch (active) {
    case "pricing":
      return <PricingPanel user={user} onAccountUpdated={onAccountUpdated} />;
    case "settings":
      return <SettingsPanel onOpenDelete={onOpenDelete} />;
    case "account":
    default:
      return (
        <AccountPanel
          user={user}
          account={account}
          emailConfirmed={emailConfirmed}
          onSignOut={onSignOut}
          onConnectExtension={onConnectExtension}
          showConnectAction={showConnectAction}
          onAccountUpdated={onAccountUpdated}
        />
      );
  }
}

export function AccountPageClient({
  provider,
  emailConfirmed,
  account,
  initialSection,
  initialDeleteOpen,
  authConfirmed,
}: AccountPageClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [accountState, setAccountState] = useState(account);
  const [active, setActive] = useState<Exclude<NavId, "api">>(initialSection);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(initialDeleteOpen);
  const [isPending, startTransition] = useTransition();

  const user = useMemo<DashboardUser>(() => {
    const baseName = accountState.username
      ? titleCase(accountState.username)
      : accountState.email
        ? titleCase(accountState.email.split("@")[0] ?? "Metis User")
        : "Metis User";

    return {
      name: baseName,
      email: accountState.email,
      plan: accountState.tier,
      isBeta: accountState.isBeta,
      scansUsed: accountState.scansUsed,
      sitesTracked: accountState.sitesTracked,
      periodStart: accountState.periodStart,
      periodEnd: accountState.periodEnd,
      provider,
    };
  }, [accountState.email, accountState.isBeta, accountState.periodEnd, accountState.periodStart, accountState.scansUsed, accountState.sitesTracked, accountState.tier, accountState.username, provider]);

  useEffect(() => {
    setAccountState(account);
  }, [account]);

  useEffect(() => {
    setActive(initialSection);
  }, [initialSection]);

  useEffect(() => {
    setDeleteOpen(initialDeleteOpen);
  }, [initialDeleteOpen]);

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
    if (deleteOpen) {
      setDeleteOpen(false);
    }
    router.push(SECTION_HREFS[id]);
  }

  function handleSignOut() {
    startTransition(async () => {
      await supabase.auth.signOut();
      router.replace("/sign-in");
    });
  }

  function handleConnectExtension() {
    setActive("settings");
    setIsMobileNavOpen(false);
    if (deleteOpen) {
      setDeleteOpen(false);
    }
    router.push("/account/settings?source=extension");
  }

  function openDeleteOverlay() {
    setActive("settings");
    setDeleteOpen(true);
  }

  function closeDeleteOverlay() {
    setDeleteOpen(false);
    router.replace(SECTION_HREFS[active]);
  }

  const activeSection = NAV_ACTIVE.find((section) => section.id === active) ?? NAV_ACTIVE[0];

  const navigationContent = (
    <>
      <div style={{ padding: "20px 6px 16px", marginBottom: 12, borderBottom: `1px solid ${BD_SOFT}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(220,94,94,0.28)" }}>
            <span style={{ fontFamily: FONT_SERIF, fontSize: 16, color: "white", lineHeight: 1 }}>M</span>
          </div>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 17, letterSpacing: "-0.02em", color: TXT }}>{dashboardCopy.brandLabel}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_PRIMARY.map((section) => (
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
        <p style={{ margin: 0, marginBottom: 8, fontFamily: FONT_SANS, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TXT_FAINT }}>
          {dashboardCopy.moreSectionsLabel}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_SOON.map((item) => (
          <NavLink key={item.label} icon={item.icon} label={item.label} soon />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ borderTop: `1px solid ${BD_SOFT}`, paddingTop: 12, marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 12,
            border: `1px solid ${BD}`,
            background: BG_CARD_2,
            padding: "10px 12px",
            marginBottom: 10,
          }}
        >
          <Avatar user={user} size={30} fontSize={12} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT_SANS,
                fontSize: 12,
                fontWeight: 600,
                color: TXT,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: FONT_SANS, fontSize: 10, color: TXT_FAINT }}>
              {formatTierLabel(user.plan, user.isBeta)}
            </p>
          </div>
        </div>
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
          <span style={{ fontFamily: FONT_SANS, fontSize: 13 }}>{dashboardCopy.backToSiteLabel}</span>
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
        overflow: "hidden",
        background: "#090b10",
        color: TXT,
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

      <main style={{ minWidth: 0, overflowY: "auto", flex: 1 }}>
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
              background: "#090b10ee",
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
            <div>
              <p style={{ margin: 0, fontFamily: FONT_SERIF, fontSize: 18, letterSpacing: "-0.01em", color: TXT }}>{activeSection.label}</p>
              <p style={{ margin: "2px 0 0", fontFamily: FONT_SANS, fontSize: 11, color: TXT_FAINT }}>{activeSection.subtitle}</p>
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
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
            {renderPanel({
              active,
              user,
              emailConfirmed,
              onSignOut: handleSignOut,
              onConnectExtension: handleConnectExtension,
              showConnectAction: !isMobileViewport,
              onOpenDelete: openDeleteOverlay,
              account: accountState,
              onAccountUpdated: setAccountState,
            })}
            </motion.div>
          </AnimatePresence>

          {!emailConfirmed ? (
            <div
              style={{
                marginTop: 12,
                borderRadius: 12,
                border: `1px solid ${DANGER_BD}`,
                background: DANGER_DIM,
                padding: "12px 14px",
                color: "#ffb8b8",
                fontFamily: FONT_SANS,
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {dashboardCopy.unverifiedBody}
            </div>
          ) : null}

          {isPending ? <div style={{ marginTop: 12, fontFamily: FONT_SANS, fontSize: 12, color: TXT_FAINT }}>Updating session…</div> : null}
          </div>
      </main>

      {deleteOpen ? (
        <DeleteAccountOverlay
          email={accountState.email}
          username={accountState.username}
          authConfirmed={authConfirmed}
          onClose={closeDeleteOverlay}
        />
      ) : null}
    </motion.div>
  );
}
