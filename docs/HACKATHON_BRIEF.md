# HackShift 2026 — Healthcare & Well-being Brief

**Event:** HackShift 2026 · IIIT Delhi  
**Theme:** Healthcare & Well-being — *"Reimagining Healthcare Through Technology"*  
**Product:** AYUSETU (आयुसेतु) — The Continuity-of-Care Operating System  

---

## 🎯 Umbrella Problem Statement

> *"Healthcare & Well-being — develop technology-driven solutions to improve healthcare **accessibility, affordability and quality of care**, such as **AI-assisted guidance, remote monitoring and digital health management**."*

---

## 📋 Core Requirements (PS-1 to PS-7)

| ID | Requirement Area | Hackathon Expectation | AYUSETU Implementation |
|---|---|---|---|
| **PS-1** | **Accessibility** | Language, distance, literacy, low bandwidth | Voice-first Indic UX (Hindi, English, Punjabi, Tamil), WhatsApp native, offline-capable kiosk |
| **PS-2** | **Affordability** | Cost reduction, wastage reduction | Generic-substitution Savings Meter, FEFO expiry-aware allocation, zero-hardware RPM |
| **PS-3** | **Quality of Care** | Error prevention, triage accuracy | Triage Sentinel hard-rule red-flag bypass (<3s), course-valid batch dispensing |
| **PS-4** | **AI-Assisted Guidance** | Clinical guidance & history taking | Adaptive clinical questioning (SOCRATES style), clinician SOAP note generation |
| **PS-5** | **Remote Monitoring** | Out-of-hospital patient monitoring | AYUSETU Home: WhatsApp photo/voice check-ins, Drift Radar (BOCPD change-point detection) |
| **PS-6** | **Digital Health Mgmt** | Interoperable records, clinic ERP | Single Patient Thread, ABHA-aligned FHIR R4 bundles, multi-clinic inventory & ledger |
| **PS-7** | **Responsible AI & Privacy** | Data protection, DPDP compliance | On-device/Edge PHI redaction gate, granular consent receipts, hash-chained audit logs |

---

## 🔄 Dual-Project Origin & Integration

AYUSETU unifies and elevates two foundational codebases into a single closed-loop ecosystem:

1. **Project 1 — AarogyaNidhi (ClinicOS)**
   - *Scope:* Multi-clinic hospital operations, role isolation, POS, inventory batch/expiry radar, double-entry financial ledger.
   - *Directory:* `projects/project-1/`

2. **Project 2 — MediKiosk (SIH 2026 PS #26047)**
   - *Scope:* Multilingual voice intake, adaptive triage questioning, red-flag detection, prescription/report OCR, physician SOAP generation.
   - *Directory:* `projects/project-2/`

3. **The AYUSETU Synergy ("1 + 1 = 3")**
   - **Intake → Ops (Rx-to-Shelf):** Prescriptions from intake automatically match in-stock, course-valid, lowest-cost generic batches in the clinic inventory.
   - **Ops → Home (Refill hazard):** Inventory consumption and prescription timelines schedule proactive refill nudges via WhatsApp.
   - **Home → Intake (Closed Loop):** Remote monitoring vitals drift alerts feed nurse intervention queues and preload patient context on their next clinic visit.
