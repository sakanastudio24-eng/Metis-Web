# Metis Web

Metis Web is the public-facing website for Metis, the browser product that helps teams understand where frontend cost risk starts and why it grows.

The Chrome extension does the scanning. This website does the explaining.

It is here to:

- introduce the Metis product in a way that feels concrete, not hand-wavy
- show how the hover, side panel, score, issue list, and fix flow fit together
- give the product a clean home at `metis.zward.studio`
- prepare the repo for the next layer: auth, protected reports, and 1Password-managed runtime secrets

## What the extension is for

Metis sits lightly on top of a site and surfaces cost pressure that usually stays invisible until a bill or outage forces the conversation.

The extension is designed to help teams answer questions like:

- Which requests are repeating when they should not?
- Which assets or scripts are quietly making every session heavier?
- Where is AI usage starting to turn into real spend?
- Which fix should we do first if we want the fastest cost win?

The current sibling repo at [`../Metis`](/Users/zech/Downloads/The-Big-One/Metis-Full/Metis/README.md) contains the product logic and extension runtime context this website is written around.

## Repo shape

- `src/app`: Next.js App Router routes for the website, auth placeholders, and legal pages
- `src/components/landing`: the Figma-driven marketing shell, adapted into a production Next.js client component
- `src/lib`: config and env validation helpers
- `api/`: minimal FastAPI scaffold for health checks and future protected product flows
- `docs/`: human-readable notes about implementation flow, git segmentation, and runtime secret setup

## Local setup

1. Copy `.env.example` to `.env.local` and fill in safe local values.
2. Install the web dependencies with `pnpm install`.
3. Start the site with `pnpm dev`.
4. Start the API scaffold with `pnpm api:dev`.

## Guardrails

- Env values are treated seriously. If required config is missing, the app should fail loudly instead of limping forward.
- Auth is scaffolded, not faked. The `/sign-in` and `/sign-up` routes show the intended shape of the flow without pretending the provider work is already done.
- The site copy is intentionally human. It should sound like a product a team could trust, not a placeholder deck.

## Git segmentation

This repo is meant to be developed in clean segments instead of one giant dump commit.

The working rule for this implementation is:

- repo and tooling setup in one segment
- product UI and route work in another
- docs and runtime flow notes in another

That keeps the history readable and makes review easier when the auth and secrets work starts.
