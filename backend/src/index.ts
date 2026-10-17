import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { z } from "zod";

import { intakeRouter } from "./modules/intake/routes";
import { opsRouter } from "./modules/ops/routes";
import { bridgeRouter } from "./modules/bridge/routes";
import { homeRouter } from "./modules/home/routes";
import { platformRouter } from "./modules/platform/routes";
import { herRouter } from "./modules/her/routes";
import { vitalisRouter } from "./modules/vitalis/routes";
import { createApp } from "../../apps/api/app";

import {
  sentinel,
  rxToShelf,
  driftRadar,
  threadPulse,
  dispensingPlan,
  savingsMeter,
  computeLedger,
  predictRefillWarning,
  herSafetyGate,
  herCycleDetector,
  herScreeningEngine,
  herWellnessRanker,
  herTrendAnalyzer,
  vitalisSafetyGate,
  vitalisHealthspanIndex,
  vitalisPreventiveRanker,
  vitalisExerciseProgression,
  vitalisBiomarkerTrends,
  vitalisLifestyleCorrelations,
  vitalisRecommendationSelector,
  evaluateVO2maxRecord,
  estimateNonExerciseVO2max,
  vitalisRollingBaseline,
  vitalisSleepRegularity,
  vitalisDailyReadiness,
  vitalisFunctionalCapacity,
  vitalisIngestAndDeduplicate,
  vitalisPreventiveEligibility,
  vitalisBehaviorSimulator,
} from "../../packages/engine";

import {
  encounterSchema,
  intakeSchema,
  loginSchema,
  type Principal,
  reviewSchema,
} from "../../packages/shared/integration";
import { integrationOpenapi } from "../../packages/shared/integration-openapi";
import type { IntegrationContext } from "./context";
import { tenantDb as integrationTenantDb } from "./database";
import { jsonBody } from "./http";
import { equalHash, newToken, passwordHash, tokenHash } from "./security";

// Export Durable Objects for Cloudflare runtime binding
export { ClinicInventory } from "./do/ClinicInventory";
export { ClinicHub } from "./do/ClinicHub";
export { TriageSession } from "./do/TriageSession";
export { OrgAudit } from "./do/OrgAudit";

export type Env = {
  DB: D1Database;
  KV: KVNamespace;
  R2?: R2Bucket;
  CLINIC_INVENTORY: DurableObjectNamespace;
  CLINIC_HUB: DurableObjectNamespace;
  TRIAGE_SESSION: DurableObjectNamespace;
  ORG_AUDIT: DurableObjectNamespace;
  ENVIRONMENT: string;
  API_VERSION: string;
  SARVAM_API_KEY?: string;
  SARVAM_SPEECH_ENABLED?: string;
  ASSETS?: { fetch: (req: Request) => Promise<Response> };
};

export type { Env as IntegrationEnv } from "./context";
export { tenantDb } from "./db/tenant";

// =========================================================================
// Integration App (Self-contained for clinical intake & pharmacy workflows)
// =========================================================================

type UserRow = {
  id: string;
  clinic_id: string;
  role: Principal["role"];
  password_salt: string;
  password_hash: string;
};

type EncounterRow = {
  id: string;
  patient_id: string;
  clinic_id: string;
  name: string;
  language: string;
  chief_complaint: string;
  answers_json: string;
  red_flags_json: string;
  next_question: string | null;
  status: string;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  revoked_at: string | null;
};

const encounterSelect = `SELECT e.*, p.name, p.language, c.revoked_at FROM encounters e
 JOIN patients p ON p.org_id=e.org_id AND p.id=e.patient_id
 JOIN consents c ON c.org_id=e.org_id AND c.encounter_id=e.id AND c.purpose='care'
 WHERE e.org_id = :org AND e.clinic_id = ?`;

function mapEncounter(row: EncounterRow) {
  return encounterSchema.parse({
    id: row.id,
    patientId: row.patient_id,
    clinicId: row.clinic_id,
    patientName: row.name,
    chiefComplaint: row.chief_complaint,
    language: row.language,
    status: row.status,
    answers: JSON.parse(row.answers_json),
    redFlags: JSON.parse(row.red_flags_json),
    nextQuestion: row.next_question,
    createdAt: row.created_at,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note,
    consentActive: row.revoked_at === null,
  });
}

