# Doctor Consultation dashboard: CBC report extraction and frozen-model integration — execution prompt

Prepared from repository inspection on 18 October 2026; revised to make the complete feature part of the existing Doctor Consultation dashboard. This is an implementation brief, not evidence that the feature or its deployment already exists.

**Scope decision:** The doctor performs upload, extraction review, confirmation, model execution, and history inspection inside the selected patient’s consultation workspace. Patient/kiosk and Flutter/Expo feature implementation are out of scope for this release. The shared backend remains reusable for future clients.

## Repository review: findings that shape this implementation

1. `AGENTS.md` makes `docs/PRD.md` authoritative. Both website and Flutter must use the unified Cloudflare `/api/v1` backend. Strict TypeScript, Zod boundaries, tenant scoping, no PHI egress to external AI, no secrets in source, and Cloudflare-native runtime infrastructure are mandatory.
2. `backend/src/index.ts` is the deployed entrypoint in both Wrangler configurations. It mounts legacy module routers, `createIntegrationApp()`, and the synthetic `apps/api/app.ts` application. Routing order matters; changes tested only against the factory can still fail against the deployed default export.
3. `POST /api/v1/documents/ocr` currently returns hardcoded medication and lab fixtures. It accepts no document bytes. It is not a functioning CBC extraction service.
4. `frontend/website/src/components/PatientKiosk.tsx` has file controls and preview-related code, but existing displayed extraction content includes sample values. `DoctorConsultation.tsx` consumes legacy intake queue endpoints. Neither proves authenticated persistent CBC support.
5. `apps/web/erp.html` loads `frontend/website/src/erp.tsx`, which loads `App.tsx`. `apps/web/vite.config.ts` and `frontend/website/vite.config.ts` produce different outputs: `dist/web` and `dist/integration`. Root `dev` starts the legacy Node API, while `integration:dev` starts `createIntegrationApp()` through `backend/local/server.ts`.
6. Authentication is inconsistent. `/platform/auth/login` returns `mock-jwt-token`; website `authService.ts` can fabricate local sessions after failure. `createIntegrationApp()` has persisted hashed-token sessions, clinic/role checks, and explicit production login unavailability. Its authentication middleware currently selects only `/encounters*` and `/auth*`. Adding a `/cbc*` route does not automatically protect it.
7. There are incompatible patient/encounter schema families. `0001_initial_schema.sql` uses globally keyed records, `dob`, `sex`, and uppercase operational statuses. `0001_intake.sql` uses composite tenant keys, `birth_date`, `gender`, `synthetic=1`, and lowercase clinical statuses. `backend/local/migrate.ts` explicitly selects only the integration migration family. Do not assume Wrangler applying the whole directory is equivalent to this local runner.
8. There are two tenant database wrappers: `backend/src/database.ts` uses a mandatory `:org` placeholder; `backend/src/db/tenant.ts` has scoped helpers but also exposes raw/prepare access that does not enforce scoping by itself. Neither replaces object-level authorization.
9. `backend/src/context.ts` has no R2 binding; the main `Env` has optional `R2`, but neither current Wrangler configuration provisions an R2 bucket. Document persistence is therefore not configured merely because an optional TypeScript property exists.
10. `frontend/app` is Flutter with Riverpod, GoRouter, and HTTP. Its old `/scan` route redirects to `/`; editing the old `scan_screen.dart` alone adds no reachable feature. `AppSession` is an onboarding flag, not authentication. The old OCR client contains sample fallbacks.
11. `apps/mobile` is a separate Expo source tree. Neither mobile tree is part of this dashboard-only implementation; preserve their existing behavior.
12. Shared `observationSchema` currently supports only four non-CBC codes and limited sources/units. CBC data cannot be stuffed into that contract without intentional additive schema work. Existing FHIR export is a collection, not certified ABDM integration.
13. The frozen model exists at `model-api/bundle/model.joblib`; its inspected SHA256 matches configuration: `c87ec848515906247b77e9764953a9969c4c9ae8da69cd3b877e7afaa2c3c23e`. README describes an India-only logistic regression refitted on 752 development records, not verified NHANES transfer learning. Its documented sensitivity is 35.9%; outputs are research scores, not calibrated cancer probabilities.
14. `model-api/README.md` describes an existing optional Render deployment, currently not called by the application. This conflicts with the current strict Cloudflare-only runtime instruction if made the new required production path. Prefer a verified portable representation of the exact frozen pipeline; preserve the Python service as an independent reference.
15. `model-api/tests/test_api.py` provides artifact identity, a published-sample prediction, input validation, and zero-denominator checks. Preserve these numerical contracts.
16. Root Vitest includes only `tests/**/*.test.ts`. `tsconfig.frontend.json` has selective coverage; a successful existing check does not automatically typecheck new ERP TSX. `scripts/verify-untouched.sh` is referenced in package scripts but absent in this checkout.
17. At the original review, before this prompt document was added, the working tree was clean, root Node dependencies were absent, Node was v24.15.0, and default Python was 3.14.7 versus the model's documented Python 3.12.12. Application tests and builds were not executed for this review. Do not describe them as passed.

