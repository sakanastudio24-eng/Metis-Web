# Metis Web Production Roadmap

This document is the website-side path to production. It assumes `Metis-Web` owns auth, onboarding, account, legal, beta posture, provider flows, email delivery, and public product messaging.

The remaining work is now a short release list instead of a vague cleanup bucket: provider QA, temporary auth removal, final hardening, then launch prep.

## Launch goal

Ship a website and account layer that is production-safe, provider-tested, email-capable, SEO-safe, and clear about the boundary between website account state and extension runtime behavior.

## Current production view

Recent cleanup reduced drift in auth and copy:

- auth code is cleaner and more centralized
- dead imports were removed
- more live UI text was pulled back into central copy files
- front-facing copy is less stiff
- docs were tightened across the repo
- `pnpm lint` and `pnpm typecheck` passed

The open items are now:

- removing the local temporary auth bypass before release
- finishing real Google and GitHub provider testing
- final mobile polish on account and security
- real entitlement wiring if Plus Beta or API Beta becomes live
- a final production pass on SEO, OG assets, and deployment config

## Phase 1: Auth and provider completion

### Priority work

- magic link flow
- provider flow testing
- remove temporary auth bypass

### Scope

- verify magic link sign-in end to end
- verify provider auth launch, cancel, callback, failure, and retry states for Google and GitHub
- remove the local temporary auth bypass before release and keep only the real Supabase flows
- confirm sign-up, sign-in, onboarding, account, and security flows all reflect the real provider/account state

### Exit criteria

- every auth path has a tested happy path and failure path
- provider copy matches real behavior
- temporary auth is no longer part of the release path

## Phase 2: Runtime, API, and deployment hardening

### Priority work

- runtime injection
- api prep grouping
- environment and callback hardening
- extension auth validation contract

### Scope

- finish runtime secret injection for Next.js and FastAPI deploy targets
- verify callback URLs, public app URLs, and backend URLs stay aligned across Supabase, provider dashboards, and deployment config
- group API prep work so the FastAPI layer has a clear production-ready boundary for health, readiness, protected routes, and account-type validation support
- keep the first live API scope anchored to `docs/api-beta-plan.md`
- define the account-type validation contract the extension will rely on for free vs Plus Beta behavior
- harden route guards for `/logged-in`, `/account`, and `/account/security`

### Exit criteria

- deployment config is stable and repeatable
- API responsibilities are narrow and documented
- extension-facing account validation has a clear contract

## Phase 3: Growth and launch polish

### Priority work

- report to email temporary flow
- SEO hardening
- design system pass
- mobile polish
- final copy pass
- final security pass

### Scope

- ship a temporary report-to-email flow that is honest about being temporary
- harden metadata, indexing rules, canonicals, and private-route SEO boundaries
- lock landing, auth, onboarding, account, and security to one visual system using `docs/design-system-logic.md`
- tighten the account and security polish on mobile once the auth flow is final
- do a full copy pass across landing, auth, onboarding, account, security, pricing, legal, and beta messaging
- do a final security pass across auth copy, redirects, provider flows, backend headers, error handling, and temporary auth fencing
- do a final production pass on SEO metadata, OG assets, and deployment config before launch

### Exit criteria

- public pages are production-indexable where intended
- private pages stay out of indexing
- copy, legal text, and account behavior all agree
- temporary auth remains fenced to development only
- the website visual system holds together across public and private surfaces

## Cross-repo dependencies on `Metis`

- runtime injection behavior on real pages
- extension-side account validation call points
- temporary report export shape that will feed email delivery
- final extension copy and permission language

## Still unresolved

- the final long-term replacement for temporary report-to-email is still unresolved and should not be implied in public copy yet
- final live entitlement wiring for Plus Beta or API Beta is still unresolved unless those sections move beyond staged UI
