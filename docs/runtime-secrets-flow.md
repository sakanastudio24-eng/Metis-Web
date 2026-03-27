# Runtime Secrets Flow

Metis Web is being prepared for 1Password runtime injection, but the final secret wiring is intentionally a joint step.

## Why this is staged

Secrets work is one of the easiest places to create accidental mess:

- hardcoded local values that leak into commits
- env names that drift between the web app and API
- “temporary” auth scaffolding that becomes permanent by accident

This repo avoids that by locking down the names first and delaying the real injection step until the deployment environment is confirmed.

## Reserved env names

The current implementation expects these names to exist once runtime injection is turned on:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WARD_STUDIO_URL`
- `NEXT_PUBLIC_METIS_API_BASE_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `EMAIL_AUTH_FROM`
- `EMAIL_AUTH_SERVER`
- `API_PORT`
- `API_ALLOWED_ORIGINS`

## What happens today

- `.env.example` documents the contract
- the Next.js app validates the public and server-facing values
- the FastAPI scaffold validates the same contract from Python

## What happens in the joint 1Password step

When it is time to wire the real environment:

1. create the secrets in 1Password
2. map them to the reserved env names above
3. inject them into the Next.js runtime
4. inject the same shared values into the FastAPI runtime
5. verify both `/readyz` and the web app boot path fail clearly if a required value is missing

That keeps the secret story boring, which is exactly what it should be.