18. Dashboard integration is specifically `frontend/website/src/components/DoctorConsultation.tsx`, rendered by the `doctor-consultation` view in `App.tsx`. Its right clinical column contains vitals, SOAP, assessment, and prescription controls. `PatientQueueItem` currently has `patientId` but no distinct encounter identity; queue mapping uses `enc.patient_id || enc.id`. `activePatient` falls back to `queue[0]`, and queue refresh can change selection. CBC needs explicit validated encounter context and protection from these selection changes.

---

## Copy the following execution prompt into the implementation chat

You are implementing a complete, additive CBC report extraction and frozen research-model workflow in this AYUSETU repository. Deliver working code, tests, integration documentation, and a reproducible demo. Do not stop at a design, standalone prototype, disconnected page, or mocked success response. Read `AGENTS.md`, `docs/PRD.md`, and this entire brief first; recheck actual files because the repository may have changed since review.

### 1. Outcome and scope

Build this end-to-end journey:

Doctor opens the existing Doctor Consultation dashboard → selects a patient/encounter in its queue → opens the embedded “CBC Reports” panel → selects a PDF/JPEG/PNG report → browser extracts report text → deterministic code identifies the five model inputs with source evidence → doctor resolves ambiguity and confirms a report revision → shared backend saves normalized measurements against that verified patient/encounter → doctor explicitly runs the exact frozen model → result, source, and history remain available inside the same consultation workspace after reload.

The existing Doctor Consultation dashboard is the sole feature surface for this release. All steps must be usable there without opening a separate application, global standalone screening page, patient portal, kiosk workflow, or mobile route. Use the shared Cloudflare `/api/v1` backend and persistent records so future clients can be added without a second backend. Only server-authorized doctors may use CBC operations initially. Do not add patient sessions or nurse upload permissions in this release; cashier/admin status alone must not grant clinical data access.

Initial document support: machine-generated PDFs, scanned PDFs, JPEG, and PNG. Printed CBC reports with supported English labels are the first extraction target. Localized UI is separate from OCR language support. Do not promise accurate handwritten or multilingual extraction without fixtures and verification. Unsupported formats such as DOC/DOCX must be rejected clearly rather than passed into the existing broad file picker.

Do not retrain, recalibrate, tune thresholds, add features, invent patient values, build autonomous cancer triage, or alter Sentinel/Rx-to-Shelf/Drift Radar/ThreadPulse/HER/Vitalis decisions. Do not deploy or apply remote migrations as part of local implementation.

### 2. First establish the actual runtime and baseline

- Inspect the root scripts, both Vite configurations, both Wrangler configurations, local API entrypoints, default Worker routing, migration runner, session flows, shared schemas, and existing browser tests.
- Record the current git status. Preserve existing user work. Install dependencies from lockfiles only where needed; do not broadly update versions.
- Run available baseline checks. Distinguish baseline failures from new failures. If a runtime/toolchain is absent, report the specific unavailable check; do not fabricate success or replace numerical inference with a placeholder.
- Produce a short decision record identifying canonical patient/encounter storage and the exact route mount. Use the authenticated persistent integration stack as the starting security boundary, but do not assume its encounters match those displayed in the legacy consultation screen.
- Define an explicit server-validated identity/encounter bridge if necessary. Do not match by names, phone substrings, array positions, browser-selected IDs, or default demo patients. If a legacy screen lacks a verified mapping, disable persistence/inference for that context with a meaningful state until mapping is established.
- Trace `App.tsx` → `DoctorConsultation.tsx`, `PatientQueueItem`, queue fetch/mapping, `selectedPatientId`, `activePatient`, queue reset/refresh, SOAP and prescription handlers. Add a typed CBC context carrying separately verified patient and encounter IDs, organization/clinic context, and server-authorized capabilities. Never use `patientId` as an encounter ID merely because legacy prescription/status code does so. If a single patient has multiple encounters, the panel must resolve and display the actual selected encounter rather than choosing the first.
- Fix only authentication/migration/client plumbing necessary for this feature. Avoid a repository-wide rewrite. Unsupported production authentication must fail closed and be documented; do not call synthetic identity production authentication.

### 3. Architecture: extraction locally, persistence and decisions centrally

Use local device processing for source text/image extraction by default. The browser implementation should use PDF.js for PDF text and page rendering and a pinned, maintained browser OCR implementation such as Tesseract.js for images/scanned pages. Verify current official APIs and dependency compatibility before choosing versions. Tesseract.js does not accept PDF directly: render scanned pages first. Do not run a Node worker-thread OCR package in a Cloudflare Worker and assume runtime compatibility.

