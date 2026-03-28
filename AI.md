# Metis Web AI Context

This file is the shortest repo-level context note for AI/code agents working in Metis Web.

## Product shape

Metis Web is the website and auth shell for the Metis product.

Current surface split:

- public website: product story, problem framing, fixes, solution, legal pages
- auth routes: email sign up, email sign in, Google OAuth, GitHub OAuth
- recovery routes: forgot password, reset password, and verification guidance
- callback route: shared auth completion at `/auth/callback`
- logged-in route: short onboarding questionnaire on a red background with a white multi-answer panel
- API: FastAPI proof layer for health, readiness, and authenticated backend expansion

## Live runtime model

- the public site explains the product and routes people into auth
- Supabase owns identity, provider login, sessions, and callback exchange
- the website completes auth at `/auth/callback` and redirects into `/logged-in` or `/reset-password`
- FastAPI does not issue its own passwords or sessions
- FastAPI validates authenticated access against Supabase and stays narrow for now

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

## Key files

- `src/app/page.tsx`
- `src/app/sign-in/page.tsx`
- `src/app/sign-up/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`
- `src/app/verify/page.tsx`
- `src/app/logged-in/page.tsx`
- `src/components/auth/AuthScreen.tsx`
- `src/components/auth/ForgotPasswordScreen.tsx`
- `src/components/auth/ResetPasswordScreen.tsx`
- `src/components/auth/LoggedInState.tsx`
- `src/content/authCopy.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/auth.ts`
- `src/lib/env.ts`
- `api/app/main.py`
- `api/app/config.py`

## Docs worth reading first

- `README.md`
- `docs/implementation-flow.md`
- `docs/runtime-secrets-flow.md`

## Working rules

- prefer focused commits by surface area
- every implemented feature or meaningful change should call out git segmentation clearly
- keep dependency or version bumps isolated when possible
- frontend changes should stay humanized, intentional, and readable, not generic scaffold output
- keep auth work separate from unrelated landing-page or mobile-layout changes
- keep front-facing auth copy in `src/content/authCopy.ts`

## Agent operating rules

- before adding a new flow doc, check the existing docs first
- only add or update docs when they add real value to future work
- if a doc feels redundant or should be merged into another doc, ask the user before removing or merging it
- when a flow changes, update the matching flow doc instead of creating overlapping notes
- never inspect `.env` files directly
- if environment shape matters, ask the user or update `.env.example`
- when reporting work back, include the git segmentation for the feature that was added or changed

## Security rules

- keep auth, entitlement, and trust boundaries explicit in code and copy
- do not move identity logic into FastAPI unless there is a clear product reason
- do not hardcode secrets into code, docs, or examples
- keep provider callback URLs explicit and documented
- prefer narrow backend responsibility over convenience-heavy hidden behavior

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

The biggest review-sensitive area is still auth configuration drift between Supabase, provider dashboards, local env shape, and deployed callback URLs.
