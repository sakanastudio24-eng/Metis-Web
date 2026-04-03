# Metis Magic Link Launch Setup

This is the launch setup for passwordless email sign-in in Metis.

Metis uses Supabase for the auth logic, the email template, and the sign-in link. The website keeps one callback route at `/auth/callback`, and the app exchanges the session there after the user clicks the link in their inbox.

## Launch defaults

- use Supabase passwordless email auth
- keep Google and GitHub unchanged
- keep `/auth/callback` as the only callback route
- use the Supabase default sender for launch
- do not add custom SMTP or Resend yet
- use `{{ .ConfirmationURL }}` in the Magic Link template

## Supabase dashboard setup

In `Authentication -> URL Configuration`, set:

- `Site URL` to `https://metis.zward.studio`
- `Additional Redirect URLs` to:
  - `http://localhost:3000/auth/callback`
  - `https://metis.zward.studio/auth/callback`

Use exact URLs first. The callback target in app code must match one of these allowed redirect URLs.

In `Authentication -> Email Templates -> Magic Link`, set:

- subject to `Sign in to Metis`
- body to the branded HTML template below

Leave SMTP unset for now so launch uses Supabase's default sender. Custom SMTP can be added later if branded deliverability becomes necessary.

## Paste-ready Magic Link template

```html
<h2>Sign in to Metis</h2>

<p>Click the button below to sign in securely.</p>

<p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 18px;border-radius:8px;text-decoration:none;">
    Sign in to Metis
  </a>
</p>

<p>This sign-in link expires soon.</p>

<p>If you didn’t request this email, you can safely ignore it.</p>

<p>If the button doesn’t work, copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
```

Important rule:

- keep `{{ .ConfirmationURL }}`
- do not swap this to `{{ .RedirectTo }}` unless Metis moves to a custom token-hash confirm flow later

## App-side auth behavior

Metis already uses this client call:

```ts
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: "http://localhost:3000/auth/callback",
  },
})
```

For production, the redirect target should be the production callback URL.

The current product behavior stays:

- auth entry on the website
- `signInWithOtp()` for email magic link
- `/auth/callback` for callback exchange
- `/logged-in` as the short onboarding handoff
- `/account` as the canonical signed-in home

## Launch QA checklist

- send a magic link from the local auth UI
- confirm Supabase sends the email
- click the newest magic link once
- verify `/auth/callback` exchanges the session and completes sign-in
- click the same link twice and confirm the retry error is clear
- resend and verify the newest email is the one that works
- confirm Google and GitHub still use the same callback route without regression

