# CBC reports in Doctor Consultation

## Delivered scope

The existing Doctor Consultation workspace embeds a CBC Reports panel. A doctor selects a verified clinical encounter, selects a PDF/JPEG/PNG, reviews the five extracted values and their units, confirms an immutable revision, and explicitly runs the frozen research model. Saved reports, revisions, evidence, results and deletion are available in that panel. There is no new patient/kiosk/Flutter/Expo screen.

**This release supports authenticated synthetic records only.** The existing ERP demo login is not a clinical credential. Production capabilities and production clinical login remain disabled. Do not change the environment to development to bypass this boundary for real records.

## Start the dashboard locally

From the repository root:

```sh
npm ci --ignore-scripts
npm ci --prefix frontend/website --ignore-scripts
npm run integration:dev
```

Open `http://127.0.0.1:8790/erp.html#/app?view=doctor-consultation`.

1. In the embedded **CBC clinical workspace**, connect organization `demo`, clinical email `doctor@demo.test`, and the development-only password defined in `backend/local/seed.ts`. These credentials are seeded only by the explicit local clinical server.
2. Add an explicitly fictional consultation using **Add synthetic consultation**, or select an existing authorized clinical encounter from the usual patient queue. Entries have a separate `Clinical <encounter prefix>` token. This is not ABHA verification or real patient registration.
3. Use **CBC Reports → Upload CBC report**, or enter reviewed synthetic values manually. The published model sample is not automatically inserted into the form.
4. Compare the rendered source pages and evidence with all five values/units. Resolve missing/ambiguous values manually. Select the collection date only when known; confirm one coherent panel and the selected patient. An explicit mismatched patient-name label blocks saving.
5. Record processing permission and, if desired, research-processing permission. Confirm and save. Only then use **Run research analysis**. The doctor can inspect results and report revisions after a full reload and reconnection.

The local Node clinical server uses `.local/integration.sqlite`; `INTEGRATION_DB` and `INTEGRATION_PORT` override its path and port. This is an explicit local SQLite analogue of D1, not an additional production host. The other root `npm run dev` entrypoint serves a different legacy demo and does not provide the persisted CBC clinical session.

Original-file retention is optional. It is unavailable in the default Node local server because no R2 binding is supplied. Local previews, measurement persistence and research inference still work. The UI explicitly distinguishes device-local selection from server source retention. The Worker/R2 smoke test below exercises actual private source storage in local Cloudflare emulators.

## Runtime and identity decision

- Canonical CBC records use the clinical schema from `0001_intake.sql`, not the incompatible operational patient/encounter schema.
- `DoctorCbcAccess` establishes a real persisted local clinical session through `/api/v1/auth/login`, validates the server principal, and retrieves authorized encounters. CBC state is separate from the legacy shell's fabricated/demo tokens.
- The consultation queue retains patient and encounter identity separately. Only server-authorized clinical rows carry CBC encounter context. A name/phone/token match never grants access. Two encounters for one patient have distinct selection keys.
- Queue refresh retains existing consultation edits and never automatically chooses a new CBC attachment. Session changes discard previous clinical context. Expiry, logout and periodic/focus revalidation remove invalid clinical access. Backend authorization and care-consent checks remain authoritative on every request.
- Browser work, pending writes and result responses are bound to the mounted session/patient/encounter context. Switching consultations cancels local extraction and prevents late results from updating the new panel. The panel has a separate error boundary so extraction failure does not take down SOAP or prescription controls.
- Existing prescription scanning and deterministic engines remain unchanged. The research score is never inserted automatically into diagnosis codes, SOAP, prescriptions, printed prescriptions, queue priority or HER/Vitalis indices.

## Extraction and units

Pinned root dependencies: PDF.js `6.4.299`, Tesseract.js `7.0.0`, and English trained data `1.0.0`. `scripts/cbc-assets.ts` packages the OCR worker, core/WASM variants, English language data, PDF CMaps/fonts/codecs and license notices for both Vite builds. Browser runtime requests use same-origin assets; no report bytes/text go to an external OCR service or LLM. PDF.js performs document decoding in its worker; Tesseract uses one OCR worker. PDF page rendering and image preprocessing use browser canvas.

