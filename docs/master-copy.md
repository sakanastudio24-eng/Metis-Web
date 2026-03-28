# Metis Web Master Copy

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

- Header line 1: `Every session has a price.`
- Header line 2: `Most teams never see the bill.`
- Primary CTA: `Start for free`
- Secondary CTA: `Watch a scan`
- Stat label: `time to first signal`
- Stat label: `pages sampled in a live run`
- Stat label: `to understand the first report`
- Support copy: `keep going`

### Product

- Tag: `Product`
- Heading: `The cost layer your frontend never had`
- Body: `Metis was designed to feel calm on the page and serious in the report. It catches what a normal profiler rarely explains: what those requests mean for real spend.`

Feature cards:

- Card header: `Hover-first workflow`
  Card body: `Metis stays lightweight on the page, then opens the deeper workspace in the browser side panel when you want context.`
- Card header: `Cost and control`
  Card body: `The product frames waste in plain language: what costs money now, what scales badly later, and what deserves attention first.`
- Card header: `Stack-aware signals`
  Card body: `Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic.`
- Card header: `Built for real teams`
  Card body: `The website explains the product cleanly while the extension stays focused on scanning, scoring, and the side-panel workspace.`

### Problem

- Tag: `The Problem`
- Heading: `Your frontend is bleeding money every session`
- Body: `Unoptimised requests, noisy third-party scripts, and AI-heavy interactions compound quietly. Metis exists to make that waste legible before it becomes a postmortem.`

Stats:

- Stat value and label: `24 avg API calls per page load`
- Stat value and label: `3.2 MB avg payload per session`
- Stat value and label: `$0.004 avg session cost, unoptimised`
- Stat value and label: `86% of teams don't know their frontend cost`

Problem issues:

- Issue label: `Duplicate API Requests — 8× per load`
- Issue label: `Memory leak in 3 components`
- Issue label: `OpenAI called on every keystroke`
- Issue label: `3 images over 2MB — no WebP conversion`
- Issue label: `Static assets without Cache-Control headers`

### Fixes

- Tag: `How it fixes it`
- Heading: `Here's exactly what to fix`
- Body: `Not vague advice. The product direction is clear: ranked fixes, grounded explanations, and a report that respects how engineering teams actually work.`
- Label: `Root Cause`
- Label: `Fix`
- Label: `Fix First`
- Dynamic save label: ``Save ~$${saving}/mo``

Fix cards:

- Card header: `Duplicate API Requests`
  Root cause body: `Multiple components trigger the same fetch independently on mount with no deduplication.`
  Fix body: `Add SWR or React Query with a shared cache key. Concurrent callers share one in-flight request.`
- Card header: `AI API Call Frequency`
  Root cause body: `AI completion handler fires on onChange with no debounce — each keystroke = one API call.`
  Fix body: `Debounce by 400ms with useDebouncedCallback. Cache identical prompts with a simple Map for 5 min.`
- Card header: `Memory Leak Pattern`
  Root cause body: `useEffect hooks add event listeners but return no cleanup function.`
  Fix body: `Return cleanup from each useEffect: return () => window.removeEventListener(...). Use AbortController for fetch.`

### Solution

- Tag: `The result`
- Heading line 1: `Start free`
- Heading line 2: `Fix in minutes`
- Body: `Install Metis, open a page, and get a clear read on where cost pressure starts. The website handles the story. The extension handles the scan.`
- Result caption: `Minimal Risk`
- Primary CTA: `Get early access`

Checklist:

- Checklist item: `Score any running page in under 2 seconds`
- Checklist item: `See exactly what's costing you, per session`
- Checklist item: `Get ranked code fixes with savings estimates`
- Checklist item: `Free to start, with room for Plus-style team workflows later`

### Footer

- Badge: `Beta Access`
- Heading line 1: `Get early access.`
- Heading line 2: `Free, always.`
- Body: `Join the list and be first to hear when Metis opens up deeper auth flows, team-ready reports, and polished release builds.`
- Email placeholder: `you@company.com`
- Submit label: `Join beta`
- Success message: `You're on the list. We'll be in touch.`

Footer links:

- Link label: `zward.studio`
- Link label: `GitHub`
- Link label: `Get early access`
- Link label: `Privacy`
- Link label: `Terms`

Footer stack badges:

- Badge label: `Next.js`
- Badge label: `React`
- Badge label: `Python`
- Badge label: `TypeScript`

## Auth Flow

### Sign In

- Eyebrow: `Access`
- Title: `Sign in to Metis`
- Intro body: `Choose a provider, use a magic link, or sign in with email and password`
- Submit label: `Sign in`
- Alternate CTA: `Create an account`
- Side panel header: `Get back into the product`
- Side panel body: `Use the fastest path into Metis and move straight from access into setup`

Steps:

- Step label: `Choose`
- Step label: `Verify`
- Step label: `Start`

Highlights:

- Highlight body: `Use Google or GitHub if you want the quickest path`
- Highlight body: `Use a magic link if you do not want to enter a password`
- Highlight body: `Land inside the guided onboarding flow as soon as access is valid`

### Sign Up

- Eyebrow: `Start`
- Title: `Create your Metis access`
- Intro body: `Start with Google, GitHub, magic link, or create access with email and password`
- Submit label: `Create account`
- Alternate CTA: `Already have access`
- Side panel header: `Move from sign up into setup`
- Side panel body: `Create access now and continue directly into the onboarding questions that shape the next product pass`

Steps:

- Step label: `Create`
- Step label: `Confirm`
- Step label: `Answer`

Highlights:

- Highlight body: `Choose the provider flow that feels easiest`
- Highlight body: `Use magic link when you want less friction`
- Highlight body: `Keep the first protected experience short and useful`

