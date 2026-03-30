# Metis Web AI Context

This is the shortest repo note for agents working in Metis Web.

## Product shape

Metis Web is the website and account layer for Metis.

Current surfaces:

1. Public website pages for the product story and legal pages
2. Passwordless auth overlay for sign in and sign up
3. Shared auth callback at `/auth/callback`
4. Onboarding at `/logged-in`
5. Account and security at `/account` and `/account/security`
6. FastAPI proof endpoints for health, readiness, and future protected backend work

## Runtime model

Supabase owns identity, sessions, provider auth, magic link delivery, and callback exchange.

The website completes auth at `/auth/callback`.

FastAPI does not issue credentials. It only verifies protected access where backend proof is needed.

Temporary local auth exists only for UI review and must never cross the backend trust boundary.

## Product rules

Keep public copy clear and direct.

Keep auth copy separate from marketing copy.

Treat `/logged-in` as the short setup handoff.

Treat `/account` as the long term account destination.

Keep account settings on the website and extension settings in the extension.

Keep Plus Beta wording honest and website managed.

Keep API Beta visible only as a coming-soon roadmap stub until the beta backend surface is ready.

Use a hamburger section menu on mobile dashboard views instead of forcing the desktop rail onto a narrow screen.

## Important files

`src/app`

`src/components/auth`

`src/content/authCopy.ts`

`src/content/frontFacingCopy.ts`

`src/lib/auth.ts`

`src/lib/auth-server.ts`

`src/lib/supabase`

`src/lib/seo.ts`

`api/app`

## Docs to read first

`README.md`

`docs/repo-alignment.md`

`docs/production-roadmap.md`

`docs/design-system-logic.md`

`docs/front-facing-foundation.md`

`docs/implementation-flow.md`

`docs/runtime-secrets-flow.md`

`docs/api-beta-plan.md`

`docs/git-segmentation.md`

## Working rules

Commit by section.

Keep auth, onboarding, account, security, pricing, settings, copy, and docs separate when the work can stand on its own.

If a commit turns out too broad, re segment it right away.

Do not inspect `.env` directly.

Update `.env.example` or the docs when the contract changes.

## Security rules

Keep provider callback URLs explicit.

Keep auth and security routes out of public indexing.

Do not move identity logic into FastAPI unless there is a product reason.

Keep temporary auth fenced to development.
Keep it opt-in and easy to remove after provider QA.

## Main risk before shipping

The biggest risk is drift between Supabase config, provider dashboard redirects, website copy, and the real boundary between website account state and extension runtime behavior.
