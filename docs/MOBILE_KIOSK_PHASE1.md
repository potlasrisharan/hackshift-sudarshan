# DHAAGA Mobile Kiosk — Phase 1 checkpoint

Date: 17 October 2026. Branch: `feat/mobile-kiosk`.
Active Flutter project: `frontend/app/` inside the requested Desktop checkout.

## Scope delivered

- Created the active Flutter project from the archived kiosk platform scaffolding.
  Original projects still match `baseline-untouched`. Removed the inherited fake
  patient, OCR, assessment and token flows from the active application.
- Added Clean Architecture domain entities/repository/use case, data DTO/source/
  repository, presentation providers, and core network/error/theme/router/storage
  boundaries. The five later intake screens are explicit unavailable states.
- Added Dio configuration via `config/production.json` → `API_BASE_URL` define;
  HTTPS-only validation, timeouts, bounded idempotent backoff and cancellation.
- Added allowlisted status-only diagnostics and sealed safe failures/results.
  No request/response/error bodies, headers or URLs are logged or shown in errors.
- Added Riverpod 2.x codegen, AsyncNotifier for health and sealed intake flow,
  immutable preferences, and guarded routes. Business state uses no `setState`.
- Added generated immutable json_serializable health DTOs with `Object?`
  boundaries, four ARBs, typed AppStrings generation, bundled Noto fonts and
  licenses, Material 3 dark theme, 56 dp control minimums, screen-reader labels,
  ordered focus and High-Contrast Elder Mode.
- Pinned compatible Flutter 3.35.7/Dart 3.9.2, Riverpod 2.6.1, generator 2.6.5 and
  go_router 16.2.4. An isolated SDK was installed under the requested folder's
  `.tools`; the existing Flutter installation was not modified.

## Verification

All Flutter/Dart commands below used the pinned SDK from `frontend/app/`.

| Command/check | Measured result |
|---|---|
| `flutter pub get` | Passed; lockfile saved |
| `dart run build_runner build --delete-conflicting-outputs` | Passed; seven generated outputs |
| `flutter analyze` with strict casts/raw-types/inference | 0 issues |
| `flutter test --coverage` | 28 passed; opt-in network test skipped in ordinary suite |
| `flutter test test/live_health_test.dart --dart-define=LIVE_API=true --dart-define-from-file=config/production.json` | 1 passed; read-only live health |
| Domain/data LCOV line coverage | 37/38 lines = 97.4%, including generated health DTO; Phase 1 slice only |
| `flutter build web --release --no-web-resources-cdn --pwa-strategy=none --dart-define-from-file=config/production.json` | Passed; assets in `frontend/app/build/web` |
| `bash scripts/verify-untouched.sh` | Passed |
| Source scan of all `lib/` Dart, including generated | 0 dynamic keywords, 0 null assertions, 0 embedded HTTP(S) URLs |
| Font cmap inspection against all four ARBs | All characters covered by bundled families; all four fonts upright |
| Chrome browser walkthrough | Four locales, unique control semantics, Elder Mode, portrait/landscape Web viewports, live health display and unavailable intake route passed; no runtime errors |
| Browser request observation | Only the health endpoint was observed as an external request; no external font download. This is a walkthrough observation, not a system-wide egress audit |

Unit tests cover configuration, failure mapping, malformed/missing response data,
DTO mapping, retry exhaustion, auth/validation no-retry, nonempty idempotency key
gating, Retry-After bounds, cancellation, logging allowlists, duplicate health
requests and state resets. Widget checks load real bundled fonts and exercise
all four languages with Elder Mode at text scale 2.0 without overflow, semantics,
touch sizes and denial of fabricated queue deep links. Tested Elder Mode text
pairs meet 7:1 contrast; full accessibility certification is not claimed.

An optional Flutter CI template is included at
`frontend/app/tool/ci/kiosk-flutter.yml.example`; it is not an enabled workflow.
Remote CI results are reported separately from these local checks.

## Contract discrepancies and open risks

1. The deployed Worker is `apps/api/worker.ts` → `apps/api/app.ts`; its public
   health route is **origin `/healthz`**, not `/api/v1/healthz` (401).
2. The live OpenAPI has no `/api/v1/intake/session` or `/api/v1/ocr/prescription`.
   The separate undeployed backend's intake stub has no validated request and
   returns `sessionId,status,triageTier,timestamp`, not the requested
   `sessionId,tier,tokenNumber,estimatedWaitMinutes`.
3. The shared package defines `phoneHash` but no normalization/hash scheme/salt,
   submission schema, idempotency guarantee or QR payload. No substitute was
   invented or integrated. These shared contracts must be established before
   Phase 2 live submission.
4. The live service reports synthetic-demo only, `rawPhiAllowed:false`,
   `liveUpstreams:false`, and no persistent storage. No real patient data was
   collected, sent or persisted in Phase 1.
5. Translation text needs native-speaker review. The small typed ARB generator
   supports plain string messages; ICU plurals/parameters need an explicit
   extension when required. json_serializable and Riverpod remain the actual
   model/provider generators.
6. Android command-line tools/device verification, APK, OCR, voice permissions,
   encrypted offline queue, background retry, auto-reset and device lockdown
   remain later gates. No Worker was deployed in this phase.

## Full Definition of Done at this gate

- [x] Dependency resolution and code generation succeed.
- [x] Strict analyzer reports zero issues.
- [x] Current tests pass; current domain/data slice exceeds 80% coverage.
- [ ] Full mocked intake walkthrough and all six functional screens.
- [ ] Live session POST returns a server token rendered by the app.
- [ ] Airplane-mode encrypted queue reconnects and syncs exactly once.
- [x] Current display strings use ARBs; current colors use the theme/palette;
  current API URL is environment configuration; no sample patient data in `lib/`.
- [ ] Android APK and tablet portrait/landscape verification.
- [ ] Final production readiness review, including remaining privacy contracts.

Phase 1 is a verified foundation preview. Stop here for the requested gate;
Phase 2 has not been implemented or claimed complete.
