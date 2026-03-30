# Metis Communication Contracts

This folder is the communication source of truth for Metis.

The website-side auth bridge, backend validation endpoint, and first upload routes now live in `Metis-Web` against this contract family. The extension still needs to adopt the same locked message shapes, queue behavior, and access-state rules in `Metis`.

Use it when work crosses:

- extension UI and scanner
- extension and website
- extension and backend
- website and backend

## Contract set

- `communication-build-track.md`
- `extension-internal-contract.md`
- `auth-contract.md`
- `api-upload-contract.md`
- `website-backend-contract.md`
- `access-state-contract.md`

## How to use these docs

- start with `communication-build-track.md` for the build order
- use `extension-internal-contract.md` for extension-only messaging
- use `auth-contract.md` for the website auth bridge
- use `api-upload-contract.md` for uploads, queueing, and rate limits
- use `website-backend-contract.md` for normal website/backend traffic
- use `access-state-contract.md` for account-tier and gating rules

If a communication change affects more than one lane, update all touched contracts on purpose.
