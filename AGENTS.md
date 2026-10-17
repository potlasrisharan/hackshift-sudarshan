# AGENTS.md — DHAAGA Architecture & Execution Rules

> **Single Source of Truth:** `docs/PRD.md`. Always check specs, algorithms, and schemas there before implementing.

---

## 🏗️ Repository Layout

- `backend/` — **Unified Cloudflare Worker** (Hono + D1 + Durable Objects + R2 + KV + Queues). Serves both `website/` and `app/` over `/api/v1`.
- `frontend/website/` — **Web ERP & Clinician Portal** (React + Vite + Tailwind CSS).
- `frontend/app/` — **Patient & Kiosk App** (Flutter — Android, iOS, Web).
- `packages/engine/` — **Pure TS Deterministic Algorithms** (Sentinel, Rx-to-Shelf, Drift Radar, ThreadPulse).
- `packages/shared/` — **Contracts & Models** (Zod schemas, TypeScript types, FHIR R4 mappers).
- `docs/` — **PRD, Hackathon Brief, Decisions, and Progress Tracking**.

---

## ⚡ Master Rules

1. **Shared Backend:** Both `frontend/website` and `frontend/app` connect to the same Cloudflare backend (`/api/v1`).
2. **TypeScript Strict:** No `any`. Zod validation on all API boundaries.
3. **Algorithms Decide, AI Translates:** Rule engines make medical and operational decisions; LLMs only format/translate text.
4. **Zero PHI Leaks:** Redaction gate strips all identifiers before any external AI call.
5. **Money = Integer Paise:** Zero floating point math for prices or ledger entries.
6. **Multi-Tenancy:** All D1 queries scoped with `org_id` via `tenantDb(ctx)`.
