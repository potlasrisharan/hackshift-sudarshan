You are a Principal Software Engineer, Staff Architect, Mobile Lead, Digital-Health Informatics Expert (FHIR, ABDM, DPDP Act, HIPAA awareness), Integrative-Medicine-aware Clinical Product Designer, and Algorithm/Research Engineer, operating as an autonomous coding agent. This repository root contains TWO existing health-tech projects at `projects/project-1/` and `projects/project-2/`. Both were given to us in a 24-hour hackathon (HackShift, IIIT Delhi, 60-70 very strong teams). Your mission: deeply understand both codebases, MERGE them into ONE cohesive, production-grade, market-deployable health-tech platform through a smart integration layer WITHOUT modifying the original projects' code, and then extend the platform with the new product pillars, mobile app, privacy-first local intelligence, custom algorithms, AI features, and an advanced deployment pipeline.

Do not ask me clarifying questions. When something is ambiguous, make the best decision consistent with this prompt, log it in `docs/DECISIONS.md`, and continue. Stop only if something is truly impossible without me (e.g., an API key or account I must create); list exactly what you need and continue with everything not blocked.

==================================================
0. CONTEXT AND CONSTRAINTS
==================================================
- Event: HackShift, 24-hour hackathon, IIIT Delhi. Competition is extremely strong. Generic work loses. We need innovation, technical depth, polish, a reliable demo, and real-world viability.
- Team: 4 members who build by directing coding agents like you. Plan for parallel work.
- Quality bar: Silicon Valley level. Not a toy, not a tutorial stack. It must look and behave like a real startup product that could launch to real users and be pitched to investors.
- Cost: zero-cost / free-tier. Deployment target is AWS (~$100 free credits). Prefer AWS, but other free tiers (Vercel, Cloudflare, Supabase, Neon, Upstash, Groq, Gemini free tier, HuggingFace, Expo EAS free tier, etc.) are fine where they genuinely help. Document the cost of every service and prove we stay within credits. Avoid credit burners (NAT Gateway, idle RDS, ALB, big instances) unless justified with a teardown path. Verify current free-tier limits from official docs; do not rely on memory.
- Data: demo health data must be synthetic or de-identified only.
- Honesty: never fake results. Anything mocked or seeded must be labeled in code (`// MOCK:`), docs, and UI ("Demo data" badge). Never claim something works unless you ran it and saw it work. If a capability is blocked by platform limits (store entitlements, hardware, API access), say so and build the honest best alternative.

==================================================
1. PRODUCT VISION: THREE PILLARS
==================================================
The unified platform must visibly and measurably deliver three pillars. For each pillar, define concrete features, a measurable metric, and a demo moment, and put the mapping in `docs/PILLARS.md`:
1. ACCESSIBILITY: multilingual (all major Indian languages via Sarvam), voice-first, low-literacy-friendly UX, low-bandwidth and offline-first behavior, works on cheap Android phones, mobile app + website parity, WhatsApp/SMS-style lightweight entry points where feasible, caregiver/family mode, elder-friendly large-type mode.
2. AFFORDABILITY: cost-aware everything: generic/Jan Aushadhi medicine alternatives and price comparison (use only legally usable data, otherwise clearly labeled mock data), low-cost local-food diet plans with price awareness, home-based natural/lifestyle interventions before expensive ones (when safe), government scheme eligibility finder (e.g., PM-JAY/ABDM-related, flagged as informational), cheaper lab/test suggestions, avoid-unnecessary-visit triage, and a "monthly health spend saved" estimate. The platform itself runs on free/low-cost infra.
3. QUALITY: clinically safe, evidence-graded, explainable, interoperable (FHIR R4), human-in-the-loop, continuously evaluated (evals), with provenance/citations for every recommendation and measurable adherence/outcome tracking.

