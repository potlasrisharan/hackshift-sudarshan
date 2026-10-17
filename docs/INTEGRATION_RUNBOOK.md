# Running the integrated clinical milestone

This is the first working slice of `PROJECT_INTEGRATION_PLAN.md`, for synthetic
records only. It connects a React clinic workspace to persistent intake and
clinician review. It is not full operational parity or a clinical deployment.

## Start locally

Use Node >=22.13 (Node 24 recommended), then:

```sh
npm ci
npm run integration:dev
```

Open http://127.0.0.1:8790. The local server builds the React site, applies the
idempotent initial schema and seeds two synthetic tenants. It binds to loopback
only. Records persist in `.local/integration.sqlite`, including after restart.
The SQLite adapter is local development infrastructure, not Worker code.

Sign in with organization `demo`, email `doctor@demo.test`, password
`Dhaaga-demo-2026!`. A second browser can use `nurse@demo.test` and the same local
demo password to create an intake while the doctor watches the queue. Additional
seeded accounts are `admin`, `cashier` and `east-doctor` at `@demo.test`.
`other-org` has its own separate records. These published credentials are for
synthetic local development, never production accounts.

1. Open Patient intake and enter a synthetic patient's confirmed demographics.
2. Complete the red-flag screen and confirm care consent.
3. Submit once; the app opens the server-issued encounter. A second clinician
   session in the same clinic sees it in the queue, which polls every 5 seconds.
4. Sign in as the doctor and save a review note. The note and actor/time persist.
5. Record withdrawal of care consent to remove the encounter from clinical reads
   and deny further review/replay. Revocation is currently staff-assisted.

A positive danger answer shows immediate emergency guidance and persists an
emergency encounter. Routine review cannot downgrade it. Queue ordering places
emergency records first. This illustrative engine is not clinically calibrated.
No diagnosis, SOAP, prescription or insurance approval is fabricated on failure.

Sessions remain in browser memory, expire after one hour and are revoked on
successful sign-out. Reload requires sign-in; the encounter URL and server record
remain. No health records or bearer tokens are written to browser storage.

The canonical API contract is served at `/openapi.json`.

## Verification

```sh
npm test
npm run lint
npm run typecheck
npm run integration:build
npm run integration:worker:build
npm run integration:worker:smoke
npx playwright install chromium
npm run integration:e2e
npm run verify-untouched
```

Unit/integration tests use actual SQLite with foreign keys and batch rollback,
not mocked repository responses. The Worker smoke test runs the bundled Worker
in local workerd with a real local D1 binding, including concurrent duplicate
submissions and rollback after a failed batch. Browser tests cover separate
nurse/doctor sessions, review persistence, revocation, emergency protection,
mobile layout and visible server errors. Browser runs use a separate database
per test-run process rather than changing the normal development workspace. These do not establish production D1
latency, remote deployment, clinical safety or native-app behavior.

The legacy synthetic demo remains available through `npm run dev` / `npm run
build`; its separate routes and ephemeral fixtures have not been silently mixed
with the persistent integration. The new entrypoint is explicit until parity
and cutover gates pass.

## Cloudflare configuration

`backend/wrangler.jsonc` targets `backend/src/index.ts` and the built React
assets. It includes D1 but no unused mock Durable Objects, KV, R2 or Queue
bindings. Add those only when their implementations and tests exist.

The D1 database ID is intentionally absent: no hosted resource has been created
or selected. Dry-run bundling requires no remote ID. Local Wrangler development
can use the named database and `integration:worker:migrate`; it does not run the
Node demo seed automatically. The smoke harness creates and seeds an isolated,
throwaway local D1 database for repeatable verification.

Do not deploy the development seed or point this milestone at real records.
Production login is disabled. This slice uses opaque hashed session tokens and
PBKDF2-SHA256 password hashes (100,000 iterations) for its local synthetic users;
PRD Argon2id/JWT/refresh, production provisioning, kiosk device sessions, patient
handoff credentials, identifier encryption and hash-chained audit remain pending.
Patient/complaint text is stored as plaintext synthetic data in this local slice.

## Outstanding integration

Prescription signing, actual stock reservations/POS/accounting, procurement,
wards/staff and the remaining Project 1 capabilities; full SOAP/OCR/speech,
AYUSH/provider workflows; home monitoring/events; Flutter connectivity and device
verification; production auth/security/retention and final parity/cutover.
Unimplemented API paths return an error, rather than the previous scaffold's
hardcoded success. Capabilities explicitly report dispensing and live providers
as unavailable. Original imported projects remain unchanged.
