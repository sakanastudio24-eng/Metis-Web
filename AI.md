# Metis Web AI Context

This file is the shortest repo-level context note for AI/code agents working in Metis Web.

## Product shape

Metis Web is the website and auth shell for the Metis product.

Current surface split:

- public website: product story, problem framing, fixes, solution, legal pages
- auth routes: V4-aligned sign up and sign in as centered overlays over the homepage, plus Google OAuth, GitHub OAuth, and magic link
- recovery routes: verify email, forgot password, and reset password
- callback route: shared auth completion at `/auth/callback`
- signed-in routes: onboarding, account, and security surfaces
- Metis Dash: account overview, API Beta, security, plan and pricing, and settings inside one dashboard shell
- API: FastAPI proof layer for health, readiness, and authenticated backend expansion

## Live runtime model

- the public site explains the product and routes people into auth
- `/sign-in` and `/sign-up` render the landing page with a centered overlay instead of a separate auth page
- Supabase owns identity, provider login, sessions, and callback exchange
- the website completes auth at `/auth/callback` and redirects into `/logged-in` or `/reset-password`
- FastAPI does not issue its own passwords or sessions
- FastAPI validates authenticated access against Supabase and stays narrow for now
- local development includes a temporary Google test bypass for onboarding and account UI review only

## Core pipeline

Metis Web is presentation-first with explicit auth boundaries.

The main web logic path is:

`landing -> auth -> callback -> session -> protected page -> API verification`

Important implementation boundaries:

- `src/app`: routes and page entry points
- `src/components/auth`: auth UI and signed-in confirmation state
- `src/content/authCopy.ts`: front-facing auth copy
- `src/lib/supabase`: browser and server Supabase client setup
- `src/lib/auth.ts`: callback and auth error mapping helpers
- `api/app`: FastAPI config and protected proof endpoints

## Current product rules

- the public website should stay clear and human-readable, not overloaded with internal implementation detail
- Supabase is the system of record for auth
- FastAPI should stay focused on backend proof points and future protected routes
- email sign up should require verification before the user is treated as fully signed in
- callback handling should stay centralized at `/auth/callback`
- auth copy should stay separate from landing-page marketing copy
- the temporary Google test account is local-only and should be removed after review

## Key files

- `src/app/page.tsx`
- `src/app/sign-in/page.tsx`
- `src/app/sign-up/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`
- `src/app/verify/page.tsx`
- `src/app/logged-in/page.tsx`
- `src/app/account/page.tsx`
- `src/app/account/security/page.tsx`
- `src/components/auth/AuthScreen.tsx`
- `src/components/auth/AuthOverlay.tsx`
- `src/components/auth/HomeWithAuthOverlay.tsx`
- `src/components/auth/ForgotPasswordScreen.tsx`
- `src/components/auth/ResetPasswordScreen.tsx`
- `src/components/auth/LoggedInState.tsx`
- `src/components/auth/AccountPageClient.tsx`
- `src/components/auth/SecurityPageClient.tsx`
- `src/content/authCopy.ts`
- `src/content/frontFacingCopy.ts`
- `src/lib/seo.ts`
- `src/lib/auth-server.ts`
- `src/lib/temp-auth.ts`
- `src/lib/temp-auth-client.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/auth.ts`
- `src/lib/env.ts`
- `api/app/main.py`
- `api/app/config.py`
- `Metis Design Figma (V4).zip`

## Docs worth reading first

- `README.md`
- `docs/implementation-flow.md`
- `docs/runtime-secrets-flow.md`

## Working rules

- prefer focused commits by section, not just by broad surface area
- every implemented feature or meaningful change should call out git segmentation clearly
- if one request changes multiple sections, each section should get its own commit
- do not batch unrelated section edits into one “UI” or “auth” commit just because they share a folder
- create a stable checkpoint commit for each finished section so rewrites can target only that section later
- when a section needs to be reworked, reset or rewrite from the nearest section checkpoint instead of rolling back farther than necessary
- section checkpoints matter most for auth entry, onboarding, dashboard sections, pricing/plan work, settings work, copy, and docs
- keep Metis Dash sections isolated when committing: account, API Beta, security, pricing, and settings should not be batched together unless the user explicitly asks for a larger checkpoint
- keep dependency or version bumps isolated when possible
- frontend changes should stay humanized, intentional, and readable, not generic scaffold output
- keep auth work separate from unrelated landing-page or mobile-layout changes
- keep front-facing auth copy in `src/content/authCopy.ts`
- use `Metis Design Figma (V4).zip` as the active local design source for auth, onboarding, account, security, and related docs
- treat `Metis Figma Design (V.3).zip` as historical reference only unless the user explicitly asks to revive it

## Agent operating rules

- before adding a new flow doc, check the existing docs first
- only add or update docs when they add real value to future work
- if a doc feels redundant or should be merged into another doc, ask the user before removing or merging it
- when a flow changes, update the matching flow doc instead of creating overlapping notes
- never inspect `.env` files directly
- if environment shape matters, ask the user or update `.env.example`
- when reporting work back, include the git segmentation for the feature that was added or changed
- when reporting work back, explain the section-level commit breakdown, not just the total number of commits
- if a prior commit was too broad, re-segment it immediately instead of stacking more work on top

## Security rules

- keep auth, entitlement, and trust boundaries explicit in code and copy
- do not move identity logic into FastAPI unless there is a clear product reason
- do not hardcode secrets into code, docs, or examples
- keep provider callback URLs explicit and documented
- prefer narrow backend responsibility over convenience-heavy hidden behavior
- keep auth, account, and security routes out of public indexing
- keep dashboard-facing beta language honest: API Beta and other staged controls should look intentional without pretending backend entitlement already exists
- never let the temporary local test session cross the backend auth boundary

## Env contract in use

Web:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

API:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `FRONTEND_URL`

OAuth archive:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Main risk before shipping

The biggest review-sensitive areas are auth configuration drift between Supabase, provider dashboards, and deployed callback URLs, plus the temporary local test-account path that must stay fenced to development and be removed later.