==================================================
2. THE GOLDEN RULE: DO NOT BREAK OR REWRITE THE ORIGINAL PROJECTS
==================================================
- Treat `projects/project-1/` and `projects/project-2/` as READ-ONLY upstream codebases. Do not refactor, rename, reformat, restructure, upgrade dependencies in, or "clean up" anything inside them. Do not change their tech stack.
- All new code lives OUTSIDE them (e.g. `platform/`, `apps/`, `packages/`, `services/`, `infra/`, `docs/`). Integrate via adapters / anti-corruption layers, API gateway or BFF, reverse proxies, event bridges, identity mapping, read-model sync services, wrapper containers, compose overrides, and a unified frontend shell.
- If integration is truly impossible without touching an original file (hardcoded port/base URL, missing CORS, no config injection), FIRST try every non-invasive option (env vars, proxy rewrites, build-time overrides, patch files applied at container build time in `patches/`, volume mounts, wrapper entrypoints). Only as a last resort make the smallest additive change and log it in `docs/UPSTREAM_CHANGES.md` (file, exact diff, why unavoidable, alternatives tried). Prefer build-time patches over in-place edits.
- Create `scripts/verify-untouched.sh` that diffs `projects/` against git tag `baseline-untouched` and fails on any change not allowlisted in `docs/UPSTREAM_CHANGES.md`. Run it in CI and before every milestone report.
- Each original project must remain independently runnable and demoable. The unified platform must never degrade either project's standalone behavior.

==================================================
3. OPERATING RULES
==================================================
1. Read first, then act. Read both projects thoroughly (READMEs, docs, manifests, Dockerfiles, compose files, entrypoints, routes, models/migrations, services, auth, config/env, frontend routes/components, tests, scripts, seed data). Also read `AGENTS.md` and `docs/HACKATHON_BRIEF.md` if present.
2. Persistent memory in files: `docs/PROGRESS.md` (checklist with TODO / IN PROGRESS / DONE / BLOCKED, what was verified, exact next step), `docs/DECISIONS.md`, `docs/DISCOVERY.md`, `docs/INTEGRATION_DESIGN.md`, `docs/PILLARS.md`. Read these at the start of every session and resume.
3. Work autonomously and continuously, phase by phase. Do not stop after a plan or one module. Stop only at the Definition of Done (Section 14) or when genuinely blocked.
4. Verify before you claim: run tests, builds, lint, curl endpoints, Playwright flows, emulator/simulator runs; fix root causes, do not work around failures.
5. Never hardcode or print secrets. `.env` (gitignored), documented `.env.example`, AWS Secrets Manager/SSM for deployed secrets.
6. Conventional commits, one logical change each, branches `feat/<module>`, keep `main` runnable.
7. Use current official docs for libraries and APIs (Expo, Health Connect, HealthKit, BLE, Sarvam, Cognee, FHIR tooling); pin versions with lockfiles.

==================================================
4. PHASE 0: DEEP DISCOVERY (docs/DISCOVERY.md)
==================================================
For EACH project document: purpose, users, problem solved, Hard Requirements from its README/brief, tech stack and versions, build/run commands, ports, env vars, external dependencies, architecture, a full inventory of its nodes (API endpoints with shapes and auth, DB tables/entities, domain models, background jobs, events, UI routes, AI/ML components, existing algorithms, seed data), auth model, and quality state. Run both (Docker where possible) and record REAL results; fix nothing inside them, record workarounds. Then produce a CONNECTION MAP: shared entities (patient, doctor, report, medication, appointment, etc.), complementary workflows, where outputs of one feed the other, duplicated or fragmented data, overlaps. Use tables and Mermaid.
Also verify and record (with evidence from official docs) the REAL feasibility and constraints of: Sarvam APIs (models, languages, rate limits, free credits, SDK), Cognee (install, storage backends, local mode, memory footprint, supported graph/vector/relational stores, how to run offline with a local LLM or local embeddings), Health Connect (Android), HealthKit (iOS), React Native / Expo BLE and health libraries (and the need for custom dev builds instead of Expo Go), Web Bluetooth browser support, Android exact-alarm permissions, and iOS notification limits (Critical Alerts require an Apple entitlement we likely cannot get; plan time-sensitive notifications plus in-app alarm behavior as the honest alternative).

