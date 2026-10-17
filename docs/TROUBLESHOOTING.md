# Troubleshooting

- **No page at localhost:** run `make setup`, then `make dev`. The default is
  http://127.0.0.1:8787. If assets change, rebuild; the service is not a watch server.
- **Consent/session expired:** start a new demo. Tokens and observations are
  intentionally in memory; a restart or expiry discards the synthetic session.
- **Server actions offline:** use the local algorithm lab; this is not a full
  encrypted offline record/sync implementation. Real data must not be entered.
- **PWA old shell:** unregister the service worker in browser developer tools
  and reload. Cache names must be bumped when publishing incompatible shell code.
- **Browser test port in use:** `REUSE_SERVER=1 npm run e2e` uses an already-running
  local server; CI otherwise starts its own.
- **Original P1 tests fail:** use the synthetic env documented in DISCOVERY.
  Tests mock HTTP; do not mistake their green result for live security validation.
- **Original P2 import fails:** SUPABASE_KEY is required at startup. Configure an
  authorized isolated test backend; do not point tests at the existing live data.
- **Android Gradle timeout:** wrapper downloads may time out; use an official
  downloaded Gradle distribution or increase network timeout. Do not downgrade
  SDK versions just to suppress an audit warning.
- **Cognee missing tokenizer:** cache tokenizer/model assets before enabling the
  Python egress guard. No health data is needed for initial asset downloads.
- **Cognee migration failure:** inspect the first exception in the log; a blocked
  asset download can surface as a migration error. Never disable the guard and
  then claim an offline proof.
- **AWS NoCredentials:** authenticate the intended account with AWS CLI, confirm
  `aws sts get-caller-identity`, then use the pinned-revision deploy script.
- **GitHub HTTP 408:** retry with HTTP/1.1 and a buffered post; verify remote refs
  before claiming success. No force push is needed.
