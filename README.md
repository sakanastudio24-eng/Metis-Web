# Metis

Metis helps teams understand what their frontend is costing them.

The website is where people create an account, review security, manage beta access, and understand the product. The browser extension is where the scan and report experience happens. Those two surfaces work together, but they do not try to be the same thing.

## What this website is for

Metis Web is the public face of the product and the account layer behind it. It explains the product clearly, handles passwordless access with Google, GitHub, and magic link, guides new users through setup, and gives them a place to manage account access, security, and plan status.

The website owns account settings, security, legal acceptance, and Plus Beta posture. The extension owns scans, reports, page-level runtime controls, and extension-only settings.

The website also owns the bridge contract that hands authenticated state back to the extension. Auth still completes on the website. The extension only receives a narrow success payload and validates access state back against the backend.

## What Metis does

Metis looks for the things that quietly make pages expensive to run. That can mean repeated requests, heavy assets, third party scripts, and AI usage that grows faster than teams expect. The goal is simple. Show where the cost starts, explain why it matters, and point to the fixes worth doing first.

## How the product is split

Use the website when the job is identity, onboarding, account review, security, or plan access.

Use the extension when the job is scanning a page, reading the report, adjusting extension behavior, or working inside the side panel flow.

## Docs worth reading first

- [docs/AI.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/AI.md)
- [docs/front-facing-foundation.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/front-facing-foundation.md)
- [docs/repo-alignment.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/repo-alignment.md)
- [docs/production-roadmap.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/production-roadmap.md)
- [docs/api-beta-plan.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/api-beta-plan.md)
- [docs/magic-link-launch.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/magic-link-launch.md)
- [docs/communication-contracts/README.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/communication-contracts/README.md)
- [docs/communication-contracts/communication-build-track.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/communication-contracts/communication-build-track.md)
- [docs/communication-contracts/auth-contract.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/communication-contracts/auth-contract.md)
- [docs/communication-contracts/website-backend-contract.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/communication-contracts/website-backend-contract.md)
- [docs/design-system-logic.md](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis-Web/docs/design-system-logic.md)

## Current product shape

Metis Web is already running the real passwordless stack for launch.

- Google and GitHub stay as the provider paths
- email auth is magic-link only
- `/auth/callback` completes website auth
- `/auth/success` hands the session back to the extension when auth starts there
- `/account` stays the long-term account home
- account deletion is a website-owned soft-delete flow with fresh magic-link re-auth

## Who made it

Metis is made by [zward.studio](https://zward.studio).

## Where to find it

Website: [metis.zward.studio](https://metis.zward.studio)

Studio: [zward.studio](https://zward.studio)

Website repo: [sakanastudio24-eng/Metis-Web](https://github.com/sakanastudio24-eng/Metis-Web)

Extension repo: [sakanastudio24-eng/Metis](https://github.com/sakanastudio24-eng/Metis)
