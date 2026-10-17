# DHAAGA Flutter kiosk

Patient intake for Android tablets and Web, in **frontend/app/**. The Phase 2
implementation uses the existing shared synthetic encounter API. It is a
staff-assisted demonstration; use synthetic information only.

## What works

- Hindi, English, Punjabi and Tamil interface with bundled Noto fonts.
- Material 3 dark theme and high-contrast Elder Mode.
- Staff sign-in, entered demographics, complaint and structured safety answers.
- Mandatory care consent before submission, with duplicate taps blocked.
- Server-issued encounter receipt and emergency guidance to inform clinic staff.
- Client-generated UUID-v4 idempotency key; an uncertain request keeps the same
  immutable payload and key for retry during the current app session.
- Visible 60-second receipt inactivity countdown. Activity extends the deadline;
  expiry or reset clears app-held intake, sign-in and voice state.
- Optional Android speech input source with an editable transcript, audio-level
  animation, silence timeout and typed fallback. Web uses typed input.

The API does **not** provide OPD tokens, wait estimates, QR payloads or phone/ABHA
lookup. The UI marks those features unavailable. An encounter reference is not a
queue token. No phone number or ABHA is collected or transmitted.

See [Phase 2 verification](../../docs/MOBILE_KIOSK_PHASE2.md) for the detailed
implementation record and [Phase 1](../../docs/MOBILE_KIOSK_PHASE1.md) for the
historical foundation audit.

## Toolchain

Use **Flutter 3.35.7 / Dart 3.9.2**, pinned in [.fvmrc](.fvmrc). Riverpod 2.6.1
and its 2.6.5 generator are retained. The generator's analyzer is incompatible
with the newer Flutter SDK previously installed on the development machine;
use the pinned SDK rather than overriding analyzer constraints.

On the original development machine the separate SDK is in
Desktop/IIITD hackshift/.tools/flutter-3.35.7. Other collaborators can install
that version or use FVM. Android also needs a configured Android SDK and
compatible JDK; JDK 21 was prepared during setup. Open frontend/app in Android
Studio and select the pinned Flutter SDK.

## Install, generate and verify

From the repository root:

```sh
cd frontend/app
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter analyze
flutter test --coverage
```

Run build_runner after changing DTO annotations, Riverpod providers or ARBs.
Do not edit generated Dart files manually. The build-only tool/typed_json package
uses json_serializable for DTOs and generates typed AppStrings from the four
ARB files. Its current ARB support is plain string messages; ICU parameters and
plurals require an explicit extension. All four translations need native-speaker
review.

## API configuration and running

API_BASE_URL is injected at build/run time. It must use HTTPS and end in
/api/v1, with no embedded credentials, query or fragment. No privileged value
belongs in a Dart define or committed configuration.

[config/production.json](config/production.json) points to the requested public
Worker. At Phase 2 verification that Worker served the legacy synthetic-demo
API: health worked, but encounter intake and OCR were not deployed there.
These commands run/build against that configuration; they do not make live
intake available:

```sh
flutter run -d chrome --dart-define-from-file=config/production.json
flutter build web --release --no-web-resources-cdn --pwa-strategy=none --dart-define-from-file=config/production.json
```

For functional synthetic intake, follow the
[integration runbook](../../docs/INTEGRATION_RUNBOOK.md) to start the persistent
backend and obtain its explicitly seeded local staff accounts. Serve the API and
Flutter assets behind the **same HTTPS origin**, and build with that origin:

```sh
flutter build web --release --no-web-resources-cdn --pwa-strategy=none --dart-define=API_BASE_URL=https://YOUR-SAME-ORIGIN/api/v1
```

Replace YOUR-SAME-ORIGIN with your configured HTTPS host. The backend deliberately
rejects cross-origin browser requests. Do not disable certificate checks in the
app or embed staff credentials. Production authentication is disabled in this
backend milestone; the local demonstration is not a production kiosk deployment.

## Shared contracts

The authoritative sources are
[shared integration schemas](../../packages/shared/integration.ts),
[patient/symptom schemas](../../packages/shared/contracts.ts) and
[Worker handlers](../../backend/src/index.ts).

| Operation | Contract used by the kiosk |
|---|---|
| Health | GET at origin /healthz; both actual backend response shapes are recognized |
| Staff sign-in | POST /api/v1/auth/login; token held in memory |
| Intake | POST /api/v1/encounters with Bearer authorization and Idempotency-Key |
| Intake body | patient {name, birthDate, gender, language}, chiefComplaint, answers, careConsent:true, synthetic:true |
| Response | Actual server encounter; status controls emergency presentation and id is the receipt reference |

The requested /intake/session token response and /ocr/prescription upload are
not current contracts. No substitute token, QR payload or phone hashing scheme
is invented by this app.

## Architecture and privacy

- lib/core contains environment configuration, Dio/retry/failure mapping, theme,
  localization and routing. Diagnostics allowlist method/status/outcome only;
  bodies, headers, URLs, raw exceptions and patient identifiers are not logged.
- features/intake/domain contains immutable entities, sealed flow states,
  repository interfaces and use cases, without Flutter, Dio or Riverpod imports.
- features/intake/data contains generated DTOs, remote repositories and the
  singleton Android speech adapter.
- features/intake/presentation contains Riverpod 2 codegen providers, screens
  and widgets. Business state uses AsyncNotifier; routes enforce the flow gates.
- Drafts, complaints and staff tokens stay in app memory. Completion retains
  receipt metadata only. Current storage has no pending-session disk cache;
  memory reset does not delete the synthetic record persisted by the backend.
- An uncertain request is lost on process exit. This phase does not provide
  durable offline replay. Ask staff before abandoning an uncertain submission.
- Client reset discards the staff token. Server sessions follow the existing
  backend's expiry/revocation rules.

Speech uses speech_to_text 7.3.0 with Android microphone permission and
recognition-service discovery. A five-second silence timeout and 45-second hard
limit bound capture. On-device recognition is requested; actual language packs,
permission UX, recognition behavior and audio capture still require Android
device verification. Use synthetic speech only. No continuous ASR claim is made.

Bundled Noto fonts include their SIL Open Font Licenses. Flutter Web's Roboto
fallback is also mapped to a bundled font. Elder Mode contrast evidence is
limited to tested text pairs, not full accessibility certification.

## Verified Phase 2 results

- Dependency resolution, code generation and release Web builds passed.
- Strict analyzer: zero issues. Flutter: 49 tests passed; domain/data line
  coverage was 91.1%, including generated DTOs and the partially exercised
  Android adapter. These figures are a Phase 2 checkpoint, not a fresh CI claim.
- Four-language mocked-Dio walkthroughs cover consent, serialization, receipts,
  inactivity reset and retry safeguards. Hindi/Tamil run at 2x text in Elder Mode.
- The backend's 11 integration tests passed. Chrome routine English and emergency
  Hindi/portrait/Elder flows reached a separate real local SQLite backend and
  appeared in the authenticated clinician queue, with no page errors or external
  requests. Screenshots were visually inspected.
- All updated ARB characters were covered by bundled fonts. Original-source
  baseline and configured secret-pattern checks passed.

The opt-in public Worker smoke test is a read-only health check:

```sh
flutter test test/live_health_test.dart --dart-define=LIVE_API=true --dart-define-from-file=config/production.json
```

The Flutter CI template at tool/ci/kiosk-flutter.yml.example is optional and not
enabled. No current remote Flutter CI result is claimed.

## Remaining gates

- Phase 3: prescription camera/OCR upload and editable medication list.
- Phase 4: one encrypted local queue, background replay and purge policy.
- Phase 5: kiosk lockdown, device-owner setup and global inactivity handling.
- Phase 6: debug APK, Android tablet portrait/landscape and microphone checks.
- Shared contracts/deployment: OPD token/wait/QR, identifier lookup/privacy,
  device authentication and production readiness.

The full Definition of Done remains open. No APK, hosted intake deployment,
airplane-mode exactly-once guarantee or real-patient readiness is claimed.