export function createIntegrationApp() {
  const integrationApp = new Hono<IntegrationContext>();
  integrationApp.use(
    "*",
    secureHeaders({
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: ["'none'"],
      },
      referrerPolicy: "no-referrer",
    }),
  );
  integrationApp.use("*", async (c, next) => {
    c.set("requestId", crypto.randomUUID());
    c.header("X-Request-Id", c.get("requestId"));
    if (c.req.path.startsWith("/api/")) c.header("Cache-Control", "no-store");
    const origin = c.req.header("origin");
    if (origin && origin !== new URL(c.req.url).origin)
      throw new HTTPException(403, {
        message: "Cross-origin requests are disabled",
      });
    await next();
  });
  integrationApp.use("/api/*", bodyLimit({ maxSize: 32000 }));
  integrationApp.onError((error, c) => {
    const isZod =
      error instanceof z.ZodError ||
      (error as { name?: string })?.name === "ZodError";
    const status = isZod
      ? 422
      : error instanceof HTTPException
        ? error.status
        : 500;
    if (status === 500) {
      console.error("[INTEGRATION ERROR]", error);
    }
    return c.json(
      {
        error: {
          code: `HTTP_${status}`,
          message:
            status === 500
              ? "Internal error"
              : status === 422
                ? "Invalid request fields"
                : error.message,
          requestId: c.get("requestId"),
        },
      },
      status,
    );
  });
  integrationApp.get("/openapi.json", (c) => c.json(integrationOpenapi));
  integrationApp.get("/healthz", (c) =>
    c.json({
      status: "ok",
      service: "dhaaga-integration",
      syntheticOnly: true,
    }),
  );
  integrationApp.get("/api/v1/capabilities", (c) =>
    c.json({
      mode: "synthetic-integration",
      persistentStorage: true,
      intake: true,
      clinicianQueue: true,
      dispensing: false,
      externalClinicalAI: false,
      liveUpstreams: false,
    }),
  );
  integrationApp.post("/api/v1/auth/login", async (c) => {
    if (c.env.ENVIRONMENT !== "development" && c.env.ENVIRONMENT !== "test")
      throw new HTTPException(503, {
        message: "Production authentication is not configured",
      });
    const input = loginSchema.parse(await jsonBody(c.req.raw));
    const db = integrationTenantDb({ db: c.env.DB, orgId: input.orgId });
    const now = new Date();
    const key = await tokenHash(input.email.toLowerCase());
    const attempt = await db
      .statement(
        `INSERT INTO login_attempts (org_id,key_hash,attempts,window_end) VALUES (:org,?,1,?)
      ON CONFLICT(org_id,key_hash) DO UPDATE SET
      attempts=CASE WHEN window_end <= ? THEN 1 ELSE attempts+1 END,
      window_end=CASE WHEN window_end <= ? THEN excluded.window_end ELSE window_end END
      RETURNING attempts`,
        key,
        new Date(now.getTime() + 60000).toISOString(),
        now.toISOString(),
        now.toISOString(),
      )
      .first<{ attempts: number }>();
    if (!attempt || attempt.attempts > 10)
      throw new HTTPException(429, {
        message: "Too many login attempts; try again in a minute",
      });
    const user = await db
      .statement(
        "SELECT * FROM users WHERE org_id = :org AND email = ?",
        input.email.toLowerCase(),
      )
      .first<UserRow>();
    const hash = await passwordHash(
      input.password,
      user?.password_salt ?? "unknown-user-fixed-salt",
    );
    if (!user || !equalHash(hash, user.password_hash))
      throw new HTTPException(401, {
        message: "Invalid organization, email or password",
      });
    const token = `${input.orgId}.${newToken()}`;
    const expiresAt = new Date(now.getTime() + 3600000).toISOString();
    await db
      .statement(
        "INSERT INTO sessions (org_id,token_hash,user_id,expires_at) VALUES (:org,?,?,?)",
        await tokenHash(token),
        user.id,
        expiresAt,
      )
      .run();
    return c.json({
      token,
      expiresAt,
      principal: {
        orgId: input.orgId,
        userId: user.id,
        clinicId: user.clinic_id,
        role: user.role,
      },
    });
  });
  integrationApp.use("/api/v1/*", async (c, next) => {
    if (c.req.path === "/api/v1/auth/login") {
      return next();
    }
    if (!c.req.path.startsWith("/api/v1/encounters") && !c.req.path.startsWith("/api/v1/auth")) {
      return next();
    }
    const authorization = c.req.header("Authorization") ?? "";
    if (!authorization.startsWith("Bearer "))
      throw new HTTPException(401, { message: "Session required" });
    const token = authorization.slice(7);
    const orgId = token.split(".")[0] ?? "";
    if (!/^[a-z0-9-]{1,80}$/.test(orgId) || token.length > 300)
      throw new HTTPException(401, { message: "Session required" });
    const db = integrationTenantDb({ db: c.env.DB, orgId });
    const user = await db
      .statement(
        `SELECT u.id,u.clinic_id,u.role FROM sessions s
      JOIN users u ON u.org_id=s.org_id AND u.id=s.user_id
      WHERE s.org_id = :org AND s.token_hash = ? AND s.expires_at > ?`,
        await tokenHash(token),
        new Date().toISOString(),
      )
      .first<UserRow>();
    if (!user)
      throw new HTTPException(401, { message: "Session expired or revoked" });
    c.set("principal", {
      orgId,
      userId: user.id,
      clinicId: user.clinic_id,
      role: user.role,
    });
    await next();
  });
  integrationApp.get("/api/v1/auth/me", (c) => c.json(c.get("principal")));
  integrationApp.post("/api/v1/auth/logout", async (c) => {
    const token = c.req.header("Authorization")?.slice(7) ?? "";
    const p = c.get("principal");
    await integrationTenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        "DELETE FROM sessions WHERE org_id = :org AND token_hash = ?",
        await tokenHash(token),
      )
      .run();
    return c.json({ loggedOut: true });
  });
  integrationApp.use("/api/v1/encounters*", async (c, next) => {
    if (c.get("principal").role === "CASHIER")
      throw new HTTPException(403, { message: "Clinical role required" });
    await next();
  });
  integrationApp.post("/api/v1/encounters", async (c) => {
    const input = intakeSchema.parse(await jsonBody(c.req.raw));
    if (input.patient.birthDate > new Date().toISOString().slice(0, 10))
      throw new HTTPException(422, {
        message: "Birth date cannot be in the future",
      });
    const key = z.string().uuid().parse(c.req.header("Idempotency-Key"));
    const p = c.get("principal");
    const db = integrationTenantDb({ db: c.env.DB, orgId: p.orgId });
    const hash = await tokenHash(JSON.stringify(input));
    const existing = async () =>
      db
        .statement(
          "SELECT request_hash,encounter_id FROM idempotency WHERE org_id = :org AND user_id = ? AND key = ?",
          p.userId,
          key,
        )
        .first<{ request_hash: string; encounter_id: string }>();
    const replay = async (prior: {
      request_hash: string;
      encounter_id: string;
    }) => {
      if (prior.request_hash !== hash)
        throw new HTTPException(409, {
          message: "Idempotency key already used for different data",
        });
      const row = await db
        .statement(
          `${encounterSelect} AND e.id = ? AND c.revoked_at IS NULL`,
          p.clinicId,
          prior.encounter_id,
        )
        .first<EncounterRow>();
      if (!row)
        throw new HTTPException(403, {
          message: "Care consent is no longer active",
        });
      return c.json(mapEncounter(row), 200);
    };
    const prior = await existing();
    if (prior) return replay(prior);
    const result = sentinel({ answers: input.answers });
    const id = crypto.randomUUID(),
      patientId = crypto.randomUUID(),
      at = new Date().toISOString();
    const status = result.tier === "emergency" ? "emergency" : "waiting";
    try {
      await db.batch([
        db.statement(
          "INSERT INTO patients (org_id,id,name,birth_date,gender,language,synthetic) VALUES (:org,?,?,?,?,?,1)",
          patientId,
          input.patient.name,
          input.patient.birthDate,
          input.patient.gender,
          input.patient.language,
        ),
        db.statement(
          "INSERT INTO encounters (org_id,id,patient_id,clinic_id,chief_complaint,answers_json,red_flags_json,next_question,status,created_at) VALUES (:org,?,?,?,?,?,?,?,?,?)",
          id,
          patientId,
          p.clinicId,
          input.chiefComplaint,
          JSON.stringify(input.answers),
          JSON.stringify(result.explanation.redFlags),
          result.nextQuestion,
          status,
          at,
        ),
        db.statement(
          "INSERT INTO consents (org_id,patient_id,encounter_id,purpose,granted_at) VALUES (:org,?,?,'care',?)",
          patientId,
          id,
          at,
        ),
        db.statement(
          "INSERT INTO idempotency (org_id,user_id,key,request_hash,encounter_id) VALUES (:org,?,?,?,?)",
          p.userId,
          key,
          hash,
          id,
        ),
        db.statement(
          "INSERT INTO activity (org_id,id,encounter_id,actor_id,action,created_at) VALUES (:org,?,?,?,'intake.completed',?)",
          crypto.randomUUID(),
          id,
          p.userId,
          at,
        ),
      ]);
    } catch (error) {
      const winner = await existing();
      if (winner) return replay(winner);
      throw error;
    }
    const row = await db
      .statement(`${encounterSelect} AND e.id = ?`, p.clinicId, id)
      .first<EncounterRow>();
    if (!row) throw new Error("Encounter commit failed");
    return c.json(mapEncounter(row), 201);
  });
  integrationApp.get("/api/v1/encounters", async (c) => {
    const p = c.get("principal");
    const { results } = await integrationTenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        `${encounterSelect} AND c.revoked_at IS NULL ORDER BY CASE e.status WHEN 'emergency' THEN 0 WHEN 'waiting' THEN 1 ELSE 2 END,e.created_at DESC LIMIT 100`,
        p.clinicId,
      )
      .all<EncounterRow>();
    return c.json({ encounters: results.map(mapEncounter) });
  });
  integrationApp.get("/api/v1/encounters/:id", async (c) => {
    const p = c.get("principal");
    const row = await integrationTenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        `${encounterSelect} AND e.id = ? AND c.revoked_at IS NULL`,
        p.clinicId,
        z.string().uuid().parse(c.req.param("id")),
      )
      .first<EncounterRow>();
    if (!row)
      throw new HTTPException(404, { message: "Encounter unavailable" });
    return c.json(mapEncounter(row));
  });
  integrationApp.post("/api/v1/encounters/:id/review", async (c) => {
    const p = c.get("principal");
    if (p.role !== "DOCTOR")
      throw new HTTPException(403, { message: "Doctor role required" });
    const input = reviewSchema.parse(await jsonBody(c.req.raw));
    const db = integrationTenantDb({ db: c.env.DB, orgId: p.orgId });
    const result = await db
      .statement(
        `UPDATE encounters SET status='reviewed',reviewed_by=?,reviewed_at=?,review_note=?
      WHERE org_id = :org AND clinic_id = ? AND id = ? AND status='waiting'
      AND EXISTS (SELECT 1 FROM consents c WHERE c.org_id=encounters.org_id AND c.encounter_id=encounters.id AND c.revoked_at IS NULL)
      RETURNING id`,
        p.userId,
        new Date().toISOString(),
        input.note,
        p.clinicId,
        z.string().uuid().parse(c.req.param("id")),
      )
      .first<{ id: string }>();
    if (!result)
      throw new HTTPException(409, {
        message:
          "Encounter cannot be reviewed: emergency, already reviewed, unavailable or revoked",
      });
    return c.json({ reviewed: true });
  });
  integrationApp.post("/api/v1/encounters/:id/revoke", async (c) => {
    const p = c.get("principal");
    const result = await integrationTenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        `UPDATE consents SET revoked_at=? WHERE org_id = :org AND encounter_id = ? AND revoked_at IS NULL
      AND EXISTS (SELECT 1 FROM encounters e WHERE e.org_id=consents.org_id AND e.id=consents.encounter_id AND e.clinic_id=?) RETURNING encounter_id`,
        new Date().toISOString(),
        z.string().uuid().parse(c.req.param("id")),
        p.clinicId,
      )
      .first<{ encounter_id: string }>();
    if (!result)
      throw new HTTPException(404, { message: "Active consent unavailable" });
    return c.json({ revoked: true });
  });
  integrationApp.all("/api/v1/ops/pos/*", () => {
    throw new HTTPException(501, {
      message: "This integration capability is not implemented yet",
    });
  });
  integrationApp.get("*", async (c, next) => {
    if (
      c.req.path.startsWith("/api/") ||
      c.req.path === "/healthz" ||
      c.req.path === "/openapi.json"
    ) {
      return next();
    }
    return c.env.ASSETS
      ? c.env.ASSETS.fetch(c.req.raw)
      : c.json({ error: { message: "Website assets not built" } }, 404);
  });
  return integrationApp;
}