Use lazy-loaded browser Web Workers for expensive processing; self-host worker files, WASM, and language assets through the existing Cloudflare-delivered application. Avoid runtime CDN fetching and external OCR/LLM endpoints. Check both Vite outputs, CSP, worker loading, WASM requirements, asset paths, and licensing notices. No global unsafe CSP relaxation.

All extraction UI and workers belong to the existing React website bundle. Do not modify Flutter/Expo packages, native permissions, kiosk scan flows, or patient navigation for this implementation. Keep the shared API and pure parsing/inference contracts client-neutral for a later separately scoped mobile integration.

Server code must treat all client extraction data as untrusted. Revalidate quantities, units, ownership, revision state, and permissions. Store extraction provenance as client-generated evidence, not a server-certified laboratory result. Human confirmation does not establish clinical verification.

The original report may be retained in private R2 after explicit document-storage consent. Document extraction occurs locally before any optional original-file transfer. Make the distinction clear in the UI. Local-only preview and manual entry remain possible when document retention is unavailable, with explicit no-source-retention provenance. Do not silently claim a file was uploaded if it only remained in local memory. Do not send full report text to the backend merely to parse five fields.

### 4. Exact input contract and deterministic normalization

Required measurements, before model-specific rounding:

| API field | Meaning | Canonical unit | Accepted label examples |
|---|---|---|---|
| `wbc` | Total white blood cell count | `10^9/L` | WBC, total WBC count, total leukocyte/leucocyte count, TLC |
| `rbc` | Red blood cell count | `10^12/L` | RBC, RBC count, erythrocyte count |
| `neutrophils` | Neutrophil percentage | `%` | Neutrophils %, NEUT%, polys/polymorphs when context supports neutrophil differential |
| `lymphocytes` | Lymphocyte percentage | `%` | Lymphocytes %, LYMPH%, LYM% |
| `monocytes` | Monocyte percentage | `%` | Monocytes %, MONO%, MON% |

Label aliases are contextual candidates, not permission for blind substring matching. `TLC` can mean something else outside a CBC section. Never map MCHC/haemoglobin/platelets/urea/creatinine into these fields.

Conversions must be explicit, tested, and preserve original values/units:

- WBC `8950 cells/µL`, `/uL`, `/cumm`, or `/mm³` → `8.95` in `10^9/L`.
- WBC `8.95 ×10³/µL` → `8.95` in `10^9/L`.
- RBC `4.41 million/µL`, `4.41 ×10^6/µL`, or `4.41 ×10^12/L` → `4.41`.
- RBC `44.1 lakh/µL` → `4.41`, only when the label and unit really indicate RBC concentration.
- Equivalent spelling variants need a versioned unit alias map. Use dimensionally correct conversion factors, not thresholds such as “WBC above 100 means divide by 1000.”
- Ambiguous thousands separators/decimal commas, missing exponents, OCR-lost decimal points, and unknown units require review. No guessing by magnitude.
- ANC/ALC/AMC and `NEUT#`/`LYMPH#`/`MONO#` are absolute counts, not percentages. In version one, flag absolute-only differentials and request explicit percentage entry. Do not automatically derive percentages from counts or combine different collection times.
- WBC/RBC must be finite and positive; differential inputs finite in `[0,100]`; their raw sum must be `<=100 + 1e-6`, matching Python. These three percentages need not sum to 100 because eosinophils/basophils may exist. Never rescale them to force a sum of 100.
- Preserve measured decimal precision. Whole-percentage rounding belongs only to the frozen model preprocessing, not to stored lab measurements.
- Missing values are missing, never zero. Explicitly measured zero is distinct from absent data. Plausibility warnings require documented configurable bounds and review; avoid unsupported diagnostic rules.

### 5. Extraction accuracy, evidence, and ambiguity handling

Build a geometry-aware extraction representation containing page number, text tokens/spans, line grouping, bounding boxes where available, and extraction method. Normalize coordinate conventions so highlights align in PDF/image previews.

For PDFs, inspect text per page. Use extracted text only if its quality and row association are usable; a tiny text footer is not proof the page has extractable table content. Rasterize and OCR only pages that need it. Support mixed scanned/text PDFs, rotated images, and multi-column layouts within resource bounds.

For each candidate preserve: field key, matched source label, original numeric token, original unit, canonical value/unit when resolvable, page and evidence region, method, provider confidence if actually supplied, parser warnings, and review status. OCR confidence is not clinical accuracy or a calibrated extraction probability. If the provider supplies none, use `null`; do not display a fabricated 96%.

Associate each label with the result column and unit column. Do not pick a reference-range endpoint, previous result, accession number, header date, age, or neighboring row's value. Handle high/low flags separately from the numeric token. Store only minimal relevant snippets, not whole report headers containing identifiers.

