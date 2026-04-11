# Metis Web Post Mortem

## Problem statement

The website-to-extension account bridge is not yet production-stable.

Users can complete website sign-in successfully and still fail to land in a usable connected extension state. The failure mode is especially visible when the website overlay remains in a generic connecting state, or when the extension rejects validation because the expected same-origin validation route is missing, stale, or returning an unexpected payload.

This problem matters because the product promise is simple: sign in on the website, then let the extension reflect the account state. When that handoff fails, the user experiences a successful website login but a broken extension connection, which makes the account model feel untrustworthy even if the underlying auth session is valid.

## Current symptoms

- The extension can open the website sign-in flow correctly but fail during the validation handoff.
- The website overlay can stay in a connecting state longer than expected or surface a backend validation failure.
- The extension may not update visible account fields like email, username, and scans used if validation does not complete.
- Production drift between deployed website routes and the bridge contract can break the connection even when local development works.

## Scope of the issue

- Website auth overlay and callback flow
- `/account/settings?source=extension` bridge surface
- `/v1/extension/validate` same-origin validation route
- Extension bridge listener, validation call, and local account snapshot storage

## Not resolved yet

- This issue should remain open until the production website, deployed validation route, and live extension build are verified together end to end.
- Do not mark this resolved based on local success alone.
