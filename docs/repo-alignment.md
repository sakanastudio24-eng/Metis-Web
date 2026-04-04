# Metis Web Alignment

This document explains what belongs in Metis Web, what belongs in Metis, and what should not drift between them.

Use `docs/AI.md` for the short working context.

Use `docs/production-roadmap.md` for the ordered launch checklist.

Use `docs/design-system-logic.md` for shared UI logic across landing, auth, onboarding, account, and security.

Use `docs/communication-contracts/README.md` for upload, access-state, and multi-lane communication work.

Use `docs/communication-contracts/auth-contract.md` for website-to-extension auth bridge work.

## What this repo owns

Metis Web is the source of truth for the public site, sign in, sign up, onboarding, account pages, account security, legal copy, and website managed beta posture.

## What the extension repo owns

The Metis extension repo owns runtime scanning, the hover entry, reports, side panel workflow, popup controls, and extension only settings.

## The practical rule

Website account settings live on the website. Extension behavior settings live in the extension.

That means the website should talk about account access, security, legal acceptance, and plan state. The extension should talk about scans, reports, page analysis, and extension level controls.

## Current alignment points

1. `https://metis.zward.studio` is the canonical public domain.
2. `/logged-in` is only the short setup handoff.
3. `/account` is the long term account home.
4. `/account/security` is the website owned security surface.
5. Sign up requires privacy and terms acceptance.
6. Plus Beta is managed through the website account layer.
7. API Beta stays visible as roadmap copy, but the full panel stays staged until the beta launch pass.
8. Extension-aware auth keeps website auth on the web and hands a narrow success payload back through `/account/settings?source=extension`.
9. Backend validation and upload routes follow `docs/communication-contracts` instead of one-off payloads.
10. Account deletion is a website-owned soft-delete flow and does not run from the extension.

## Guardrails for copy

Do not say auth is not ready if the flow already exists.

Do not imply the extension owns website account settings.

Do not imply a full website to extension account bridge unless that bridge has actually shipped.
The shipped bridge today is the website handoff plus backend account validation. It is not full product sync.

Keep beta wording honest. If something is staged, say it is staged.

## Current repo state

The website is in launch-prep shape rather than early exploration.

## Finished in Metis Web

- passwordless website auth is live with Google, GitHub, and magic link
- `/auth/callback` is the shared website callback for provider auth and magic links
- `/account/settings?source=extension` is the extension-aware bridge completion route
- `/logged-in` stays the short setup handoff and `/account` stays the long-term account home
- account and security live on the website, and extension behavior settings stay in the extension
- dashboard sections work in one shell on desktop and mobile
- API Beta stays visible as a coming-soon roadmap stub without exposing a fake live panel
- backend validation and first upload routes follow `docs/communication-contracts`
- temporary auth review paths have been removed
- account deletion is a website-owned soft-delete flow with fresh magic-link re-auth
- auth and copy were tightened to reduce drift
- docs are cleaner and more centralized
- `pnpm lint` and `pnpm typecheck` passed in the current repo state

## Still needs change before shipping

- real Google and GitHub provider QA still needs a final production-style pass
- the packaged extension still needs live verification against the shipped auth bridge and backend validation contract
- callback URLs, provider dashboards, and deployed runtime settings still need one final alignment pass together
- final mobile polish on account and security can still improve
- Plus Beta and API Beta remain staged UI until real entitlement wiring is either implemented or explicitly deferred
- final launch prep still needs OG assets, deployment checks, and a last copy and security review

Bridge work must follow `docs/communication-contracts/auth-contract.md` instead of inventing ad hoc callback or payload behavior.

Upload and access-state work must follow the communication contracts folder instead of scattered one-off notes.

## When to update both repos

Check the matching note in `../Metis/docs/repo-alignment.md` when a change affects account expectations, legal promises, Plus Beta wording, or shared product boundaries.
