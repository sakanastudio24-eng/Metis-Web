# Runtime Secrets Flow

Metis Web is prepared for runtime secret injection, but the final wiring step is still intentional and shared.

## Why this stays staged

Secrets are one of the easiest places to create long term mess. A rushed setup usually leads to leaked local values, env names that drift between services, or temporary auth work that never gets cleaned up. This repo avoids that by locking the contract first and leaving the real injection step for a deliberate pass.

## Current env contract

Web

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_BASE_URL
```

API

```txt
DATABASE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
FRONTEND_URL
```

OAuth archive

```txt
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

## Callback shape

The website callback path is fixed at `/auth/callback`.

The allowed website callback URLs are:

```txt
http://localhost:3000/auth/callback
https://metis.zward.studio/auth/callback
```

For Google and GitHub, the provider dashboard redirect URI should point at the Supabase project callback:

```txt
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

## What happens today

`.env.example` documents the contract. The Next app validates the public values it needs. The FastAPI layer validates the server contract. Missing values should fail clearly instead of half working.

## What happens in the shared 1Password step

1. Create the secrets in 1Password.
2. Map them to the reserved names above.
3. Inject them into the Next runtime.
4. Inject the shared backend values into FastAPI.
5. Confirm the website and `/readyz` both fail clearly when a required value is missing.

That keeps the secret story boring, which is the right outcome.
