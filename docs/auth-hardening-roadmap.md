# Authentication Hardening Roadmap

The web frontend already uses opaque server-side sessions stored in PostgreSQL and referenced by Secure, HttpOnly cookies. The items below are follow-up improvements, primarily for explicit non-browser clients and production operations.

## Remaining work

| Priority | Item | Status | When to implement |
| --- | --- | --- | --- |
| High | Hash external-client refresh tokens | Pending | Before enabling mobile or external API clients in production |
| High | Atomic refresh rotation with token-family and replay tracking | Pending | Before enabling mobile or external API clients in production |
| High | Redis-backed distributed login rate limiting | Pending | Before running multiple production API instances |
| Medium | Logged-in devices and session-management API/UI | Pending | Before exposing account session management to users |
| Conditional | Redis session-validation cache | Deferred | Only after measurements show PostgreSQL session validation is a bottleneck |
| Medium | Live Google OAuth exchange test | Pending | When a dedicated OAuth test project and credentials are available |

## 1. Hash external-client refresh tokens

External-client refresh tokens should receive the same database protection as web-session tokens.

- Generate a cryptographically random raw refresh token.
- Return the raw value only once to the client.
- Store only a SHA-256 hash in PostgreSQL.
- Look up refresh sessions using the token hash.
- Migrate or revoke existing plaintext refresh-token records.
- Ensure logs, telemetry, and error responses never expose raw tokens.

### Acceptance criteria

- No raw refresh token is stored in PostgreSQL.
- Login, refresh, logout, and logout-all continue to work for explicit token clients.
- Tests confirm that database records cannot be used directly as credentials.

## 2. Atomic refresh rotation and token families

Refresh rotation must remain correct when requests arrive concurrently or a consumed token is replayed.

- Add a token-family identifier shared by every rotation descendant.
- Store parent/replacement relationships or equivalent rotation metadata.
- Claim a refresh token atomically using a database transaction or compare-and-swap update.
- Allow only one request to rotate a given token successfully.
- Detect reuse of consumed tokens.
- Revoke the affected token family when genuine replay is detected.
- Add absolute family expiration so rotation cannot extend a session indefinitely.
- Add concurrency tests that issue simultaneous refresh requests.

### Acceptance criteria

- Exactly one concurrent rotation succeeds.
- A replayed consumed token cannot mint another access token.
- Replay revokes the intended token family without affecting unrelated device sessions.

## 3. Distributed login rate limiting

The current in-process limiter does not share counters across API instances. Redis should become the shared rate-limit backend before horizontally scaling the API.

- Use atomic Redis increments with expiration.
- Key limits by normalized account identifier and client IP where appropriate.
- Preserve the current `Retry-After` response behavior.
- Define explicit behavior during Redis outages.
- Avoid logging passwords, tokens, or sensitive request bodies.
- Add tests using two independent API instances against the same Redis server.

### Acceptance criteria

- Attempts against instance A affect limits enforced by instance B.
- Counters expire at the expected time.
- Redis failure behavior is documented and tested.

## 4. Logged-in devices and session management

Users should eventually be able to inspect and revoke their active web sessions.

### Backend

- Store safe session metadata such as creation time, last activity, approximate device label, and coarse IP information if approved by the privacy policy.
- Never return session-token hashes.
- Add tenant-safe endpoints to list sessions, revoke one session, and revoke all other sessions.
- Prevent users from revoking another employee's sessions.
- Broadcast revocation so matching WebSockets close immediately across API instances.

### Frontend

- Add an account-security view listing active sessions.
- Clearly mark the current session.
- Provide “Sign out” and “Sign out all other devices” actions with confirmation and loading/error states.
- Localize all visible text in English and Spanish.

### Acceptance criteria

- Users see only their sessions.
- Revoking a session invalidates its API requests and closes its chat sockets.
- Cross-tab logout behavior remains consistent.

## 5. Redis session-validation cache

This is intentionally deferred until production measurements show PostgreSQL session validation is a meaningful bottleneck.

If justified:

- Keep PostgreSQL as the authoritative session store.
- Cache only the minimum validation result in Redis.
- Use a short TTL, initially 30–60 seconds.
- Delete cache entries when sessions are revoked.
- Broadcast revocation across API instances.
- Fall back to PostgreSQL when Redis is unavailable.
- Never allow a cache entry to outlive the authoritative session expiration.

### Decision gate

Implement only when traces or database metrics show session-validation queries materially affect latency or database capacity.

## 6. Live Google OAuth exchange test

Current automated coverage verifies signed OAuth state generation, mismatch rejection, and tamper rejection. A complete provider exchange requires a dedicated Google OAuth test project.

- Create isolated test client credentials and redirect URIs.
- Keep credentials in CI secrets, never in the repository.
- Test popup state issuance and single-use callback consumption.
- Test the server-redirect flow separately.
- Cover invalid state, replayed state, denied consent, invalid code, and inactive accounts.
- Ensure tests cannot create users in a production company.

### Acceptance criteria

- A real authorization-code exchange succeeds in the test environment.
- Missing, mismatched, expired, and replayed states fail.
- Test-created accounts and sessions are cleaned up.

## Recommended implementation order

1. Hash external refresh tokens.
2. Add atomic token-family rotation and replay handling.
3. Move login rate limiting to Redis.
4. Add the devices/session-management API and UI.
5. Add the live Google OAuth test environment.
6. Reconsider Redis session caching only after performance measurement.
