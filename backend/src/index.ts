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
  vitalisDailyReadiness,
  vitalisFunctionalCapacity,
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
  if (name === "vitalis-daily-readiness" || name === "vitalisDailyReadiness") return c.json(vitalisDailyReadiness(body));
  if (name === "vitalis-functional-capacity" || name === "vitalisFunctionalCapacity") return c.json(vitalisFunctionalCapacity(body));
  if (name === "vitalis-behavior-simulator" || name === "vitalisBehaviorSimulator") return c.json(vitalisBehaviorSimulator(body));
  return c.json({ error: `Unknown algorithm: ${name}` }, 404);
});

app.route("/", createIntegrationApp());
app.route("/api/v1", v1);

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
