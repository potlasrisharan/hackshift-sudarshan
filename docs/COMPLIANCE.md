# Compliance and security status

This is a synthetic engineering demonstration. No compliance certification,
production readiness, diagnostic-device classification or legal approval is
claimed. Real deployment for health care needs clinical, privacy and legal review.

| Area | Implemented | Still required before real use |
|---|---|---|
| Purpose and consent | Per-session local demo processing; server checks on every protected record action; revoke | Full notices, retention schedules, guardian workflows, consent receipts and lawful basis review |
| Rights | Synthetic observations can be deleted; FHIR collection can be exported | Durable encrypted record erasure/portability, backups, identity verification, support process |
| DPDP / children | Real personal/children’s data excluded | Current DPDP Act/Rules applicability and rollout, grievance/contact process, verifiable parental consent |
| ABDM / ABHA | Source-based FHIR R4 aligned collection only | Sandbox credentials, profiles/validation, HIP/HIU consent flows and certification assessment |
| Telemedicine | No real consultation or prescribing | Licensed clinician workflow, consent, identity and records obligations review |
| Medical device | No diagnosis, lifespan prediction or automatic treatment/dispense | CDSCO classification advice for intended use; clinical validation and quality system if needed |
| HIPAA/GDPR | No claim; synthetic dataset only | Applicability determination, contracts, rights and security/privacy assessments |
| Coding | LOINC observation code + UCUM units | Terminology licensing/version governance; SNOMED/ICD/RxNorm usage review |
| Mobile health policies | Explicit unavailable health integrations and demo label | Store disclosures, minimal permissions, health-data policy and device tests |
| AI | Local citation template; no external clinical free-text calls | Clinical glossary, safety/fairness evals by language/age/sex, human approval and monitoring |

Authoritative starting points (must be rechecked with qualified reviewers for
real deployment): [MeitY data protection](https://www.meity.gov.in/data-protection-framework),
[ABDM](https://abdm.gov.in/), [NRCeS FHIR](https://nrces.in/ndhm/fhir/r4/),
[CDSCO](https://cdsco.gov.in/), [FHIR R4](https://hl7.org/fhir/R4/).

## STRIDE-lite

| Threat | Current control | Residual gap |
|---|---|---|
| Spoofing | High-entropy bearer demo tokens; one-hour expiry | No production identity provider, SSO, MFA or token exchange |
| Tampering | Zod validation; paise integers; per-session serialized audit hashes | No durable immutable audit store or trusted external hash anchor |
| Repudiation | Action + timestamp + request ID | No clinician signatures or legally sufficient non-repudiation |
| Disclosure | Session-bound patient; no client patient-ID selection; no-store responses; CSP; no external AI | Memory is unencrypted; imported originals need separate audit; no real PHI permitted |
| Denial of service | Session/global capacity, per-token request limits, bounded arrays | Distributed limits, edge protections and streaming body-size enforcement need hardening |
| Privilege escalation | No privileged staff/admin endpoints in public demo | Real role/tenant/clinic policies must be implemented and tested |
| Prompt injection | No tools or generative clinical provider enabled | Future RAG must treat records as untrusted data and reject ungrounded output |

Audit chains are tamper-evident, not tamper-proof. Regex redaction is a partial
helper, not de-identification. Python socket controls are partial defense in
depth, not an OS firewall. These distinctions are shown in the UI and runner.

The initial mobile audit identified transitive build-tool vulnerabilities; see
PROGRESS for final remediation state. Original-project vulnerabilities remain
tracked because their dependencies are read-only. No real patient database or
historical authenticated test tokens are included in publication.
