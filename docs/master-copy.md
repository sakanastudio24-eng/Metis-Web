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

Italic line: `Find what makes your app expensive before it scales`

Primary CTA: `Start for free`

Supporting line: `Run a scan and see where your app starts getting expensive.`

Secondary CTA: `Watch a scan`

Returning primary CTA: `Open Metis Dash`

Returning supporting line: `Continue where you left off and review your latest scan.`

Support copy: `keep going`

### Product

Tag: `Product`

Header: `The cost layer your frontend never had`

Body: `Metis stays calm on the page and serious in the report. It shows what most profilers miss: what those requests mean in real cost.`

Feature title: `Hover-first workflow`

Feature body: `Metis stays light on the page, then opens the side panel when you want more context.`

Feature title: `Cost and control`

Feature body: `It frames waste in plain language: what costs money now, what gets worse as you scale, and what to fix first.`

Feature title: `Stack-aware signals`

Feature body: `Frameworks, hosts, AI providers, and third-party scripts are detected so the report feels specific, not generic.`

Feature title: `Built for real teams`

Feature body: `The website handles account and beta access. The extension stays focused on scans, scores, and reports.`

### Problem

Tag: `The Problem`

Header: `Your frontend is bleeding money every session`

Body: `Extra requests, noisy third-party scripts, and AI-heavy interactions add up quietly. Metis makes that cost visible before it turns into cleanup work.`

Issue summary: `5 issues detected · High Risk`

Issue label: `Duplicate API Requests, 8× per load`

Issue label: `Memory leak in 3 components`

Issue label: `OpenAI called on every keystroke`

Issue label: `3 images over 2MB with no WebP conversion`

Issue label: `Static assets without Cache-Control headers`

### Fixes

Tag: `How it fixes it`

Header: `Here's exactly what to fix`

Body: `No vague advice. You get ranked fixes, clear explanations, and a report built for how engineering teams actually work.`

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

Body: `Start with a scan. Go deeper through Plus Beta and staged features when you need more.`

Checklist item: `Score any running page in under 2 seconds`

Checklist item: `See exactly what's costing you, per session`

Checklist item: `Get ranked code fixes with savings estimates`

Checklist item: `Keep account settings on the website and extension settings in the extension`

Result caption: `Minimal Risk`

Primary CTA: `Get early access`

Returning primary CTA: `Open Metis Dash`

### Mockup / demo

Primary CTA: `Open Full Report`

Returning primary CTA: `Open Metis Dash`

Supporting copy: `View detected issues, estimated cost impact, and where to focus first.`

### Footer

Badge: `Beta Access`

Header line 1: `Get early access.`

Header line 2: `Free, always.`

Body: `Basic scans work without an account. Create one when you want saved setup, account sync, and access to Metis+ Beta when it opens.`

Email placeholder: `you@company.com`

CTA: `Try Metis+ Beta`

Success message: `Metis+ Beta is now enabled for this account.`

Footer link: `zward.studio`

Footer link: `GitHub`

Footer link: `Get early access`

Footer link: `Privacy`

Footer link: `Terms`

## Auth overlay

### Shared labels

Brand label: `Metis Web`

Stage header: `A quiet layer for frontend cost risk`

Provider button: `Google`

Provider button: `GitHub`

Provider button: `Send magic link`

Supporting copy: `We’ll send a secure sign-in link to your email.`

Disclosure: `By continuing, you agree to the Terms and Privacy Policy. If you sign in with Google or GitHub, Metis may use the email and basic profile information your provider shares to create and secure your account.`

Magic link success: `Magic link sent. Check your inbox and continue from the email.`

Magic link sent header: `Check your email`

Magic link sent body: `We sent a secure sign-in link to ${email}. Open the newest email on any device to continue into Metis.`

Magic link subject: `Sign in to Metis`

Magic link email intro: `Click the button below to sign in securely.`

Magic link email button: `Sign in to Metis`

Magic link email fallback: `If the button doesn’t work, copy and paste this link into your browser:`

Magic link expiry label: `This link expires in about 10 minutes.`

Magic link resend CTA: `Resend link`

Email label: `Work email`

Security support line: `Protected access for metis.zward.studio`

### Callback handoff

Header: `Signing you in...`

Body: `Redirecting...`

## Extension bridge

Eyebrow: `Connection`

Header: `Connecting`

Body: `Stay on this settings page while the website connects your account to the extension.`

Waiting label: `Connecting to extension`

Success header: `Connected`

Success body: `The extension confirmed the connection. You can keep working in settings.`

Failure header: `Connection failed`

Close action: `Close overlay`

Retry action: `Try sign-in again`

Missing-extension state: `We couldn’t connect your extension. Try signing in again or open Metis from the extension.`

Debug header: `Bridge debug`

Debug label: `Origin`

Debug label: `Route`

Debug label: `Query extensionId`

Debug label: `Configured IDs`

Debug label: `Attempted ID`

Debug label: `Stage`

Debug fallback: `Waiting for the website to attempt the external bridge.`

### Delete account overlay

Eyebrow: `Danger Zone`

Header: `Delete your account`

Body: `This will remove your account and disconnect Metis from your extension.`

Checklist label: `This will`

Primary confirmation label: `Type your username`

Primary confirmation helper: `Use ${username} to confirm the account you want to remove.`

Secondary confirmation label: `Type DELETE`

Secondary confirmation helper: `This prevents accidental removal.`

Re-auth card header: `Verify with a magic link`

