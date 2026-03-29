# Metis Web Design System Logic

This document defines the website-side design logic that should stay stable through launch.

## Design goal

Metis Web should feel trustworthy, polished, and product-led. It should present a real account system and a clear public story without drifting into either generic SaaS chrome or extension-style density.

## Surface roles

- landing pages: product story, trust, and entry into auth
- auth overlays and recovery flows: direct, calm, and low-friction
- onboarding: short setup handoff, not a second dashboard
- account pages: durable management surface
- security pages: high-clarity, low-ambiguity controls

These surfaces should feel related, but each one should preserve its own density and tone.

## Core visual logic

- public marketing and signed-in account UI should share tokens, not share the same layout behavior
- auth screens should feel quieter than landing pages
- account and security surfaces should prioritize clarity over flourish
- motion should help route changes, panel reveals, and feedback states feel deliberate
- visual trust comes from consistency, not excess decoration

## Token and component rules

- shared color, spacing, border, and radius tokens should stay centralized
- auth, account, and security UI should reuse the same field, button, card, and feedback language
- legal, pricing, onboarding, and auth copy should feel like one brand voice
- private-route UI should not pick up marketing-only treatments unless there is a real product reason

## Product-boundary logic

- website account state is real and should look real
- staged Plus Beta and API Beta sections should look intentional without overstating entitlement that is not live yet
- temporary auth or review-only tooling must never inherit polished public-product framing

## Production pass checklist

- landing, auth, onboarding, account, and security share one clear visual system
- copy, spacing, and component behavior remain consistent across mobile and desktop
- staged beta sections do not overpromise live backend behavior
- legal and recovery flows feel as considered as the public marketing pages
- final SEO and OG work uses the same visual language as the shipped site