Text PDFs are grouped into rows using token coordinates. Pages without usable CBC rows are rendered for OCR. Scanned pages can be checked at quarter-turn orientations when fields are missing. PDF/image previews are rendered locally; OCR bounding boxes support row highlighting. PDF text extraction uses page/row evidence without claiming pixel-exact highlight coordinates. Confidence is recorded only when supplied, and is not a clinical accuracy estimate.

Required model measurements:

| Field | Canonical unit |
|---|---|
| WBC / TLC | `10^9/L` |
| RBC | `10^12/L` |
| Neutrophils | `%` |
| Lymphocytes | `%` |
| Monocytes | `%` |

Conversions include WBC cells/µL divided by 1,000 and RBC lakh/µL divided by 10. Original values, units, evidence, extraction method and confirming actor remain on the revision. Differential decimals are preserved in stored measurements; whole-percentage rounding occurs only inside frozen model preprocessing.

Absolute differential counts, missing units, comma/decimal ambiguity, competing panels, multiple labels on a row, and unrecognized formats require manual review. Missing values never become zero. The three differential percentages may total less than 100 but cannot exceed `100 + 1e-6`. Urea, creatinine, haemoglobin and platelets are not model inputs.

The parser intentionally favors unresolved fields over speculative extraction. Version one supports tested printed English labels; it does not promise arbitrary handwriting, every laboratory layout, multilingual OCR, or reliable identity matching from names. Patient-name comparison is an additional local mismatch check, not authentication or a guarantee that an unlabelled file belongs to the selected person. A clinician must review the source.

Draft extraction stays in device memory until confirmation; there is deliberately no separate server OCR-dump or draft-extraction endpoint. Only five bounded measurements and their relevant evidence are persisted on confirmation. This avoids persisting an unnecessary duplicate OCR document. Unsaved drafts are cleared on context/unmount; patient switching prompts before discarding an unsaved draft. Dashboard exits and navigation buttons also prompt before discarding a draft; browser reload/close uses the usual unsaved-work guard.

Initial resource limits: 10 MiB source, five pages, 12 megapixels per rendered page/image, one OCR worker, 120-second cancellable extraction budget, bounded report text and evidence. Server JSON remains bounded at 32 KB; only the specific authenticated binary upload route permits 10 MiB. Unsupported, corrupt, encrypted and oversized documents expose errors/manual-entry fallback. No fixed sample values are used after failure.

## API and persistence

The route family is `/api/v1/cbc`. Its capabilities endpoint contains no patient information; every report operation requires a server-verified doctor session, an authorized same-clinic synthetic encounter, and active care consent. Client tenant/patient/role headers are not credentials. Admin, nurse and cashier roles are not implicitly authorized.

| Method and suffix | Function |
|---|---|
| `GET /capabilities` | Availability, synthetic-only status, storage/inference capabilities |
| `POST /reports` | Create a draft with processing and optional research permission |
| `GET /reports?encounterId=...` | Current authorized encounter's reports, newest-first cursor pagination |
| `GET /reports/:id` | Report and immutable revision history |
| `POST /reports/:id/confirm` | Normalize/revalidate five measurements, commit optimistic-concurrency revision |
| `POST /reports/:id/predict` | Run frozen inference on a server-loaded current confirmed revision |
| `PUT /reports/:id/document` | Optional bounded private original retention with explicit permission |
| `GET /reports/:id/document` | Authorized private no-store source download |
| `DELETE /reports/:id` | Tombstone report, remove measurement/results payloads and original |

Creation, confirmation and prediction require UUID `Idempotency-Key` headers. Changed payload/revision with an already-used key is rejected. Confirmations use an expected revision; previous results remain attached to the old revision after editing. A unique report/revision prediction is reused on retry. Input SHA256, source artifact SHA256, representation/model versions, cutoff, imputation flag, actors and timestamps provide provenance. Original retention additionally records actor/time, document hash and byte count.

