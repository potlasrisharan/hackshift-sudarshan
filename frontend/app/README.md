# DHAAGA Flutter kiosk — Phase 2 synthetic intake

Active project: frontend/app. Android tablet + Web source. The synthetic intake now uses the shared staff-authenticated encounter API: entered demographics → complaint/structured safety questions → consent → server receipt. Optional Android speech is implemented with a typed Web fallback. OPD tokens, wait estimates, QR and identifier lookup are explicitly unavailable in the current contract.

See [the Phase 2 gate](../../docs/MOBILE_KIOSK_PHASE2.md) for evidence and limitations. The public Worker still exposes the legacy API, so local persistent integration verification does not imply live hosted intake. OCR, encrypted offline sync, lockdown, APK and device speech verification remain later gates. Use synthetic information only.

## Toolchain and run

Use **Flutter 3.35.7 / Dart 3.9.2**, pinned in `.fvmrc`. Riverpod remains **2.6.1**
with generator **2.6.5**, as requested. Its analyzer 7.x crashes when resolving
the installed Flutter 3.47 SDK's newer language constructs. `go_router` 16.2.4
is pinned to the compatible SDK. Do not silently upgrade Riverpod to 3.x or
override the analyzer constraint.

On this machine, a separate SDK is at
`Desktop/IIITD hackshift/.tools/flutter-3.35.7`; the original SDK is unchanged.
On another machine, install this Flutter version or use FVM.

From this directory, using that SDK's `flutter` and `dart`:

```sh
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter analyze
flutter test --coverage
flutter run -d chrome --dart-define-from-file=config/production.json
flutter build web --release --no-web-resources-cdn --pwa-strategy=none --dart-define-from-file=config/production.json
```

Android: open this folder in Android Studio, select the pinned Flutter SDK and
a compatible JDK (21), configure the Android SDK, and run with the same defines.
Android build, tablet emulator tests and device-owner setup are later gates.

The API URL exists only in `config/production.json`, injected with a Dart define.
No URL is embedded in feature source. Missing configuration is a localized safe
failure. Configuration accepts HTTPS `/api/v1` URLs only; credentials, query
strings and fragments are rejected. No environment secrets belong in this file.

## Architecture

- `lib/core/constants`: environment configuration and palette.
- `lib/core/network`: Dio, bounded idempotent retries, safe diagnostic events,
  and exception-to-failure mapping.
- `lib/core/error`: sealed failures/results and localized error text.
- `lib/core/theme`, `router`, `localization`: Material 3, Elder Mode, guarded
  GoRouter and generated ARB strings.
- `lib/core/storage`: documents the disabled storage boundary pending Phase 4.
- `features/intake/domain`: immutable entities, sealed flow states, repository
  interfaces and health/intake use cases. No Flutter/Dio/Riverpod dependencies here.
- `features/intake/data`: typed generated health/intake DTOs, speech adapter, remote source and repositories.
- `features/intake/presentation`: generated Riverpod providers and responsive UI.

Health recognizes both actual backend contracts. Intake DTOs follow packages/shared/integration.ts and backend/src/index.ts. Staff tokens and drafts remain in memory; completion retains only receipt metadata. A failed/uncertain submit freezes its body and UUID key for replay; this is not durable offline support. The router cannot fabricate a receipt or skip required input/consent. The actual API provides no OPD token, wait estimate or QR specification.
Archived originals under `hackshift/projects/` remain unchanged.

## Type-safe generation and localization

Run `build_runner`; do not edit generated files. The small local build-only
package `tool/typed_json`:

1. delegates field generation to `json_serializable`, replacing its generated
   JSON `dynamic` boundary type with `Object?`;
2. generates a typed Flutter `AppStrings` delegate from the four ARB files,
   validating identical keys and avoiding generated null assertions/untyped
   delegate lists.