### Shared Auth Labels

- Brand label: `Metis Web`
- Stage label: `Access flow`
- Switcher label: `Mode`
- Tab label: `Sign in`
- Tab label: `Sign up`
- Section label: `Continue with a provider`
- Provider button: `Continue with Google`
- Provider button: `Continue with GitHub`
- Provider button: `Email me a magic link`
- Magic link success: `Magic link sent. Check your inbox and continue from the email`
- Divider label: `or use email and password`
- Field label: `Email`
- Email placeholder: `you@company.com`
- Field label: `Password`
- Password placeholder: `Enter a strong password`
- Support card header: `Access first`
- Support card body: `Choose the path that gets you into Metis with the least friction`
- Support card header: `Setup next`
- Support card body: `Answer a few questions so the first protected experience feels shaped around your needs`
- Support card header: `Keep it clear`
- Support card body: `No hidden provider jumps, no confusing detours, and no fake completion state before onboarding starts`
- Back link: `Back to the site`

### Logged In

- Eyebrow: `Onboarding`
- Header: `Tell Metis what matters first`
- Support body: `Answer a few quick questions and shape the first protected experience`
- Signed-in support line: ``Signed in as ${email}``
- Panel header: `White multi answer panel`
- Panel body: `Choose more than one answer when it helps. This step is here to guide the next product pass, not slow you down`
- Sign out label: `Sign out`
- Finish CTA: `Finish setup`
- Skip CTA: `Skip for now`
- Completion eyebrow: `Saved`
- Completion header: `Your setup is captured`
- Completion body: `You can move on now and come back later when deeper onboarding persistence is wired`
- Summary title: `Protected access is working`

Summary items:

- Summary header: `Session active`
  Summary body: `Supabase has completed the auth handoff and the protected page is reachable`
- Summary header: `Backend ready`
  Summary body: `FastAPI is prepared to validate authenticated access for the next product routes`
- Summary header: `Next surface`
  Summary body: `Saved scans, richer reports, and team facing flows can now layer on top`

Onboarding questions:

- Question header: `Who are you setting Metis up for`
  Question helper: `Choose every role that fits`
  Answer options: `Founder`, `Engineer`, `Product`, `Design`, `Growth`, `Ops`
- Question header: `What should Metis help with first`
  Question helper: `Choose more than one if needed`
  Answer options: `Cost visibility`, `AI spend`, `Fix priority`, `Team reporting`, `Site audits`, `Release checks`
- Question header: `What shows up most in your stack`
  Question helper: `Pick the tools or surfaces you expect Metis to touch first`
  Answer options: `Next.js`, `React`, `Vercel`, `OpenAI`, `Cloudflare`, `Third party scripts`

## Legal Pages

### Privacy

- Eyebrow: `Privacy`
- Title: `Privacy policy`

Paragraphs:

- Body paragraph 1: `Metis respects the difference between explaining a product and quietly collecting data. This website does not ask visitors for account details unless they choose to use the sign in or sign up flow, and it does not present itself as a live analytics dashboard.`
- Body paragraph 2: `If you contact Metis, join a waitlist, or create access through the auth flow, the information you provide may be used to respond to you, manage access, and improve the service. Metis is not intended to sell personal information or use hidden tracking as a product strategy.`
- Body paragraph 3: `As the authenticated product expands, this policy should be updated to describe what product data is stored, how long it is retained, who can access it, and how deletion requests are handled.`

### Terms

- Eyebrow: `Terms`
- Title: `Terms of use`

Paragraphs:

- Body paragraph 1: `Metis is provided as a developing product and website. The material on this site is intended to explain the service clearly, but access, features, and availability may change as the product evolves.`
- Body paragraph 2: `You agree not to misuse the site, interfere with access, attempt to bypass security controls, or use the service in a way that harms the product, its operators, or other users. If authenticated features are enabled, account access remains your responsibility.`
- Body paragraph 3: `Unless a separate commercial agreement says otherwise, the site and service are offered without guarantees of uninterrupted availability. The source code in this repository is available under the MIT license included at the repo root.`

Shared legal link:

- Link label: `Back to Metis`

## Example Mockup Copy

### Header and score labels

- Header: `Metis Scan`
- Subheader: `metis.zward.studio · just now`
- Label: `Cost Risk Score`
- Label: `Session cost`
- Support label: `Live · 3 pages sampled · metis.zward.studio`
- Support label: `At 10k users →`
- Prefix: `~`
- Suffix: `/month est. waste`
- Dynamic monthly waste label: ``~$${min}–$${max}/month est. waste``
- Dynamic projection label: ``~$${(min * 10).toLocaleString()}/month``

### States and empty responses

- Empty insight: `All issues resolved`
- Empty issues label: `No Issues Detected`
- Dynamic issues label: ``${count} Issues · By Severity``

### Example state insights

- Insight body: `High request count and AI usage detected`
- Insight body: `Moderate cost inefficiencies across 5 issues`
- Insight body: `Severe API overuse and memory pressure detected`
- Insight body: `2 minor issues remain — fixes applied to critical items`
- Insight body: `Site is well-optimized — low cost risk detected`

### Example issue labels

- Issue label: `Duplicate API Requests`
- Issue label: `Memory Leak Pattern`
- Issue label: `AI API Call Frequency`
- Issue label: `Unoptimized Images`
- Issue label: `Missing Cache Headers`

## Errors And Catchall Responses

### Auth UI fallbacks

- Missing credentials: `Email and password are both required`
- Missing email for magic link: `Enter your email first so we know where to send the magic link`
- Provider launch error: `The provider login could not start`
- Magic link error: `The magic link could not be sent`
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