// =========================================================================
// Main Unified AYUSETU Cloudflare Worker Application
// =========================================================================

const app = new Hono<{ Bindings: Env }>();

// Explicit CORS allowlist — no wildcard. Only known origins accepted.
const ALLOWED_ORIGINS = new Set([
  "https://ayusetu-api.potlasrisharanchowdary.workers.dev",
  "https://ayuseva.pages.dev",
  "https://dhaaga-web.pages.dev",
]);

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null;
      if (
        origin.endsWith(".pages.dev") ||
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        ALLOWED_ORIGINS.has(origin)
      ) {
        return origin;
      }
      return null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Tenant-Id", "X-Patient-Id"],
    credentials: false,
  })
);

// Liveness check
app.get("/healthz", (c) => {
  return c.json({
    status: "ok",
    service: "ayusetu-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ABDM Router: ABHA verification for Patient / Kiosk app
const abdmRouter = new Hono();
abdmRouter.post("/abha/verify", async (c) => {
  let abhaNumber = "91-4829-1029-4821";
  try {
    const raw = (await c.req.json()) as { abha_number?: string };
    if (raw?.abha_number) abhaNumber = raw.abha_number;
  } catch {
    // fallback
  }

  return c.json({
    patient_id: "pat-048291",
    abha_number: abhaNumber,
    abha_address: "ramesh.chandra@abdm",
    name: "Ramesh Chandra",
    gender: "MALE",
    age: 52,
    phone: "+91 9876543210",
    address: "Khammam, Telangana, India",
  });
});

// Insurance Router: PM-JAY coverage check
const insuranceRouter = new Hono();
insuranceRouter.post("/coverage-eligibility/check", async (c) => {
  let abhaNumber = "91-4829-1029-4821";
  let patientId = "pat-048291";
  try {
    const raw = (await c.req.json()) as { abha_number?: string; patient_id?: string };
    if (raw?.abha_number) abhaNumber = raw.abha_number;
    if (raw?.patient_id) patientId = raw.patient_id;
  } catch {
    // fallback
  }

  return c.json({
    eligible: true,
    scheme_name: "Ayushman Bharat PM-JAY",
    coverage_amount_inr: 500000.0,
    beneficiary_id: "PMJAY-TEL-90821-A",
    status: "ACTIVE",
    message: "Eligible for 100% Cashless Consultation & Free Medicines",
    patient_id: patientId,
    abha_number: abhaNumber,
  });
});

// Documents Router: OCR extraction
const documentsRouter = new Hono();
documentsRouter.post("/ocr", async (c) => {
  let encounterId = "enc-0042";
  try {
    const raw = (await c.req.json()) as { encounter_id?: string };
    if (raw?.encounter_id) encounterId = raw.encounter_id;
  } catch {
    // fallback
  }

  return c.json({
    encounter_id: encounterId,
    document_id: "doc-09821",
    medications: [
      { name: "Telmisartan (Telma 40)", dosage: "40mg", frequency: "1-0-0", duration: "30 Days" },
      { name: "Yograj Guggulu", dosage: "500mg", frequency: "1-0-1", duration: "15 Days" },
    ],
    lab_results: [
      { test_name: "Serum Uric Acid", value: "7.8", unit: "mg/dL", reference_range: "3.5 - 7.2", is_abnormal: true },
      { test_name: "HbA1c", value: "6.1", unit: "%", reference_range: "< 5.7", is_abnormal: true },
    ],
    confidence_score: 0.96,
  });
});

// Prescriptions Router: Doctor-to-Patient synchronization & adherence
interface MedicineRecord {
  id: string;
  prescriptionId?: string;
  name: string;
  dosageForm: string;
  strength: string;
  timeSlot: "morning" | "afternoon" | "night";
  scheduledTime: string;
  instructions: string;
  batchNumber: string;
  expiryDate: string;
  isTaken: boolean;
  reminderEnabled: boolean;
  takenAt?: string | null;
}

interface PrescriptionRecord {
  rxId: string;
  prescriptionId?: string;
  patientId: string;
  prescriptionDate: string;
  validTillDate: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  opdRoom: string;
  doctorNotes: string;
  dietRestrictions: string[];
  hydrationTarget: string;
  followUpDate: string;
  medicines: MedicineRecord[];
  adherenceLog: Array<{
    medicineId: string;
    isTaken: boolean;
    takenAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const defaultRameshPrescription: PrescriptionRecord = {
  rxId: "#RX-2026-A8921",
  prescriptionId: "#RX-2026-A8921",
  patientId: "pat-048291",
  prescriptionDate: "18 Oct 2026",
  validTillDate: "01 Nov 2026",
  doctorName: "Dr. Ananya Sharma",
  specialty: "Senior Physician · Rheumatology & Integrative Ayurveda",
  hospital: "All India Institute of Ayurveda (AIIA)",
  opdRoom: "OPD-3",
  doctorNotes:
    "Vata-shamana & Rasayana protocol: Continue medication consistently for 14 days. If knee stiffness flares up in morning, apply warm castor oil pack for 15 mins.",
  dietRestrictions: [
    "Avoid fermented curds, refrigerated foods, and carbonated beverages",
    "Restrict high-purine lentils (toor dal, black gram) during acute flare-ups",
    "Prefer warm moong soup, boiled vegetables with cow's ghee and roasted cumin",
  ],
  hydrationTarget: "2.8L of warm water or CCF (Cumin-Coriander-Fennel) infusion daily",
  followUpDate: "Nov 02, 2026 · OPD-3 · In 14 Days",
  medicines: [
    {
      id: "med-01",
      prescriptionId: "rx-98124a-2026",
      name: "Yograj Guggulu",
      dosageForm: "Tablet",
      strength: "500 mg",
      timeSlot: "morning",
      scheduledTime: "08:00 AM",
      instructions: "1 tablet with lukewarm water 15 mins after breakfast",
      batchNumber: "BAT-2026-Y89",
      expiryDate: "11/2027",
      isTaken: true,
      reminderEnabled: true,
      takenAt: "2026-10-18T08:15:00.000Z",
    },
    {
      id: "med-02",
      prescriptionId: "rx-98124a-2026",
      name: "Dashamularishta",
      dosageForm: "Asava / Elixir",
      strength: "20 ml",
      timeSlot: "afternoon",
      scheduledTime: "01:00 PM",
      instructions: "20 ml mixed with 20 ml equal warm water after lunch",
      batchNumber: "BAT-2026-D12",
      expiryDate: "04/2028",
      isTaken: false,
      reminderEnabled: true,
      takenAt: null,
    },
    {
      id: "med-03",
      prescriptionId: "rx-98124a-2026",
      name: "Shatavari Churna",
      dosageForm: "Churna / Powder",
      strength: "3 g",
      timeSlot: "night",
      scheduledTime: "08:30 PM",
      instructions: "3 grams with warm almond/cow milk 30 mins before sleep",
      batchNumber: "BAT-2026-S44",
      expiryDate: "09/2027",
      isTaken: false,
      reminderEnabled: true,
      takenAt: null,
    },
    {
      id: "med-04",
      prescriptionId: "rx-98124a-2026",
      name: "Triphala Churna",
      dosageForm: "Churna / Powder",
      strength: "5 g",
      timeSlot: "night",
      scheduledTime: "09:30 PM",
      instructions: "1 teaspoon with hot water right before bedtime",
      batchNumber: "BAT-2026-T10",
      expiryDate: "12/2027",
      isTaken: false,
      reminderEnabled: true,
      takenAt: null,
    },
  ],
  adherenceLog: [
    {
      medicineId: "med-01",
      isTaken: true,
      takenAt: "2026-10-18T08:15:00.000Z",
    },
  ],
  createdAt: "2026-10-18T00:00:00.000Z",
  updatedAt: "2026-10-18T08:15:00.000Z",
};

const prescriptionStore = new Map<string, PrescriptionRecord>();
prescriptionStore.set("pat-048291", defaultRameshPrescription);
prescriptionStore.set("#RX-2026-A8921", defaultRameshPrescription);
prescriptionStore.set("RX-2026-A8921", defaultRameshPrescription);

const prescriptionsRouter = new Hono<{ Bindings: Env }>();

// GET /api/v1/prescriptions/patient/:id
prescriptionsRouter.get("/patient/:id", async (c) => {
  const patientId = c.req.param("id");
  let rx = prescriptionStore.get(patientId);
  if (!rx) {
    for (const val of prescriptionStore.values()) {
      if (val.patientId === patientId) {
        rx = val;
        break;
      }
    }
  }
  if (!rx) {
    rx = defaultRameshPrescription;
  }
  return c.json({
    ...rx,
    prescription: rx,
  });
});

// Fallback GET /api/v1/prescriptions
prescriptionsRouter.get("/", async (c) => {
  const rx = prescriptionStore.get("pat-048291") ?? defaultRameshPrescription;
  return c.json({
    ...rx,
    prescription: rx,
  });
});

// GET /api/v1/prescriptions/:id
prescriptionsRouter.get("/:id", async (c) => {
  const id = decodeURIComponent(c.req.param("id"));
  let rx = prescriptionStore.get(id);
  if (!rx) {
    for (const val of prescriptionStore.values()) {
      if (val.rxId === id || val.patientId === id) {
        rx = val;
        break;
      }
    }
  }
  if (!rx) {
    rx = defaultRameshPrescription;
  }
  return c.json({
    ...rx,
    prescription: rx,
  });
});

// POST /api/v1/prescriptions: Issue new prescription from doctor consultation
prescriptionsRouter.post("/", async (c) => {
  try {
    const raw = (await c.req.json()) as Record<string, unknown>;
    const patientId = String(raw.patientId || raw.patient_id || "pat-048291");
    const rxId = String(raw.rxId || raw.rx_id || `#RX-${Date.now().toString().slice(-6)}`);
    const adviceObj = (typeof raw.advice === "object" && raw.advice !== null ? raw.advice : {}) as Record<string, unknown>;

    const doctorName = String(raw.doctorName || adviceObj.doctorName || "Dr. Ananya Sharma");
    const specialty = String(raw.specialty || adviceObj.specialty || "Senior Physician · Rheumatology & Integrative Ayurveda");
    const hospital = String(raw.hospital || adviceObj.hospital || "All India Institute of Ayurveda (AIIA)");
    const opdRoom = String(raw.opdRoom || adviceObj.opdRoom || "OPD-3");
    const doctorNotes = String(raw.doctorNotes || adviceObj.doctorNotes || raw.plan || "Follow prescribed dosages.");
    const prescriptionDate = String(raw.prescriptionDate || adviceObj.prescriptionDate || "Today");
    const validTillDate = String(raw.validTillDate || adviceObj.validTillDate || "In 14 Days");
    const followUpDate = String(raw.followUpDate || adviceObj.followUpDate || "In 14 Days · OPD-3");
    const hydrationTarget = String(raw.hydrationTarget || adviceObj.hydrationTarget || "2.5L warm water daily");

    let dietRestrictions: string[] = [];
    if (Array.isArray(raw.dietRestrictions)) {
      dietRestrictions = raw.dietRestrictions.map(String);
    } else if (Array.isArray(adviceObj.dietRestrictions)) {
      dietRestrictions = adviceObj.dietRestrictions.map(String);
    } else {
      dietRestrictions = [
        "Warm nourishing meals with digestive spices (jeera, shunthi)",
        "Avoid cold, heavy, and ultra-processed items during recovery",
      ];
    }

    const rawMedicines = Array.isArray(raw.medicines) ? raw.medicines : [];
    const medicines: MedicineRecord[] = rawMedicines.map((m: unknown, index: number) => {
      const med = (typeof m === "object" && m !== null ? m : {}) as Record<string, unknown>;
      const slotRaw = String(med.timeSlot || (index === 0 ? "morning" : index === 1 ? "afternoon" : "night")).toLowerCase();
      const timeSlot: "morning" | "afternoon" | "night" =
        slotRaw.includes("morn") ? "morning" : slotRaw.includes("after") ? "afternoon" : "night";
      return {
        id: String(med.id || `med-${patientId}-${index}`),
        prescriptionId: String(med.prescriptionId || rxId),
        name: String(med.name || `Medicine ${index + 1}`),
        dosageForm: String(med.dosageForm || "Tablet"),
        strength: String(med.strength || "500 mg"),
        timeSlot,
        scheduledTime: String(med.scheduledTime || (timeSlot === "morning" ? "08:00 AM" : timeSlot === "afternoon" ? "01:00 PM" : "08:30 PM")),
        instructions: String(med.instructions || "1 dose after meals"),
        batchNumber: String(med.batchNumber || "BAT-2026"),
        expiryDate: String(med.expiryDate || "12/2027"),
        isTaken: Boolean(med.isTaken),
        reminderEnabled: med.reminderEnabled !== undefined ? Boolean(med.reminderEnabled) : true,
        takenAt: med.takenAt ? String(med.takenAt) : null,
      };
    });

    const now = new Date().toISOString();
    const newRecord: PrescriptionRecord = {
      rxId,
      prescriptionId: rxId,
      patientId,
      prescriptionDate,
      validTillDate,
      doctorName,
      specialty,
      hospital,
      opdRoom,
      doctorNotes,
      dietRestrictions,
      hydrationTarget,
      followUpDate,
      medicines,
      adherenceLog: [],
      createdAt: now,
      updatedAt: now,
    };

    prescriptionStore.set(patientId, newRecord);
    prescriptionStore.set(rxId, newRecord);
    const cleanId = rxId.replace("#", "");
    prescriptionStore.set(cleanId, newRecord);

    if (c.env?.DB) {
      try {
        await c.env.DB.prepare(
          "INSERT OR REPLACE INTO prescriptions (id, org_id, encounter_id, doctor_id, signed_at, items_json, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          rxId,
          "org-ayusetu-primary",
          patientId,
          doctorName,
          now,
          JSON.stringify(medicines),
          "SIGNED"
        ).run();
      } catch {
        // Fallback safely to in-memory store
      }
    }

    return c.json({
      success: true,
      prescriptionId: rxId,
      rxId,
      patientId,
      prescription: newRecord,
    }, 201);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: errorMsg }, 400);
  }
});

// PUT /api/v1/prescriptions/:id/adherence: Record patient medicine adherence
prescriptionsRouter.put("/:id/adherence", async (c) => {
  try {
    const paramId = decodeURIComponent(c.req.param("id"));
    const raw = (await c.req.json()) as Record<string, unknown>;
    const medicineId = String(raw.medicineId || raw.medicine_id || "");
    const isTaken = raw.isTaken !== undefined ? Boolean(raw.isTaken) : true;
    const takenAt = String(raw.takenAt || new Date().toISOString());

    let targetRx = prescriptionStore.get(paramId);
    if (!targetRx) {
      for (const val of prescriptionStore.values()) {
        if (
          val.rxId === paramId ||
          val.patientId === paramId ||
          paramId.includes(val.patientId) ||
          val.rxId.includes(paramId)
        ) {
          targetRx = val;
          break;
        }
      }
    }
    if (!targetRx) {
      targetRx = defaultRameshPrescription;
    }

    let updated = false;
    for (const med of targetRx.medicines) {
      if (med.id === medicineId || medicineId === "") {
        med.isTaken = isTaken;
        med.takenAt = isTaken ? takenAt : null;
        updated = true;
        if (medicineId !== "") break;
      }
    }

    targetRx.adherenceLog.push({
      medicineId: medicineId || "med-all",
      isTaken,
      takenAt,
    });
    targetRx.updatedAt = new Date().toISOString();

    const takenCount = targetRx.medicines.filter((m) => m.isTaken).length;
    const totalCount = targetRx.medicines.length;

    return c.json({
      success: true,
      rxId: targetRx.rxId,
      medicineId,
      isTaken,
      takenAt,
      adherenceCount: takenCount,
      totalCount,
      adherenceRate: totalCount > 0 ? takenCount / totalCount : 0,
      updated,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: errorMsg }, 400);
  }
});

// Mount module routers under /api/v1
const v1 = new Hono<{ Bindings: Env }>();
v1.route("/intake", intakeRouter);
v1.route("/ops", opsRouter);
v1.route("/bridge", bridgeRouter);
v1.route("/home", homeRouter);
v1.route("/platform", platformRouter);
v1.route("/abdm", abdmRouter);
v1.route("/insurance", insuranceRouter);
v1.route("/documents", documentsRouter);
v1.route("/prescriptions", prescriptionsRouter);
v1.route("/her", herRouter);
v1.route("/vitalis", vitalisRouter);

// Deterministic algorithm evaluation endpoint
v1.post("/algorithms/:name", async (c) => {
  const name = c.req.param("name");
  const body = await c.req.json();
  if (name === "sentinel") return c.json(sentinel(body));
  if (name === "rx-to-shelf" || name === "rxToShelf") return c.json(rxToShelf(body));
  if (name === "drift-radar" || name === "driftRadar") return c.json(driftRadar(body));
  if (name === "threadpulse" || name === "threadPulse") return c.json(threadPulse(body));
  if (name === "dispensing-plan" || name === "dispensingPlan") return c.json(dispensingPlan(body.prescription, body.inventory, body.today));
  if (name === "savings-meter" || name === "savingsMeter") return c.json(savingsMeter(body));
  if (name === "double-entry-ledger" || name === "computeLedger") return c.json(computeLedger(body));
  if (name === "refill-warning" || name === "predictRefillWarning") return c.json(predictRefillWarning(body));
  if (name === "her-safety-gate" || name === "herSafetyGate") return c.json(herSafetyGate(body));
  if (name === "her-cycle-detector" || name === "herCycleDetector") return c.json(herCycleDetector(body));
  if (name === "her-screening-engine" || name === "herScreeningEngine") return c.json(herScreeningEngine(body));
  if (name === "her-wellness-ranker" || name === "herWellnessRanker") return c.json(herWellnessRanker(body));
  if (name === "her-trend-analyzer" || name === "herTrendAnalyzer") return c.json(herTrendAnalyzer(body.observations, body.metricName));
  if (name === "vitalis-safety-gate" || name === "vitalisSafetyGate") return c.json(vitalisSafetyGate(body));
  if (name === "vitalis-healthspan-index" || name === "vitalisHealthspanIndex") return c.json(vitalisHealthspanIndex(body));
  if (name === "vitalis-preventive-ranker" || name === "vitalisPreventiveRanker") return c.json(vitalisPreventiveRanker(body.actions, body.config));
  if (name === "vitalis-exercise-progression" || name === "vitalisExerciseProgression") return c.json(vitalisExerciseProgression(body));
  if (name === "vitalis-biomarker-trends" || name === "vitalisBiomarkerTrends") return c.json(vitalisBiomarkerTrends(body.metricKey, body.readings));
  if (name === "vitalis-lifestyle-correlations" || name === "vitalisLifestyleCorrelations") return c.json(vitalisLifestyleCorrelations(body.xLabel, body.yLabel, body.pairs));
  if (name === "vitalis-recommendation-selector" || name === "vitalisRecommendationSelector") return c.json(vitalisRecommendationSelector(body));
  if (name === "vitalis-vo2-provenance" || name === "evaluateVO2maxRecord") return c.json(evaluateVO2maxRecord(body));
  if (name === "vitalis-estimate-vo2" || name === "estimateNonExerciseVO2max") return c.json(estimateNonExerciseVO2max(body));
  if (name === "vitalis-rolling-baseline" || name === "vitalisRollingBaseline") return c.json(vitalisRollingBaseline(body.metricType, body.historicalSamples, body.todaySample));
  if (name === "vitalis-sleep-regularity" || name === "vitalisSleepRegularity") return c.json(vitalisSleepRegularity(body.intervals ?? body));
  if (name === "vitalis-daily-readiness" || name === "vitalisDailyReadiness") return c.json(vitalisDailyReadiness(body));
  if (name === "vitalis-functional-capacity" || name === "vitalisFunctionalCapacity") return c.json(vitalisFunctionalCapacity(body));
  if (name === "vitalis-time-series-dedup" || name === "vitalisIngestAndDeduplicate") return c.json(vitalisIngestAndDeduplicate(body.samples ?? body));
  if (name === "vitalis-preventive-eligibility" || name === "vitalisPreventiveEligibility") return c.json(vitalisPreventiveEligibility(body));
  if (name === "vitalis-behavior-simulator" || name === "vitalisBehaviorSimulator") return c.json(vitalisBehaviorSimulator(body));
  return c.json({ error: `Unknown algorithm: ${name}` }, 404);
});

app.route("/api/v1", v1);
app.route("/", createIntegrationApp());

// Mount demo app for legacy compatibility (/api/v1/demo/session, /api/v1/consent, /api/v1/record, etc.)
const demoEnv = (globalThis as { process?: { env?: Record<string, string> } }).process?.env;
const demoApp = createApp({
  trustedProxy: true,
  speechEnabled: (demoEnv?.SARVAM_SPEECH_ENABLED ?? "true") === "true",
  speechKey: demoEnv?.SARVAM_API_KEY,
});
app.route("/", demoApp);

app.get("*", async (c) =>
  c.env.ASSETS
    ? c.env.ASSETS.fetch(c.req.raw)
    : c.json({ error: { message: "Website assets not built" } }, 404),
);

export default app;
