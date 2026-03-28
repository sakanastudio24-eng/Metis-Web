# Master Copy

This document is the readable source of truth for the current user-facing copy in Metis Web.

It captures website copy, auth copy, legal copy, mockup labels, success messages, and mapped error responses. The implementation source of truth still lives in the content and helper files, but this document is the editorial handoff version.

## Landing Page

### Brand

- Name: `Metis`
- Footer tagline: `Cost intelligence for the modern web.`
- Footer subline: `A browser extension and reporting layer by zward.studio.`
- Footer copyright: `© 2026 zward.studio`

### Navigation

- Product
- Problem
- Fixes
- Solution
- Primary CTA: `Try free`

### Hero

- `Every session has a price.`
- `Most teams never see the bill.`
- Primary CTA: `Start for free`
- Secondary CTA: `Watch a scan`
- Stat label: `time to first signal`
- Stat label: `pages sampled in a live run`
- Stat label: `to understand the first report`
- Scroll nudge: `keep going`

### Product

- Tag: `Product`
- Heading: `The cost layer your frontend never had`
- Body: `Metis was designed to feel calm on the page and serious in the report. It catches what a normal profiler rarely explains: what those requests mean for real spend.`

Feature cards:

- `Hover-first workflow`
  `Metis stays lightweight on the page, then opens the deeper workspace in the browser side panel when you want context.`
- `Cost and control`
  `The product frames waste in plain language: what costs money now, what scales badly later, and what deserves attention first.`
- `Stack-aware signals`
  `Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic.`
- `Built for real teams`
  `The website explains the product cleanly while the extension stays focused on scanning, scoring, and the side-panel workspace.`

### Problem

- Tag: `The Problem`
- Heading: `Your frontend is bleeding money every session`
- Body: `Unoptimised requests, noisy third-party scripts, and AI-heavy interactions compound quietly. Metis exists to make that waste legible before it becomes a postmortem.`

Stats:

- `24 avg API calls per page load`
- `3.2 MB avg payload per session`
- `$0.004 avg session cost, unoptimised`
- `86% of teams don't know their frontend cost`

Problem issues:

- `Duplicate API Requests — 8× per load`
- `Memory leak in 3 components`
- `OpenAI called on every keystroke`
- `3 images over 2MB — no WebP conversion`
- `Static assets without Cache-Control headers`

### Fixes

- Tag: `How it fixes it`
- Heading: `Here's exactly what to fix`
- Body: `Not vague advice. The product direction is clear: ranked fixes, grounded explanations, and a report that respects how engineering teams actually work.`
- Label: `Root Cause`
- Label: `Fix`
- Label: `Fix First`
- Dynamic save label: ``Save ~$${saving}/mo``

Fix cards:

- `Duplicate API Requests`
  Root cause: `Multiple components trigger the same fetch independently on mount with no deduplication.`
  Fix: `Add SWR or React Query with a shared cache key. Concurrent callers share one in-flight request.`
- `AI API Call Frequency`
  Root cause: `AI completion handler fires on onChange with no debounce — each keystroke = one API call.`
  Fix: `Debounce by 400ms with useDebouncedCallback. Cache identical prompts with a simple Map for 5 min.`
- `Memory Leak Pattern`
  Root cause: `useEffect hooks add event listeners but return no cleanup function.`
  Fix: `Return cleanup from each useEffect: return () => window.removeEventListener(...). Use AbortController for fetch.`

### Solution

- Tag: `The result`
- Heading line 1: `Start free`
- Heading line 2: `Fix in minutes`
- Body: `Install Metis, open a page, and get a clear read on where cost pressure starts. The website handles the story. The extension handles the scan.`
- Result caption: `Minimal Risk`
- Primary CTA: `Get early access`

Checklist:

- `Score any running page in under 2 seconds`
- `See exactly what's costing you, per session`
- `Get ranked code fixes with savings estimates`
- `Free to start, with room for Plus-style team workflows later`

### Footer

- Badge: `Beta Access`
- Heading line 1: `Get early access.`
- Heading line 2: `Free, always.`
- Body: `Join the list and be first to hear when Metis opens up deeper auth flows, team-ready reports, and polished release builds.`
- Email placeholder: `you@company.com`
- Submit label: `Join beta`
- Success message: `You're on the list. We'll be in touch.`

Footer links:

- `zward.studio`
- `GitHub`
- `Get early access`
- `Privacy`
- `Terms`

Footer stack badges:

- `Next.js`
- `React`
- `Python`
- `TypeScript`

## Auth Flow

### Sign In

- Eyebrow: `Welcome back`
- Title: `Sign in to Metis`
- Intro: `Use email and password or continue with Google or GitHub`
- Submit label: `Sign in`
- Alternate label: `Need an account?`
- Context panel title: `Back into the scan flow`
- Context panel body: `Move straight into the protected side of Metis without losing the calm lightweight feel of the public site`

Steps:

- `Access`
- `Confirm`
- `Enter`

Highlights:

- `Return with email or a provider you already trust`
- `Keep the entry flow short and readable`
- `Be ready for protected reports and saved product states next`

### Sign Up

