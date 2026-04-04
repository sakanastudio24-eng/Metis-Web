# Metis Communication Contracts

This folder is the communication source of truth for Metis.

The website-side auth bridge, backend validation endpoint, and first upload routes now live in `Metis-Web` against this contract family. The extension-side bridge, storage, ACK flow, and validated access-state wiring now exist in `Metis` as well.

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

## Done in Metis-Web

- [x] contract docs are tracked in git
- [x] website auth bridge contract is implemented with `source=extension`
- [x] `/account/settings?source=extension` posts the authenticated handoff payload and waits for ACK
- [x] backend account validation exists at `POST /v1/extension/validate`
- [x] first upload routes exist for events, scan summary, and premium report request
- [x] extension-side listener, storage, ACK, and gated UI adoption are implemented in `Metis`
- [x] website-to-extension auth messaging is locked to `https://metis.zward.studio` and `http://localhost:3000`
- [ ] full production bridge verification still needs the packaged extension and live site together

## Current stage

The shared communication system is currently in `Step 5 / Milestone E`.

What is already done:

- local extension messaging is in place
- the auth bridge is implemented
- backend validation and first upload routes exist
- extension access-state gating is wired

What is left before the communication stack is production-finished:

- live end-to-end verification with the packaged extension
- final retry, rate-limit, and edge-case hardening
