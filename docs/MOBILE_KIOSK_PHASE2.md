# DHAAGA Flutter kiosk — Phase 2 gate

17 October 2026 · branch: feat/mobile-kiosk · active project: frontend/app

## Scope and authoritative contract

Merged origin/main (a443175) into the mobile branch, preserving the team's integration changes and both progress records. Source of truth: packages/shared/integration.ts, packages/shared/contracts.ts and backend/src/index.ts.

The user explicitly selected the existing synthetic encounter flow, with token features marked unavailable. The implemented endpoints are POST /api/v1/auth/login and POST /api/v1/encounters. This phase does not introduce a competing kiosk schema or change/deploy the backend.

The strict intake body contains patient {name,birthDate,gender,language}, chiefComplaint, answers, careConsent:true and synthetic:true. The patient enters all demographic and complaint values; there are no sample patient values or staff credentials in lib/. Language maps to en-IN, hi-IN, pa-IN or ta-IN. Only the actual shared yes/no/unsure symptom keys are sent.

The actual response is a server-issued encounter, not {sessionId,tier,tokenNumber,estimatedWaitMinutes}. Its status drives emergency presentation. The receipt shows the server ID and recorded care consent. OPD token, wait and QR are explicitly unavailable. Phone/ABHA lookup and a shared phone hash scheme are absent, so those identifiers are not collected or transmitted. Format validators are ready and tested without collecting identifiers.

## Changed implementation

- core/network/api_client.dart: audited login/encounter operations, safe failures, cancellation and authenticated idempotent encounter retry. Login is never automatically retried.
- domain/entities/intake_draft.dart and intake_flow_state.dart: immutable draft, staff session, receipt, strict validation, secure UUID-v4 keys and exhaustive editing/submitting/completed states.
- domain/repositories and use_cases/submit_intake.dart; data/dtos/intake_dto.dart and repositories/intake_repository_impl.dart: typed, generated request/response boundary and actual shared-schema mapping.
- presentation/providers/core_providers.dart: sign-in, validation gates, single in-flight submission, frozen uncertain payload/key for replay, generation guards against late replies, reset/cancellation and receipt-only completion state.
- presentation/screens/identify_screen.dart, converse_screen.dart, summarize_screen.dart, queue_token_screen.dart: synthetic staff-assisted demographics, complaint/structured safety questions, editable transcript, consent-gated review, emergency staff prompt and actual receipt. summary_screen.dart now exports the implemented screen.
- speech_providers.dart and AndroidSpeechInput: Riverpod voice state, singleton Android recognizer, locale availability check, editable transcript, audio-level animation, five-second silence limit and 45-second hard limit. Web is deliberately typed input. Permission/unavailability/initialization failures retain typed input.
- core/router/app_router.dart: state-driven route guards. Deep links cannot skip consent or fabricate a receipt.
- kiosk_shell.dart: reset scrolling when screen content changes; receipt countdown is pinned in a footer. Receipt pointer/keyboard activity extends its 60-second idle deadline; expiry clears app state, credentials, preferences and voice state and returns to languages. Current phase has no disk cache.
- data/dtos/health_dto.dart: both legacy live Worker health and new integration health are recognized; undeclared capability flags remain unknown rather than fabricated.
- four ARBs, bundled font verification, Android microphone permission/recognition-service query, speech dependency and generated files.
- new intake_test.dart and intake_widgets_test.dart; updated health/localization tests.

## Verification

- flutter pub get: passed using pinned Flutter 3.35.7 / Dart 3.9.2.
- dart run build_runner build --delete-conflicting-outputs: passed.
- flutter analyze: zero issues.
- flutter test --coverage: 49 passed; the opt-in live test is skipped in the ordinary suite.
- flutter test test/live_health_test.dart --dart-define=LIVE_API=true --dart-define-from-file=config/production.json: one passed against the public Worker, GET only.
- Domain/data coverage including generated DTOs and Android adapter: 235/258 lines, 91.1%. Android adapter coverage is partial and does not constitute device speech verification.
- Four-language mocked-Dio walkthroughs cover sign-in, user input, safety answers, mandatory consent, actual request serialization, receipt rendering, activity extension and reset. Hindi and Tamil run in Elder Mode at 2x text scale. Double taps, late replies, malformed responses, expired sessions, UUID keys, immutable maps and frozen replay are covered. Speech denial, exception, transcript and silence behavior are covered with an injected adapter.
- npx vitest run tests/integration.test.ts: 11 passed against the existing persistent backend implementation.
- Chrome release-build verification uses a separate local SQLite database and loopback HTTPS proxy. Routine English and emergency Hindi/Elder/portrait intakes reach the real backend and appear in an independently authenticated clinician queue; reset works. Final browser error check and build evidence are recorded at handoff below.
- Font cmap check: no missing characters across the four updated ARBs; all bundled fonts upright.
- lib/ scan including generated Dart: zero dynamic, zero null assertions, zero embedded HTTP URLs.
- scripts/verify-untouched.sh: passed. scripts/secret-scan.py: configured-pattern check passed; no comprehensive audit claim. git diff --check: passed.

