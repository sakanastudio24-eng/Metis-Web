# Git Segmentation Notes

This project should be easy to review in slices.

## What “git segmentation” means here

Every meaningful request should land as a clean unit of change instead of being buried inside a single all-purpose commit.

For this repo, that means keeping work separated by intent:

- foundation and tooling
- product UI and routes
- docs and runtime notes
- later auth and 1Password wiring

## Why it matters

Metis Web is doing a few jobs at once:

- it is a product site
- it is a future auth shell
- it is a bridge to the extension product
- it is a staging point for runtime secrets

If those changes get mixed together carelessly, review becomes slow and future debugging becomes expensive.

## Working rule

When the next request comes in, ask one question before committing:

“Is this a tooling change, a product change, or a documentation change?”

If the answer is “more than one,” split it.
