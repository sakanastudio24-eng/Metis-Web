# Metis Web Master Copy

This is the readable copy reference for the current website, auth flow, onboarding, dashboard, and security surfaces. The source of truth in code still lives in `src/content`, but this file should match what people actually see.

## Brand

Name: `Metis`

Footer tagline: `Cost intelligence for the modern web.`

Footer subline: `A browser extension and reporting layer by zward.studio.`

Footer copyright: `© 2026 zward.studio`

## Navigation

Section label: `Product`

Section label: `Problem`

Section label: `Fixes`

Section label: `Solution`

Primary CTA: `Try free`

## Landing page

### Hero

Header line 1: `Every session has a price.`

Header line 2: `Most teams never see the bill.`

Primary CTA: `Start for free`

Secondary CTA: `Watch a scan`

Stat label: `time to first signal`

Stat label: `pages sampled in a live run`

Stat label: `to understand the first report`

Support copy: `keep going`

### Product

Tag: `Product`

Header: `The cost layer your frontend never had`

Body: `Metis was designed to feel calm on the page and serious in the report. It catches what a normal profiler rarely explains: what those requests mean for real spend.`

Feature title: `Hover-first workflow`

Feature body: `Metis stays lightweight on the page, then opens the deeper workspace in the browser side panel when you want context.`

Feature title: `Cost and control`

Feature body: `The product frames waste in plain language: what costs money now, what scales badly later, and what deserves attention first.`

Feature title: `Stack-aware signals`

Feature body: `Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic.`

Feature title: `Built for real teams`

Feature body: `The website explains the product cleanly while the extension stays focused on scanning, scoring, and the side-panel workspace.`

### Problem

Tag: `The Problem`

Header: `Your frontend is bleeding money every session`

Body: `Unoptimised requests, noisy third-party scripts, and AI-heavy interactions compound quietly. Metis exists to make that waste legible before it becomes a postmortem.`

Issue summary: `5 issues detected · High Risk`

Issue label: `Duplicate API Requests, 8× per load`

Issue label: `Memory leak in 3 components`

Issue label: `OpenAI called on every keystroke`

Issue label: `3 images over 2MB with no WebP conversion`

Issue label: `Static assets without Cache-Control headers`

### Fixes

Tag: `How it fixes it`

Header: `Here's exactly what to fix`

Body: `Not vague advice. The product direction is clear: ranked fixes, grounded explanations, and a report that respects how engineering teams actually work.`

Label: `Root Cause`

Label: `Fix`

Label: `Fix First`

Dynamic label: ``Save ~$${saving}/mo``

Fix title: `Duplicate API Requests`

Root cause body: `Multiple components trigger the same fetch independently on mount with no deduplication.`

Fix body: `Add SWR or React Query with a shared cache key. Concurrent callers share one in-flight request.`

Fix title: `AI API Call Frequency`

Root cause body: `AI completion handler fires on onChange with no debounce. Each keystroke triggers one API call.`

Fix body: `Debounce by 400ms with useDebouncedCallback. Cache identical prompts with a simple Map for 5 min.`

Fix title: `Memory Leak Pattern`

Root cause body: `useEffect hooks add event listeners but return no cleanup function.`

Fix body: `Return cleanup from each useEffect: return () => window.removeEventListener(...). Use AbortController for fetch.`

### Solution

Tag: `The result`

Header line 1: `Start free`

Header line 2: `Fix in minutes`

Body: `Create access on the website, manage your account there, then use the extension for the actual scan and report workflow.`

Checklist item: `Score any running page in under 2 seconds`

Checklist item: `See exactly what's costing you, per session`

Checklist item: `Get ranked code fixes with savings estimates`

Checklist item: `Keep account settings on the website and extension settings in the extension`

Result caption: `Minimal Risk`

Primary CTA: `Get early access`

### Footer

Badge: `Beta Access`

Header line 1: `Get early access.`

Header line 2: `Free, always.`

Body: `Create a free account on the website, complete setup there, and manage Plus Beta access from your account when beta enrollment opens.`

Email placeholder: `you@company.com`

CTA: `Join beta`

Success message: `You're on the list. We'll be in touch.`

Footer link: `zward.studio`

Footer link: `GitHub`

Footer link: `Get early access`

Footer link: `Privacy`

Footer link: `Terms`

## Auth overlay

### Shared labels

Brand label: `Metis Web`

Stage header: `A quiet layer for frontend cost risk`

Stage body: `Metis keeps website auth focused on access, account settings, and beta controls so the extension can stay focused on signal.`

Tab label: `Sign in`

Tab label: `Sign up`

Provider label: `Continue with`

Provider button: `Google`

Provider button: `GitHub`

Provider button: `Send magic link`

Magic link success: `Magic link sent. Check your inbox and continue from the email.`

