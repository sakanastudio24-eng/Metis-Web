# Metis Web Alignment

This document explains what belongs in Metis Web, what belongs in Metis, and what should not drift between them.

## What this repo owns

Metis Web is the source of truth for the public site, sign in, sign up, onboarding, account pages, account security, legal copy, and website managed beta posture.

## What the extension repo owns

The Metis extension repo owns runtime scanning, the hover entry, reports, side panel workflow, popup controls, and extension only settings.

## The practical rule

Website account settings live on the website. Extension behavior settings live in the extension.

That means the website should talk about account access, security, legal acceptance, and plan state. The extension should talk about scans, reports, page analysis, and extension level controls.

## Current alignment points

1. `https://metis.zward.studio` is the canonical public domain.
2. `/logged-in` is only the short setup handoff.
3. `/account` is the long term account home.
4. `/account/security` is the website owned security surface.
5. Sign up requires privacy and terms acceptance.
6. Plus Beta is managed through the website account layer.

## Guardrails for copy

Do not say auth is not ready if the flow already exists.

Do not imply the extension owns website account settings.

Do not imply a full website to extension account bridge unless that bridge has actually shipped.

Keep beta wording honest. If something is staged, say it is staged.

## Guardrails for temporary auth

Temporary auth is only for local review. It should never read like a public feature and it should never cross the backend trust boundary.

## When to update both repos

Check the matching note in `../Metis/docs/repo-alignment.md` when a change affects account expectations, legal promises, Plus Beta wording, or shared product boundaries.