No handwritten or generated `lib/` code uses `dynamic` or null assertions.
The ARB builder currently supports plain string messages; future pluralized or
parameterized messages require an explicit builder extension with tests.
Riverpod's normal generator creates the providers; intake flow and health use
AsyncNotifier. Preferences use a synchronous generated Notifier for local UI
settings, with immutable values and no `setState` business logic.

Four Noto font families and their SIL Open Font Licenses are bundled in
`assets/fonts/`; no runtime Google Fonts request is made. Noto Sans is also registered under
Flutter Web's default Roboto family so the engine's fallback stays local. Source:
https://github.com/google/fonts/tree/main/ofl
Translations are draft interface translations and need native-speaker review.
AAA claims are limited to tested Elder Mode foreground/background text pairs;
this is not a full accessibility conformance certification.

## Network and privacy boundaries

- Dio timeouts: connect 10 s, send 15 s, receive 20 s; automatic redirects off.
- Up to two retries for transient GET/HEAD/OPTIONS failures, with 250/500 ms
  backoff; numeric Retry-After is capped at 10 s. Cancellation stops retries.
- A future write must explicitly assert a server-verified idempotency contract,
  have a nonempty Idempotency-Key, and use replayable JSON to be retried. No
  current feature submits a write. Multipart uploads are not auto-replayed.
- Diagnostics are disabled unless a sink is injected. The interceptor emits
  only allowlisted HTTP method, numeric status and success/failure category:
  no URL, headers, body, response text or raw exception. Sink failures cannot
  interrupt the request. No crash reporting provider is configured.
- Raw server messages never reach the UI. All failures use localized ARB text.
- No phone, ABHA, complaint, image or unsent session is collected or persisted
  in this phase. No empty-string phone hash or invented salt is used.

## Contract discrepancies blocking live intake

Audited against remote `main` 0e7dba9 and the live published OpenAPI:

- The deployed Worker uses `apps/api/worker.ts` → `apps/api/app.ts`.
  `GET /healthz` is public at the origin root. `/api/v1/healthz` returns 401.
- Neither `/api/v1/intake/session` nor `/api/v1/ocr/prescription` is deployed.
- The separate `backend/src/modules/intake/routes.ts` stub returns
  `sessionId,status,triageTier,timestamp`; it does not validate input or issue
  `tier,tokenNumber,estimatedWaitMinutes`.
- `packages/shared/index.ts` declares `phoneHash: string` but no normalization,
  hash domain/version/salt, intake request schema or QR payload specification.
- Live capabilities explicitly report `rawPhiAllowed:false`,
  `liveUpstreams:false`; health reports `persistentStorage:false`.

Agree and implement shared request/response, privacy, idempotency and QR
contracts before Phase 2 integration. Synthetic fixtures are not evidence of
live ABHA verification. No real patient data may be used against this demo.
Backend deployment remains a separate step; this phase changes no Worker.

## Phase 1 verification

See `docs/MOBILE_KIOSK_PHASE1.md` at the repository root for exact measured
results and remaining gates. `test/live_health_test.dart` is an opt-in **read**
smoke, not a live session submission:

```sh
flutter test test/live_health_test.dart --dart-define=LIVE_API=true --dart-define-from-file=config/production.json
```

The full Definition of Done remains unmet until the later gates: real contracted
session/token response, OCR, encryption/offline exactly-once sync, automatic reset,
lockdown, APK and tablet emulator/device checks.

Optional CI: `tool/ci/kiosk-flutter.yml.example` contains a Flutter verification
workflow template. It is not enabled; copy it into `.github/workflows/` when
CI ownership and workflow publishing permissions are configured.

## Same-origin synthetic integration

Use the backend/local server and synthetic staff accounts documented in docs/INTEGRATION_RUNBOOK.md. Build with --dart-define=API_BASE_URL=https://YOUR-SAME-ORIGIN/api/v1 and serve API and Flutter assets behind that HTTPS origin. No staff password or token belongs in a Dart define. Cross-origin browser calls are deliberately rejected by this backend. The production config points at the legacy public service and currently cannot submit encounters.
