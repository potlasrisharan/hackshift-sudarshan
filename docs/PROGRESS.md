# Progress — 17 October 2026

**Mobile kiosk work resumed on 17 October 2026.** The latest user-approved scope is the phased Flutter kiosk in `frontend/app/`. Phase 2 synthetic encounter intake is implemented; the earlier platform/Expo checkpoint below is historical. See `docs/MOBILE_KIOSK_PHASE2.md` for the current gate and contract gaps.

**Integration implementation resumed on 17 October 2026 at the user's request.**
The [integration plan](PROJECT_INTEGRATION_PLAN.md) now has an implemented first
clinical milestone. See the [runbook](INTEGRATION_RUNBOOK.md) for setup and limits.

| New integration work | State | Evidence / next step |
|---|---|---|
| React clinic shell | Implemented | `frontend/website`, Project 1-derived structure; routed intake/queue/thread; mobile layout; attribution in PROVENANCE |
| Canonical contracts/client | Implemented initial scope | Consolidated shared exports; Punjabi retained alongside existing languages; Zod intake/review/session models, typed client and separate integration OpenAPI |
| Tenant/auth/persistence | Verified local synthetic slice | D1-compatible schema, tenantDb marker binding, persisted hashed opaque sessions, clinic/role checks, logout/expiry/login throttle; production login disabled |
| Intake → clinician | Verified API slice | Atomic patient/encounter/consent/activity write; replay protection, persisted review note, emergency routine-review protection, consent revoke/read denial |
| Automated API verification | Passed | 61 total tests including 11 new integration tests; persistence across DB reopen, concurrent retries, batch rollback, tenant/clinic/role denials |
| Cloudflare runtime | Passed initial smoke | Dry-run Worker bundle and actual local workerd/D1 login → intake → concurrent replay / batch rollback → review → revocation |
| Browser verification | Passed | Three end-to-end checks: separate nurse/doctor sessions, review reload, revocation, emergency protection, mobile overflow and visible server failures; screenshots inspected |
| Build/CI | Local checks passed; CI extended | Strict root/backend checks, lint, React build and legacy build; integration build/Worker/browser checks added to CI; legacy Docker image rebuild passed, no remote CI run claimed |
| Production foundation | Pending | Argon2id/JWT/refresh, provisioning, device/patient sessions, encrypted identifiers and hash-chained audit; local demo currently uses PBKDF2 and plaintext synthetic data |
| Remaining integration | Pending | Prescriptions, POS/ledger/inventory/procurement, remaining operations, OCR/speech/AYUSH, home/events, Flutter and parity/cutover |

## Current preview checkpoint

At the user's request, the integrated website was rebuilt and started on
`http://127.0.0.1:8790`; browser sign-in and the clinician queue were inspected.
The development server is intentionally left running for the user to explore.
The interrupted phase-4 work added pharmacy contracts, an additive migration and
an allocation engine. Its unfinished router import was removed from the running
API; these operations remain unavailable until their service/UI implementation
and final checks are complete. The build/typechecks pass; no new full test run
was performed in this preview turn.

No originals were modified; `verify-untouched` passes. The old mock module/DO
scaffold has been removed from `backend`; unavailable routes now fail explicitly.
The legacy root demo stays available separately until the new app passes parity.

The remaining table records the earlier checkpoint, not newly verified parity.

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

## Historical resume checkpoint

Last implementation commit before pause: 8834d46. Platform: 50 tests passed, four browser tests passed, lint/typechecks/build passed. Standalone local Cognee proof and measured k6 health test are saved. Android JavaScript export passed (730 modules, 2.4 MB Hermes bundle); native APK was not produced before cancellation. This earlier pause was superseded by the resumed integration and mobile work.


## Flutter mobile kiosk — Phase 1 gate

- Active app: `frontend/app/` on `feat/mobile-kiosk`.
- Complete: typed Dio/errors/results, Riverpod 2.x codegen and sealed flow foundation, four-language ARBs, bundled fonts, dark/Elder themes, guarded routes and read-only live health.
- Verified: pub get/codegen pass; analyzer 0 issues; 28 unit/widget tests + 1 opt-in live health test pass; current domain/data coverage 97.4%; release Web build passes; archived originals unchanged.
- Pending: agreed intake/OCR/hash/QR/idempotency schemas, functional intake, encrypted offline sync, kiosk lockdown, APK and tablet verification. Current service is a synthetic demo, not a real-patient backend.
- Gate: stop after Phase 1 as requested. Full product Definition of Done remains unmet.


## Flutter mobile kiosk — Phase 2 gate

- User selected the existing shared synthetic encounter contract; OPD token/wait/QR and phone/ABHA lookup remain explicitly unavailable.
- Implemented staff sign-in, entered demographics, typed/Android speech complaint, structured safety answers, consent, emergency receipt, idempotent retry and 60-second receipt reset.
- Flutter: 49 tests pass, strict analyzer zero issues, domain/data coverage 91.1%; independent live health read passes. Existing backend integration: 11 tests pass. See MOBILE_KIOSK_PHASE2.md for browser/build evidence and limits.
- No hosted backend deployment, Android APK/device verification, OCR, encrypted offline queue or lockdown claimed. Stop at Phase 2 pending the next gate.
