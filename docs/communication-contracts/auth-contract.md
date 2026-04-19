# Metis Auth Contract

This is the website-side copy of the shared auth contract.

Use this file when changing website sign-in entry points, callback routing, auth
intent propagation, or the account settings overlay that starts the extension
connection flow.

The direct website -> extension runtime message is owned by
`external-auth-bridge-contract.md`.

## Ownership

- `Metis-Web` owns auth, providers, callback routing, and account state
- `Metis` owns the extension runtime, local storage, and connected UI
- the website stays the identity source of truth
- the extension must not become a second auth system

## Entry flow

When the extension starts auth, it opens:

- production: `https://metis.zward.studio/sign-in?source=extension&extensionId=<chrome.runtime.id>`
- development: `http://localhost:3000/sign-in?source=extension&extensionId=<chrome.runtime.id>`

If sign-up is used instead, the same query rules apply:

- `/sign-up?source=extension&extensionId=<chrome.runtime.id>`

The website may also carry:

- `intent=plus_beta`
- `email=<prefill>`

Those values are routing and UX inputs only. They are not proof of extension
identity.

## Callback flow

- auth completes through `/auth/callback`
- normal website auth returns to the normal website destination
- extension-aware auth resolves into `/account/settings?source=extension`
- `extensionId` is preserved when present
- `/auth/success` is compatibility-only and should redirect into
  `/account/settings?source=extension`

## Query rules

`source=extension` means:

- preserve extension intent through the auth flow
- callback completion should land on `/account/settings?source=extension`
- the account settings overlay becomes the visible bridge surface

`extensionId` means:

- the flow started from an installed extension
- the website may use it only as a routing hint
- the website must still check it against the configured allowlist before
  sending any bridge packet

## Allowed origins and callbacks

Exact allowed website origins:

- `https://metis.zward.studio`
- `http://localhost:3000`

Exact callback URLs:

- `https://metis.zward.studio/auth/callback`
- `http://localhost:3000/auth/callback`

Rules:

- exact string match only
- no wildcard origins
- no preview domains unless explicitly allowlisted
- no sibling subdomains

## Website responsibilities

- render sign-in and sign-up
- preserve `source`, `extensionId`, `intent`, and prefilled email when needed
- complete auth through `/auth/callback`
- land extension-aware auth on `/account/settings?source=extension`
- build the current account snapshot from website-owned tables
- start the external bridge from the account settings overlay

## Out of scope

This contract does not own:

- the extension runtime message shape
- extension storage keys
- Chrome `externally_connectable`
- service-worker validation rules

Those belong to `external-auth-bridge-contract.md`.
