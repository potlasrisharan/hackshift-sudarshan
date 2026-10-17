# Requirement traceability

Original source remains present; a README claim is not runtime proof. The original
hospital build and 12 mocked tests pass. MediKiosk root and red-flag tests pass with
local dummy configuration; database-dependent workflows remain unverified.

| Original hard requirement | Preserved source | Unified status |
|---|---|---|
| P1-HR1 tenancy and roles | App.tsx / HospitalContext / policies | Live SSO/identity mapping pending |
| P1-HR2 POS, FEFO, loose units, split payments, GST | POSDashboard / sale RPCs | Synthetic course-valid allocation connected; live POS bridge pending |
| P1-HR3 inventory/expiry/transfers/import | InventoryDashboard / migrations | Source preserved; reservation/transfer bridge pending |
| P1-HR4 wards/admit/discharge billing | IPDDashboard / IPD migrations | Source preserved; unified writes pending |
| P1-HR5 procurement/PO/GRN/GST | ProcurementDashboard / RPCs | Synthetic refill suggestion only |
| P1-HR6 ledger/statements/audit lock | CAFinancialSuite / ledger migrations | No new transactional ledger implementation |
| P1-HR7 staff/attendance/equipment | corresponding components | Standalone source preserved; shell parity pending |
| P1-HR8 notifications/audit | WhatsApp functions / AuditLogs | New session hash-chain verified; delivery pending |
| P2-HR1 multilingual voice | AI routes/services / Flutter/web | New dictionaries + static TTS adapter; live voice intake pending |
| P2-HR2 adaptive intake | clinical_engine.py fixed list | New illustrative Bayesian engine, not clinical full intake |
| P2-HR3 red flags | intake router / clinical engine | Original subset test + new closed-ontology tests pass |
| P2-HR4 OCR | documents/ocr routes | Preserved; new safe extraction/review flow pending |
| P2-HR5 SOAP | doctor / scribe routes | New cited observation template, not approved full SOAP |
| P2-HR6 ABHA/consent/FHIR | ABDM / fhir services | New purpose consent and FHIR collection; no certified profiles/live ABDM |
| P2-HR7 portals | patient/doctor/AYUSH/triage/admin HTML | Preserved; shared login/mounting pending |
| P2-HR8 AYUSH coding | AYUSH portal / services | Preserved; no new therapeutic inference |
| P2-HR9 NHCX/PM-JAY | insurance routes | Live eligibility unverified |

| New requirement | Evidence | Status |
|---|---|---|
| Untouched originals | baseline tag + verification script | Verified |
| Shared record | validated adapters + provenance API/browser tests | Synthetic slice verified |
| Four algorithms | engine + exhaustive/property tests + real bench | Engineering mechanisms verified, clinical calibration pending |
| Accessible PWA | responsive Hindi/elder/dark/offline-lab e2e | Verified scope only |
| Native mobile | Expo source and typecheck | APK/device status in PROGRESS |
| Sarvam | static TTS gateway + mocked tests | Limited adapter; key needed for live verification |
| Privacy Node | real local Cognee remember/recall evidence | Standalone proof verified; application sync pending |
| Full women's health/natural care/longevity | module designs; honest limited UI | Pending full implementation |
| Production identity/events/storage/security | design and threat model | Pending implementation/configured backends |
| CI, cloud deployment, public URL | workflow, Docker, CloudFormation | Local container verified; cloud auth needed |

No inherited security, government integration, latency or market-performance
claim is transferred to this platform. Full prompt Definition of Done is unmet.