Divider label: `or use email`

Email label: `Work email`

Password label: `Password`

Security support line: `Protected access for metis.zward.studio`

Boundary note: `Sign in on the website to manage your account and legal access, then use the extension for scans and reports.`

Back label: `Back to the site`

Temporary review label: `Local testing only`

Temporary review body: `Google is temporarily bypassed in local development so onboarding and account flows can be reviewed quickly.`

Temporary review CTA: `Use temporary Google test account`

### Start screen

Header: `Start with Metis`

Primary CTA: `Create account`

Secondary CTA: `Log in`

### Sign in

Eyebrow: `Sign in`

Header: `Welcome back.`

Body: `Sign in on the website to manage your account, security posture, and beta access before heading back to the extension.`

Submit CTA: `Log in`

Footer prompt: `No account yet?`

Footer link: `Sign up free`

### Sign up

Eyebrow: `Create account`

Header: `Create your account.`

Body: `Create your free account on the website, accept the legal terms here, and move straight into your first guided setup.`

Submit CTA: `Create account`

Footer prompt: `Already have one?`

Footer link: `Log in`

Field label: `Full name`

Field label: `Email address`

Legal acceptance label: `I agree to the`

Legal link: `Terms of Use`

Legal link: `Privacy Policy`

Legal error: `You need to accept the Terms of Use and Privacy Policy before creating an account.`

## Verification and recovery

Verification eyebrow: `Verify email`

Verification header: `Check your inbox`

Verification body: `Open the email from Metis and use the secure link to finish access.`

Verification support body: `Once verification is complete you can return to sign in and move into onboarding without extra setup.`

Verification dynamic line: ``Verification sent to ${email}``

Recovery eyebrow: `Recovery`

Recovery header: `Forgot your password?`

Recovery body: `No problem. Enter your email and we'll send a reset link — it expires in 15 minutes.`

Recovery CTA: `Send reset link`

Recovery success header: `Check your inbox.`

Recovery success body: `We've sent a reset link to ${email}. Check your spam folder if it doesn't arrive within a minute.`

Reset eyebrow: `New password`

Reset header: `Choose a new password`

Reset body: `Enter your new password to finish recovery.`

Reset CTA: `Update password`

Reset error header: `Recovery link needed`

Reset error body: `Use a fresh recovery email so Metis can confirm it is really you.`

Reset success header: `Password updated`

Reset success body: `You can sign in now and move straight back into Metis.`

## Onboarding

Eyebrow: `Setup`

Header: `Tell Metis what matters first`

Body: `This stays short and points your first dashboard toward the signals you care about most.`

Signed in line: ``Signed in as ${email}``

Next destination line: `Your account settings and beta access live on the website account pages after setup.`

Finish CTA: `Finish setup`

Skip CTA: `Skip for now`

Completion eyebrow: `Saved`

Completion header: `You are all set`

Completion body: `Welcome to Metis. Your first setup answers are saved and your account areas are ready to review next.`

Completion badge: `All set`

Inline label: `Next step`

CTA: `Install extension. It's free.`

CTA: `Open account settings`

Temporary account label: `Temporary test account`

Temporary account body: `This local-only session is for reviewing onboarding and account flows. Remove it before shipping.`

Question: `What are you building?`

Question helper: `We'll personalise your first scan for your project type.`

Options: `SaaS app`, `E-commerce`, `Internal tool`, `Something else`

Question: `How big is your team?`

Question helper: `Helps us tune how we present team-level insights.`

Options: `Just me`, `2 – 5`, `6 – 20`, `20+`

Question: `What worries you most?`

Question helper: `We'll surface those insights first on your dashboard.`

Options: `API costs`, `Performance`, `AI spend`, `All of it`

## Metis Dash

Brand label: `Metis Dash`

Badge: `Plus Beta`

Section label: `Account`

Section label: `API Beta`

Section label: `Security`

Section label: `Plan & Pricing`

Section label: `Settings`

Section support label: `More sections coming soon`

Nav state: `Soon`

Back link: `Back to site`

### Account section

Header: `Account overview`

Body: `Keep identity basics, verification status, and connected access in one place.`

Label: `Account status`

Label: `Free plan`

Label: `Plus Beta`

Label: `Connected access`

Label: `Scan usage`

### API Beta section

Nav state: `Visible in navigation as coming soon`

Header: `API Beta`

Body: `Preview the staged API surface for CI checks, deploy hooks, and automated scans without overstating what is live.`

Label: `Beta access status`

Status: `Pending unlock`

Status: `Enabled for Plus Beta`

Body: `API Beta is staged while endpoints, rate limits, and docs are hardened for launch.`

Label: `Beta key preview`

Body: `Keys stay masked until API Beta is enabled for this account.`

CTA: `Join Plus Beta`

