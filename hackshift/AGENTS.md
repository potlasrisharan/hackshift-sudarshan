# AGENTS.md
Source of truth: PROMPT.md (root). Read it fully at the start of EVERY session,
then read docs/PROGRESS.md, DECISIONS.md, DISCOVERY.md, INTEGRATION_DESIGN.md and resume.
projects/ is READ-ONLY (see PROMPT.md section 2). Run scripts/verify-untouched.sh before reporting milestones.
Never commit secrets. Zero-cost only. Label mocks. Verify before claiming done.

---

## ⚡ Master Rules (Non-Negotiable)

1. **TypeScript Strict:** No `any`. Strict types always. Zod validation har I/O boundary par. Biome lint/format pass hona chahiye.
2. **Cloudflare-Native Platform:** Code runs on Cloudflare Workers (Hono) + D1 (SQLite) + Durable Objects + KV + R2 + Queues. Zero Node-only runtime dependencies (`fs`, `child_process`, etc.).
3. **Algorithms Decide, AI Translates:** Rule-engine aur deterministic algorithms (Sentinel, Rx-to-Shelf, Drift Radar, ThreadPulse) decisions lenge. LLM kabhi question sequence, triage tier, drug matching, batch, ya medical alert decide nahi karega.
4. **Zero PHI Leaks:** Har outbound LLM call `packages/ai` ke through jayegi (`redact` -> `chain` -> `validate` -> `fallback`). No raw patient identifiers to third-party APIs.
5. **Data & Accounting:**
   - Har amount integer **paise** mein hoga (no floating point currency).
   - Multi-tenant isolation: sabhi queries `tenantDb(ctx)` ke through execute hongi with `org_id`.
   - Ledger: double-entry balancing (`SUM(debit) == SUM(credit)`) DB transaction mein assert hogi.
6. **Code Quality & Resilience:**
   - Har screen/feature ke paas Loading, Empty, Error, aur Offline states hone chahiye.
   - Code likhne ke baad `pnpm test` chala.
7. **Synthetic Data Policy:** Hackathon demo ke liye sabhi patients, encounters, aur records synthetic hain. ABDM/FHIR "aligned" bolna hai, kabhi "certified" ya "live government approved" claim mat karna.
8. **Progress Tracking:** Har feature complete hone par `docs/PROGRESS.md` update kar.
