# Interface provenance

The website follows Project 1's ClinicOS workspace structure: clinic identity,
role-aware sidebar, header, dashboard panels and operational navigation. Its
reference is `hackshift/projects/project-1/src/components/layout/AppLayout.tsx`.
The React shell, typed state and API implementation here are newly written; the
original Supabase context and generic CRUD service were not copied.

The staff-assisted intake, red-flag screen, patient concern, clinical queue and
encounter review journeys come from Project 2's MediKiosk kiosk and doctor
portals (`public/kiosk/index.html`, `public/doctor/index.html`). They now share
server-issued patient/encounter IDs and one consent-checked API. The original
HTML scripts, clinical fallbacks, CDN libraries and provider secrets were not
copied. Root originals remain unchanged and retain their original notices.

This milestone does not yet port Project 1's operational feature screens or
Project 2's Flutter client. See `docs/PROJECT_INTEGRATION_PLAN.md` for scope.