Never mix values from different patients, reports, dates, specimens, or CBC panels. If a multi-page file contains repeated measurements or multiple panels, require the reviewer to select a coherent panel and confirm collection date when present. Contradictory candidates remain alternatives until resolved. Patient-context mismatch must block attachment; OCR names alone do not authenticate ownership.

Give every field a deterministic status such as `found`, `missing`, `ambiguous`, `unit_unknown`, `invalid`, or `confirmed`. Missing/ambiguous fields remain editable with original evidence visible. Manual entry must record `manual` provenance and reviewer identity. Automatic extraction must never auto-run inference.

### 6. Contracts and proposed module boundaries

Adapt names to existing conventions after inspection, but keep responsibilities separate:

- `packages/shared/cbc_contracts.ts`: strict Zod request/response schemas, versioned enums, units, report revision/provenance contracts, validated inference response.
- `packages/engine/cbc/`: pure deterministic aliases, parsing, candidate resolution, normalization, validation, portable frozen preprocessing/inference. Keep browser OCR and storage outside this package.
- `backend/src/modules/cbc/`: authenticated routes, authorization, consent, repository, private document access, audit, lifecycle orchestration. Do not extend the monolithic index with all business logic.
- `frontend/website/src/features/cbc/`: typed API client, extraction worker/adapter, `CbcConsultationPanel`, report preview/review, result/history components, and context-scoped hooks/state.
- `frontend/website/src/components/DoctorConsultation.tsx`: a small additive mount and explicit verified patient/encounter context wiring. Keep parsing, worker management, API orchestration, and model code outside this large component.
- `frontend/website/src/App.tsx`: only minimal authenticated doctor-context plumbing if needed; do not add a separate top-level CBC product or alter consultation navigation.
- `scripts/export-cbc-model.py`: reproducible offline exporter from the exact trusted artifact; `tests/fixtures/cbc/`: synthetic documents, extraction expectations, and Python-generated numerical reference cases.

Use new CBC-specific contracts rather than changing unrelated vital-sign semantics. If integrating FHIR, add separate CBC mappings/extension points with verified codes and UCUM units, preserving existing exports. Do not place a research score into `Condition` as a cancer diagnosis or claim certified interoperability.

### 7. Persistence, migrations, state, and API

Design additive tenant-scoped tables for reports, immutable confirmed revisions and measurements, prediction runs, and CBC consent if existing care consent is insufficient. Include `org_id`, verified patient/encounter/clinic relationships, creator/reviewer, timestamps, schema/parser/model versions, and private document metadata. Use composite constraints or equivalent checks that prevent cross-tenant foreign-key relationships. Identify which existing audit table actually exists on the selected runtime.

Never edit or rename previously applied migrations as a shortcut. Establish explicit migration manifests/configuration for the schema families before adding CBC SQL. Update the local selected migration runner as well as the relevant Wrangler migration path, or supply a narrowly scoped supported migration path for CBC. Test fresh creation and upgrade of an existing populated database. Do not depend on migration ordering to reconcile two incompatible `CREATE TABLE IF NOT EXISTS` definitions.

Proposed route family, mounted on the actual shared Worker:

- `GET /api/v1/cbc/capabilities`: availability, supported browser document extraction modes, persistence/source-retention/inference status; no secrets. Public status must expose only non-sensitive capabilities.
- `POST /api/v1/cbc/reports`: create an authorized draft in the verified patient/encounter context; strict metadata schema.
- `PUT /api/v1/cbc/reports/:reportId/document`: bounded original upload to private R2 when retention is enabled/consented.
- `PUT /api/v1/cbc/reports/:reportId/extraction`: save bounded, PHI-minimized candidates/provenance; no complete OCR dumps.
- `POST /api/v1/cbc/reports/:reportId/confirm`: server normalizes/revalidates all five reviewed values and atomically commits an immutable revision.
- `POST /api/v1/cbc/reports/:reportId/predict`: clinician-only; accepts revision reference, not an arbitrary replacement feature vector. Server loads the confirmed snapshot.
- `GET /api/v1/cbc/reports/:reportId`: doctor-authorized report/revision and inference status.
- `GET /api/v1/cbc/reports`: bounded cursor pagination within verified patient/encounter context; never a global report dump.
- `GET /api/v1/cbc/reports/:reportId/document`: authenticated private preview with safe headers; no public R2 URL.
- `DELETE /api/v1/cbc/reports/:reportId`: authorized deletion/revocation workflow with artifact cleanup policy.

Support idempotency on creation/confirmation/prediction. Bind keys to tenant, actor, operation and request hash. Same key with changed payload returns conflict. Deduplicate prediction by confirmed revision hash plus model version; retried requests must not produce duplicate history. Enforce optimistic concurrency with expected revision/version to prevent late OCR or edits overwriting confirmation.

