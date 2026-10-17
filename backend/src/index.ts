import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { z } from "zod";
import { sentinel } from "../../packages/engine";
import {
  encounterSchema,
  intakeSchema,
  loginSchema,
  type Principal,
  reviewSchema,
} from "../../packages/shared/integration";
import { integrationOpenapi } from "../../packages/shared/integration-openapi";
import type { IntegrationContext } from "./context";
import { tenantDb } from "./database";
import { jsonBody } from "./http";

export type { Env } from "./context";

import { equalHash, newToken, passwordHash, tokenHash } from "./security";

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
  const app = new Hono<IntegrationContext>();
  app.use(
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
  app.use("*", async (c, next) => {
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
  app.use("/api/*", bodyLimit({ maxSize: 32000 }));
  app.onError((error, c) => {
    const status =
      error instanceof z.ZodError
        ? 422
        : error instanceof HTTPException
          ? error.status
          : 500;
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
  app.get("/openapi.json", (c) => c.json(integrationOpenapi));
  app.get("/healthz", (c) =>
    c.json({
      status: "ok",
      service: "dhaaga-integration",
      syntheticOnly: true,
    }),
  );
  app.get("/api/v1/capabilities", (c) =>
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
  app.post("/api/v1/auth/login", async (c) => {
    // This milestone deliberately accepts only the locally seeded synthetic tenant.
    if (c.env.ENVIRONMENT !== "development" && c.env.ENVIRONMENT !== "test")
      throw new HTTPException(503, {
        message: "Production authentication is not configured",
      });
    const input = loginSchema.parse(await jsonBody(c.req.raw));
    const db = tenantDb({ db: c.env.DB, orgId: input.orgId });
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
  app.use("/api/v1/*", async (c, next) => {
    const authorization = c.req.header("Authorization") ?? "";
    if (!authorization.startsWith("Bearer "))
      throw new HTTPException(401, { message: "Session required" });
    const token = authorization.slice(7);
    const orgId = token.split(".")[0] ?? "";
    if (!/^[a-z0-9-]{1,80}$/.test(orgId) || token.length > 300)
      throw new HTTPException(401, { message: "Session required" });
    const db = tenantDb({ db: c.env.DB, orgId });
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
  app.get("/api/v1/auth/me", (c) => c.json(c.get("principal")));
  app.post("/api/v1/auth/logout", async (c) => {
    const token = c.req.header("Authorization")?.slice(7) ?? "";
    const p = c.get("principal");
    await tenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        "DELETE FROM sessions WHERE org_id = :org AND token_hash = ?",
        await tokenHash(token),
      )
      .run();
    return c.json({ loggedOut: true });
  });
  app.use("/api/v1/encounters*", async (c, next) => {
    if (c.get("principal").role === "CASHIER")
      throw new HTTPException(403, { message: "Clinical role required" });
    await next();
  });
  app.post("/api/v1/encounters", async (c) => {
    const input = intakeSchema.parse(await jsonBody(c.req.raw));
    if (input.patient.birthDate > new Date().toISOString().slice(0, 10))
      throw new HTTPException(422, {
        message: "Birth date cannot be in the future",
      });
    const key = z.uuid().parse(c.req.header("Idempotency-Key"));
    const p = c.get("principal");
    const db = tenantDb({ db: c.env.DB, orgId: p.orgId });
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
  app.get("/api/v1/encounters", async (c) => {
    const p = c.get("principal");
    const { results } = await tenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        `${encounterSelect} AND c.revoked_at IS NULL ORDER BY CASE e.status WHEN 'emergency' THEN 0 WHEN 'waiting' THEN 1 ELSE 2 END,e.created_at DESC LIMIT 100`,
        p.clinicId,
      )
      .all<EncounterRow>();
    return c.json({ encounters: results.map(mapEncounter) });
  });
  app.get("/api/v1/encounters/:id", async (c) => {
    const p = c.get("principal");
    const row = await tenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        `${encounterSelect} AND e.id = ? AND c.revoked_at IS NULL`,
        p.clinicId,
        z.uuid().parse(c.req.param("id")),
      )
      .first<EncounterRow>();
    if (!row)
      throw new HTTPException(404, { message: "Encounter unavailable" });
    return c.json(mapEncounter(row));
  });
  app.post("/api/v1/encounters/:id/review", async (c) => {
    const p = c.get("principal");
    if (p.role !== "DOCTOR")
      throw new HTTPException(403, { message: "Doctor role required" });
    const input = reviewSchema.parse(await jsonBody(c.req.raw));
    const db = tenantDb({ db: c.env.DB, orgId: p.orgId });
    // Emergency stays in emergency workflow; this route cannot downgrade it.
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
        z.uuid().parse(c.req.param("id")),
      )
      .first<{ id: string }>();
    if (!result)
      throw new HTTPException(409, {
        message:
          "Encounter cannot be reviewed: emergency, already reviewed, unavailable or revoked",
      });
    return c.json({ reviewed: true });
  });
  app.post("/api/v1/encounters/:id/revoke", async (c) => {
    const p = c.get("principal");
    const result = await tenantDb({ db: c.env.DB, orgId: p.orgId })
      .statement(
        `UPDATE consents SET revoked_at=? WHERE org_id = :org AND encounter_id = ? AND revoked_at IS NULL
      AND EXISTS (SELECT 1 FROM encounters e WHERE e.org_id=consents.org_id AND e.id=consents.encounter_id AND e.clinic_id=?) RETURNING encounter_id`,
        new Date().toISOString(),
        z.uuid().parse(c.req.param("id")),
        p.clinicId,
      )
      .first<{ encounter_id: string }>();
    if (!result)
      throw new HTTPException(404, { message: "Active consent unavailable" });
    return c.json({ revoked: true });
  });
  app.all("/api/*", () => {
    throw new HTTPException(501, {
      message: "This integration capability is not implemented yet",
    });
  });
  app.get("*", async (c) =>
    c.env.ASSETS
      ? c.env.ASSETS.fetch(c.req.raw)
      : c.json({ error: { message: "Website assets not built" } }, 404),
  );
  return app;
}
export default createIntegrationApp();