## Running and deployment boundaries

Use the pinned SDK and the README generation/build commands. The default config/production.json is the user's public Worker, which currently serves the legacy synthetic demo. Its fresh OpenAPI check has no /encounters, /intake/session or /ocr/prescription. A working health check does not imply working intake on that URL.

For end-to-end development use backend/local/server.ts with its own INTEGRATION_DB and INTEGRATION_PORT. The runbook documents the explicitly seeded synthetic staff accounts; no password is baked into the kiosk. Serve the Flutter build and API behind the same HTTPS origin, with API_BASE_URL ending /api/v1. The backend deliberately denies cross-origin browser requests. The verification proxy and certificate stay outside Git. Never disable HTTPS checks in the app.

Staff authentication is this milestone's existing contract, not kiosk device authorization. The backend deliberately disables production login; D1 provisioning, real authentication, deployment and kiosk handoff remain separate work. Client reset discards the staff token; server sessions follow the existing backend expiry/revocation rules. No hosted deployment was performed.

Speech package: speech_to_text 7.3.0, pinned and resolved against this SDK. See https://pub.dev/packages/speech_to_text/versions/7.3.0 for its Android permission, locale, singleton and short-utterance behavior. On-device recognition is requested, but language packs, OS behavior, permission UX and actual audio capture are not verified on Android hardware. Use synthetic speech only. No continuous multilingual transcription claim is made. Translation text still needs native-speaker review.

An uncertain submission keeps its exact payload and key only in memory. It is not an encrypted offline queue and is lost on process exit. Ask staff before abandoning an uncertain request. Durable retry/purge/airplane-mode guarantees belong to Phase 4.

## Definition of Done at this gate

- [x] Pub resolution/codegen, zero analyzer issues, passing current tests and domain/data coverage above 80%.
- [x] Actual shared-schema synthetic intake, emergency display, consent, receipt and memory reset.
- [x] Four locales and Elder Mode; current UI strings, colors and API configuration follow the requested boundaries.
- [ ] Live public Worker session POST returns a real OPD token; endpoint/contract/deployment unavailable.
- [ ] Prescription camera/OCR/editable medication list: Phase 3.
- [ ] One encrypted offline store/background exactly-once replay and purge: Phase 4.
- [ ] Kiosk lockdown/global inactivity/device-owner setup: Phase 5.
- [ ] Debug APK and Android tablet portrait/landscape/microphone verification: Phase 6.
- [ ] Production privacy/authentication readiness and native-speaker review.

Stop at the Phase 2 gate. The requested complete runnable Android delivery remains in the later authorized phase sequence; it is not claimed done here.

## Final Phase 2 handoff evidence

Both local HTTPS and production-config release Web builds passed. The real local-backend Chrome runs completed routine and emergency intake, clinician-queue confirmation and reset with zero page errors and zero external requests. The verified screenshots were captured after canvas animations settled and visually inspected, including the Hindi emergency receipt and pinned countdown. The production build was restored for the existing port-6284 preview; the separate synthetic HTTPS preview uses a saved local-config build on port 6285. Neither is a hosted deployment.

Implementation commits: 92833e0 (typed authenticated encounter intake) and ab0a03d (multilingual screens, speech adapter and walkthroughs), plus merge 9614f1d bringing in the team's main branch. Draft PR: https://github.com/potlasrisharan/hackshift-sudarshan/pull/3. Git author remains Rohan; GitHub attribution is checked after push.
