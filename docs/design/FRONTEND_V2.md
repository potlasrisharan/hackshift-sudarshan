# AyuSetu design system V2

Reference: `ayusetu-ui-reference.png`. Implementation brief supplied on 18 October 2026.

## Direction

Warm ivory marketing and kiosk surfaces, jade actions, sage navigation, dark green text and restrained amber accents. Red indicates critical or destructive states. The supplied reference informs the proportions, multilingual language tiles, patient journey and clinical workspace density. The hero illustration is an original generated asset, not a patient photograph.

Tokens live in `packages/design/tokens.css`. Typography uses the existing Plus Jakarta Sans family with native Indic and system fallbacks; no new external font requests are required. Spacing follows 4px increments, with a 240px desktop sidebar, 76–88px headers and 10–20px component radii. Existing dark-mode and high-contrast controls remain available.

## Actual website entry points

| Surface | Entry | Build output | Notes |
| --- | --- | --- | --- |
| Public website and patient PWA | `apps/web/index.html` | `dist/web/index.html` | Public landing followed by the existing explicit demo consent action |
| Existing ERP and kiosk | `apps/web/erp.html` | `dist/web/erp.html` | Reconnects the retained React ERP; existing demo/session behavior preserved |
| Persisted clinical workspace | `frontend/website/index.html` | `dist/integration/index.html` | Existing sign-in, intake, queue, review and consent APIs |
| ERP in clinical bundle | `frontend/website/erp.html` | `dist/integration/erp.html` | Same retained ERP, same design system |

Install both locked dependency sets before building:

```sh
npm ci
npm ci --prefix frontend/website --ignore-scripts
npm run build:frontend
npm run check:frontend
```

The deployed-site Vite configuration now includes both the PWA and ERP entry points. CI installs the website dependency set. Existing backend deployments and API contracts are unchanged by this redesign.

## Route inventory and implementation

All ERP URLs below are hash routes under `/erp.html`. Existing view IDs and role checks are retained.

| Route or view | Treatment |
| --- | --- |
| `/` | New editorial hero, illustrated care continuum, workspace selector, platform story, safety section and closing action |
| `/about`, `/news`, `/contact` | Retained content and forms; shared typography, navigation, colors and SVG icons |
| `/clinic-operations`, `/hospital-command-center` | Retained product content; shared public design system |
| `/privacy`, `/careers`, `/support` | Retained legal/support content and workflows; shared public design system |
| `/login`, `/register` | Existing redirects to the ERP entry preserved |
| `/kiosk` | Compact five-step header, accessible language tiles, identity methods, shared voice orb, existing scan/extraction and token/download flows |
| `/app?view=doctor-consultation` | Light clinical header, persistent clinical navigation, patient queue, existing SOAP, vitals, medications and review workflows |
| `/app?view=emergency-triage` | Light default, scoped clinical contrast improvements, explicit status text, existing bays, cases, filters and simulation actions |
| `/app?view=admin` | Shared enterprise shell, quieter audit strip, network/clinic cards, existing analytics and inventory workflows |
| `/app?view=clinic-admin` | Shared clinic shell, operations overview, existing quick actions and pharmacy workflows |
| `/app?view=pos`, `inventory-dashboard` | Retained medicine search/cart, batch and inventory workflows; shared tokens, controls, icons and tables |
| `/app?view=staff`, `attendance`, `shift-management` | Retained staff, attendance and shift workflows; shared shell and SVG icon adapter |
| `/app?view=earnings`, `expenses`, `ca-suite` | Retained financial calculations and controls; shared enterprise styling |
| `/app?view=procurement`, `medicine-migration`, `equipments` | Existing workflows preserved; shared enterprise styling |
| `/app?view=ipd`, `ayush-center` | Existing inpatient and AYUSH workflows preserved; shared styling |
| `/app?view=billing`, `settings` | Existing subscription and settings workflows preserved; shared styling |
| `/app?view=hospitals`, `audit_logs` | Existing role restrictions and registry/audit components preserved; shared shell/icons |