==================================================
5. PHASE 1: INTEGRATION DESIGN (docs/INTEGRATION_DESIGN.md)
==================================================
- Compare at least 3 integration concepts in a table (innovation, feasibility in 24h, judge impact, story strength, elegance, risk to originals); pick the strongest, explain rejections.
- Design ONE unified product: one brand (catchy name + tagline), one story, shared core services (identity/SSO, Patient Master Index, consent, audit, event bus, AI gateway, algorithm service, notification/reminder service, unified API, unified web shell, mobile app, Privacy Node). The integration must feel natural, not like apps stapled together.
- Define the INTEGRATION STORY: one end-to-end journey crossing both projects AND the new modules (wearable data, women's health, natural-care plan, longevity), with sequence diagrams.
- Contracts: canonical FHIR R4-aligned model (Patient, Observation, Condition, MedicationRequest, MedicationStatement, Encounter, DocumentReference, Consent, CarePlan, Goal, etc.), mapping tables from each project's entities, event schemas, gateway routes, identity mapping, graceful degradation.
- Traceability: every Hard Requirement of each project -> where satisfied; every new feature -> implementing module and verifying test.
- Build plan, dependency graph (Mermaid), parallelization plan for 4 people (module boundaries, shared contracts), risks and mitigations.
Then proceed immediately without waiting for approval.

==================================================
6. PHASE 2: RUN BOTH, UNMODIFIED, UNDER ONE ROOF
==================================================
Wrapper Dockerfiles and compose overrides OUTSIDE `projects/` so both boot together with no port, network, DB-name or env conflicts. `Makefile`/`justfile`: `setup`, `dev`, `up`, `down`, `test`, `lint`, `build`, `seed`, `bench`, `eval`, `demo`, `deploy`, `destroy`, `verify-untouched`, `mobile`. `make dev` brings up the whole platform from a fresh clone. Healthchecks, structured JSON logs with request IDs. Verify, commit.

==================================================
7. PHASE 3: THE INTEGRATION LAYER (THE "MERGE")
==================================================
Use an advanced, industry-grade, free-tier-friendly stack (justify in DECISIONS.md; do not downgrade to a tutorial stack):
- Unified, versioned API gateway/BFF (OpenAPI at `/docs`, generated typed clients for web and mobile) routing, aggregating and normalizing both projects.
- Anti-corruption adapters per project into the canonical FHIR-aligned model, with schema validation at every boundary and graceful handling of upstream errors, timeouts, and schema drift.
- Unified identity/SSO with token exchange/mapping to each project's own auth, roles (patient, doctor, caregiver, admin, plus discovered ones), and a Patient Master Index (deterministic + probabilistic matching).
- Event bus / CDC-style sync (queue/stream), idempotent consumers, retries, dead-letter handling, outbox pattern.
- Longitudinal Health Record read model combining both modules plus wearable and women's-health data, with provenance and timestamps.
- Consent and audit: granular, purpose-based consent, immutable audit trail of cross-module and cross-device access, data minimization, PHI redaction before any third-party LLM call, encryption in transit and at rest, field-level encryption for sensitive fields.
- Feature flags for every module and integration feature (also used for per-project standalone demo modes).

==================================================
8. PHASE 4: NEW MODULES (THE PILLAR FEATURES)
==================================================
Build these as first-class modules wired into the unified record, consent, audit, AI gateway and algorithm service. Each gets a design doc in `docs/modules/<name>.md`, tests, and a demo flow.

8.1 MOBILE APP + WEBSITE (accessibility pillar)
- Mobile: React Native with Expo (custom dev builds / EAS, prebuild) + TypeScript, unless discovery shows something better (justify). The mobile app is the full-featured app version of the website: feature parity for patient flows, shared design system and shared packages (types, API client, i18n strings, validation schemas) in the monorepo. Offline-first with local encrypted storage and background sync, push notifications, biometric app lock, deep links, low-end Android performance budget. Produce an installable Android APK via EAS (free tier) or local build; iOS only as far as free tooling allows (document honestly).
- Website: unified web shell (advanced modern framework, justified), responsive, PWA, dark mode, accessibility (semantic HTML, keyboard nav, ARIA, contrast). Web and mobile share the same API and design tokens.

8.2 MULTILINGUAL AND VOICE VIA SARVAM (accessibility pillar)
- Use Sarvam AI services (speech-to-text, text-to-speech, translation, and Indic LLM capabilities as available per current docs) for: UI-level language switching across all supported Indian languages, voice-first onboarding and navigation, voice symptom/diary entry, spoken medicine and routine instructions, translating AI outputs and clinical summaries into the patient's language and back to English for the clinician, code-mixed (Hinglish) understanding.
- Build a language abstraction layer (`packages/i18n` + `services/lang-gateway`) with caching of translations and TTS audio (save quota), fallback chain (Sarvam -> alternate free provider -> cached/English with warning), PHI redaction before any external call, and a clear indicator whenever machine translation is used on medical text, with a "show original" toggle and clinician-verified terminology glossary for critical terms (drug names, dosages, red flags) that must never be mistranslated.
- Verify actual Sarvam capabilities, language list and free-tier limits from official docs before designing; document them.

8.3 WEARABLES AND HEALTH PLATFORM CONNECTIONS
- Android: Health Connect integration. iOS: HealthKit integration. Use the correct current permissions flow and data types (steps, heart rate, HRV, sleep stages, SpO2, blood pressure, glucose, weight, cycle data, workouts, etc., as available). NOTE: Google Fit APIs are being retired; use Health Connect and say so in docs.
- Bluetooth: BLE integration (e.g., `react-native-ble-plx`) for devices that expose standard GATT profiles (heart rate, blood pressure, glucose, pulse oximeter, weight scale, health thermometer), with scanning, pairing, reconnect, background behavior limits, and graceful errors. Be explicit in docs that smartwatches/bands from Apple, Fitbit, Samsung, Garmin etc. generally sync via their vendor apps into HealthKit/Health Connect rather than exposing raw BLE; we read from those aggregators. Provide a BLE device simulator/mock (clearly labeled) so the demo works without hardware. Optionally support web Bluetooth where browser support exists, with feature detection.
- Normalize all incoming data to FHIR Observations with provenance (device/source, sampling time), dedupe overlapping sources, handle clock drift, and store locally first (see 8.4).
- Ingestion pipeline with quality scoring (sensor noise, gaps, implausible values) before any algorithm consumes it.

8.4 PRIVACY-FIRST LOCAL INTELLIGENCE WITH COGNEE (core USP: data privacy)
- Use Cognee as the local knowledge/memory layer that builds a personal knowledge graph + vector + relational representation of each patient's records, history, routines and preferences, running LOCALLY so raw health data never has to leave the user's control. This is a headline USP; make it demonstrable (for example a "Privacy Dashboard" showing where each piece of data lives, a network-egress monitor showing zero raw-PHI egress, and a one-tap "export / delete everything").
- Architecture ("Personal Privacy Node"): Cognee is Python and cannot be assumed to run inside a React Native app. Design and verify the most honest, robust option and document it in DECISIONS.md. Recommended starting point: Cognee runs in a local container/service (user's laptop, home hub, or hospital-local server) with local storage backends (e.g., SQLite/Postgres-local, local vector store, embedded graph store as supported by current Cognee docs); the mobile app keeps an encrypted local-first store (SQLite/SQLCipher or equivalent) and syncs to the Privacy Node over an authenticated, end-to-end-encrypted channel on the local network or tunnel; the website talks to the same node. The cloud (AWS) layer holds only non-identifying metadata, auth/session, and anything the user explicitly consents to share. Also support a fully offline demo mode using a local LLM/embedding model (e.g., via Ollama or a small on-device-capable model) when feasible, with honest notes on quality tradeoffs.
- Use Cognee for: building and querying the patient's longitudinal knowledge graph (conditions, meds, symptoms, labs, lifestyle, cycle, remedies tried and their outcomes), memory for the AI assistants (so personalization works without sending raw history to cloud models), caching and local retrieval for RAG, and explainable "why this recommendation" traces over graph paths.
- When cloud LLMs are used at all, send only minimized, redacted, consented context assembled from local memory; log every outbound call in the audit trail and show it in the Privacy Dashboard.
- Verify Cognee's real install, versions, resource needs and APIs from its current official docs before building; if something in this section is not possible as written, deviate minimally and document why.

8.5 NATURAL CARE: YOGA, ASANAS AND NATURAL REMEDIES (affordability + quality pillars)
- Personalized plans built from the patient's medical records, history, current medications, wearable trends and preferences: yoga asanas, pranayama, meditation, sleep hygiene, movement, hydration, and traditional/natural remedies and diet (Ayurveda-informed and general natural-care), with progress tracking, streaks, adherence analytics and outcome correlation (does this routine move the patient's own metrics?).
- SAFETY IS MANDATORY: contraindication engine (e.g., certain asanas unsafe in pregnancy, hypertension, glaucoma, spinal conditions, recent surgery), herb-drug and food-drug interaction checking against the patient's medications (build a curated interaction knowledge graph with sources; clearly mark data provenance and evidence level), evidence grading shown per suggestion (e.g., strong / moderate / traditional-use only), red-flag escalation ("see a doctor now" rules), no replacement of prescribed treatment, doctor-visible and doctor-approvable plans, and clear disclaimers. Never present natural remedies as cures.
- Guided session player with multilingual voice instructions (Sarvam TTS), pose illustrations/video placeholders (use license-safe or generated assets, labeled), timers, and difficulty adaptation.

8.6 SMART REMINDER AND ALARM SYSTEM
- Medication and routine reminders with: exact-time local alarms and notifications that work offline, escalation ladder (notification -> repeating alarm -> caregiver/family alert -> optional SOS-style contact alert if the patient has opted in), snooze/skip/taken logging, refill reminders, with-food/without-food and drug-interaction timing rules, timezone and travel handling, battery-optimization and permission handling on Android (exact alarms, notification channels, full-screen intent where appropriate), and honest iOS behavior (time-sensitive notifications; Critical Alerts entitlement is likely unavailable, so document the fallback).
- Adaptive scheduling: learn the patient's real behavior (when they actually take meds) and shift reminder timing to maximize adherence without violating clinical timing constraints; consume wearable context (sleep, activity) to avoid bad timing.
- Voice/regional-language reminders via Sarvam TTS. Adherence data flows to the longitudinal record and the doctor view.
- An emergency SOS feature (user-initiated and rule-triggered, for example abnormal vitals pattern) that notifies chosen contacts with location, clearly stating it is not a substitute for emergency services; build with explicit consent and false-alarm controls.

8.7 WOMEN'S HEALTH MODULE (PCOS / PCOD / HORMONAL BALANCE)
- Cycle tracking (period dates, flow, symptoms, mood, pain, discharge, sleep, stress, basal body temperature if available, integration with Health Connect/HealthKit cycle data), prediction of next period and fertile window with uncertainty ranges (not single-point dates), irregularity detection, and trend analysis across months.
- Pattern-based risk awareness (NOT diagnosis): combine cycle irregularity, symptoms (acne, hirsutism, weight change, hair loss, fatigue), sleep, activity, and available labs to surface "your pattern may be worth discussing with a gynecologist" with explanation of which signals contributed and what tests a doctor might consider. Respect clinical criteria (e.g., Rotterdam-style) only as informational context.
- Personalized lifestyle recommendations (cycle-phase-aware yoga, exercise intensity, sleep, local affordable diet, stress management), with clear safety rules and escalation (very heavy bleeding, severe pain, missed periods with possible pregnancy, etc.).
- Strong privacy defaults (cycle data is highly sensitive: local-only by default, never shared without explicit consent, discreet app mode/notification text, easy delete), partner/family sharing optional and granular.
- Optional extensions: pregnancy/postpartum mode, perimenopause mode, adolescent-friendly education in regional languages.

8.8 LONGEVITY AND HEALTHSPAN ENGINE
- Goal: help each user improve healthspan (and plausibly lifespan) through a personalized, natural, lifestyle-first routine built from their own database: sleep regularity, movement (zone-2, strength, mobility), daily steps, nutrition (local, affordable, whole-food, culturally appropriate), stress/HRV, circadian routine, sun/outdoor time, social connection, hydration, avoidance of harmful habits, preventive screening reminders, and relevant yoga/pranayama/meditation.
- Compute a transparent "Healthspan Score" and risk-factor dashboard from the user's real signals (resting heart rate, HRV, sleep consistency, activity, BMI/waist where available, BP, glucose/HbA1c, lipids), using published, validated approaches where possible and clearly labeled as an informational wellness estimate, NOT a medical prediction of lifespan. Never claim guaranteed longevity or cures. Show uncertainty and evidence level for every recommendation, and cite sources (guidelines, peer-reviewed literature) in the explanation.
- Personalized "what-if" simulator: the user changes a habit (e.g., +30 min walking, fixed sleep schedule) and sees the projected change in their risk-factor trajectory with confidence bands, based on published effect sizes (cite them) and the user's own data.
- Weekly plan generation, habit-loop design (small steps, streaks, implementation intentions), adaptive difficulty, and progress tracking; doctor-shareable summaries.
- Medical safety: do not suggest stopping or altering prescribed medication; flag when a lifestyle plan should be supervised by a clinician; age/condition-aware limits (for example fasting or intense exercise cautions).

8.9 CREATIVE ADDITIONS (YOU MUST BRAINSTORM AND ADD MORE)
Beyond everything above, brainstorm at least 12 additional innovative, high-impact features that fit the three pillars and the merged projects, rank them by (judge wow x feasibility in 24h x pillar fit), and implement the top ones that fit the schedule. Record the full ranked list and the reasoning in `docs/FEATURE_IDEATION.md`. Seeds to consider (evaluate, do not blindly copy): family/caregiver health circle with elder mode; ASHA/community-health-worker assist mode for low-resource settings; Jan Aushadhi generic-alternative and price finder; cost-aware diet planner using local seasonal foods; scheme-eligibility finder; "Digital Health Twin" what-if engine; doctor-ready one-page visit brief auto-generated in the clinician's language; voice-based prescription and report explainer in regional languages; lab report understanding with trend charts; sleep and stress coaching from HRV; seasonal/air-quality-aware recommendations (Delhi AQI) tied to the patient's conditions; medication-adherence streak rewards; hospital queue and appointment optimization; symptom-diary with timeline correlation (food, sleep, cycle, weather vs symptoms); emergency card with offline QR (blood group, allergies, meds); ABHA-linked consent-driven record sharing mock; community anonymized insights with differential privacy.

==================================================
9. PHASE 5: CUSTOM ALGORITHMS (OUR TECHNICAL USP, TOP PRIORITY)
==================================================
Design and implement 3-4 ORIGINAL "masterpiece" algorithms customized to THIS product (at least one must power the cross-project integration using data from both projects; the others should serve the new modules). They must NOT be generic AI-written logic, NOT just an LLM call, NOT trivial if/else or simple sorting. Candidate directions (choose and adapt what genuinely fits; you may propose better ones): 
 (a) a patient-centric entity-resolution + temporal knowledge-graph reasoning engine over the combined record, 
 (b) a Bayesian / hidden-Markov or state-space cycle and hormonal-phase model with calibrated uncertainty that fuses cycle logs, wearable signals and symptoms, 
 (c) a constraint-optimization personal-routine planner (yoga, diet, sleep, medicine timing, budget, time, safety constraints, interaction graph) that produces a plan maximizing expected benefit under the patient's real constraints, 
 (d) a contextual-bandit adaptive reminder and habit engine that learns the best nudge timing and style per user while respecting hard clinical constraints, 
 (e) a transparent healthspan / risk-factor estimator with what-if simulation and uncertainty propagation, 
 (f) a herb-drug-food interaction safety graph reasoner with evidence weighting.
For EACH algorithm:
- Design doc `docs/algorithms/<name>.md`: brandable name, exact problem, why naive approaches and plain LLMs fail, formal formulation (inputs, outputs, objective, constraints), full pseudocode, data structures, complexity, tunable parameters, edge cases, clinical-safety considerations, which features use it, and a 60-second (non-expert) plus 2-minute (technical) judge explanation.
- Implement as an isolated, pure, seed-deterministic, strongly typed module with a schema-based interface, docstrings that explain the math, no hidden side effects. LLMs/embeddings only where the design doc explicitly allows.
- Tests: unit tests with concrete inputs/expected outputs, property-based tests (Hypothesis / fast-check), edge cases, performance benchmarks.
- Benchmark harness versus a naive baseline on realistic synthetic data; save REAL reproducible results to `docs/benchmarks/` (JSON + markdown + charts) via `make bench`. Never invent numbers.
- Expose via API with an `explanation` payload (scores, contributing factors, intermediate steps, uncertainty) and build a UI component that visualizes it live (before/after, explainability panel) in both web and mobile where relevant.
- Where an algorithm runs on sensitive data, it must be able to run inside the Privacy Node / on-device without cloud access.

==================================================
10. PHASE 6: AI LAYER
==================================================
Implement AI as a layer ON TOP of the algorithms and real engineering. Evaluate and build what fits: clinician-facing longitudinal summarization with citations to source records; natural-language and voice querying of the unified record (via local Cognee memory first); document/report/prescription understanding (OCR + vision + extraction to FHIR); multilingual patient explanations via Sarvam; proactive care-gap, cycle, and longevity nudges; an agent that performs multi-step tasks across modules with typed tools, strict permissions, step limits, and an audit log of every tool call.
Requirements:
- Provider abstraction with routing and automatic fallback (primary -> secondary -> local model -> cached/rule-based), timeouts, retries with backoff and jitter, circuit breaker, free-tier rate-limit awareness, per-user budgets.
- Prompts as versioned files; schema-validated structured outputs with repair-and-retry; streaming where useful.
- RAG: chunking, embeddings, hybrid retrieval (vector + keyword + graph via Cognee), reranking, mandatory citations and grounding.
- Clinical safety: decision SUPPORT only, never diagnosis; confidence/uncertainty display; human-in-the-loop for consequential actions; red-flag/emergency escalation; hallucination controls; disclaimers; explainability; bias/fairness checks (skin tone for vision, language and dialect fairness, gender-specific pitfalls); prompt-injection defense (all user/retrieved content is untrusted data); PHI redaction before any external call.
- Eval suite with golden cases and scoring via `make eval` (include multilingual medical-term correctness, interaction-safety recall, and red-flag detection recall); semantic/exact caching to save quota and latency.

==================================================
11. PHASE 7: UNIFIED FRONTEND, MOBILE EXPERIENCE AND DEMO MODE
==================================================
- Unified web shell: one login, one navigation, one design system, global search across modules, patient-centric dashboard. Existing project UIs integrated unmodified (route-level mounting, micro-frontend/module federation, reverse-proxied embedding, or deep-linked with shared session), whichever is most robust. New native screens for everything that exists only because the projects are connected plus all new modules.
- Mobile app screens for the full patient experience: onboarding with language selection and voice, home/today view (meds, routines, vitals, cycle phase), wearable connections, records, natural-care plans and guided sessions, women's health, longevity dashboard, reminders/alarms, privacy dashboard, caregiver mode, SOS, settings.
- Startup-grade visual quality: cohesive design tokens, tasteful motion, real data visualizations, polished landing page, dark mode, accessibility, responsive, i18n (Hindi + at least 2 more Indian languages, ideally all that Sarvam supports), voice-first and low-literacy-friendly flows.
- Every screen has loading (skeleton), empty, error, success, and offline/degraded states.
- "Judge / Demo Mode": one-click seeded demo patient (including a female demo patient with PCOS-like pattern), clinician, and caregiver; simulated wearable/BLE stream (clearly labeled); guided walkthrough with marked "wow moments" (especially where the two original projects connect, the privacy zero-egress proof, the multilingual voice moment, and the alarm escalation); standalone Project 1 and Project 2 demo toggles; live architecture/metrics dashboard.

==================================================
12. PHASE 8: COMPLIANCE, SECURITY, DEVOPS, DEPLOYMENT
==================================================
Compliance (`docs/COMPLIANCE.md`; implement what is feasible): India DPDP Act 2023 (consent, purpose limitation, data principal rights incl. erasure and portability, children's data), ABDM (ABHA, consent manager and HIE concepts), Telemedicine Practice Guidelines, CDSCO software-as-medical-device awareness (state clearly that this is wellness/decision-support, not a diagnostic device, and what would change that), HIPAA/GDPR awareness, FHIR R4 alignment, SNOMED CT / LOINC / ICD-10 / RxNorm or free equivalents, responsible-AI statement, synthetic data strategy (Synthea-style generation and legally usable public datasets), app-store health-data policies awareness.
Security: STRIDE-lite threat model, validation everywhere, authz on every endpoint (no IDOR), rate limiting, secure headers/CSP/HSTS, CORS allowlist, dependency audit, secret scanning, SSRF/XSS/CSRF/injection protections, least-privilege IAM, audit logging, mobile hardening (secure storage, certificate pinning where practical, jailbreak/root awareness, biometric lock), end-to-end encryption for Privacy Node sync.
Testing: unit, integration, API contract, Playwright web e2e (standalone flows for each project plus the combined flow), mobile e2e (Detox/Maestro as feasible) or documented manual test scripts, k6 load tests recorded in `docs/benchmarks/`.
CI/CD (GitHub Actions): lint, typecheck, tests, `verify-untouched`, build, dependency + container vulnerability scans, container build and push (ECR or justified), deploy to staging then production, smoke tests, automatic rollback on failed health check, OIDC to AWS, caching; mobile build workflow (EAS or local build) producing a downloadable APK artifact.
Infrastructure as Code (Terraform / CDK / SST / Pulumi, justify): complete AWS stack (compute, networking, data stores, cache, queues, storage, CDN, DNS/SSL, secrets/KMS, IAM, logs, alarms), documented plan/apply/destroy, AWS Budgets and billing alarms, auto-shutdown/teardown scripts, and a cost table proving fit within free tier / $100 credits. Note that raw PHI lives in the Privacy Node, not the cloud, and reflect this in the data-flow diagrams.
Deployment: live public HTTPS URL, green health checks, seeded demo data, monitoring dashboards, downloadable APK link/QR. `docs/DEPLOYMENT.md` with exact steps, URLs, rollback/teardown.
Fallbacks: a fully offline local demo (`make demo`, including Privacy Node + local model path) in case venue wifi or cloud fails, plus a guide for recording a backup demo video.

==================================================
13. ENGINEERING STANDARDS
==================================================
Clean architecture, separation of concerns, small focused functions, strong typing with runtime validation at every boundary, consistent error handling, no dead code or copy-paste duplication, comments that explain WHY, tests for everything that matters, a thin end-to-end slice first and then deepen, so the system is demoable at every moment. Shared packages for types, schemas, i18n and API clients across web, mobile and services.

==================================================
14. DEFINITION OF DONE (do not stop before this unless blocked)
==================================================
[ ] Both original projects run unmodified (`verify-untouched` passes or every change is justified in UPSTREAM_CHANGES.md) and each works standalone.
[ ] Unified platform boots from a fresh clone with one command; one login; one navigation; one unified API; seed/demo data and accounts work reliably.
[ ] Every Hard Requirement of both projects is satisfied and traced; the cross-project integration story works end to end.
[ ] Three pillars (accessibility, affordability, quality) each have shipped features, a measurable metric, and a demo moment documented in PILLARS.md.
[ ] Mobile app (Android APK at minimum) and website both work with feature parity for core patient flows; offline-first behavior verified.
[ ] Sarvam-powered multilingual text + voice works in the app and web with fallbacks and medical-term safeguards.
[ ] Health Connect / HealthKit integration implemented (or honestly documented where platform constraints block it) plus BLE integration with a labeled simulator; data normalized to FHIR Observations.
[ ] Cognee-based Privacy Node working locally; Privacy Dashboard proves minimal/zero raw-PHI egress; offline demo path works.
[ ] Natural-care (yoga/remedies), reminders/alarms/SOS, women's health (cycle + PCOS/hormonal insights) and longevity modules implemented with safety rules, evidence grading, interaction checking, and explanations.
[ ] 3-4 custom algorithms implemented, tested, benchmarked with real numbers versus baselines, exposed with explanations, visualized in UI.
[ ] AI features implemented with fallbacks, guardrails, PHI redaction and evals; creative additions ideated, ranked, and the best implemented.
[ ] Compliance and security items implemented or explicitly documented as roadmap; no secrets in the repo.
[ ] Tests (unit, integration, e2e, load) pass; lint and typecheck clean.
[ ] CI/CD green; IaC applies cleanly; public AWS deployment live with monitoring and cost guards.
[ ] Docs complete: README with architecture diagram, DISCOVERY, INTEGRATION_DESIGN, PILLARS, module and algorithm docs, FEATURE_IDEATION, API docs, COMPLIANCE, DEPLOYMENT, BENCHMARKS, DEMO_SCRIPT (5-7 min and 2 min versions with deliberate wow moments), TROUBLESHOOTING, and a judge Q&A cheat sheet (including "why not just use ChatGPT?", "why combine these problems?", "is this a medical device?", "how is data private?", "how do you stop harmful natural-remedy advice?").
[ ] `docs/PROGRESS.md` shows every item DONE or explicitly justified.

==================================================
15. PARALLEL WORK (4 TEAM MEMBERS)
==================================================
If I say which module/role you own (e.g., "You own mobile", "You own algorithms", "You own Privacy Node + AI layer", "You own infra/CI/CD + web shell"), work only inside that boundary, respect shared contracts (`packages/shared`, OpenAPI, event schemas, canonical FHIR-aligned model), use branch `feat/<module>`, rebase often on `main`, and update only your own rows in `docs/PROGRESS.md`. If no role is given, you own everything and execute all phases in order.

==================================================
16. REPORTING
==================================================
After each phase, summarize briefly: what was built, what was verified (with evidence such as command output), deviations and why, and the next step. At the end produce `docs/FINAL_REPORT.md`: feature coverage, requirement traceability, benchmark results, architecture as built, deployed URLs, demo instructions, known limitations, and a judge cheat sheet.

BEGIN NOW: read `AGENTS.md` and `docs/HACKATHON_BRIEF.md` if present, then start Phase 0 (deep discovery of `projects/project-1/` and `projects/project-2/`, plus feasibility verification of Sarvam, Cognee, Health Connect, HealthKit, BLE and alarms). Work continuously until the Definition of Done is met.