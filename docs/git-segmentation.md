# Git Segmentation Notes

This repo should be easy to review, easy to rewrite, and easy to roll back in small pieces.

## What section commits mean here

A request should land as the smallest meaningful checkpoint, not as one broad surface commit.

If the change touches auth entry, onboarding, dashboard, copy, and docs, that should become separate commits when those sections can stand on their own.

## The working rule

Finish one section. Commit that section. Move to the next section.

If the honest answer to "what changed?" is more than one section, the commit is still too broad.

## Good examples

1. Auth entry only
2. Onboarding completion state only
3. Account dashboard layout only
4. Security flow only
5. Plan and pricing copy only
6. Docs only

## Bad examples

1. One large auth UI commit that also changes onboarding and dashboard
2. One dashboard cleanup commit that touches account, security, pricing, and settings together
3. One copy commit that mixes product copy, legal copy, and docs

## Why this matters

Metis Web changes fast. If sections are bundled together, one bad section forces a rollback that takes good work with it. Small checkpoints keep the nearest safe restore point close to the actual surface that changed.

## Reporting rule

When work is done, report the section commits clearly so the next person knows which checkpoint to return to.