Keep report state separate from extraction job and prediction state. Report can be draft/review-required/confirmed/deleted; extraction can be idle/running/failed/complete; a prediction can be pending/succeeded/failed. A model failure does not erase a confirmed report. Edits create a new revision; prior predictions stay attached to the original revision and are never silently relabelled current.

Atomic mutations must recheck authorization, current consent, and revision state. Handle concurrent confirmation, deletion, revocation, and inference; completion after revocation must not publish a result. Use transactional D1 batches/conditional writes and documented coordination appropriate to the selected design. For R2+D1 operations, provide compensating cleanup/reconciliation because cross-service writes are not one transaction.

### 8. Authentication, privacy, and resource limits

New CBC routes must use explicit server-verified authentication independent of legacy mock endpoints. Never trust `X-Tenant-Id`, `X-Patient-Id`, role fields, localStorage users, `demo-token`, or `mock-jwt-token` as authority. Tenant/actor/permissions come from a validated session; requested report/patient IDs are authorization targets, not credentials. Verify clinic boundaries and current patient/encounter ownership on every operation.

Use the current doctor’s server-verified session and explicit clinical access to the selected encounter. Do not create patient self-service, public ABHA exchange, nurse upload, or client-side role bypasses. If only synthetic identity is available, support explicitly labelled synthetic doctor demo sessions and keep real-record persistence disabled until genuine staff authentication and encounter authorization are configured. A server-validated doctor session must be made available inside the existing consultation shell; a second disconnected login/demo page does not satisfy integration.

Enforce active care/document-processing consent, separate optional source-retention consent, and explicit research-inference permission where required. Do not interpret the existing `purpose='care'` check constraint as consent to all research uses. Model display and patient measurements are separate permissions.

All new D1 queries use the selected `tenantDb` interface with explicit tenant predicates on reads, updates, deletes and joins. Do not use tenant wrapper `.raw`/`.prepare` to bypass scoping. R2 keys are server generated and tenant/report scoped; never use original filenames as keys. Hashes/deduplication are tenant scoped and must not reveal cross-tenant existence.

Set concrete initial limits: 10 MiB per source file, 5 pages per document, 12 megapixels per decoded/rendered page, bounded text/token counts, one OCR worker/page task at a time, and a cancellable 120-second total local extraction budget. Treat these as configurable implementation defaults, not guaranteed capacity; measure on target devices. Enforce limits before large allocations where possible. Reject encrypted/corrupt PDFs with useful messages. Do not execute PDF scripts, fetch embedded remote content, render OCR as HTML, or accept arbitrary URLs for server fetching.

Validate extension, MIME and file signature; normalize image orientation and metadata appropriately. Apply streaming server upload limits before `arrayBuffer`/multipart buffering, authenticated rate limits, and tenant storage quotas. CBC upload needs its own bounded route policy: do not raise the existing integration application's 32 KB JSON limit globally. JSON candidates remain tightly bounded. If using PUT/idempotency/revision headers cross-origin, update only necessary CORS methods/headers with exact supported origins and test interaction with the integration app's same-origin check. CORS is not authorization.

Use `Cache-Control: private, no-store` for patient content. Ensure service workers do not cache report/document endpoints; revoke object URLs, terminate extraction workers, clear previews on logout/patient switch, and avoid persistent browser storage of reports/OCR. Third-party analytics/session replay must not receive source images, extracted values, filenames, or report text. Errors/logs/audit must not echo document content, values, credentials or stack traces. Audit may retain minimized action/report/model identifiers under the retention policy.

Keep credentials in Wrangler bindings/gitignored variables. No new external AI processing. Missing OCR assets, identity, R2, or inference configuration must expose truthful degraded states with useful manual/local-only fallbacks, never sample results.

### 9. Integrate the exact existing frozen model

Source of truth:

- artifact: `model-api/bundle/model.joblib`;
- configuration: `model-api/bundle/config.json`;
- preprocessing: `model-api/inference.py`;
- existing API/reference tests: `model-api/api/main.py`, `model-api/tests/test_api.py`;
- SHA256: `c87ec848515906247b77e9764953a9969c4c9ae8da69cd3b877e7afaa2c3c23e`;
- version: `india-cbc-logistic-c87ec8485159`;
- cutoff: `0.626816175626443`;
- exact feature order: `[LBXWBCSI, LBXLYPCT, LBXNEPCT, LBXMOPCT, LBXRBCSI, NLR, LMR]`.

Use offline Python with the pinned documented dependencies to inspect and export only the trusted repository artifact. Verify its checksum before loading pickle/joblib. Never load user-uploaded pickle/model objects. Export fitted imputation, scaling, estimator coefficients/intercept, class order, feature order, and all transform semantics actually present; do not assume the README fully describes pipeline internals. Include source artifact checksum and representation schema/version in generated metadata.

