# AyuSetu Vitalis — Repository Integration Report & Architecture Map

**Date:** October 2026  
**Module:** AyuSetu Vitalis (Longevity, Preventive Health & Healthspan Intelligence)  
**Status:** Integrated Engineering Specification

---

## 1. Discovered Architecture & Frameworks

- **Backend:** Cloudflare Workers running Hono (`backend/src/index.ts`), bound to Cloudflare D1 SQL database (`DB`), KV, Durable Objects (`ClinicInventory`, `ClinicHub`, `TriageSession`, `OrgAudit`), and optional R2.
- **Frontend App:** Flutter 3.11+ null-safe app (`frontend/app/lib/`) utilizing GoRouter for declarative routing, Riverpod for state management, Material 3 with dark/light themes, and HTTP client for Cloudflare backend communication.
- **Packages:**
  - `packages/shared/` — Zod contracts and shared models (`contracts.ts`, `her_contracts.ts`).
  - `packages/engine/` — Pure TypeScript deterministic algorithms without external dependencies (`sentinel`, `rxToShelf`, `driftRadar`, `threadPulse`, and HER engines `herSafetyGate`, `herCycleDetector`, etc.).
- **Women's Health (HER):** Isolated under `/api/v1/her` and `frontend/app/lib/features/her/`. Menstrual and reproductive data is strictly isolated with separate consent mechanisms and never cross-pollinated into Vitalis without explicit user grant.
- **Existing Operations:** Patient Kiosk (`/kiosk`), Doctor Portal (`/doctor`), Nurse Triage (`/nurse`), HQ Command (`/hq`), Clinical Mgmt (`/clinical`), Yoga (`/yoga`), and Legacy Longevity (`/longevity`).

---

## 2. Shared Health Core & Privacy Isolation

```
                   ┌──────────────────────────────┐
                   │    AyuSetu Patient Core      │
                   │ (Demographics, Conditions,   │
                   │  Allergies, Meds, Consents)  │
                   └──────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│       AyuSetu HER            │          │      AyuSetu Vitalis         │
│ (Menstrual Rhythm, Cycle     │          │ (Cardiorespiratory Fitness,  │
│  Anomalies, Gyn Triage,      │          │  Healthspan Progress Index,  │
│  Private Symptom Journal)    │          │  Functional Capacity, Biomarkers,│
│                              │          │  Indian Nutrition, Sleep SRI) │
└──────────────────────────────┘          └──────────────────────────────┘
```

### Privacy & Consent Boundary:
- Sensitive HER reproductive and cycle tracking observations remain locked within `her_*` database scopes.
- General health telemetry (steps, resting heart rate, sleep duration) collected by the shared wearable layer can be accessed by both modules under explicit per-domain consent.
- Neither module makes diagnostic assertions or modifies clinical prescriptions autonomously.

---

## 3. Vitalis Deterministic Engine (V0–V14)

All algorithms are deterministic, versioned, and provide complete evidence traceability:

| ID | Name | Core Purpose | Safety Constraint |
|---|---|---|---|
| **V0** | Safety Gate & Triage | Red-flag symptom check & contraindication filter | Precedes all interventions; blocks high intensity exertion on cardiac signs |
| **V1** | Healthspan Progress Index | Behavioral $[0, 100]$ score across 8 modifiable domains | Returns `insufficient_data` if coverage < 40%; never claims biological age |
| **V2** | Preventive Priority Ranker | Weighted ranking: $P(a) = \alpha E + \beta R + \gamma F - \delta B$ | Triage issues are handled out-of-band, never deprioritized |
| **V3** | Exercise Progression | Adaptive step & volume progression | Halts progression upon symptom or elevated fatigue reports |
| **V4** | Biomarker Trend Analyzer | Rate of change ($\Delta x / \Delta t$) and rolling variance | Quarantines conflicting units and physically impossible values |
| **V5** | Lifestyle Associations | Pearson/Spearman paired correlation tracker | Clearly labels correlations as non-causal associations |
| **V6** | Recommendation Selector | Interventions filtered by profile & contraindications | Grounded strictly in curated evidence library |
| **V7** | VO2max Provenance | Provenance categorization (`lab_measured`, `wearable`, `model`) | Research regression disabled by default under experimental flag |
| **V8** | 21-Day Rolling Baseline | Robust personal baselines ($\mu \pm 2\sigma$) | SDNN and RMSSD strictly separated; never combined |
| **V9** | Sleep Regularity Index | 24-hour epoch state agreement & circular bedtime variability | Explicitly differentiates SRI from simple sleep duration |
| **V10** | Daily Readiness | Normalized $[0, 100]$ exploratory wellness indicator | Never authorizes extreme training or acts as clinical clearance |
| **V11** | Functional Capacity | Grip strength (kg), chair-rise, WHO ICOPE risk scoring | Never predicts lifespan years from physical grip strength |
| **V12** | Ingestion & Bucketing | Time-series deduplication & timezone-aware day bucketing | Deduplicates by source record ID; handles DST offsets |
| **V13** | Preventive Care Eligibility | Evidence-based screening schedule (Diabetes, HTN, Lipids) | Age, sex, and family-history conditional; no blanket testing |
| **V14** | Behavior Simulator | What-if behavioral adherence modeling | Strictly simulates adherence targets, never biological lifespan years |

---

## 4. Mobile UX Architecture (Flutter)

17 routes mounted under `/vitalis`:
1. `/vitalis` — Main Dashboard & Priority Actions
2. `/vitalis/onboarding` — Multi-step Profile & Consent Setup
3. `/vitalis/assessment` — Adaptive Q01–Q40 Branching Questionnaire
4. `/vitalis/healthspan` — 8-Domain Healthspan Progress Index (HPI)
5. `/vitalis/biomarkers` — Laboratory Biomarker Trends & Range Verification
6. `/vitalis/cardio` — VO2max Provenance & Cardiorespiratory Guidance
7. `/vitalis/wearables` — Sync Manager & 21-Day Baseline Viewer
8. `/vitalis/activity` — Progressive Overload Exercise & Yoga Planner
9. `/vitalis/nutrition` — Indian Whole Food Nutrition & Restriction Intelligence
10. `/vitalis/sleep` — Sleep Regularity Index (SRI) & Recovery
11. `/vitalis/functional-health` — Functional Capacity (Grip, Chair Rise, WHO ICOPE)
12. `/vitalis/preventive-care` — Jurisdictional Preventive Timeline
13. `/vitalis/trajectory` — Longitudinal Multi-Axis Trend Explorer
14. `/vitalis/scenarios` — What-If Behavioral Adherence Simulator
15. `/vitalis/copilot` — Evidence-Grounded AI Healthspan Copilot
16. `/vitalis/summary` — Doctor-Ready Longitudinal Summary & Export
17. `/vitalis/settings` — Consent Granularity, Data Vault & Audit Trail
