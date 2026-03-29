# Git Segmentation Notes

This project should be easy to review, undo, and rewrite in narrow slices.

## What “git segmentation” means here

Every meaningful request should land as a clean section-level unit of change.

That means not just splitting by broad category like “auth” or “dashboard”, but splitting by the actual section that changed.

Good examples:

- auth entry state
- onboarding completion state
- account dashboard section layout
- pricing section
- metis settings section
- copy alignment
- docs only

Bad examples:

- one large “auth UI updates” commit that touches sign in, onboarding, dashboard, and copy
- one large “dashboard cleanup” commit that changes account, security, pricing, and settings at once

## Why it matters

Metis Web changes often arrive as visual and flow refinements. If section work is batched together:

- review becomes noisy
- reverting one mistake means undoing unrelated good work
- rewriting one section forces history to roll back farther than needed
- future agents lose the nearest safe checkpoint for the exact surface they need to revisit

## Section checkpoint rule

Every finished section should have its own stable checkpoint commit.

That checkpoint should be close enough that if the section needs to be rewritten later, the rollback target is only that section’s last good state.

This is the rule:

- finish one section
- commit that section
- move to the next section

Do not wait until three or four sections are done and then batch them together.

## Working rule

Before committing, ask:

“What exact section changed?”

If the honest answer is more than one section, split the commit.

## Preferred segmentation for this repo

When work spans these surfaces, commit them separately:

- auth entry
- onboarding
- account dashboard
- security
- plan and pricing
- Metis settings
- legal copy
- landing page sections
- docs
- env or runtime contract changes

## Reporting rule

When reporting work back, call out the section-level commit breakdown explicitly so future rewrites know the nearest good checkpoint.