CTA: `Docs coming soon`

Security note: `Never paste beta keys into client-side code. Keep all tokens server-side.`

Badge: `Beta gated`

Support label: `Exact endpoint scope lands in docs.`

### Security section

Header: `Security posture`

Body: `Keep the current sign-in method visible, preview two-factor, and stage deeper controls honestly.`

Label: `Good security posture`

Body: `Email verification, provider auth, and recovery flows are active. Two-factor is next.`

Label: `Sign-in method`

Label: `Two-factor authentication`

Status: `Preview available`

Label: `Active sessions`

Label: `Audit log`

Status: `Coming soon`

Body: `These controls stay visible so the dashboard is honest about what is next without pretending the backend is already live.`

### Plan and pricing section

Header: `Plan & Pricing`

Body: `Start free, then enroll into Plus Beta when you need deeper dashboard and API access.`

Plan: `Free`

Plan: `Plus Beta`

CTA: `Current plan`

CTA: `Enroll in Plus Beta`

FAQ: `Can I switch plans later?`

Answer: `Yes. Free remains available, and Plus Beta can be enabled or removed during the staged rollout.`

FAQ: `What does Plus Beta unlock?`

Answer: `It stages deeper dashboard access, API Beta, and premium rollout features as they harden.`

FAQ: `Is there a Team plan?`

Answer: `Not in this phase. The dashboard is focused on Free and Plus Beta only.`

### Settings section

Header: `Settings`

Body: `Keep account settings on the website and extension behavior settings inside the extension.`

Label: `App settings`

Body: `The extension remains the single place for scan controls, refresh preferences, and saved-history actions.`

State label: `Managed in extension`

## Security page

Eyebrow: `Security`

Header: `Protect your Metis access`

Body: `Set up two-factor authentication, review your current sign-in method, and keep the account boundary explicit.`

Section label: `Available now`

Item: `Supabase session handling`

Item: `Email verification checks`

Item: `Provider-based sign-in with Google and GitHub`

Item: `Password recovery with callback validation`

Section label: `Coming next`

Item: `Recovery codes`

Item: `Trusted device review`

Item: `Session management for teams`

Two-factor preview header: `Two-factor authentication`

Preview body: `Temporary accounts can still review the 2FA layout here, but real accounts now use the live authenticator-app flow below.`

Preview badge: `Preview only`

Live setup badge: `Start setup`

Enabled badge: `Enabled`

Start header: `Authenticator app`

Start body: `Begin setup to generate a QR code and secret for your authenticator app. Once verified, the current session is promoted to aal2.`

Start CTA: `Start 2FA setup`

Manual key label: `Manual key`

Copy label: `Copy`

Copied label: `Copied`

Verify header: `Verify your code`

Verify body: `Scan the QR code or enter the manual key in your authenticator app, then enter the current six-digit code to finish setup.`

Verify CTA: `Verify and enable`

Restart CTA: `Restart setup`

Enabled header: `Authenticator active`

Enabled summary: `Authenticator-based sign-in is live for this account. Keep your app and secret safe.`

Disable CTA: `Disable 2FA`

Assurance header: `Authenticator assurance`

Assurance body: `AAL shows how strongly the current session is verified. aal2 means the session has passed both the first factor and a verified MFA factor.`

Provider section header: `Current sign-in method`

Provider section body: `Your current provider determines whether password changes happen here or with the provider you used to sign in.`

Session note: `Protected routes stay private and are excluded from public indexing.`

Back label: `Back to account`

Temporary security label: `Temporary security preview`

Temporary security body: `This local-only account can review the security UI, but it does not represent a real provider-backed session.`

## Errors and helper responses

Callback error: `That sign-in link is not usable anymore. Try again.`

Provider cancel error: `The provider sign-in was cancelled before it finished.`

Credential error: `That email and password combination did not work.`

Verification required error: `Check your inbox and confirm your email before signing in.`

Recovery link error: `That recovery link is not usable anymore. Request a new one.`

Provider launch error: `The provider sign-in could not start.`

Magic link error: `The magic link could not be sent.`

Create account error: `We could not create that account.`

Recovery request error: `We could not send a recovery email right now.`

Reset password error: `We could not update your password right now.`

Reset password success: `Password updated. You can sign in now.`

Temporary access error: `The temporary test account could not be started.`

Security load error: `We could not load your current two-factor state right now.`

Security enroll error: `We could not start two-factor setup right now.`

Security enroll success: `Authenticator setup started. Scan the QR code and verify the first code.`

Security verify error: `That verification code did not work. Try the latest code from your authenticator app.`

Security verify success: `Two-factor authentication is now enabled for this account.`

Security disable error: `We could not disable two-factor authentication right now.`

Security disable success: `Two-factor authentication has been removed from this account.`