New tables are isolated in `backend/cbc-migrations/0006_cbc.sql`. They use tenant keys and references to the canonical clinical tables. The local migration runner selects the clinical family explicitly. `scripts/prepare-integration-migrations.ts` prepares the same set under ignored `.local/integration-migrations`; `backend/wrangler.jsonc` points there. The root operational Wrangler database configuration is not repointed or migrated.

```sh
npm run integration:worker:migrate
```

This command applies **local** migrations only. Do not apply every SQL file in the legacy shared migration directory to a clinical database: the two original patient/encounter definitions are incompatible. Do not rewrite migrations already applied to remote databases. A remote deployment requires a separately reviewed schema inventory/migration plan.

Rate limits are 120 authenticated CBC requests per doctor/minute, with bounded stale-limit cleanup. Synthetic tenant quotas limit active reports to 500 and retained originals to 100. Quotas are development guardrails, not a transactional production storage billing guarantee.

## Optional private R2 sources and retention

The Worker accepts an optional R2 binding named `CBC_DOCUMENTS`. Neither production Wrangler configuration provisions a new bucket automatically. An operator must create/select a private bucket and add that binding before enabling original retention. Do not expose a public R2 bucket or signed URL in the UI.

Source keys are server-generated under a tenant/report namespace. File types/signatures are checked, content is downloaded only through an authorized API, and source responses use private/no-store headers and attachment disposition. A failed metadata attachment compensates by deleting the uploaded object. A deleted record retains a tombstone/reference if a storage failure requires a later retry; deleted reports remain unreadable immediately.

`pruneCbcSources` deletes originals after 30 days, after record deletion or after care-consent withdrawal. It also reconciles sufficiently old unlinked uploads with a 24-hour grace period. Cleanup is tenant-scoped and bounded (three expired/revoked sources and one ten-object reconciliation page per invocation, with a persisted cursor); it runs on authenticated CBC requests when R2 exists. For cleanup even when there is no traffic, configure a Worker Cron Trigger and set `CBC_MAINTENANCE_ORGS` to the explicit comma-separated tenant inventory. The default Worker exports a scheduled handler for that purpose. No unscoped tenant-discovery query is issued, and no remote cron/bucket was provisioned by this implementation. Monitor cleanup failures before using retention operationally.

A storage outage blocks original-file operations while leaving measurement-only work available. Expired sources are denied even before a bounded cleanup reaches them. Care withdrawal blocks report/source reads immediately; physical source removal occurs on the next cleanup request or scheduled run. Confirmed measurement retention follows the clinical record policy; explicit report deletion removes those payloads. Research permission is recorded per report and cannot be silently upgraded by editing values. A new report is needed when that permission changes in this version.

## Frozen model and reproducibility

The original `model-api/bundle/model.joblib` is unchanged:

```text
c87ec848515906247b77e9764953a9969c4c9ae8da69cd3b877e7afaa2c3c23e
```

The offline exporter verifies that checksum through the existing Python loader. It exports fitted median imputation, the missing-feature indicator, StandardScaler statistics, logistic coefficients/intercept and class order into `packages/engine/cbc/frozen-model.json`. No fitting/retraining is performed. TypeScript preserves NumPy ties-to-even rounding, rounded NLR/LMR, saved imputation and cutoff semantics.

Feature order: WBC, lymphocyte %, neutrophil %, monocyte %, RBC, NLR, LMR. The indicator applies only to missing features selected by the fitted imputer; it is not reconstructed from guesswork. Version `india-cbc-logistic-c87ec8485159`, cutoff `0.626816175626443`.

Published reference `{wbc:8.95,rbc:4.41,neutrophils:65,lymphocytes:25,monocytes:9}` yields score `0.6528833817519397`. The UI calls it a research score; it is neither a diagnosis nor a calibrated personal cancer probability. The repository's documented internal sensitivity is 35.9%, and its labels/evaluation have limitations. Results cannot rule out cancer or change clinical triage automatically.

