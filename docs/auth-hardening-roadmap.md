# Authentication Hardening Roadmap

Kindora web authentication uses short-lived access JWTs held only in browser memory and rotating opaque refresh tokens in Secure, HttpOnly, SameSite cookies. PostgreSQL is authoritative for refresh-token families; Redis coordinates distributed rate limits and WebSocket revocation/fan-out when available.

## Status

| Priority | Item | Status | Notes |
| --- | --- | --- | --- |
| High | Hash every refresh token | Complete | PostgreSQL stores only SHA-256 token hashes |
| High | Atomic refresh rotation and replay handling | Complete | Fixed-lifetime token families revoke on replay |
| High | Redis-backed distributed auth rate limiting | Complete | Atomic Redis counters; process-local fallback during outages |
| High | Secure Google Sign-In | Complete | Verified ID tokens, stable `sub`, invited accounts only, one-time nonces |
| Medium | Logged-in devices and session-management API/UI | Pending | Implement before exposing account session management to users |
| Conditional | Redis session-validation cache | Deferred | Implement only if database-auth measurements justify it |
| Medium | Live Google Sign-In provider test | Pending | Requires a dedicated Google test project and browser account |

## Completed controls

### Refresh-token protection

- Raw refresh tokens are returned only to the intended client or browser cookie jar.
- PostgreSQL stores only SHA-256 hashes.
- Rotation atomically consumes the current token and creates one descendant.
- Concurrent rotation has one winner; replay revokes the family.
- Family expiry is absolute, so rotation cannot extend a session forever.
- Logout, password reset, account deactivation, and explicit revocation invalidate sessions.

### Distributed authentication rate limiting

- Redis uses an atomic increment-and-expire script shared by API instances.
- Existing `Retry-After` behavior is preserved.
- Local development and Redis outages fall back to bounded process-local counters.
- No password, provider credential, access token, or refresh token is part of a rate-limit key.

### Google Sign-In

- The frontend uses Google Identity Services authentication with FedCM rather than the Google API authorization-code flow.
- The backend accepts the ID token only in a POST body and never puts provider credentials in URLs.
- Verification pins RS256, Google's issuer, the configured audience, expiry/issued-at, verified email, stable `sub`, and nonce.
- Every browser tab receives an independent database-backed nonce; consumption is atomic and single-use.
- The first verified login may link only to an existing employee email. Unknown Google users are rejected and cannot be auto-provisioned.
- Later logins resolve by `(provider, sub)`, not mutable email.
- One Google identity per employee is enforced by database constraints.

## Remaining work

### Logged-in devices and session management

Backend:

- Store safe session metadata such as creation time, last activity, and an approved coarse device label.
- Add tenant-safe endpoints to list sessions, revoke one session, and revoke all other sessions.
- Never return refresh-token hashes.
- Broadcast revocation so matching WebSockets close on every API instance.

Frontend:

- Add an account-security view listing only the current employee's sessions.
- Mark the current session and provide localized revoke actions with confirmation and loading/error states.

### Redis session-validation cache

This remains intentionally deferred. PostgreSQL stays authoritative. Add a short-lived Redis cache only if production traces show session validation materially affects latency or database capacity; cache entries must never outlive or override authoritative expiry/revocation.

### Live Google provider test

Deterministic tests already cover cryptographic claim validation with local signing keys, origin enforcement, nonce replay, concurrent tabs, invitation-only linking, stable-subject lookup, and duplicate-link rejection.

A real provider test still requires infrastructure that cannot live in the repository:

- A separate Google Cloud test project and web client.
- Exact test HTTPS origins and no production tenant access.
- A dedicated test Google account stored in CI/browser secrets.
- Assertions for consent, cancellation, invalid audience, provider-key rotation, and cleanup.

## Production checklist

- Use separate Google Cloud projects for development and production.
- Register only exact owned HTTPS origins in the production client.
- Keep the OAuth consent screen, verified domains, privacy policy, and support contacts current.
- Set `COOKIE_SECURE=true` and a strong `JWT_SECRET`.
- Configure Redis for every multi-instance deployment and alert on local rate-limit fallback logs.
- Leave `TRUST_PROXY` disabled unless a trusted reverse proxy replaces forwarded-IP headers.
- Allow the Google Identity Services script, frame, and connection origins in the production Content Security Policy.
- Apply database migrations before deploying the frontend that calls `/auth/google`.