Implement a tiny pure TypeScript inference module for the Cloudflare Worker using that exported representation. Reproduce exactly:

1. The Python input validation, including rejecting bools, missing/non-finite values, non-positive counts and invalid raw differential sums.
2. NumPy `.round(..., 0)` on neutrophils/lymphocytes/monocytes, including ties-to-even. JavaScript `Math.round` is not equivalent. Verify values around half boundaries against Python.
3. `NLR = roundedNeutrophils / roundedLymphocytes` and `LMR = roundedLymphocytes / roundedMonocytes`.
4. Zero denominators become missing features and use the saved imputer. Do not substitute zero, infinity, an epsilon, or newly learned imputation.
5. Saved scaling including fitted mean/scale/flags and estimator decision/probability semantics. Use a stable sigmoid where equivalent and test class ordering.
6. `score >= cutoff`, exact model version, `undefined_ratios_imputed`, and `research_only=true`.

Reference case: input `{wbc:8.95,rbc:4.41,neutrophils:65,lymphocytes:25,monocytes:9}` → score `0.6528833817519397`, above cutoff `true`.

Generate a fixed-seed Python oracle corpus without any patient records: ordinary valid inputs, decimal differentials, half ties, zero/rounded-to-zero denominators, extremes, and samples near the decision cutoff. Require absolute score agreement within `1e-12` and identical flags/classification on the documented corpus. Explain floating-point tolerance; do not claim formal equivalence over all real numbers. Test invalid-case rejection equivalence too. Keep Python untouched as reference except additive tests/tooling.

If actual pipeline steps cannot be faithfully exported, report that exact blocker and leave inference disabled while completing extraction/persistence. Do not silently replace the model. The existing Render service must not become a required runtime dependency under current Cloudflare-only instructions. A future explicitly authorized exception could use a server-side adapter sending only five numeric measurements, with endpoint validation/authentication/timeouts, but it is not the default implementation in this task.

Store each result with confirmed input revision/hash, original artifact checksum, portable representation version, model version, threshold, score, flags, execution timestamp and actor. Verify metadata consistency before enabling inference. No training jobs or fitted-data uploads.

### 10. Doctor Consultation dashboard placement, behavior, and user experience

Mount a lazy-loaded `CbcConsultationPanel` inside the right clinical column of `DoctorConsultation.tsx`, after the selected-patient header/vitals and before the SOAP/assessment/prescription suite, adapting placement to preserve the existing layout. Give it the visible title “CBC Reports” and a short “Research analysis available after review” description. Keep the left patient queue, emergency indications, notes, medication builder, POS/IPD actions, and existing consultation navigation usable.

Use existing design tokens/components, language conventions, loading states, icons, focus treatment and accessibility patterns. On desktop, the expanded review area should provide a report preview beside the five-field form; on smaller screens, stack them without horizontal overflow. Lazy-load PDF/OCR assets only when a doctor selects a file. An expandable panel or contained drawer may help space, but it remains part of the consultation and must not force a separate page or block unrelated work during extraction.

Required panel areas:

1. **Context header:** currently selected patient, verified encounter, specimen/report date if known, and authorized report status. Present the patient name from the current clinical context; do not send it to inference. Disable actions with an explanation when no verified encounter/session exists.
2. **Report intake:** “Upload CBC report” file control/drop zone, supported types and size limit, original-retention choice/consent state, and explicit manual entry. Empty state contains no sample lab values. Local selection versus server source retention must be described accurately.
3. **Extraction progress:** file/page progress, cancel, timeout/error/retry, and usable manual-entry fallback. No fake timed success animations or fixed OCR-confidence badges.
4. **Review:** five rows for WBC, RBC, neutrophils, lymphocytes and monocytes. Show original result/unit, normalized value/unit, editable correction, evidence/page link, warnings and confirmation state. Resolve competing candidates/panels and collection dates. “Confirm and save measurements” stays disabled while required fields or units are unresolved.
5. **Confirmed snapshot:** saved revision/time and confirming doctor, source-retention/provenance status, exact normalized inputs, derived NLR/LMR preview explicitly labelled with frozen preprocessing when displayed, and a deliberate “Run research analysis” action. An edit creates a new revision; never mutate the inputs underlying a past result.
6. **Research result:** model score, research cutoff, above/below cutoff, model version, imputation flag, limitations and run timestamp. Keep extraction correctness separate from model validity. Do not present a percentage chance of cancer, diagnosis, screening clearance, urgency tier or treatment recommendation. A low score cannot cancel symptoms/referrals or other clinical rules; do not merge it into HER/Vitalis indices or queue priority.
7. **Report and analysis history:** reports for this patient with explicit encounter/date associations, newest-first bounded pagination, revision selection, private source preview where retained, and previous runs bound to their exact revision/model. Default to the current encounter; access to historical encounters must be separately authorized by the backend. Opening a historical record cannot silently change the current attachment target.

