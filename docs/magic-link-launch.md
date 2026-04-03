# Metis Magic Link Launch Setup

This is the launch setup for passwordless email sign-in in Metis.

Metis uses Supabase for the auth logic, the email template, and the sign-in link. Resend only handles SMTP delivery once Supabase is configured to use it. The website keeps one callback route at `/auth/callback`, and the app exchanges the session there after the user clicks the link in their inbox.

## Launch defaults

- use Supabase passwordless email auth
- keep Google and GitHub unchanged
- keep `/auth/callback` as the only callback route
- use Supabase auth with custom SMTP through Resend
- keep Resend as the delivery layer only
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

In `Authentication -> SMTP Settings`, configure your verified Resend sending domain and SMTP credentials. Keep Supabase in charge of generating the link and rendering the template. Resend should only deliver the message.

## Paste-ready Magic Link template

```html
<h2>Sign in to Metis</h2>
<p>Click below to sign in securely.</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to Metis</a></p>
<p>This link expires soon.</p>
<p>If you didn’t request this email, you can safely ignore it.</p>
<p>{{ .ConfirmationURL }}</p>
```

Important rule:

- keep `{{ .ConfirmationURL }}`
- do not swap this to `{{ .RedirectTo }}` unless Metis moves to a custom token-hash confirm flow later
- keep the email branded but basic so it stays reliable across inboxes

## App-side auth behavior

Metis already uses this client call:

```ts
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: "https://metis.zward.studio/auth/callback",
  },
})
```

This is now the default even during localhost testing so cross-device sign-in can finish on a phone or another laptop.

If you need strict same-browser localhost testing, use the explicit engineering override:

```txt
/sign-in?magic_link=local
/sign-up?magic_link=local
```

That opt-in path sends the email to `http://localhost:3000/auth/callback` instead.

The current product behavior stays:

- auth entry on the website
- `signInWithOtp()` for email magic link
- `/auth/callback` as a tiny loading screen that exchanges the session and redirects onward
- `/logged-in` as the short onboarding handoff
- `/account` as the canonical signed-in home

The callback screen should only say:

- `Signing you in...`
- `Redirecting...`

## Launch QA checklist

- send a magic link from localhost and open it on a phone
- confirm Supabase sends the email
- click the newest magic link once
- verify `/auth/callback` shows the short signing-in handoff and completes sign-in
- verify normal website auth lands on `/logged-in`
- click the same link twice and confirm the retry error is clear
- resend and verify the newest email is the one that works
- confirm Google and GitHub still use the same callback route without regression
