# Metis Web Alignment Packet

This document is the website-side alignment note. It defines what `Metis-Web` owns, what `Metis` owns, and what must not drift during production polish.

## Website role

`Metis-Web` is the source of truth for:

- auth
- onboarding
- account management
- account security
- pricing and beta posture
- public privacy and terms
- website-managed product copy

The website is not the source of truth for extension runtime settings, scan execution, or extension-side report behavior.

## Ownership boundary

`Metis-Web` owns:

- public landing and marketing copy
- sign-up and sign-in flows
- provider auth and callback handling
- onboarding at `/logged-in`
- account management at `/account`
- security controls at `/account/security`
- legal acceptance during sign-up
- beta and Plus Beta access posture

`Metis` owns:

- extension runtime behavior
- scanning and reporting
- popup controls
- side panel workflow
- extension-local settings
- extension-local legal details

## Current alignment rules

- the canonical public domain is `https://metis.zward.studio`
- `/logged-in` is onboarding/setup only, not the long-term account home
- `/account` is the canonical account destination
- `/account/security` is the website-owned security surface
- sign-up requires privacy and terms acceptance
- sign-in stays lower friction than sign-up
- account settings are managed on the website
- extension settings are managed in the extension
- Plus is only available by website-managed beta opt-in

## Current repo status

Current website alignment for this pass is resolved:

- the website remains the source of truth for auth, onboarding, account, security, legal, and Plus Beta posture
- website copy should continue to describe Plus as website-managed beta access
- future changes that affect extension account expectations or Plus wording should still be mirrored into the extension packet intentionally

## Copy and product guardrails

- do not say auth is “not switched on yet”
- do say auth exists and is still being finished intentionally
- do not imply the extension owns account settings
- do not imply users can unlock or buy Plus from the extension
- do not describe the website-to-extension auth bridge as finished unless it actually ships
- keep beta language honest and explicit

## Temp auth guardrails

- temporary auth tooling is development-only
- production-facing copy must not treat temp auth as a real product path
- dev review tooling must stay fenced away from real production behavior

## Legal guardrails

- website privacy and terms are the canonical public legal surfaces
- website legal copy should describe website-managed auth, account state, and beta access accurately
- website legal copy should not overclaim extension/server sync that is not shipped
- when website legal meaning changes, mirror the extension-side legal notes intentionally

## Before changing shared product expectations

Check the matching extension packet first:

- `../Metis/docs/repo-alignment.md` in the parent workspace

If a change affects:

- auth expectations
- account wording
- beta or Plus language
- legal promises
- public links or domains

then update both repos deliberately instead of letting one side drift.
