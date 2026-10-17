# Progress — 17 October 2026

**Mobile kiosk work resumed on 17 October 2026.** The latest user-approved scope is the phased Flutter kiosk in `frontend/app/`. Phase 1 core is verified; the earlier platform/Expo checkpoint below is historical. See `docs/MOBILE_KIOSK_PHASE1.md` for the current gate and contract gaps.

This is a checkpoint, not completion of prompts.md. DONE means only the verified
slice described. TODO work is not disguised as blocked or completed.

| Area | State | Evidence / next step |
|---|---|---|
| Prompt-first push | DONE | e302141: prompts.md pushed before implementation |
| Original source baseline | DONE | baseline-untouched; verify-untouched passes; publication exclusions in UPSTREAM_CHANGES |
| Discovery/design/traceability | DONE reviewed slice | DISCOVERY, SOURCE_INVENTORY, INTEGRATION_DESIGN, REQUIREMENTS |
| P1 standalone verification | DONE build/test slice | npm ci, tsc/Vite build, 12 HTTP-mocked tests with synthetic env; live backend remains unverified |
| P2 standalone verification | DONE root/red-flag slice | Two pytest tests pass with dummy local config; five database tests need an authorized isolated backend |
| Shared schemas/adapters/API | DONE synthetic slice | Zod, provenance, FHIR collection, OpenAPI and typed-client source |
| Consent/session authorization | DONE demo slice | Revoke/deny, cross-session isolation, server-bound identity/source and bounded streaming bodies tested |
| Production SSO/MPI/RBAC | TODO | Reviewed identity mappings, token exchange, tenant/clinic scopes and real backend auth |
| Durable events/outbox/read model | TODO | Persistent encrypted storage, idempotent queues/retries/dead-letter and consent propagation |
| Four algorithms | DONE declared mechanisms | Bayesian question selection, exact safe-stock allocation, robust CUSUM, exact demand convolution; property/exhaustive tests and docs |
| Clinical model depth/calibration | TODO | Reviewed ontology/asymmetric loss, BOCPD/fusion, fitted refill history and independent evaluation |
| Benchmarks | DONE mechanism harness | 500 seed-26047 cases; measured JSON/markdown/plot with synthetic limitations |
| Web/PWA/accessibility | DONE declared slice | Responsive shell, four draft label dictionaries, elder/dark, offline lab; four browser tests and screenshots |
| Native Expo app | IN PROGRESS | Eight screens, shared engine, secure check-in, notifications/biometrics source; typecheck/prebuild pass; Android JS/assets export passed; native release build stopped on user request before an APK was produced |
| Android APK/device test | IN PROGRESS | Gradle retries encountered download/Kotlin issues, then advanced to native packaging with an installed-NDK override. Paused before APK/device verification |
| Sarvam gateway | DONE limited adapter; BLOCKED live test | Static nonclinical welcome only; cache/timeouts/cap/fallback and mocked tests. Server-side key required |
| Full multilingual voice/translation | TODO | STT, clinical glossary, original toggle, verified translations and language evals |
| Wearables | DONE simulation only | Source/unit/plausibility/dedupe boundary; real Health Connect/HealthKit/BLE implementation/device validation TODO |
| Local Cognee | DONE standalone proof | Real local remember/recall: 124/128 mmHg, 108.714 s; local Aya/nomic and embedded stores; proof JSON |
| Privacy Node app sync | TODO | Authenticated E2EE, encrypted health store, lifecycle API and system-wide egress verification |
| Natural care/reminders/women/longevity | DONE limited demo/display; full modules TODO | General wellbeing/timer/check-in, private static cycle illustration, guideline-target what-if; not full clinical modules |
| AI | DONE local cited templates; full layer TODO | Clinical OCR, app hybrid RAG, audited agents and broad clinical/fairness evals pending |
| Pillars/ideation | DONE | Ranked 14 additions; exact shipped slices mapped to metrics/demo moments |
| Security | DONE demo boundary; production TODO | CSP/no-store, token/consent/isolation, rate/cap/validation and tamper-evident audit. Real PHI prohibited |
| Dependency audit | Root clean; mobile/original findings unresolved | P1:66 findings; mobile:23 (7 moderate/16 high); compatible fix found no resolution; no unsafe SDK downgrade |
| Docker | DONE local build/health | Hardened non-root/read-only image builds; health endpoint checked; final rebuild verification recorded below |
| CloudFormation | DONE static validation | cfn-lint passes; no AWS apply or verified account-cost proof |
| Public AWS deployment | BLOCKED | No AWS credentials/credit confirmation; no public URL |
| CI/CD | DONE first remote verification; rollout TODO | GitHub run 39026410649 passed for c2507f9. Subsequent commits require their own run. No automatic staging/production deployment |
| Load testing | DONE health-handler scope | Real k6 five-user/15s local HTTP test: 117,589 iterations; raw output in benchmarks/k6-health.txt. Not authenticated/database load. Separate in-process measurement explicitly labelled |
| Documentation/report | DONE checkpoint docs | README, design, traceability, modules, algorithms, safety, deployment, demo, QA and report distinguish TODO from completed work |

## External prerequisites

AWS authentication for the intended account and confirmed credits; server-side
Sarvam key/credits; explicitly authorized isolated Supabase instances and identity
scopes; native health-capable devices and required permissions. Do not paste keys
into chat/repo. Existing public browser config is not permission to access live data.

## Next independent work

Finish native build/device verification and load evidence; publish tested commits
and inspect actual CI. Then implement durable identity/events/sync and the full
clinical modules. The full requested Definition of Done remains unmet.

## Resume checkpoint

Last implementation commit before pause: 8834d46. Platform: 50 tests passed, four browser tests passed, lint/typechecks/build passed. Standalone local Cognee proof and measured k6 health test are saved. Android JavaScript export passed (730 modules, 2.4 MB Hermes bundle); native APK was not produced before cancellation. Resume only when the user asks.


## Flutter mobile kiosk — Phase 1 gate

- Active app: `frontend/app/` on `feat/mobile-kiosk`.
- Complete: typed Dio/errors/results, Riverpod 2.x codegen and sealed flow foundation, four-language ARBs, bundled fonts, dark/Elder themes, guarded routes and read-only live health.
- Verified: pub get/codegen pass; analyzer 0 issues; 28 unit/widget tests + 1 opt-in live health test pass; current domain/data coverage 97.4%; release Web build passes; archived originals unchanged.
- Pending: agreed intake/OCR/hash/QR/idempotency schemas, functional intake, encrypted offline sync, kiosk lockdown, APK and tablet verification. Current service is a synthetic demo, not a real-patient backend.
- Gate: stop after Phase 1 as requested. Full product Definition of Done remains unmet.
