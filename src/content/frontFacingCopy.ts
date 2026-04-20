export type SeverityLevel = "critical" | "moderate" | "low";

export type MockIssue = {
  title: string;
  severity: SeverityLevel;
  color: string;
  saving: number;
};

export const siteLinks = {
  wardStudioUrl: "https://zward.studio",
  repoUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
  waitlistUrl: "/account?section=pricing",
  accountUrl: "/account",
  privacyUrl: "/privacy",
  termsUrl: "/terms",
} as const;

export const frontFacingCopy = {
  brand: {
    name: "Metis",
    footerTagline: "Cost intelligence for the modern web.",
    footerSubline: "A browser extension and reporting layer by zward.studio.",
    footerCopyright: "© 2026 zward.studio",
  },
  nav: {
    sections: [
      { key: "product", label: "Product" },
      { key: "problem", label: "Problem" },
      { key: "fixes", label: "Fixes" },
      { key: "solution", label: "Solution" },
    ],
    primaryCta: "Try free",
    returningCta: "Open Metis Dash",
  },
  mockup: {
    title: "Metis Scan",
    subtitle: "metis.zward.studio · just now",
    scoreLabel: "Cost Risk Score",
    insightEmpty: "All issues resolved",
    sessionCostLabel: "Session cost",
    liveSampleLabel: "Live · 3 pages sampled · metis.zward.studio",
    scaleProjectionLabel: "At 10k users →",
    monthlyWastePrefix: "~",
    monthlyWasteSuffix: "/month est. waste",
    issuesLabel: {
      withIssues: (count: number) => `${count} Issues · By Severity`,
      empty: "No Issues Detected",
    },
    supportingCopy: "View detected issues, estimated cost impact, and where to focus first.",
    reportCta: "Open Full Report",
    returningReportCta: "Open Metis Dash",
    monthlyWasteLabel: (min: number, max: number) => `~$${min}–$${max}/month est. waste`,
    monthlyProjectionValue: (min: number) => `~$${(min * 10).toLocaleString()}/month`,
  },
  hero: {
    quote: "Find what makes your app expensive before it scales",
    supportingLine: "Run a scan and see where your app starts getting expensive.",
    returningSupportingLine: "Continue where you left off and review your latest scan.",
    ctas: {
      primary: "Start for free",
      returningPrimary: "Open Metis Dash",
      secondary: "Watch a scan",
    },
    scrollNudge: "keep going",
  },
  product: {
    tag: "Product",
    heading: "The cost layer your frontend never had",
    body:
      "Metis stays calm on the page and serious in the report. It shows what most profilers miss: what those requests mean in real cost.",
    features: [
      {
        icon: "activity",
        title: "Hover-first workflow",
        desc: "Metis stays light on the page, then opens the side panel when you want more context.",
      },
      {
        icon: "trendingDown",
        title: "Cost and control",
        desc: "It frames waste in plain language: what costs money now, what gets worse as you scale, and what to fix first.",
      },
      {
        icon: "zap",
        title: "Stack-aware signals",
        desc: "Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic.",
      },
      {
        icon: "shield",
        title: "Built for real teams",
        desc: "The website handles account and beta access. The extension stays focused on scans, scores, and reports.",
      },
    ],
  },
  problem: {
    tag: "The Problem",
    heading: "Your frontend is bleeding money every session",
    body:
      "Extra requests, noisy third-party scripts, and AI-heavy interactions add up quietly. Metis makes that cost visible before it turns into cleanup work.",
    stats: [
      { value: "24", unit: "avg", label: "API calls per page load" },
      { value: "3.2", unit: "MB", label: "avg payload per session" },
      { value: "$0.004", unit: "", label: "avg session cost, unoptimised" },
      { value: "86%", unit: "", label: "of teams don't know their frontend cost" },
    ],
    issueSummaryLabel: "5 issues detected · High Risk",
    issues: [
      { title: "Duplicate API Requests, 8× per load", severity: "critical", color: "#ef4444" },
      { title: "Memory leak in 3 components", severity: "critical", color: "#ef4444" },
      { title: "OpenAI called on every keystroke", severity: "moderate", color: "#f97316" },
      { title: "3 images over 2MB with no WebP conversion", severity: "moderate", color: "#f97316" },
      { title: "Static assets without Cache-Control headers", severity: "low", color: "#eab308" },
    ],
  },
  fixes: {
    tag: "How it fixes it",
    heading: "Here's exactly what to fix",
    body:
      "No vague advice. You get ranked fixes, clear explanations, and a report built for how engineering teams actually work.",
    rootCauseLabel: "Root Cause",
    fixLabel: "Fix",
    fixFirstLabel: "Fix First",
    saveLabel: (saving: number) => `Save ~$${saving}/mo`,
    items: [
      {
        rank: 1,
        title: "Duplicate API Requests",
        color: "#ef4444",
        saving: 8,
        rootCause: "Multiple components trigger the same fetch independently on mount with no deduplication.",
        fix: "Add SWR or React Query with a shared cache key. Concurrent callers share one in-flight request.",
      },
      {
        rank: 2,
        title: "AI API Call Frequency",
        color: "#f97316",
        saving: 11,
        rootCause: "AI completion handler fires on onChange with no debounce. Each keystroke triggers one API call.",
        fix: "Debounce by 400ms with useDebouncedCallback. Cache identical prompts with a simple Map for 5 min.",
      },
      {
        rank: 3,
        title: "Memory Leak Pattern",
        color: "#ef4444",
        saving: 5,
        rootCause: "useEffect hooks add event listeners but return no cleanup function.",
        fix: "Return cleanup from each useEffect: return () => window.removeEventListener(...). Use AbortController for fetch.",
      },
    ],
  },
  solution: {
    tag: "The result",
    heading: ["Start free", "Fix in minutes"],
    body:
      "Start with a scan. Go deeper through Plus Beta and staged features when you need more.",
    checklist: [
      "Score any running page in under 2 seconds",
      "See exactly what's costing you, per session",
      "Get ranked code fixes with savings estimates",
      "Keep account settings on the website and extension settings in the extension",
    ],
    resultCaption: "Minimal Risk",
    primaryCta: "Get early access",
    returningPrimaryCta: "Open Metis Dash",
    secondaryNote: "",
  },
  footer: {
    badge: "Beta Access",
    heading: ["Get early access.", "Free, always."],
    body:
      "Basic scans work without an account. Create one when you want saved setup, account sync, and access to Metis+ Beta when it opens.",
    emailPlaceholder: "you@company.com",
    submitLabel: "Try Metis+ Beta",
    successMessage: "Metis+ Beta is now enabled for this account.",
    links: [
      { label: "zward.studio", href: siteLinks.wardStudioUrl, icon: "externalLink" },
      { label: "GitHub", href: siteLinks.repoUrl, icon: "github" },
      { label: "Get early access", href: siteLinks.waitlistUrl, icon: "externalLink" },
      { label: "Privacy", href: siteLinks.privacyUrl, icon: null },
      { label: "Terms", href: siteLinks.termsUrl, icon: null },
    ],
    stackBadges: ["Next.js", "React", "Python", "TypeScript"],
  },
  auth: {
    signIn: {
      eyebrow: "Protected access",
      title: "Sign in to Metis",
      intro:
        "Sign in on the website to manage your account, security, and beta access. The extension stays focused on scans and reports.",
    },
    signUp: {
      eyebrow: "Early access",
      title: "Create your Metis account",
      intro:
        "Create your account on the website, accept the terms there, and move into setup before opening the extension.",
    },
    stack: [
      { title: "Auth today", body: "Google, GitHub, and magic link all start on the website." },
      { title: "Account settings", body: "Billing, beta access, and security settings stay on the website." },
      { title: "Extension role", body: "The extension stays focused on scanning, reporting, and local controls." },
    ],
    backToSite: "Back to the site",
    needAccount: "Need an account?",
    alreadyHaveAccess: "Already have access?",
  },
  legal: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy policy",
      lastUpdated: "April 19th, 2026",
      intro:
        "Metis is a website and browser-extension product designed to help users understand cost-risk patterns in websites and web applications.",
      sections: [
        {
          title: "1. Information Metis uses",
          paragraphs: [
            "Metis may use information you provide directly, information needed to operate authentication and account access, and product data required to run the service.",
          ],
          bullets: [
            "account profile information such as email address, username, and account identifiers",
            "authentication-related information used to sign you in and protect access to your account",
            "onboarding answers, account settings, and beta-access status",
            "usage counters, connected-account state, and extension bridge state needed to keep the website and extension consistent",
            "product interaction data needed to operate core features, security controls, and support flows",
          ],
        },
        {
          title: "2. Sign-in providers",
          paragraphs: [
            "Metis may allow sign-in through third-party authentication providers such as Google, GitHub, or email-based sign-in.",
            "If you sign in through a provider, Metis may receive basic account information that the provider makes available to the application, such as your email address, display name, profile image, and provider identifier, depending on the provider and permissions granted.",
            "Metis uses this information to:",
          ],
          bullets: [
            "create or access your account",
            "authenticate you",
            "protect account access",
            "manage settings and connected-account state",
            "operate beta access and account recovery flows",
            "support the website-to-extension connection flow",
          ],
        },
        {
          title: "3. Email address use",
          paragraphs: [
            "If your sign-in method provides an email address, Metis may use that email address to:",
          ],
          bullets: [
            "identify your account",
            "send sign-in links or security notices",
            "communicate about account access or account changes",
            "manage beta access, product access, or recovery flows",
          ],
          trailing:
            "Metis does not treat access to your provider email address as permission to send unrelated marketing without notice.",
        },
        {
          title: "4. Website and extension behavior",
          paragraphs: [
            "Metis uses the website to manage sign-in, onboarding, account settings, beta access, and security controls.",
            "The website may store account profile data, onboarding answers, usage counters, and connected-account state needed to keep the website and extension bridge coherent.",
            "The browser extension remains local-first for scan behavior in this phase unless a feature explicitly says data is being sent or saved.",
          ],
        },
        {
          title: "5. Data use expectations",
          paragraphs: [
            "Metis does not position hidden tracking, silent resale of personal information, or surprise data sharing as part of the product strategy.",
            "If debugging text, bridge diagnostics, or beta surfaces appear in the product, they are there to explain system state to the user, not to expand data collection without notice.",
          ],
        },
        {
          title: "6. Security and account protection",
          paragraphs: [
            "Metis uses reasonable measures to protect account access, authentication state, and product operation. No system can guarantee absolute security or uninterrupted availability.",
            "Users remain responsible for maintaining access to their sign-in method and for activity under their account.",
          ],
        },
        {
          title: "7. Product changes",
          paragraphs: [
            "Metis is an evolving product. Features, beta access, account flows, and connected-extension behavior may change as the service develops.",
          ],
        },
        {
          title: "8. Contact",
          paragraphs: ["For privacy or account questions, contact: [your email]"],
        },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of use",
      lastUpdated: "Month Day, Year",
      intro:
        "These Terms govern your use of the Metis website, account surface, and browser-extension product.",
      sections: [
        {
          title: "1. Product status",
          paragraphs: [
            "Metis is provided as a developing website, account surface, and browser-extension product. Features, beta access, legal copy, security controls, and availability may change as the product evolves.",
          ],
        },
        {
          title: "2. Accounts and authentication",
          paragraphs: [
            "You may access Metis using supported sign-in methods, including third-party providers and email-based sign-in.",
            "By using provider-based sign-in, you authorize Metis to receive and use the account information made available through that provider as needed to authenticate you, operate your account, support account security, and run the service.",
            "You are responsible for activity under your account and for maintaining access to the sign-in method you use.",
          ],
        },
        {
          title: "3. Acceptable use",
          paragraphs: ["You agree not to:"],
          bullets: [
            "misuse the website or extension",
            "interfere with authentication, account security, or connected-account flows",
            "attempt to bypass beta access controls or entitlement checks",
            "scrape, probe, or abuse protected routes or protected product surfaces",
            "use the service in a way that harms the product, its operators, or other users",
          ],
        },
        {
          title: "4. Beta access and feature availability",
          paragraphs: [
            "Metis Free and Metis+ Beta may have different capabilities and access rules.",
            "Signing in does not automatically grant access to every feature. Access to beta surfaces, expanded reports, API Beta, and related functionality may depend on website-validated account state and may change as the product evolves.",
          ],
        },
        {
          title: "5. Diagnostic nature of the product",
          paragraphs: [
            "Metis is a diagnostic and estimation tool. Reports, cost signals, and related outputs are directional and should not be treated as guarantees of technical outcomes, financial outcomes, or exact future costs.",
          ],
        },
        {
          title: "6. No guarantees",
          paragraphs: [
            "Unless a separate commercial agreement says otherwise, the site and service are offered without guarantees of uninterrupted availability, exact financial outcomes, or permanent feature availability.",
            "The extension, website account features, bridge flows, and beta surfaces should be treated as released only when the product explicitly says they are live.",
          ],
        },
        {
          title: "7. Suspension or removal",
          paragraphs: [
            "Metis may limit, suspend, or remove access where necessary to protect the product, enforce these Terms, respond to abuse, or maintain security.",
          ],
        },
        {
          title: "8. Changes",
          paragraphs: [
            "These Terms may be updated as the product evolves. Continued use of Metis after updates means you accept the revised Terms.",
          ],
        },
        {
          title: "9. Contact",
          paragraphs: ["For legal or account questions, contact: [your email]"],
        },
      ],
    },
    backLink: "Back to Metis",
  },
} as const;

