"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Crown } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import {
  ACCENT,
  ACCENT_BD,
  Badge,
  BD,
  BG_CARD,
  Card,
  FONT_SANS,
  FONT_SERIF,
  GREEN,
  PanelFrame,
  TXT,
  TXT_DIM,
  TXT_FAINT,
  type DashboardUser,
} from "@/components/auth/account-panels/shared";

type PricingPanelProps = {
  user: DashboardUser;
};

export function PricingPanel({ user }: PricingPanelProps) {
  const copy = authCopy.dashboard.pricing;
  const plans = copy.plans.map((plan) => ({
    ...plan,
    current: user.plan === plan.id || (user.plan === "paid" && plan.id === "plus_beta"),
  }));

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
              background: plan.highlight ? `linear-gradient(155deg, rgba(220,94,94,0.1) 0%, ${BG_CARD} 65%)` : BG_CARD,
              padding: "24px 22px",
            }}
          >
            {plan.highlight ? <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} /> : null}

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: plan.highlight ? ACCENT : TXT_DIM }}>{plan.name}</p>
                {plan.highlight ? (
                  <Badge>
                    <Crown size={10} />
                    Beta
                  </Badge>
                ) : null}
              </div>
              {plan.price ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontFamily: FONT_SERIF, fontSize: 36, letterSpacing: "-0.03em", color: TXT }}>{plan.price}</span>
                  <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: TXT_DIM }}>{plan.period}</span>
                </div>
              ) : null}
              <p style={{ margin: "8px 0 0", fontFamily: FONT_SANS, fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{plan.desc}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {plan.features.map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={13} style={{ color: plan.highlight ? ACCENT : GREEN, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: TXT_DIM }}>{feature}</span>
                </div>
              ))}
              {plan.missing.map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <AlertTriangle size={13} style={{ color: TXT_FAINT, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: TXT_FAINT }}>{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              style={{
                width: "100%",
                borderRadius: 11,
                border: plan.current ? `1px solid ${BD}` : "none",
                background: plan.highlight ? ACCENT : "#13161f",
                padding: "11px 0",
                color: plan.highlight ? "white" : plan.current ? TXT_FAINT : TXT,
                fontFamily: FONT_SANS,
                fontSize: 13,
                fontWeight: 700,
                cursor: plan.current ? "default" : "pointer",
                boxShadow: plan.highlight ? "0 12px 28px rgba(220,94,94,0.25)" : "none",
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
              <p style={{ margin: 0, marginBottom: 6, fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: TXT }}>{item.q}</p>
              <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 12, color: TXT_DIM, lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </PanelFrame>
  );
}
