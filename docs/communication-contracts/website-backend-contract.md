# Metis Website Backend Contract

This contract defines normal website-to-backend communication.

## Lane responsibilities

Website ↔ backend is used for:

- auth
- onboarding
- user account
- billing later
- saved reports later

## Identity rule

Supabase remains the identity source of truth.

FastAPI stays narrow and only handles protected app and backend needs that sit beside the website account system.

## Current boundary

The website owns:

- auth entry
- callback completion
- onboarding
- account pages
- security pages
- staged API Beta posture

The backend owns:

- protected verification
- extension validation at `POST /v1/extension/validate`
- narrow authenticated upload routes at `POST /api/events`, `POST /api/scan-summary`, and `POST /api/premium-report-request`
- health and readiness
- future account-linked API work
- future report-saving behavior

## Beta boundary rule

API Beta may stay visible in the website UI before the full backend surface is live.

That visibility must remain honest:

- staged account UI is allowed
- unfinished backend behavior must not be implied as live

## Future scope

This lane expands later for:

- billing
- saved reports
- stronger account-linked features

Those should be added through this contract, not ad hoc route-by-route drift.

## Done in Metis-Web

- [x] website-side auth callback and extension bridge flow are implemented
- [x] backend validation exists at `POST /v1/extension/validate`
- [x] first authenticated upload routes exist for events and summary traffic
- [x] extension-side adoption of validation and upload contracts is implemented in `Metis`
- [ ] packaged extension verification and release hardening still need final QA