Re-auth card body: `For Metis v1, account deletion requires a fresh magic-link sign-in before the final delete action is allowed.`

### Passwordless entry

Header: `Start with Metis`

Primary CTA: `Continue with Google`

Secondary CTA: `Continue with GitHub`

### Sign in

Eyebrow: `Sign in`

Header: `Welcome back.`

Body: `Use Google, GitHub, or an email magic link to get back into your Metis account on the website.`

Footer prompt: `Need an account?`

Footer link: `Create account`

### Sign up

Eyebrow: `Create account`

Header: `Start with Metis`

Body: `Create access on the website with Google, GitHub, or an email magic link, then move straight into your first guided setup.`

Footer prompt: `Already have access?`

Footer link: `Sign in`

Field label: `Work email`

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

CTA: `Install extension (free)`

CTA: `Open account settings`

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

## Privacy page

Eyebrow: `Privacy`

Header: `Privacy policy`

Last updated: `April 19th, 2026`

Intro: `Metis is a website and browser-extension product designed to help users understand cost-risk patterns in websites and web applications.`

Section: `1. Information Metis uses`

Section: `2. Sign-in providers`

Section: `3. Email address use`

Section: `4. Website and extension behavior`

Section: `5. Data use expectations`

Section: `6. Security and account protection`

Section: `7. Product changes`

Section: `8. Contact`

Back link: `Back to Metis`

## Terms page

Eyebrow: `Terms`

Header: `Terms of use`

Last updated: `Month Day, Year`

Intro: `These Terms govern your use of the Metis website, account surface, and browser-extension product.`

Section: `1. Product status`

Section: `2. Accounts and authentication`

Section: `3. Acceptable use`

Section: `4. Beta access and feature availability`

Section: `5. Diagnostic nature of the product`

Section: `6. No guarantees`

Section: `7. Suspension or removal`

Section: `8. Changes`

Section: `9. Contact`

Back link: `Back to Metis`

Brand label: `Metis Dash`

Badge: `Plus Beta`

Section label: `Account`

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

### Security section

Header: `Security posture`

Body: `Keep the current sign-in method visible, preview two-factor, and stage deeper controls honestly.`

Label: `Good security posture`

Body: `Email verification, provider auth, and magic-link access are active. Two-factor is next.`

Label: `Sign-in method`

Label: `Two-factor authentication`

Status: `Preview available`

Label: `Active sessions`

Label: `Audit log`

Status: `Coming soon`

Body: `These controls stay visible so the dashboard is honest about what is next without pretending the backend is already live.`

### Plan and pricing section

Header: `Plan & Pricing`

Body: `Keep Free simple, then request Metis+ Beta on the website when you want deeper access. Billing can wait.`

Plan: `Metis Free`

Body: `No account required to start scanning.`

Pillar: `Scan & detect`

Pillar items: `Local page scan and analysis`, `Known stack detection`, `Top issues summary`

Pillar: `Understand cost`

Pillar items: `Cost risk score with confidence and supporting insight`, `Supporting detail for key issues`

Pillar: `Act & improve`

Pillar items: `Compact side panel workspace`, `Full report view in-page`, `Basic export document`

Pillar: `Optional account connection`

Pillar items: `Sign in to connect your account`, `Popup account status when connected`, `Local settings and scan history`

Plan: `Metis+ Beta`

Body: `Plus Beta unlocks deeper analysis and expanded reports.`

Pillar: `Deeper analysis`

Pillar items: `Full detailed issue rows`, `Cost breakdown section`, `Endpoint-level detail`

Pillar: `Understand scale impact`

Pillar items: `Scale modeling`, `Expanded insight depth`

Pillar: `Act with direction`

Pillar items: `Fix recommendations`, `Fix priority`

Pillar: `Expanded reports`

Pillar items: `Extended export document`, `Cost breakdown`, `Endpoint detail`, `Scale modeling`, `Fix priority`

Pillar: `Access & state`

Pillar items: `Plus badge in panel and report`, `Premium request eligibility`, `Degrade to Free toggle`

CTA: `Try Metis+ Beta`

Coming soon: `Reports`, `API Beta`

Body: `Reports and API Beta stay visible here as staged product areas, not as live access claims.`

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

Item: `Magic link and provider callback handling`

Item: `Provider-based sign-in with Google and GitHub`

Item: `Protected route checks on website account pages`

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

Provider section body: `Your current provider is shown here so you can keep website access clear and know which sign-in path you used most recently.`

Session note: `Protected routes stay private and are excluded from public indexing.`

Back label: `Back to account`

Temporary security label: `Temporary security preview`

Temporary security body: `This local-only account can review the security UI, but it does not represent a real provider-backed session.`

## Errors and helper responses

Callback error: `Link expired or already used. Send a new link to keep going.`

Provider cancel error: `The provider sign-in was cancelled before it finished.`

Provider launch error: `The provider sign-in could not start.`

Magic link error: `The magic link could not be sent.`

Temporary access error: `The temporary test account could not be started.`

Security load error: `We could not load your current two-factor state right now.`

Security enroll error: `We could not start two-factor setup right now.`

Security enroll success: `Authenticator setup started. Scan the QR code and verify the first code.`

Security verify error: `That verification code did not work. Try the latest code from your authenticator app.`

Security verify success: `Two-factor authentication is now enabled for this account.`

Security disable error: `We could not disable two-factor authentication right now.`

Security disable success: `Two-factor authentication has been removed from this account.`
