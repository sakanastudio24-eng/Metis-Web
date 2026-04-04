# Metis Access State Contract

This contract defines shared access-state and feature-gating behavior.

## Canonical access shape

```ts
type AccessState = {
  isAuthenticated: boolean;
  tier: "free" | "plus_beta" | "paid";
};
```

## Truth sources

Access state should come from validated communication state, not hardcoded UI assumptions.

Server-side truth can come from:

- auth session metadata
- backend validation response
- profile or account table later

## Extension feature gating

- signed out → `Sign in to unlock full insights`
- free → limited report behavior
- plus beta → deeper report and premium-request eligibility
- paid later → future paid behavior without changing the core model

## Gating rule

Do not gate features through hardcoded UI alone.

The extension should derive what to show from validated access state.

## Sync rule

The extension stays useful while signed out.

Connected account state adds:

- authenticated status
- tier-aware UI
- access to account-linked requests

It does not turn the extension into a website-dependent product.

## Done across the contract set

- [x] validated account state is returned by `POST /v1/extension/validate`
- [x] the shared tier model is locked to `free`, `plus_beta`, and `paid`
- [x] website and extension contract docs both treat signed-in and entitlement state as separate concerns
- [ ] final live entitlement wiring for Plus Beta and paid behavior still needs production verification