Patient PWA views `#today`, `#thread`, `#medicines`, `#monitor`, `#care`, `#women`, `#privacy` and `#lab` share the V2 palette, navigation, controls, charts and responsive layouts. Existing HER and Vitalis exploration remains in the women’s wellbeing and preventive-care views; their navigation is labelled AyuSetu HER and AyuSetu Vitalis.

Persisted clinical hash routes `/clinician`, `/kiosk` and `/thread/:id` use the V2 shell, reusable status badges/metric cards, queue search/status filters and accessible browser dictation. Clinical checks, request bodies, consent handling, tenant identity and integer-paise calculations are preserved.

## Shared implementation

- `packages/design/landing.ts`, `landing.css`, `tokens.css`: shared static public content and tokens, reused by the PWA and React site. Destinations are local constants, never user/API HTML.
- `frontend/website/src/design-system/`: clinical styles and scoped retained-ERP compatibility styling.
- `components/ui/clinical.tsx`: reusable clinical metric and status components.
- `components/ui/SymbolIcon.tsx`: local Lucide SVG adapter replacing unloaded icon-font glyphs.
- `components/VoiceInput.tsx`: idle, initializing, listening, processing, paused, speaking, completed and error states. Web Audio levels drive the listening rings/waveform when available. Pause, stop and unmount release microphone tracks. Browser dictation is optional; typing remains available. Replay uses actual speech-synthesis events. Reduced motion is respected.
- ERP screens load in separate bundles. In the measured local build, the ERP entry fell from roughly 2.63MB to roughly 344KB before gzip; large charts/PDF/spreadsheet modules load separately.
- Analytics CommonJS interop is normalized so optional analytics cannot blank the ERP entry.

## Verification

- [x] Route/source inventory completed before implementation.
- [x] V2 tokens, shared styles and original illustration implemented.
- [x] Public landing and workspace selection replaced.
- [x] Kiosk language, progress and voice interfaces implemented.
- [x] Existing identity, scanning and completion flows retained and styled.
- [x] Clinical, emergency, headquarters, operations and remaining implemented routes share V2 styling.
- [x] Existing role rules, backend logic and algorithms left unchanged by the redesign.
- [x] Frontend production builds completed for deployed and clinical bundles.
- [x] Focused frontend TypeScript check passed.
- [x] Scoped Biome checks passed for new/shared components and entry points.
- [x] 104 existing unit/API/engine tests passed in the development checkout.
- [x] Seven patient-site browser tests passed, including new navigation, dictation lifecycle and unsupported-browser fallback tests.
- [x] Three unchanged clinical browser tests passed against an isolated database initialized with the existing `0001_intake.sql` schema.
- [x] 53 ERP route/viewport inspections: 29 routes at 1440px, plus six key routes at 1280, 1024, 768 and 390px. No blank screens, JavaScript page errors or document horizontal overflow after fixes.

### Existing limitations, not production-readiness claims

The original ERP includes synthetic data, local/demo sessions and simulated integrations. The redesign labels that surface accordingly; it does not turn ABHA, insurance, OCR, notifications, pharmacy or emergency simulations into verified provider integrations. No map coordinates or patient measurements were invented for the redesign.

In the shared development checkout, the standard clinical browser run was blocked by incompatible legacy and intake `patients` table definitions across migration families. The isolated schema run verifies the frontend workflow independently; it does not certify the combined migration set.

Repository-wide Biome reported 1,422 errors across the existing tree. The original broad TypeScript configuration also includes dormant ERP/archive/Supabase files with existing strict-type errors. New frontend code has its own focused typecheck. These wider cleanup items remain outside a visual frontend change.

Automated inspection does not establish full WCAG conformance or validate every nested modal with every role and dataset. Live speech provider quality, real microphone hardware, clinical validity and production operations require separate verification.
