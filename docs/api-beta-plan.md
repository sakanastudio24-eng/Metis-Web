# Metis API Beta Plan Draft

This draft defines the smallest believable API Beta for Metis Web.

The goal is not to launch a full platform. The goal is to ship a narrow protected backend surface that matches the staged API Beta language already present in the account area.

This is still a planning document. The dashboard keeps API Beta visible as roadmap posture, but the full panel remains staged until the backend surface is genuinely ready to review.

## Beta goal

API Beta should prove that Metis can expose a small authenticated backend surface for:

- account-aware access
- extension account validation support
- temporary report-to-email delivery
- basic protected backend integrations

It should stay small enough that the product does not overpromise more than the backend can safely support.

## What API Beta is not

API Beta is not:

- a public anonymous API
- a full scan engine in the cloud
- a replacement for the extension runtime
- a promise of permanent beta-key access for every account
- a large integration platform on day one

## Who gets access first

The initial audience should be:

- internal review
- handpicked Plus Beta accounts
- a very small group testing account-linked integrations

Free accounts can still see the staged API Beta surface in the dashboard, but they should not receive live access by default.

## Basic access model

Keep access simple in the first beta.

- Supabase remains the identity source of truth
- protected API routes accept a website-authenticated bearer token
- account plan and beta flags are checked server-side
- beta keys stay masked and optional until the live beta launch pass
- if keys ship in the beta, they should be server-to-server only and never required for the first protected-account proof routes

## Minimum endpoint set

### Public proof endpoints

- `GET /healthz`
- `GET /readyz`

These exist for uptime, deployment, and basic environment verification.

### Protected account endpoints

- `GET /auth/me`
- `GET /v1/account/status`
- `GET /v1/api-beta/status`

These should answer:

- who the authenticated user is
- what plan they are on
- whether Plus Beta is enabled
- whether API Beta is enabled
- whether temporary report-to-email is available for the account

### Protected beta action endpoints

- `POST /v1/reports/email`
- `POST /v1/extension/validate`

`/v1/reports/email` is the temporary bridge for report delivery.

`/v1/extension/validate` is the bridge endpoint the extension can use to confirm account type and allowed beta behavior without inventing local entitlement state.

## Suggested response shape

Keep the first beta response model boring and explicit.

Example account status shape:

```json
{
  "account": {
    "id": "user_123",
    "email": "user@example.com",
    "plan": "free",
    "plus_beta_enabled": false,
    "api_beta_enabled": false,
    "report_email_enabled": true
  }
}
```

Example extension validation shape:

```json
{
  "account": {
    "plan": "plus_beta",
    "plus_beta_enabled": true,
    "api_beta_enabled": false
  },
  "extension": {
    "allow_plus_ui": true,
    "allow_report_email": true
  }
}
```

## Temporary report-to-email rules

The first beta version should stay intentionally narrow.

- authenticated users only
- send a report summary or export payload to the account email or an explicit allowed destination
- no promise of long-term report storage
- no promise of a full historical report archive
- clear rate limits and retry behavior

This is a bridge feature, not the final reporting system.

## Account and entitlement logic

Keep the gating logic explicit.

- `free` and `plus_beta` should stay separate from `api_beta_enabled`
- Plus Beta should not automatically imply API Beta if you want a slower rollout
- API Beta access should be an explicit server-side flag
- dashboard copy should remain staged until those flags are actually wired

## Security rules

- keep bearer-token verification server-side
- keep beta keys masked until access is truly enabled
- never ask users to paste keys into client-side code
- rate-limit protected beta actions
- log access and failure states
- keep CORS narrow and avoid opening the beta to arbitrary origins

## Docs and developer experience

The first docs set only needs to cover:

- auth model
- endpoint list
- basic request and response examples
- rate limit notes
- error shapes
- explicit warning that the surface is beta and may change

Do not write docs for endpoints that do not exist yet.

## Rollout order

### Phase 0

- keep API Beta visible in the account UI as staged
- keep endpoints limited to proof routes and account validation

### Phase 1

- enable protected account status routes
- enable temporary report-to-email
- enable extension validation support

### Phase 2

- selectively enable API Beta for a small Plus Beta cohort
- add beta key issuance only if the protected-account model is no longer enough
- publish real typed docs for the live beta endpoints

## Beta acceptance checklist

- protected routes verify the Supabase-authenticated user correctly
- account status and beta flags are returned consistently
- extension validation has a stable contract
- temporary report-to-email is gated, rate-limited, and documented as temporary
- account UI wording matches the real backend behavior
- no public marketing copy overstates the size of the API surface