`scripts/export-cbc-model.py` regenerates the portable artifact and 1,049 fixed-seed synthetic oracle cases, including rounding/zero-denominator edges and samples near the cutoff. Install `model-api`'s pinned dependencies in an isolated Python environment before running it. Never load a user-uploaded pickle/joblib.

Initial verification used Python 3.11.15 with the model's exact NumPy 2.2.6, scikit-learn 1.7.2, SciPy 1.15.3 and joblib 1.6.0 versions. The optional attempt to fetch documented hosting Python 3.12.12 timed out in automatic permission review; the original model tests and the numerical corpus passed using 3.11. This is recorded rather than claiming a 3.12 runtime was tested.

The Render service remains unchanged and is not a runtime dependency. Inference executes inside the shared Cloudflare Worker, on saved confirmed inputs only. No identifiers or report contents are sent to an external model host.

## Verification commands

```sh
npm run typecheck
npm run check:frontend
npm test
npm run build:frontend
npm run integration:build
npm run build:worker
npm run integration:worker:build
npm run cbc:worker:smoke
npm run cbc:e2e
```

From a model environment: `python -m unittest discover -s model-api/tests -v`.

The CBC Worker smoke test uses actual local workerd, D1 and R2. It checks the Python oracle corpus in a Worker isolate and the actual default Worker route's login, consented encounter, source upload/download, confirmation, inference and source deletion. Browser tests use the actual ERP dashboard and actual local OCR for a PNG, a raster-only PDF and a rotated image; they also check text-PDF confirmation/inference/reload, context switching and unsupported documents. Fixtures contain no patient data. Root TypeScript and frontend commands now include strict checking of the CBC feature and the modified Doctor Consultation component. Small pre-existing undefined-index cases exposed by that expanded coverage were repaired without weakening compiler settings.

Existing `tests/integration-browser` targets an older standalone intake UI. It is not the CBC dashboard acceptance harness. Use `cbc:e2e` for this feature; do not equate a standalone page test with dashboard integration. `scripts/verify-untouched.sh` is still absent; inspect git diffs instead of claiming that script passed.

## Configuration, rollback and remaining boundaries

Final local verification on 18 October 2026: 155 Vitest tests passed, all four actual-dashboard browser tests passed, all six original Python model API tests passed, strict typechecks and both frontend builds passed, and both Worker dry-run bundles built. All 1,049 Python/workerd oracle cases agreed within `1e-12` (largest observed absolute error `2.220446049250313e-16`). Actual local D1/R2 upload, authorized download, confirmation, inference and source deletion passed. Browser checks included direct cancellation/manual retry, unsaved exit cancellation, separate encounters for one patient, real rotated OCR, and history reload by explicit encounter identity. These results do not establish production clinical validation or performance on every report layout/device.

- `CBC_ENABLED=false` disables the feature's authenticated operations. `CBC_INFERENCE_ENABLED=false` disables new research runs while allowing authorized reports/previous results to be read.
- Synthetic CBC access additionally requires `ENVIRONMENT=development` or `test`. Production authentication/identity, real clinical validation, and real-record authorization/consent remain prerequisites for any separate production milestone. Current code intentionally refuses that claim.
- Report history is scoped to the selected encounter. To inspect another encounter for the same patient, select that encounter's distinct clinical queue entry. This avoids an unreviewed cross-encounter sharing policy.
- Source storage is optional and needs an operator-supplied private R2 binding and traffic-independent cleanup scheduling when required. The default Node demo does not pretend to retain originals.
- Optional insertion of CBC into SOAP/FHIR was not added. Existing notes, diagnosis codes and printed prescriptions remain separate from research results.
- Unknown layouts/handwriting may require manual entry. Work within the documented resource budget; test target devices before making OCR performance claims. The full set of self-hosted core variants is shipped as static assets but only needed assets are requested at runtime.
- Disable the relevant feature flag to roll back availability. Remove the embedded mount only if reverting the UI. Preserve migrations/immutable report history; do not roll back by dropping shared patient tables or changing the frozen artifact. No production deployment, remote migration or retraining was performed.