Confirmed CBC measurements may be available to the clinician while writing Objective notes, but must not automatically overwrite SOAP, assessment, diagnosis codes, prescriptions, discharge documents or patient-facing PDFs. If a clinician explicitly inserts a measured-labs summary into notes, preserve report/date/revision provenance and prevent duplicate insertion. Research scores remain in the research panel; no automatic cancer diagnosis text or disease coding. Optional note insertion is secondary to the complete embedded workflow, not a reason to broaden scope.

Treat the active context as `(authorized organization, clinic, patient, encounter, session identity)` and bind every draft, worker callback and API response to it plus a request generation/revision. Use cancellation/abort and stale-response checks, not component keys alone. On patient/encounter switch, reset previews, selected report, values, errors and results before loading the next context; terminate or detach local extraction safely. Already submitted server work stays attached to its original report and never updates the new patient’s panel.

The existing `activePatient || queue[0]` fallback, automatic selection after queue refresh, and “Reset to Initial Live Queue” control must never choose a CBC attachment implicitly. Keep a deliberate stable selected encounter where possible; otherwise clear CBC state and require verified context. Unsaved work should trigger a clear discard/cancel choice on an intentional navigation action; background refresh must neither silently overwrite drafts nor open an unsolicited blocking dialog. Never carry a draft across contexts.

Handle logout, session expiry, revocation, route unmount, capability loss, cancelled extraction, changing files, duplicate upload, missing percentages, unknown units, conflicting candidates, offline network failure and retries. Report history must reload from authorized persistence after a full refresh. A local extraction error, missing R2 or failed model run must not crash the consultation component or erase existing notes. Isolate the lazy feature with a suitable error boundary and feature-specific fallback.

Do not expose new patient/kiosk/mobile UI in this release. Keep existing prescription scanning, Flutter/Expo routes, tour behavior and unrelated role dashboards unchanged. Record future client reuse as a follow-up rather than an acceptance dependency.

### 11. Verification: meaningful regression and acceptance tests

Create synthetic fixtures only. Cover text PDFs, image PDFs, mixed pages, JPEG/PNG, alternate valid units, multi-column result/reference-range distinction, absolute differential distractors, missing monocytes, duplicate dates/panels, ambiguous decimal separators, rotated pages, corrupt/encrypted/oversized documents, and conflicting patient context. Include actual OCR integration on at least one image and one scanned PDF; parser-only text tests do not prove OCR works. Keep deterministic parser tests independent of noisy OCR confidence.

Test unit conversions, alias boundaries, raw-versus-model rounding, zero-versus-missing, invalid sums, non-finite values, and preservation of original measurement precision. Verify the browser extraction worker and server normalization against shared fixture expectations.

API tests must prove anonymous/fake-session denial, patient/nurse/cashier/admin denial without explicit doctor clinical authorization, tenant and clinic isolation, doctor-to-encounter access restrictions, current consent checks, no inference before confirmation, validated upstream metadata, idempotency conflicts/replay, optimistic concurrency, revocation/deletion races, paginated scope and no PHI echoes. Attempt arbitrary patient/report IDs and forged tenant/role headers. Test both `createIntegrationApp()` and the actual default Worker export so router ordering/auth cannot bypass controls.

Persistence tests must reopen the database and read the same report/results; verify fresh and populated upgrade paths for the supported schema family. Confirm uploads are private and original-file cleanup works when DB writes fail. Test no-R2/no-inference states. Stub storage/network only in unit tests and label such tests; complete at least one actual local storage/inference path.

Keep the existing model API tests passing with the pinned Python environment. Add the cross-language parity corpus and run inference in workerd/Miniflare or the existing Wrangler local setup, not just Node. Mocked prediction responses do not satisfy this gate.

Add browser E2E starting at the actual ERP Doctor Consultation dashboard, selecting a verified synthetic patient/encounter in its queue, using the embedded CBC panel to upload → extract → review/edit → confirm → run analysis → inspect history after reload. A standalone test harness page does not satisfy dashboard integration. Test two patients and two encounters for one patient, switching during OCR, switching during fetch/inference, background queue refresh/reset, unmount/logout and session expiry. Assert the wrong patient never receives previous inputs, preview or results, and failed extraction never displays sample defaults. Check source/form layout at desktop and narrow viewport, keyboard access, progress/cancellation, and CBC error-boundary behavior. Run existing prescription/intake/consultation regression journeys; verify SOAP edits, queue selection, emergency indication, printing, POS/IPD actions and medication builder remain usable before and after CBC operations.

Ensure all new TS/TSX is included in a strict typecheck; root and existing frontend checks may not cover the added UI. Do not use `any`, ts-ignore, skipped tests or weakened compiler settings to force a green check. Scope lint to changed/new files if whole-repo legacy lint already fails, documenting baseline results.

Relevant existing commands to assess and run where applicable:

```sh
npm run typecheck
npm run check:frontend
npm test
npm run build:frontend
npm run integration:build
npm run build:worker
npm run integration:worker:build
npm run integration:e2e
```

Run `python -m unittest discover -s tests -v` from `model-api` using the documented Python/dependency environment. Flutter/Expo builds are not CBC acceptance gates because these clients must remain untouched; inspect the diff to verify that boundary. The root `verify-untouched` script currently points to a missing file; verify git diffs directly rather than claiming it passed. Avoid production network calls, remote writes and deployment.

### 12. Delivery order, gates and definition of done

Implement in the dashboard-centered phases below. Develop and validate the existing consultation integration from the first UI phase; do not leave embedding until after a standalone feature is built. Continue authorized local work through each stage; do not leave foundational architecture contradictions hidden.

| Phase | Work | Completion gate |
|---|---|---|
| 1. Baseline and context | Trace real dashboard/runtime; establish doctor session, distinct patient/encounter mapping, schema/migration decision | A selected authorized encounter has a validated CBC context; ambiguous/default demo context is disabled |
| 2. Embedded shell and contracts | Mount isolated lazy CBC panel in existing clinical column; define contracts, API client, capability and empty/error states | Panel appears inside actual consultation without changing SOAP, queue or medication behavior |
| 3. Extraction and review | PDF text/rendering, local OCR, deterministic parsing/normalization, evidence and manual correction | Synthetic text/image/scanned reports populate five reviewable fields; cancellation and context switching are safe |
| 4. Persistent confirmed reports | Authenticated routes, additive migrations, private source retention, immutable revisions, consent and idempotency | Confirmed report reloads in the same dashboard for only the correct authorized encounter |
| 5. Frozen model | Offline export, exact TypeScript pipeline, Python oracle and Worker-runtime parity | Server-loaded confirmed inputs produce matching scores/flags; no changed artifact or threshold |
| 6. Results and history | Explicit doctor execution, revision-bound results, authorized historical reports and editing workflow in panel | Entire report-to-analysis journey completes without leaving Doctor Consultation |
| 7. Regression and handoff | Real dashboard E2E, security/race/resource tests, both frontend builds, docs and rollback | Evidence demonstrates preserved consultation actions, isolation and honest degraded states |

Use independent feature flags/capabilities for extraction, source retention and research inference. Define trusted defaults: synthetic/demo support can be explicitly enabled locally, real-record storage stays unavailable without verified identity/consent, and inference stays disabled until artifact/parity checks succeed. Flags must never weaken backend authorization. Disabling inference must not disable access to already authorized report measurements.

Update `docs/PRD.md` with a small additive scope/contract section, `docs/PROGRESS.md`, and a CBC-specific implementation/runbook. Document migration selection, local asset packaging, authentication and identity bridge, supported platforms/formats, resource limits, source retention/deletion, artifact export/parity procedure, feature flags, production prerequisites, and rollback. Include exact configuration names and commands; no invented deployment IDs/secrets.

Definition of done:

- Actual supported documents produce candidates and evidence; user confirmation yields persistent validated five-input revisions.
- Upload, local extraction, evidence review, correction, confirmation, private source access, model execution and persistent history all work inside the existing Doctor Consultation dashboard for the selected authorized patient/encounter. No separate CBC page, patient/kiosk entrypoint or Flutter/Expo feature is required or added.
- The exact frozen model runs on confirmed server-loaded revisions inside the Cloudflare runtime and passes Python parity, or an explicit unresolved blocker keeps inference visibly disabled and delivery is reported incomplete.
- Identity, tenant, clinic, role, consent, revision and private-document boundaries are tested, including through the deployed-style router.
- Missing configuration produces honest degraded states; no demo values are substituted for failed real extraction, storage or inference.
- Existing intake, prescription, operational, HER and Vitalis flows retain their behavior; all affected checks pass or specific pre-existing/environment failures are disclosed.
- No model artifact modification, retraining, diagnosis claims, external PHI processing, secrets, remote migrations, deployment, or broad unrelated rewrites.

Final handoff must state what works, where it is reachable, exact changed files, tests actually run and outcomes, before/after model identity and parity evidence, performance observations, remaining blockers and production configuration steps. Do not claim “fully integrated” while embedding in the actual consultation dashboard, verified encounter selection, doctor-session binding, persistence, OCR assets or exact inference remains mocked/unverified.

## Technical references used for the architecture recommendation

- PDF.js API and text/rendering interfaces: https://mozilla.github.io/pdf.js/api/
- PDF.js getting started and packaging: https://mozilla.github.io/pdf.js/getting_started/
- Tesseract.js scope and PDF limitation: https://github.com/naptha/tesseract.js
- Cloudflare Worker limits; verify before selecting server-side document processing: https://developers.cloudflare.com/workers/platform/limits/
