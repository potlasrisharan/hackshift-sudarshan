# DHAAGA Implementation Progress

> Updated automatically as modules and tasks are implemented. Refer to `PROMPT.md` for complete technical specifications.

---

## 🚦 Status Legend
- ⬜ **Not Started**
- ⏳ **In Progress**
- ✅ **Completed**
- ⚠️ **Blocked / Testing**

---

## 📌 Phase-by-Phase Roadmap

### Phase 0: Workspace & Scaffolding
- [x] Initial hackshift directory structure created
- [x] Copy master PRD to `PROMPT.md`
- [x] Create `AGENTS.md` and `docs/HACKATHON_BRIEF.md`
- [ ] Initialize Turborepo monorepo (`apps/api`, `apps/web`, `apps/mobile`, `packages/*`)
- [ ] Setup `wrangler.jsonc` with bindings (D1, KV, R2, Vectorize, Durable Objects, Queues)
- [ ] Drizzle ORM schema definition (`db/schema.ts`) and initial migration

### Phase 1: Engine Algorithms (`packages/engine`)
- [ ] **Sentinel (Algorithm 1):** Adaptive clinical questioning, entropy minimization, hard red-flag override
- [ ] **Rx-to-Shelf (Algorithm 2):** Salt matching, course-validity batch filter, knapsack allocation, margin checks
- [ ] **Drift Radar (Algorithm 3):** Bayesian Online Changepoint Detection (BOCPD) on vitals streams
- [ ] **ThreadPulse (Algorithm 4):** Refill hazard model, Poisson-binomial stock demand, syndromic outbreak radar
- [ ] Golden-vector verification tests (50+ vectors, property tests via `fast-check`)

### Phase 2: Platform & Shared Foundation (`apps/api` + `packages/*`)
- [ ] `packages/ai`: Redaction gate (regex + dictionary), fallback chains (Sarvam → Workers AI / Gemini), template engine
- [ ] `packages/shared`: Zod schemas, FHIR R4 bundle mappers, currency/paise utils
- [ ] `apps/api`: Hono router setup with `/healthz`, JWT auth, and `tenantDb(ctx)` multi-tenant middleware
- [ ] Durable Objects implementation:
  - [ ] `ClinicInventory` (serialized FEFO inventory deductions, zero oversell)
  - [ ] `ClinicHub` (WebSocket alerts & triage queue)
  - [ ] `TriageSession` (session state resilience)
  - [ ] `OrgAudit` (tamper-evident SHA-256 hash chain)

### Phase 3: Dhaaga Intake (`apps/web/src/routes/kiosk`)
- [ ] Kiosk flow: Language Selection (Hindi, English, Punjabi, Tamil) → Consent Receipt → Patient ID
- [ ] Voice STT audio stream handling with fallback to buttons
- [ ] Prescription / Lab report OCR ingestion
- [ ] Clinician SOAP generator with provenance chips & citation validation

### Phase 4: Dhaaga Ops (`apps/web/src/routes/ops` + API)
- [ ] Multi-clinic POS with FEFO batch deduction & loose-unit calculation
- [ ] Inventory Batch & Expiry Radar with inter-clinic transfer flow
- [ ] Double-entry automated ledger triggers & real-time P&L / Balance Sheet
- [ ] Concurrency testing: parallel sales race conditions test

### Phase 5: Dhaaga Home & Bridge (`apps/web` + `apps/mobile`)
- [ ] WhatsApp webhook handler & in-app WhatsApp message/vitals simulator
- [ ] Vitals ingestion & Drift Radar alert triggering
- [ ] Nurse call-queue dashboard with priority ranking
- [ ] End-to-end Rx-to-Shelf bridge: Doctor prescription → Inventory allocation → POS reservation

### Phase 6: Lab & Verification (`apps/web/src/routes/lab`)
- [ ] Interactive `/lab` dashboard with 4 tabs comparing baseline vs DHAAGA algorithms
- [ ] Synthetic seed data generator (`/api/v1/admin/seed?profile=all`)
- [ ] Scripted patient "Sunita" demo workflow verification
- [ ] Playwright E2E smoke tests & cross-tenant data leak tests
