# DHAAGA Team Collaboration & Cloudflare Deployment Guide

> Master guide for the team working on `potlasrisharan/hackshift-sudarshan`.
> Contains GitHub multi-collaborator setup, Cloudflare remote deployment instructions, and copy-paste prompts for all roles.

---

## 👥 1. Team Collaboration Architecture (Single GitHub Repo)

We use **one central repository** (`potlasrisharan/hackshift-sudarshan`) with all teammates added as collaborators.

### Step 1: Add Collaborators on GitHub
1. Go to repository **Settings** → **Collaborators** (`https://github.com/potlasrisharan/hackshift-sudarshan/settings/access`).
2. Click **Add people** and enter each teammate's GitHub username.
3. Teammates must accept the email invite before pushing branches.

### Step 2: Clone & Local Setup
```bash
git clone https://github.com/potlasrisharan/hackshift-sudarshan.git
cd hackshift-sudarshan
npm install
```

### Step 3: Branching Strategy (Never push directly to `main`)
Every teammate works in their dedicated feature branch:
- **Teammate 1 (Mobile Lead):** `git checkout -b feat/mobile-kiosk`
- **Teammate 2 (Backend Lead):** `git checkout -b feat/backend-cloudflare`
- **Teammate 3 (AI/Voice Lead):** `git checkout -b feat/ai-voice`
- **Teammate 4 (Web Lead):** `git checkout -b feat/web-pos`

### Step 4: Connecting the Mobile App & Frontend to Backend
- **Local Dev:** Point client API to `http://10.0.2.2:8787/api/v1` (Android Emulator) or `http://localhost:8787/api/v1` (Web/iOS).
- **Remote Cloudflare:** Point client API to `https://dhaaga-api.<subdomain>.workers.dev/api/v1`.

### Step 5: Merge Workflow
1. Test your slice: `npm test`
2. Push your feature branch: `git push origin feat/<branch-name>`
3. Open a Pull Request (PR) on GitHub against `main`.

---

## ⛅ 2. Cloudflare Remote Account & API Setup

Do **not** use existing personal accounts. Create a fresh account for the hackathon deployment.

### A. Create Account & Copy Account ID
1. Sign up at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. On the dashboard homepage, copy the 32-character **Account ID** from the right sidebar.

### B. Generate Custom Remote API Token
1. Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens).
2. Click **Create Token** → **Create Custom Token** (`Get started`).
3. Set **Token name**: `hackshift-remote-deploy`.
4. Add the following Account-level permissions:
   - `Account` | `Workers Scripts` | **Edit**
   - `Account` | `Workers Routes` | **Edit**
   - `Account` | `Cloudflare Pages` | **Edit**
   - `Account` | `D1` | **Edit**
   - `Account` | `Workers KV Storage` | **Edit**
   - `Account` | `Workers Queue` | **Edit**
   - `Account` | `Durable Objects` | **Edit**
   - `Account` | `Account Settings` | **Read**
5. Under **Account Resources**, select `Include` → `All accounts`.
6. Click **Continue to summary** → **Create Token** and copy the token.

### C. Remote Deployment Commands
Set environment variables:
```bash
export CLOUDFLARE_API_TOKEN="<your_token>"
export CLOUDFLARE_ACCOUNT_ID="<your_account_id>"
```

Deploy Worker (Backend API):
```bash
npm run deploy:worker
```

Deploy Pages (Frontend Web PWA):
```bash
npm run build
npm run deploy:web
```

---

## 📋 3. Copy-Paste Teammate Prompts

### 📱 Prompt 1: Mobile App & Kiosk Lead
```markdown
You are the Mobile App Lead on the DHAAGA Continuity-of-Care platform (potlasrisharan/hackshift-sudarshan).
Your focus is delivering the Patient Intake Kiosk application.

CONTEXT & RULES:
1. Codebase: `medikiosk-sih2026-main/kiosk_app` (Flutter + Riverpod + GoRouter) or `apps/mobile` (Expo).
2. Branch: `feat/mobile-kiosk`.
3. Architecture: Clean Architecture. No hardcoded colors or strings. Use existing riverpod providers.

TASKS:
1. Run and verify `medikiosk-sih2026-main/kiosk_app`:
   - Run `flutter pub get` and launch on an Android emulator or device.
   - Verify the 6 core screens: Language Selection (`language_screen.dart`), Patient ID (`identify_screen.dart`), Voice Chat (`converse_screen.dart`), Scan Camera (`scan_screen.dart`), Summary Review (`summarize_screen.dart`), and Queue Token (`queue_token_screen.dart`).
2. Connect `api_client.dart` to the Cloudflare Worker backend:
   - Submit completed intake payloads to `POST /api/v1/intake/session`.
   - Receive the triage tier (Red/Yellow/Green) and token ID from the response.
3. Build and package a test APK for Android tablet kiosk display.

DEFINITION OF DONE:
- App runs cleanly on an Android device or emulator.
- Completing a triage flow sends data to the API and displays the issued queue token.
```