- Eyebrow: `Create your account`
- Title: `Start using Metis`
- Intro: `Create an account with email and password or continue with Google or GitHub`
- Submit label: `Create account`
- Alternate label: `Already have an account?`
- Context panel title: `Set up your first Metis pass`
- Context panel body: `Create access now, confirm your inbox once, and be ready when deeper product features move behind the authenticated layer`

Steps:

- `Create`
- `Verify`
- `Enter`

Highlights:

- `Start with email, Google, or GitHub`
- `Keep verification explicit instead of hidden`
- `Land in a clean protected state once access is ready`

### Shared Auth Labels

- Stage label: `Onboarding`
- Provider button: `Continue with Google`
- Provider button: `Continue with GitHub`
- Divider label: `or use email`
- Field label: `Email`
- Email placeholder: `you@company.com`
- Field label: `Password`
- Password placeholder: `Enter a strong password`
- Back link: `Back to the site`

### Logged In

- Eyebrow: `Signed in`
- Title: `You're logged in`
- Ready message: `Metis is ready for you`
- Dynamic ready message: ``Metis is ready for ${email}``
- Panel title: `More features are coming soon`
- Panel body: `This is the first authenticated checkpoint before reports and protected product flows land`
- Sign out label: `Sign out`
- Summary title: `Protected access is working`

Summary items:

- `Session active`
  `Supabase has completed the auth handoff and the protected page is reachable`
- `Backend ready`
  `FastAPI is prepared to validate authenticated access for the next product routes`
- `Next surface`
  `Saved scans, richer reports, and team facing flows can now layer on top`

## Legal Pages

### Privacy

- Eyebrow: `Privacy`
- Title: `Privacy policy`

Paragraphs:

- `Metis respects the difference between explaining a product and quietly collecting data. This website does not ask visitors for account details unless they choose to use the sign in or sign up flow, and it does not present itself as a live analytics dashboard.`
- `If you contact Metis, join a waitlist, or create access through the auth flow, the information you provide may be used to respond to you, manage access, and improve the service. Metis is not intended to sell personal information or use hidden tracking as a product strategy.`
- `As the authenticated product expands, this policy should be updated to describe what product data is stored, how long it is retained, who can access it, and how deletion requests are handled.`

### Terms

- Eyebrow: `Terms`
- Title: `Terms of use`

Paragraphs:

- `Metis is provided as a developing product and website. The material on this site is intended to explain the service clearly, but access, features, and availability may change as the product evolves.`
- `You agree not to misuse the site, interfere with access, attempt to bypass security controls, or use the service in a way that harms the product, its operators, or other users. If authenticated features are enabled, account access remains your responsibility.`
- `Unless a separate commercial agreement says otherwise, the site and service are offered without guarantees of uninterrupted availability. The source code in this repository is available under the MIT license included at the repo root.`

Shared legal link:

- `Back to Metis`

## Example Mockup Copy

### Header and score labels

- `Metis Scan`
- `metis.zward.studio · just now`
- `Cost Risk Score`
- `Session cost`
- `Live · 3 pages sampled · metis.zward.studio`
- `At 10k users →`
- Prefix: `~`
- Suffix: `/month est. waste`
- Dynamic monthly waste label: ``~$${min}–$${max}/month est. waste``
- Dynamic projection label: ``~$${(min * 10).toLocaleString()}/month``

### States and empty responses

- Empty insight: `All issues resolved`
- Empty issues label: `No Issues Detected`
- Dynamic issues label: ``${count} Issues · By Severity``

### Example state insights

- `High request count and AI usage detected`
- `Moderate cost inefficiencies across 5 issues`
- `Severe API overuse and memory pressure detected`
- `2 minor issues remain — fixes applied to critical items`
- `Site is well-optimized — low cost risk detected`

### Example issue labels

- `Duplicate API Requests`
- `Memory Leak Pattern`
- `AI API Call Frequency`
- `Unoptimized Images`
- `Missing Cache Headers`

## Errors And Catchall Responses

### Auth UI fallbacks

- Missing credentials: `Email and password are both required`
- Provider launch error: `The provider login could not start`
- Create account error: `We could not create that account`
- Sign in error: `That email and password combination did not work`
- Verification confirmation: `Check your inbox and confirm your email before signing in`

### Auth callback and mapped helper responses

- `callback_failed`
  `That sign-in link is not usable anymore. Try again.`
- `oauth_cancelled`
  `The provider sign-in was cancelled before it finished.`
- `invalid_credentials`
  `That email and password combination did not work.`
- `verification_required`
  `Check your inbox and confirm your email before signing in.`

### Generic no-copy fallback behavior

- Unmapped auth error code returns `null` from the helper and falls back to the direct UI error string instead of a generic unknown error banner

## Dynamic Templates

These are the variable-style strings that should stay explicit in copy review:

- ``Save ~$${saving}/mo``
- ``~$${min}–$${max}/month est. waste``
- ``~$${(min * 10).toLocaleString()}/month``
- ``${count} Issues · By Severity``
- ``Metis is ready for ${email}``
- `waitlist success`
  `You're on the list. We'll be in touch.`
