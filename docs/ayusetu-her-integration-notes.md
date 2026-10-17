# AyuSetu HER — Integration Notes

**Module:** Women's Preventive Health & Hormonal Wellness Intelligence  
**Version:** 1.0  
**Repository:** DHAAGA / AyuSetu Platform  
**Date:** 2026-10-17  

---

## 1. Architectural Alignment

1. **Shared Platform Backend:**
   - Unified Cloudflare Worker (`backend/`) on Hono + Cloudflare D1 + Durable Objects + KV.
   - New endpoint namespace: `/api/v1/her/*`.
   - Multi-tenancy: All D1 queries enforce `org_id` isolation.
   - Zero secrets in code/git: Keys use Wrangler `.dev.vars` and environment bindings.

2. **Deterministic Engine:**
   - Co-located in `packages/engine/her/`:
     - `A0`: Deterministic Safety Gate (urgent red-flag triage, pregnancy + bleeding, syncope, acute pain).
     - `A1`: Menstrual Pattern Deviation Detector (mean interval, std dev, CV, uncertainty-bounded forecast).
     - `A2`: Deterministic Screening Evidence Engine (transparent routing categories: PCOS, Endometriosis, Heavy Bleeding, Thyroid Context, PMS/PMDD).
     - `A3`: Personalized Wellness Ranker (utility score, constraint filtering, Indian diet & restorative yoga with contraindications).
     - `A4`: Longitudinal Health Trend Analyzer (rolling multi-window moving averages with minimum coverage gating).
   - Core principle: Algorithms decide and categorize; LLMs only format/translate text. No artificial diagnostic probabilities or disease confirmation.

3. **Database Schema:**
   - Additive D1 migration: `backend/migrations/0002_ayusetu_her.sql`.
   - 19 dedicated tables covering profiles, consents, cycles, bleeding days, symptoms, questionnaire definitions, sessions, answers, observations, screenings, wearable telemetry, and audit logs.

4. **Mobile Client (Flutter):**
   - Location: `frontend/app/lib/features/her/`.
   - State management: Riverpod with optimistic updates and local cache.
   - Router: GoRouter shell (`/her`, `/her/cycle`, `/her/symptoms`, `/her/questionnaire`, `/her/screening`, `/her/wellness`, `/her/doctor-summary`).
   - Design: Steve Jobs aesthetic—subtle coral/amber/teal highlights, clean typography, empathetic and respectful tone, no generic pink tropes.
   - Wearable Adapter: `HealthDataAdapter` interface with native capability detection and full synthetic demo simulation.
   - Interactive Persona Switcher: Demo A through Demo G for instant clinical evaluation.
