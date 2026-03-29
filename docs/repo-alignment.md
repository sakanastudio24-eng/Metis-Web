# Metis Web Alignment

This document explains what belongs in Metis Web, what belongs in Metis, and what should not drift between them.

Use `docs/production-roadmap.md` for the ordered launch checklist.

Use `docs/design-system-logic.md` for shared UI logic across landing, auth, onboarding, account, and security.

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

## Guardrails for copy

Do not say auth is not ready if the flow already exists.

Do not imply the extension owns website account settings.

Do not imply a full website to extension account bridge unless that bridge has actually shipped.

Keep beta wording honest. If something is staged, say it is staged.

## Guardrails for temporary auth

Temporary auth is only for local review. It should never read like a public feature and it should never cross the backend trust boundary.

## Current repo state

The website is in launch-prep shape rather than early exploration.

- auth and copy were tightened to reduce drift
- docs are cleaner and more centralized
- dashboard sections now work in one shell on desktop and mobile
- API Beta stays present as a coming-soon signal without exposing the unfinished panel
- `pnpm lint` and `pnpm typecheck` passed
- the main remaining work is provider hardening, temporary auth removal, entitlement wiring if needed, and final launch prep

## When to update both repos

Check the matching note in `../Metis/docs/repo-alignment.md` when a change affects account expectations, legal promises, Plus Beta wording, or shared product boundaries.
