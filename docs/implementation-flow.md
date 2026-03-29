# Implementation Flow

This repo is built in the same order a person meets the product.

## 1. Start with the public site

The first job is the website itself. It has to explain what Metis is, why it matters, and what the extension actually does. If that part is unclear, everything after it feels heavier than it should.

## 2. Move people into access

Once the public story is solid, the next step is access. The website owns sign in, sign up, verification, recovery, onboarding, account settings, and security. That keeps the extension free to stay focused on scanning and reporting.

## 3. Keep product boundaries honest

Metis Web handles the account layer. The extension handles the runtime product. FastAPI stays narrow and only covers backend proof points that need a protected API shape. Supabase stays the source of truth for identity.

## 4. Keep the notes readable

The docs in this repo should read like a real handoff. A founder, designer, or engineer should be able to open them and understand the product shape without decoding internal shorthand first.