---

### 🗄️ Prompt 2: Backend & Cloudflare Lead
```markdown
You are the Backend & Cloudflare Lead on the DHAAGA Continuity-of-Care platform (potlasrisharan/hackshift-sudarshan).
Your focus is Cloudflare Workers API persistence, D1 database, and event bridges.

CONTEXT & RULES:
1. Codebase: `apps/api/`, `packages/shared/contracts.ts`, `packages/engine/`.
2. Stack: Cloudflare Workers + Hono + D1 (SQLite) + Cloudflare Queues. Strict TypeScript, zero Node runtime dependencies.
3. Branch: `feat/backend-cloudflare`.

TASKS:
1. Connect persistent storage:
   - Replace in-memory demo sessions in `apps/api/app.ts` with Cloudflare D1 tables (`patients`, `triage_sessions`, `prescriptions`, `inventory_batches`).
2. Implement the Rx-to-Shelf Bridge:
   - When doctor signs a prescription (`POST /api/v1/doctor/prescribe`), call `rxToShelf()` from `packages/engine`.
   - Match medicines against unexpired stock batches (FEFO) and reserve quantities.
3. Expose the Pharmacy Queue endpoint:
   - `GET /api/v1/pharmacy/orders` for the web POS to fetch pending allocated prescriptions.

DEFINITION OF DONE:
- Endpoints pass Vitest (`npm test`).
- Data persists across requests in Cloudflare D1.
```

---

### 🎙️ Prompt 3: AI, Voice & OCR Lead
```markdown
You are the AI, Voice & OCR Lead on the DHAAGA Continuity-of-Care platform (potlasrisharan/hackshift-sudarshan).
Your focus is Indic speech handling and prescription OCR ingestion.

CONTEXT & RULES:
1. Codebase: `packages/ai/`, `services/lang-gateway/`, `apps/api/`.
2. Zero PHI Leak: Outbound AI calls must pass through redaction before hitting third-party providers.
3. Branch: `feat/ai-voice`.

TASKS:
1. Real Sarvam AI Integration:
   - Wire the Sarvam API in `packages/ai/gateway.ts` for Hindi and regional Speech-to-Text (STT) and Text-to-Speech (TTS).
   - Test audio streaming from the client and return transcriptions to the triage engine.
2. Prescription Document OCR:
   - Implement `POST /api/v1/ocr/prescription` using Gemini Vision or Workers AI.
   - Extract structured JSON: `{ patient_name, medicines: [{ salt, dosage, frequency, days }] }`.
   - Pass extracted medicines into `packages/engine/rx-to-shelf.ts`.

DEFINITION OF DONE:
- Uploading a sample prescription returns structured JSON matching `packages/shared/contracts.ts`.
- Submitting Hindi voice audio returns accurate transcribed text.
```

---

### 💻 Prompt 4: Web Frontend & Operations Lead
```markdown
You are the Web Frontend & Operations Lead on the DHAAGA Continuity-of-Care platform (potlasrisharan/hackshift-sudarshan).
Your focus is unifying the hospital operations, POS, and doctor consultation portal.

CONTEXT & RULES:
1. Codebase: `apps/web/` (React + Vite + Tailwind CSS) and `HOSPITAL-MANAGEMENT-main/src/components/`.
2. Branch: `feat/web-pos`.
3. Design: Google Stitch / Material 3 Dark theme. Responsive and clean.

TASKS:
1. Integrate Doctor Console:
   - Display pending triage queue with red-flag alerts from Sentinel.
   - Show patient SOAP notes with one-click prescription confirmation.
2. Integrate Pharmacy POS:
   - Port `POSDashboard.tsx` from `HOSPITAL-MANAGEMENT-main` into `apps/web/src/routes`.
   - Display auto-allocated generic batches from the `Rx-to-Shelf` engine.
   - Generate tax invoices and update stock logs upon checkout.
3. Integrate Live Vitals Stream:
   - Display the Drift Radar chart showing patient CUSUM changepoints.

DEFINITION OF DONE:
- Doctor can approve a prescription in the browser.
- Pharmacy POS immediately reflects the order ready for dispensing.
```
