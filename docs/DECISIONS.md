# Decisions

1. **Instruction precedence:** the user's new `prompts.md` overrides conflicting
   older `hackshift/PROMPT.md` demands to rewrite fresh or use only Cloudflare.
   Preserve original code and favour an AWS deployment option. Keep deterministic
   TypeScript algorithms, paise, validation and honest synthetic labelling.
2. **Retirement of reference projects:** The legacy `hackshift/projects/project-{1,2}`
   source trees and hackshift directory have been permanently removed from the repository.
   Platform code is self-contained at `backend/`, `frontend/website/`, `frontend/app/`,
   `packages/`, `apps/`, and `services/`.
3. **First slice:** Hono + Zod provides a versioned boundary that can be reused
   on Node or Workers. A Node host is isolated in server.ts. The web client uses
   typed DOM rendering + Vite: the small shell needs no additional UI runtime.
   Expo uses React Native and shares the pure engine/contracts/i18n packages.
4. **No inherited security claims:** keep the new synthetic demo disconnected
   from unsafe upstream fallback diagnosis and unscoped queue handlers. Do not
   route real patients through the current demo. Live auth mapping is pending.
5. **Data ownership:** browser credentials stay in memory. Server demo records
   are per-session in memory, expiring in one hour. This is not encrypted durable
   storage. Mobile optional check-in uses device SecureStore. Cycle examples are
   static and never sent to API. No real health data is accepted.
6. **Privacy Node:** Python Cognee runs separately, with local LLM and embeddings,
   SQLite/LanceDB/Ladybug storage and telemetry disabled. A Python socket guard
   is defense in depth, not proof of system-wide zero egress. Authenticated E2EE
   mobile/node sync is still pending; do not expose this runner to the network.
7. **Clinical algorithms:** current Sentinel uses an illustrative four-class
   model, not calibrated medical probabilities. Drift Radar uses robust CUSUM,
   not the older brief's BOCPD. ThreadPulse computes exact Bernoulli demand but
   does not yet estimate refill probabilities from history. Every deviation is
   displayed and documented instead of copying unmeasured PRD benchmark claims.
8. **Medical language:** interface translations are draft examples, not verified
   clinical translations. All doses/salts remain unchanged; no free-form medical
   provider call is enabled. Sarvam credentials and glossary review block live
   multilingual clinical functionality.
9. **Deployment:** a small CloudFormation stack uses one synthetic demo instance
   and CloudFront, no NAT/RDS/ALB. No cloud resources are created without working
   account credentials. Budget alarms are notifications, not hard spending caps.
10. **No nested subagents:** no role was assigned. Keep implementation within this
    chat; document four-person ownership boundaries for the team to use later.
11. **Publication exclusions:** retain unknown-provenance databases, historical
    authenticated tokens, environment files and duplicate import folders locally.
    They are not demonstration data and must not be pushed as application assets.
12. **Cross-runtime verification:** browser/Node transcendental functions can
    differ at final floating-point bits. Compare full JSON structure exactly with
    absolute numeric tolerance 1e-10; material numerical differences still fail.

13. **Native toolchain:** exact generated Gradle 9.3.1 is required; newer cached Gradle 9.6 exposed incompatible Kotlin metadata. The pinned NDK download stalled, so a command-line-only local NDK 28 override is being tested. The default Expo NDK remains unchanged. No successful APK is claimed until the artifact is produced and tested.

## Current integration direction — 17 October 2026

The user's new integration request and root AGENTS/PRD govern the new work. Use
Project 1's React workspace structure for `frontend/website` and incorporate
Project 2's clinical workflows, followed by its Flutter kiosk as the second
client. `backend/` is the new persistent Cloudflare integration entrypoint; the
older `apps/*` synthetic demo remains explicit during migration. Earlier AWS/DOM/
Expo decisions above describe that older slice, not this target architecture.

The first milestone is staff-assisted synthetic intake and clinician review.
Use local SQLite for fast durable tests and actual workerd/D1 for runtime checks.
Opaque hashed sessions and PBKDF2 are explicitly limited to local seeded accounts;
production login remains disabled pending production auth, encryption and audit.
No fake service success is mounted while operational/provider modules are pending.
