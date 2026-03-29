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
  waitlistUrl: "/sign-in",
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
    monthlyWasteLabel: (min: number, max: number) => `~$${min}–$${max}/month est. waste`,
    monthlyProjectionValue: (min: number) => `~$${(min * 10).toLocaleString()}/month`,
  },
  hero: {
    quote: ["Every session has a price.", "Most teams never see the bill."],
    ctas: {
      primary: "Start for free",
      secondary: "Watch a scan",
    },
    stats: [
      { value: "< 2s", label: "time to first signal" },
      { value: "5+", label: "pages sampled in a live run" },
      { value: "$0", label: "to understand the first report" },
    ],
    scrollNudge: "keep going",
  },
  product: {
    tag: "Product",
    heading: "The cost layer your frontend never had",
    body:
      "Metis was designed to feel calm on the page and serious in the report. It catches what a normal profiler rarely explains: what those requests mean for real spend.",
    features: [
      {
        icon: "activity",
        title: "Hover-first workflow",
        desc: "Metis stays lightweight on the page, then opens the deeper workspace in the browser side panel when you want context.",
      },
      {
        icon: "trendingDown",
        title: "Cost and control",
        desc: "The product frames waste in plain language: what costs money now, what scales badly later, and what deserves attention first.",
      },
      {
        icon: "zap",
        title: "Stack-aware signals",
        desc: "Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic.",
      },
      {
        icon: "shield",
        title: "Built for real teams",
        desc: "The website explains the product cleanly while the extension stays focused on scanning, scoring, and the side-panel workspace.",
      },
    ],
  },
  problem: {
    tag: "The Problem",
    heading: "Your frontend is bleeding money every session",
    body:
      "Unoptimised requests, noisy third-party scripts, and AI-heavy interactions compound quietly. Metis exists to make that waste legible before it becomes a postmortem.",
    stats: [
      { value: "24", unit: "avg", label: "API calls per page load" },
      { value: "3.2", unit: "MB", label: "avg payload per session" },
      { value: "$0.004", unit: "", label: "avg session cost, unoptimised" },
      { value: "86%", unit: "", label: "of teams don't know their frontend cost" },
    ],
    issueSummaryLabel: "5 issues detected · High Risk",
    issues: [
      { title: "Duplicate API Requests — 8× per load", severity: "critical", color: "#ef4444" },
      { title: "Memory leak in 3 components", severity: "critical", color: "#ef4444" },
      { title: "OpenAI called on every keystroke", severity: "moderate", color: "#f97316" },
      { title: "3 images over 2MB — no WebP conversion", severity: "moderate", color: "#f97316" },
      { title: "Static assets without Cache-Control headers", severity: "low", color: "#eab308" },
    ],
  },
  fixes: {
    tag: "How it fixes it",
    heading: "Here's exactly what to fix",
    body:
      "Not vague advice. The product direction is clear: ranked fixes, grounded explanations, and a report that respects how engineering teams actually work.",
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
        rootCause: "AI completion handler fires on onChange with no debounce — each keystroke = one API call.",
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
      "Install Metis, open a page, and get a clear read on where cost pressure starts. The website handles the story. The extension handles the scan.",
    checklist: [
      "Score any running page in under 2 seconds",
      "See exactly what's costing you, per session",
      "Get ranked code fixes with savings estimates",
      "Free to start, with room for Plus-style team workflows later",
    ],
    resultCaption: "Minimal Risk",
    primaryCta: "Get early access",
    secondaryNote: "",
  },
  footer: {
    badge: "Beta Access",
    heading: ["Get early access.", "Free, always."],
    body:
      "Join the list and be first to hear when Metis opens up deeper auth flows, team-ready reports, and polished release builds.",
    emailPlaceholder: "you@company.com",
    submitLabel: "Join beta",
    successMessage: "You're on the list. We'll be in touch.",
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
        "This screen is ready for the real auth pass. For now, it shows the shape of the product entry flow without pretending the credentials layer is finished.",
    },
    signUp: {
      eyebrow: "Early access",
      title: "Create your Metis account",
      intro:
        "This is the first stop for the future Google and email/password signup flow. The page is intentionally honest: the account system is planned, not switched on yet.",
    },
    stack: [
      { title: "Planned providers", body: "Google OAuth and email/password" },
      { title: "Secret delivery", body: "1Password runtime injection with strict env validation" },
      { title: "Backend pairing", body: "Next.js session layer with FastAPI-protected product routes" },
    ],
    backToSite: "Back to the site",
    needAccount: "Need an account?",
    alreadyHaveAccess: "Already have access?",
  },
  legal: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy policy",
      paragraphs: [
        "Metis respects the difference between explaining a product and quietly collecting data. This website does not ask visitors for account details unless they choose to use the sign in or sign up flow, and it does not present itself as a live analytics dashboard.",
        "If you contact Metis, join a waitlist, or create access through the auth flow, the information you provide may be used to respond to you, manage access, and improve the service. Metis is not intended to sell personal information or use hidden tracking as a product strategy.",
        "As the authenticated product expands, this policy should be updated to describe what product data is stored, how long it is retained, who can access it, and how deletion requests are handled.",
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of use",
      paragraphs: [
        "Metis is provided as a developing product and website. The material on this site is intended to explain the service clearly, but access, features, and availability may change as the product evolves.",
        "You agree not to misuse the site, interfere with access, attempt to bypass security controls, or use the service in a way that harms the product, its operators, or other users. If authenticated features are enabled, account access remains your responsibility.",
        "Unless a separate commercial agreement says otherwise, the site and service are offered without guarantees of uninterrupted availability. The source code in this repository is available under the MIT license included at the repo root.",
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
    quickInsight: "2 minor issues remain — fixes applied to critical items",
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
    quickInsight: "Site is well-optimized — low cost risk detected",
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
  resultSummary: `After applying ${frontFacingCopy.fixes.items.length} fixes — $${totalFixSavings}/mo saved`,
  topProblemStat: frontFacingCopy.problem.stats[0],
} as const;
