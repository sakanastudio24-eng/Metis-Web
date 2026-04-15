import Link from "next/link";

import { LandingChromeClient } from "@/components/landing/LandingChromeClient";
import { LandingFooterSignup } from "@/components/landing/LandingFooterSignup";
import { LandingHeroSupport } from "@/components/landing/LandingHeroSupport";
import { LandingPrimaryCta } from "@/components/landing/LandingPrimaryCta";
import { frontFacingCopy, landingAnalysis } from "@/content/frontFacingCopy";

const RED = "#dc5e5e";
const CREAM = "#FFF5F0";
const DARK_BLUE = "#0c1623";
const TEXT_W = "#FFFFFF";
const TEXT_W_DIM = "#FFFFFF";
const TEXT_W_DIM2 = "#FFFFFF";
const TEXT_R = "#dc5e5e";
const TEXT_R_DIM = "rgba(180,50,50,0.6)";
const CARD_BG = "rgba(0,0,0,0.10)";
const CARD_BD = "rgba(255,255,255,0.18)";
const FONT_SANS = "var(--font-sans), sans-serif";
const FONT_SERIF = "var(--font-serif), serif";
const FONT_DISPLAY = "var(--font-display), sans-serif";

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.12)" }} />;
}

function SectionTag({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 12px",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.18)",
        marginBottom: 20,
      }}
    >
      <span
        style={{
          fontFamily: FONT_SANS,
          fontSize: 11,
          fontWeight: 600,
          color: TEXT_W_DIM,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function LandingPage() {
  const copy = frontFacingCopy;

  return (
    <div
      style={{ minHeight: "100vh", position: "relative", background: CREAM }}
    >
      <LandingChromeClient />

      <section
        id="hero"
        className="metis-hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
        }}
      >
        <h1
          className="metis-hero-title"
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "clamp(72px, 12vw, 128px)",
            color: RED,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            margin: 0,
            marginBottom: 28,
          }}
        >
          {copy.brand.name}
        </h1>

        <p
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: "clamp(18px, 2.2vw, 26px)",
            color: TEXT_R_DIM,
            lineHeight: 1.5,
            margin: 0,
            marginBottom: 48,
            maxWidth: 560,
          }}
        >
          &ldquo;{copy.hero.quote}.&rdquo;
        </p>

        <LandingHeroSupport />

        <div
          className="metis-hero-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 52,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <LandingPrimaryCta variant="hero" />
          <a
            href="#product"
            style={{
              background: "rgba(220,94,94,0.08)",
              color: TEXT_R,
              border: "1px solid rgba(220,94,94,0.22)",
              borderRadius: 999,
              padding: "14px 28px",
              fontFamily: FONT_SANS,
              fontSize: 15,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            {copy.hero.ctas.secondary}
          </a>
        </div>

      </section>

      <div
        style={{
          background: RED,
          color: TEXT_W,
          transition: "background 0.5s ease",
        }}
      >
        <div
          className="metis-shell"
          style={{
            maxWidth: 1340,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: 60,
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <section id="product" style={{ padding: "100px 0" }}>
              <Divider />
              <div style={{ paddingTop: 80 }}>
                <SectionTag>{copy.product.tag}</SectionTag>
                <h2
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "clamp(36px, 4.5vw, 56px)",
                    color: TEXT_W,
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                    margin: 0,
                    marginBottom: 16,
                    maxWidth: 560,
                  }}
                >
                  {copy.product.heading}
                </h2>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    color: TEXT_W_DIM,
                    lineHeight: 1.6,
                    margin: 0,
                    marginBottom: 56,
                    maxWidth: 480,
                  }}
                >
                  {copy.product.body}
                </p>
                <div
                  className="metis-grid-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                  }}
                >
                  {copy.product.features.map(({ title, desc }) => (
                    <div
                      key={title}
                      style={{
                        background: CARD_BG,
                        border: `1px solid ${CARD_BD}`,
                        borderRadius: 16,
                        padding: 24,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 15,
                          fontWeight: 700,
                          color: TEXT_W,
                          margin: 0,
                          marginBottom: 8,
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 13,
                          color: TEXT_W_DIM,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="problem" style={{ padding: "100px 0" }}>
              <Divider />
              <div style={{ paddingTop: 80 }}>
                <SectionTag>{copy.problem.tag}</SectionTag>
                <h2
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "clamp(36px, 4.5vw, 56px)",
                    color: TEXT_W,
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                    margin: 0,
                    marginBottom: 16,
                    maxWidth: 580,
                  }}
                >
                  {copy.problem.heading}
                </h2>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    color: TEXT_W_DIM,
                    lineHeight: 1.65,
                    margin: 0,
                    marginBottom: 56,
                    maxWidth: 520,
                  }}
                >
                  {copy.problem.body}
                </p>
                <div
                  className="metis-grid-2-tight"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 12,
                    marginBottom: 48,
                  }}
                >
                  {copy.problem.stats.map(({ value, unit, label }) => (
                    <div
                      key={label}
                      style={{
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 14,
                        padding: "20px 22px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 4,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 32,
                            color: TEXT_W,
                            lineHeight: 1,
                          }}
                        >
                          {value}
                        </span>
                        {unit ? (
                          <span
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 14,
                              color: TEXT_W_DIM,
                            }}
                          >
                            {unit}
                          </span>
                        ) : null}
                      </div>
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 12,
                          color: TEXT_W_DIM2,
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="fixes" style={{ padding: "100px 0" }}>
              <Divider />
              <div style={{ paddingTop: 80 }}>
                <SectionTag>{copy.fixes.tag}</SectionTag>
                <h2
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "clamp(36px, 4.5vw, 56px)",
                    color: TEXT_W,
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                    margin: 0,
                    marginBottom: 16,
                    maxWidth: 540,
                  }}
                >
                  {copy.fixes.heading}
                </h2>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    color: TEXT_W_DIM,
                    lineHeight: 1.65,
                    margin: 0,
                    marginBottom: 52,
                    maxWidth: 480,
                  }}
                >
                  {copy.fixes.body}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {copy.fixes.items.map(
                    ({ rank, title, color, saving, rootCause, fix }) => (
                      <div
                        key={title}
                        style={{
                          borderRadius: 16,
                          overflow: "hidden",
                          border: `1px solid ${rank === 1 ? color + "55" : color + "25"}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: color + (rank === 1 ? "20" : "12"),
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "white",
                              }}
                            >
                              {title}
                            </span>
                            {rank === 1 ? (
                              <span
                                style={{
                                  borderRadius: 999,
                                  padding: "2px 8px",
                                  background: "rgba(255,215,0,0.15)",
                                  color: "#ffd700",
                                  fontFamily: FONT_SANS,
                                  fontSize: 9,
                                  fontWeight: 700,
                                }}
                              >
                                {copy.fixes.fixFirstLabel}
                              </span>
                            ) : null}
                          </div>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: "6px 12px",
                              background: "rgba(34,197,94,0.18)",
                              color: "#86efac",
                              fontFamily: FONT_SANS,
                              fontSize: 13,
                              fontWeight: 800,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {copy.fixes.saveLabel(saving)}
                          </span>
                        </div>
                        <div
                          style={{
                            padding: "14px 16px 16px",
                            background: "rgba(0,0,0,0.14)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 11,
                                color: "#FFFFFF",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                margin: 0,
                                marginBottom: 6,
                                fontWeight: 700,
                              }}
                            >
                              {copy.fixes.rootCauseLabel}
                            </p>
                            <p
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 13,
                                color: "#FFFFFF",
                                lineHeight: 1.65,
                                margin: 0,
                              }}
                            >
                              {rootCause}
                            </p>
                          </div>
                          <div
                            style={{
                              borderRadius: 10,
                              padding: "10px 12px",
                              background: "rgba(255,255,255,0.04)",
                              borderLeft: `3px solid ${color}`,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 11,
                                color,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                margin: 0,
                                marginBottom: 6,
                                fontWeight: 700,
                              }}
                            >
                              {copy.fixes.fixLabel}
                            </p>
                            <p
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 13,
                                color: "#FFFFFF",
                                lineHeight: 1.65,
                                margin: 0,
                              }}
                            >
                              {fix}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>

            <section id="solution" style={{ padding: "100px 0 80px" }}>
              <Divider />
              <div style={{ paddingTop: 80 }}>
                <SectionTag>{copy.solution.tag}</SectionTag>
                <h2
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "clamp(36px, 5vw, 64px)",
                    color: TEXT_W,
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    margin: 0,
                    marginBottom: 20,
                    maxWidth: 560,
                  }}
                >
                  {copy.solution.heading[0]}
                  <br />
                  {copy.solution.heading[1]}
                </h2>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    color: TEXT_W_DIM,
                    lineHeight: 1.65,
                    margin: 0,
                    marginBottom: 44,
                    maxWidth: 460,
                  }}
                >
                  {copy.solution.body}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 44,
                  }}
                >
                  {copy.solution.checklist.map((item) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "rgba(34,197,94,0.15)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: "#4ade80",
                            fontFamily: FONT_SANS,
                            fontSize: 12,
                          }}
                        >
                          ✓
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 14,
                          color: TEXT_W_DIM,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 20,
                    borderRadius: 18,
                    padding: "18px 24px",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    marginBottom: 40,
                  }}
                >
                  <svg
                    width={60}
                    height={60}
                    viewBox="0 0 60 60"
                    style={{ flexShrink: 0 }}
                  >
                    <circle
                      cx={30}
                      cy={30}
                      r={23}
                      fill="none"
                      stroke="rgba(34,197,94,0.15)"
                      strokeWidth={5}
                    />
                    <circle
                      cx={30}
                      cy={30}
                      r={23}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth={5}
                      strokeDasharray={2 * Math.PI * 23}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        23 *
                        (1 - landingAnalysis.resultScore / 100)
                      }
                      strokeLinecap="round"
                      transform="rotate(-90 30 30)"
                    />
                    <text
                      x={30}
                      y={30}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={14}
                      fontFamily={FONT_DISPLAY}
                    >
                      {landingAnalysis.resultScore}
                    </text>
                  </svg>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_DISPLAY,
                          fontSize: 28,
                          color: TEXT_W,
                          lineHeight: 1,
                        }}
                      >
                        {landingAnalysis.resultScore}
                      </span>
                      <span
                        style={{
                          borderRadius: 999,
                          padding: "4px 12px",
                          background: "rgba(34,197,94,0.2)",
                          color: "#22c55e",
                          fontFamily: FONT_SANS,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {copy.solution.resultCaption}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 13,
                        color: TEXT_W_DIM,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {landingAnalysis.resultSummary}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="metis-sticky-rail">
            <div className="metis-sticky-card">
              <LandingChromeClient mockupOnly />
            </div>
          </div>
        </div>
      </div>

      <footer
        style={{
          background: DARK_BLUE,
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(220,94,94,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.05) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            maxWidth: 1340,
            margin: "0 auto",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="metis-footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: "4px 12px",
                  background: "rgba(220,94,94,0.15)",
                  border: "1px solid rgba(220,94,94,0.25)",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: RED,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    fontWeight: 600,
                    color: RED,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {copy.footer.badge}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  color: CREAM,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  margin: 0,
                  marginBottom: 14,
                }}
              >
                {copy.footer.heading[0]}
                <br />
                {copy.footer.heading[1]}
              </h2>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 16,
                  color: "#FFFFFF",
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: 36,
                  maxWidth: 400,
                }}
              >
                {copy.footer.body}
              </p>

              <LandingFooterSignup />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: RED,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: 22,
                        color: "white",
                        lineHeight: 1,
                      }}
                    >
                      M
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: 24,
                      color: CREAM,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {copy.brand.name}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#FFFFFF",
                    margin: 0,
                    lineHeight: 1.6,
                    maxWidth: 420,
                  }}
                >
                  {copy.brand.footerTagline}
                  <br />
                  {copy.brand.footerSubline}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {copy.footer.links.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: FONT_SANS,
                      fontSize: 14,
                      color: "#FFFFFF",
                      textDecoration: "none",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                {copy.brand.footerCopyright}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