export const mockupStates = {
  hero: {
    score: 72,
    riskLabel: "Moderate Risk",
    riskColor: "#f97316",
    riskBg: "rgba(249,115,22,0.2)",
    quickInsight: "High request count and AI usage detected",
    costMin: 22,
    costMax: 40,
    sessionCost: "$0.0042",
    issues: [
      { title: "Duplicate API Requests", severity: "critical", color: "#ef4444", saving: 8 },
      { title: "Memory Leak Pattern", severity: "critical", color: "#ef4444", saving: 5 },
      { title: "AI API Call Frequency", severity: "moderate", color: "#f97316", saving: 11 },
    ] satisfies MockIssue[],
  },
  product: {
    score: 68,
    riskLabel: "Moderate Risk",
    riskColor: "#f97316",
    riskBg: "rgba(249,115,22,0.2)",
    quickInsight: "Moderate cost inefficiencies across 5 issues",
    costMin: 18,
    costMax: 34,
    sessionCost: "$0.0038",
    issues: [
      { title: "Duplicate API Requests", severity: "critical", color: "#ef4444", saving: 8 },
      { title: "Memory Leak Pattern", severity: "critical", color: "#ef4444", saving: 5 },
      { title: "Unoptimized Images", severity: "moderate", color: "#f97316", saving: 4 },
    ] satisfies MockIssue[],
  },
  problem: {
    score: 88,
    riskLabel: "High Risk",
    riskColor: "#ef4444",
    riskBg: "rgba(239,68,68,0.2)",
    quickInsight: "Severe API overuse and memory pressure detected",
    costMin: 38,
    costMax: 71,
    sessionCost: "$0.0089",
    issues: [
      { title: "Duplicate API Requests", severity: "critical", color: "#ef4444", saving: 8 },
      { title: "Memory Leak Pattern", severity: "critical", color: "#ef4444", saving: 5 },
      { title: "AI API Call Frequency", severity: "moderate", color: "#f97316", saving: 11 },
      { title: "Unoptimized Images", severity: "moderate", color: "#f97316", saving: 4 },
      { title: "Missing Cache Headers", severity: "low", color: "#eab308", saving: 2 },
    ] satisfies MockIssue[],
  },
  fixes: {
    score: 44,
    riskLabel: "Low Risk",
    riskColor: "#eab308",
    riskBg: "rgba(234,179,8,0.2)",
    quickInsight: "2 minor issues remain. Critical issues are already fixed.",
    costMin: 9,
    costMax: 17,
    sessionCost: "$0.0021",
    issues: [
      { title: "AI API Call Frequency", severity: "moderate", color: "#f97316", saving: 11 },
      { title: "Missing Cache Headers", severity: "low", color: "#eab308", saving: 2 },
    ] satisfies MockIssue[],
  },
  solution: {
    score: 24,
    riskLabel: "Minimal Risk",
    riskColor: "#22c55e",
    riskBg: "rgba(34,197,94,0.2)",
    quickInsight: "Site is well optimized. Low cost risk detected.",
    costMin: 3,
    costMax: 7,
    sessionCost: "$0.0008",
    issues: [] satisfies MockIssue[],
  },
} as const;

const totalFixSavings = frontFacingCopy.fixes.items.reduce((sum, item) => sum + item.saving, 0);
const issueCounts = frontFacingCopy.problem.issues.reduce(
  (acc, issue) => {
    acc.total += 1;
    acc[issue.severity] += 1;
    return acc;
  },
  { total: 0, critical: 0, moderate: 0, low: 0 },
);

export const landingAnalysis = {
  totalFixSavings,
  resultScore: mockupStates.solution.score,
  fixesApplied: frontFacingCopy.fixes.items.length,
  issueCounts,
  scoreDelta: mockupStates.problem.score - mockupStates.solution.score,
  resultSummary: `After applying ${frontFacingCopy.fixes.items.length} fixes, $${totalFixSavings}/mo saved`,
  topProblemStat: frontFacingCopy.problem.stats[0],
} as const;
