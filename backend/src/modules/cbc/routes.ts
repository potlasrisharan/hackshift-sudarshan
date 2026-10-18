import { type Context, Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { predictCbc } from "../../../../packages/engine/cbc/inference";
import { normalizeCbc } from "../../../../packages/engine/cbc/parser";
import {
  type CbcInput,
  cbcConfirmSchema,
  cbcCreateSchema,
  cbcInputSchema,
  cbcMeasurementSchema,
  cbcPredictionSchema,
  cbcPredictSchema,
  cbcReportSchema,
} from "../../../../packages/shared/cbc_contracts";
import type { IntegrationContext } from "../../context";
import { tenantDb } from "../../database";
import { jsonBody } from "../../http";
import { tokenHash } from "../../security";
import { pruneCbcSources } from "./maintenance";

type Ctx = Context<IntegrationContext>;
type ReportRow = {
  id: string;
  encounter_id: string;
  patient_id: string;
  revision: number;
  created_at: string;
  research_consent: number;
  document_key: string | null;
  document_type: string | null;
  source_consent_at: string | null;
  create_hash: string;
  deleted_at: string | null;
};
type RevisionRow = {
  revision: number;
  values_json: string;
  measurements_json: string;
  collection_date: string | null;
  confirmed_at: string;
  confirmed_by: string;
  input_hash: string;
  prediction_json: string | null;
  predicted_at: string | null;
  operation_key: string;
  request_hash: string;
};
const idSchema = z.string().uuid();
const currentCare = `EXISTS (SELECT 1 FROM consents c WHERE c.org_id=cbc_reports.org_id
 AND c.encounter_id=cbc_reports.encounter_id AND c.purpose='care' AND c.revoked_at IS NULL)`;
function dbFor(c: Ctx) {
  return tenantDb({ db: c.env.DB, orgId: c.get("principal").orgId });
}
function enabled(c: Ctx) {
  return (
    ["development", "test"].includes(c.env.ENVIRONMENT) &&
    c.env.CBC_ENABLED !== "false"
  );
}
async function encounter(c: Ctx, id: string) {
  const p = c.get("principal");
  const row = await dbFor(c)
    .statement(
      `SELECT e.id,e.patient_id FROM encounters e
    JOIN patients p ON p.org_id=e.org_id AND p.id=e.patient_id
    JOIN consents c ON c.org_id=e.org_id AND c.encounter_id=e.id AND c.purpose='care'
    WHERE e.org_id=:org AND e.id=? AND e.clinic_id=? AND p.synthetic=1 AND c.revoked_at IS NULL`,
      id,
      p.clinicId,
    )
    .first<{ id: string; patient_id: string }>();
  if (!row)
    throw new HTTPException(404, {
      message: "Authorized consented encounter not found",
    });
  return row;
}
async function report(c: Ctx, id: string) {
  idSchema.parse(id);
  const row = await dbFor(c)
    .statement(
      `SELECT * FROM cbc_reports WHERE org_id=:org AND id=? AND clinic_id=? AND deleted_at IS NULL`,
      id,
      c.get("principal").clinicId,
    )
    .first<ReportRow>();
  if (!row) throw new HTTPException(404, { message: "CBC report not found" });
  await encounter(c, row.encounter_id);
  return row;
}
async function response(c: Ctx, row: ReportRow) {
  const { results } = await dbFor(c)
    .statement(
      "SELECT * FROM cbc_revisions WHERE org_id=:org AND report_id=? ORDER BY revision DESC LIMIT 100",
      row.id,
    )
    .all<RevisionRow>();
  await encounter(c, row.encounter_id);
  return cbcReportSchema.parse({
    id: row.id,
    encounterId: row.encounter_id,
    patientId: row.patient_id,
    revision: row.revision,
    createdAt: row.created_at,
    researchConsent: !!row.research_consent,
    sourceRetained: !!row.document_key,
    revisions: results.map((r) => ({
      revision: r.revision,
      values: cbcInputSchema.parse(JSON.parse(r.values_json)),
      measurements: z
        .array(cbcMeasurementSchema)
        .parse(JSON.parse(r.measurements_json)),
      collectionDate: r.collection_date,
      confirmedAt: r.confirmed_at,
      confirmedBy: r.confirmed_by,
      inputHash: r.input_hash,
      prediction: r.prediction_json
        ? cbcPredictionSchema.parse(JSON.parse(r.prediction_json))
        : null,
      predictedAt: r.predicted_at,
    })),
  });
}
function operationKey(c: Ctx) {
  return idSchema.parse(c.req.header("Idempotency-Key"));
}
function audit(c: Ctx, encounterId: string, action: string) {
  return dbFor(c).statement(
    "INSERT INTO activity(org_id,id,encounter_id,actor_id,action,created_at) VALUES(:org,?,?,?,?,?)",
    crypto.randomUUID(),
    encounterId,
    c.get("principal").userId,
    action,
    new Date().toISOString(),
  );
}
export const cbcRouter = new Hono<IntegrationContext>();
cbcRouter.get("/capabilities", (c) =>
  c.json({
    enabled: enabled(c),
    syntheticOnly: true,
    sourceRetention: enabled(c) && !!c.env.CBC_DOCUMENTS,
    inference: enabled(c) && c.env.CBC_INFERENCE_ENABLED !== "false",
    maxFileBytes: 10485760,
    maxPages: 5,
  }),
);
cbcRouter.use("*", async (c, next) => {
  if (!enabled(c))
    throw new HTTPException(503, {
      message:
        "CBC is available only in the authenticated synthetic clinical workspace",
    });
  if (c.get("principal")?.role !== "DOCTOR")
    throw new HTTPException(403, {
      message: "Doctor clinical authorization required",
    });
  c.header("Cache-Control", "private, no-store");
  const windowStart = new Date().toISOString().slice(0, 16);
  const limit = await dbFor(c)
    .statement(
      `INSERT INTO cbc_limits(org_id,actor_id,window_start) VALUES(:org,?,?)
    ON CONFLICT(org_id,actor_id,window_start) DO UPDATE SET operations=operations+1 RETURNING operations`,
      c.get("principal").userId,
      windowStart,
    )
    .first<{ operations: number }>();
  if (!limit || limit.operations > 120)
    throw new HTTPException(429, {
      message: "CBC request limit reached; retry in a minute",
    });
  await dbFor(c)
    .statement(
      "DELETE FROM cbc_limits WHERE org_id=:org AND window_start < ?",
      new Date(Date.now() - 86400000).toISOString().slice(0, 16),
    )
    .run();
  // Keep measurement workflows available during an optional storage outage,
  // but never serve a source whose retention check could not complete.
  c.set("cbcSourceAvailable", !!c.env.CBC_DOCUMENTS);
  if (c.env.CBC_DOCUMENTS) {
    try {
      await pruneCbcSources(c.env, c.get("principal").orgId);
    } catch {
      c.set("cbcSourceAvailable", false);
    }
  }
  await next();
});
cbcRouter.post("/reports", async (c) => {
  const input = cbcCreateSchema.parse(await jsonBody(c.req.raw)),
    key = operationKey(c);
  const e = await encounter(c, input.encounterId),
    p = c.get("principal"),
    db = dbFor(c);
  const hash = await tokenHash(JSON.stringify(input));
  const prior = await db
    .statement(
      "SELECT * FROM cbc_reports WHERE org_id=:org AND created_by=? AND create_key=?",
      p.userId,
      key,
    )
    .first<ReportRow>();
  if (prior) {
    if (prior.create_hash !== hash || prior.deleted_at)
      throw new HTTPException(409, { message: "Idempotency key conflict" });
    return c.json(await response(c, await report(c, prior.id)));
  }
  const quota = await db
    .statement(
      "SELECT COUNT(*) AS count FROM cbc_reports WHERE org_id=:org AND deleted_at IS NULL",
    )
    .first<{ count: number }>();
  if ((quota?.count ?? 0) >= 500)
    throw new HTTPException(429, { message: "Synthetic report quota reached" });
  const id = crypto.randomUUID();
  try {
    await db.batch([
      db.statement(
        `INSERT INTO cbc_reports(org_id,id,encounter_id,patient_id,clinic_id,created_by,created_at,research_consent,create_key,create_hash)
      SELECT :org,?,?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM consents WHERE encounter_id=? AND org_id=? AND purpose='care' AND revoked_at IS NULL)`,
        id,
        e.id,
        e.patient_id,
        p.clinicId,
        p.userId,
        new Date().toISOString(),
        input.researchConsent ? 1 : 0,
        key,
        hash,
        e.id,
        p.orgId,
      ),
      audit(c, e.id, "cbc.report.created"),
    ]);
  } catch (error) {
    const winner = await db
      .statement(
        "SELECT * FROM cbc_reports WHERE org_id=:org AND created_by=? AND create_key=?",
        p.userId,
        key,
      )
      .first<ReportRow>();
    if (!winner) throw error;
    if (winner.create_hash !== hash || winner.deleted_at)
      throw new HTTPException(409, { message: "Idempotency key conflict" });
    return c.json(await response(c, await report(c, winner.id)));
  }
  return c.json(await response(c, await report(c, id)), 201);
});
cbcRouter.get("/reports", async (c) => {
  const encounterId = z
    .string()
    .min(1)
    .max(100)
    .parse(c.req.query("encounterId"));
  await encounter(c, encounterId);
  const cursor = c.req.query("cursor");
  const parts = cursor ? z.string().max(150).parse(cursor).split("|") : [];
  const cursorAt = cursor ? z.iso.datetime().parse(parts[0]) : null;
  const cursorId = cursor ? idSchema.parse(parts[1]) : null;
  const { results } = await dbFor(c)
    .statement(
      `SELECT * FROM cbc_reports WHERE org_id=:org AND encounter_id=? AND clinic_id=? AND deleted_at IS NULL
    AND (? IS NULL OR created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC,id DESC LIMIT 21`,
      encounterId,
      c.get("principal").clinicId,
      cursorAt,
      cursorAt,
      cursorAt,
      cursorId,
    )
    .all<ReportRow>();
  const rows = results.slice(0, 20);
  const reports = [];
  for (const row of rows) reports.push(await response(c, row));
  const last = rows.at(-1);
  return c.json({
    reports,
    nextCursor:
      results.length > 20 && last ? `${last.created_at}|${last.id}` : null,
  });
});
cbcRouter.get("/reports/:id", async (c) =>
  c.json(await response(c, await report(c, c.req.param("id")))),
);
cbcRouter.post("/reports/:id/confirm", async (c) => {
  const row = await report(c, c.req.param("id"));
  const input = cbcConfirmSchema.parse(await jsonBody(c.req.raw)),
    key = operationKey(c),
    db = dbFor(c);
  if (
    input.collectionDate &&
    input.collectionDate > new Date().toISOString().slice(0, 10)
  )
    throw new HTTPException(422, {
      message: "Collection date cannot be in the future",
    });
  let values: CbcInput;
  try {
    values = normalizeCbc(input.measurements);
  } catch {
    throw new HTTPException(422, {
      message: "Five valid measurements and compatible units required",
    });
  }
  const hash = await tokenHash(JSON.stringify(input));
  const prior = await db
    .statement(
      "SELECT * FROM cbc_revisions WHERE org_id=:org AND report_id=? AND operation_key=?",
      row.id,
      key,
    )
    .first<RevisionRow>();
  if (prior) {
    if (prior.request_hash !== hash)
      throw new HTTPException(409, { message: "Idempotency key conflict" });
    return c.json(await response(c, await report(c, row.id)));
  }
  if (row.revision !== input.expectedRevision || row.revision >= 100)
    throw new HTTPException(409, {
      message: "Report revision changed or revision limit reached; reload",
    });
  const revision = row.revision + 1;
  const results = await db.batch([
    db.statement(
      `INSERT INTO cbc_revisions(org_id,report_id,revision,values_json,measurements_json,collection_date,confirmed_by,confirmed_at,input_hash,operation_key,request_hash)
      SELECT :org,?,?,?,?,?,?,?,?,?,? FROM cbc_reports WHERE id=? AND org_id=? AND revision=? AND deleted_at IS NULL AND ${currentCare}`,
      row.id,
      revision,
      JSON.stringify(values),
      JSON.stringify(input.measurements),
      input.collectionDate,
      c.get("principal").userId,
      new Date().toISOString(),
      await tokenHash(JSON.stringify(values)),
      key,
      hash,
      row.id,
      c.get("principal").orgId,
      row.revision,
    ),
    db.statement(
      `UPDATE cbc_reports SET revision=? WHERE org_id=:org AND id=? AND revision=? AND deleted_at IS NULL
      AND EXISTS (SELECT 1 FROM cbc_revisions v WHERE v.org_id=cbc_reports.org_id AND v.report_id=cbc_reports.id AND v.revision=?)`,
      revision,
      row.id,
      row.revision,
      revision,
    ),
    audit(c, row.encounter_id, "cbc.measurements.confirmed"),
  ]);
  if (results[0]?.meta.changes !== 1) {
    const winner = await db
      .statement(
        "SELECT request_hash FROM cbc_revisions WHERE org_id=:org AND report_id=? AND operation_key=?",
        row.id,
        key,
      )
      .first<{ request_hash: string }>();
    if (!winner || winner.request_hash !== hash)
      throw new HTTPException(409, {
        message: "Report changed or consent revoked; reload",
      });
  }
  return c.json(await response(c, await report(c, row.id)));
});
cbcRouter.post("/reports/:id/predict", async (c) => {
  const row = await report(c, c.req.param("id"));
  const key = operationKey(c);
  if (c.env.CBC_INFERENCE_ENABLED === "false")
    throw new HTTPException(503, { message: "Research inference disabled" });
  const input = cbcPredictSchema.parse(await jsonBody(c.req.raw));
  const priorKey = await dbFor(c)
    .statement(
      "SELECT report_id,revision FROM cbc_prediction_keys WHERE org_id=:org AND actor_id=? AND operation_key=?",
      c.get("principal").userId,
      key,
    )
    .first<{ report_id: string; revision: number }>();
  if (
    priorKey &&
    (priorKey.report_id !== row.id || priorKey.revision !== input.revision)
  )
    throw new HTTPException(409, {
      message: "Idempotency key already used for another prediction",
    });
  if (!row.research_consent)
    throw new HTTPException(403, {
      message: "Research processing permission required",
    });
  if (input.revision !== row.revision)
    throw new HTTPException(409, {
      message: "Confirm the current report revision first",
    });
  const saved = await dbFor(c)
    .statement(
      "SELECT * FROM cbc_revisions WHERE org_id=:org AND report_id=? AND revision=?",
      row.id,
      input.revision,
    )
    .first<RevisionRow>();
  if (!saved)
    throw new HTTPException(409, {
      message: "Confirmed measurements required",
    });
  if (!priorKey) {
    try {
      await dbFor(c)
        .statement(
          "INSERT INTO cbc_prediction_keys(org_id,actor_id,operation_key,report_id,revision) VALUES(:org,?,?,?,?)",
          c.get("principal").userId,
          key,
          row.id,
          input.revision,
        )
        .run();
    } catch {
      const winner = await dbFor(c)
        .statement(
          "SELECT report_id,revision FROM cbc_prediction_keys WHERE org_id=:org AND actor_id=? AND operation_key=?",
          c.get("principal").userId,
          key,
        )
        .first<{ report_id: string; revision: number }>();
      if (
        !winner ||
        winner.report_id !== row.id ||
        winner.revision !== input.revision
      )
        throw new HTTPException(409, {
          message: "Prediction idempotency conflict",
        });
    }
  }
  if (!saved.prediction_json) {
    const prediction = predictCbc(
      cbcInputSchema.parse(JSON.parse(saved.values_json)),
    );
    await dbFor(c).batch([
      dbFor(c).statement(
        `UPDATE cbc_revisions SET prediction_json=?,predicted_at=?,predicted_by=? WHERE org_id=:org AND report_id=? AND revision=? AND prediction_json IS NULL
        AND EXISTS (SELECT 1 FROM cbc_reports WHERE cbc_reports.org_id=cbc_revisions.org_id AND cbc_reports.id=cbc_revisions.report_id
        AND revision=? AND deleted_at IS NULL AND research_consent=1 AND ${currentCare})`,
        JSON.stringify(prediction),
        new Date().toISOString(),
        c.get("principal").userId,
        row.id,
        input.revision,
        input.revision,
      ),
      audit(c, row.encounter_id, "cbc.research.executed"),
    ]);
  }
  const current = await report(c, row.id);
  if (current.revision !== input.revision)
    throw new HTTPException(409, {
      message: "Report revision changed during inference",
    });
  return c.json(await response(c, current));
});
cbcRouter.put(
  "/reports/:id/document",
  bodyLimit({ maxSize: 10485760 }),
  async (c) => {
    const row = await report(c, c.req.param("id"));
    const bucket = c.env.CBC_DOCUMENTS;
    if (!bucket || c.get("cbcSourceAvailable") === false)
      throw new HTTPException(503, {
        message:
          "Original retention unavailable; measurements can still be saved",
      });
    const quota = await dbFor(c)
      .statement(
        "SELECT COUNT(*) AS count FROM cbc_reports WHERE org_id=:org AND document_key IS NOT NULL AND deleted_at IS NULL",
      )
      .first<{ count: number }>();
    if ((quota?.count ?? 0) >= 100)
      throw new HTTPException(429, {
        message: "Original document quota reached",
      });
    if (row.revision !== 0 || row.document_key)
      throw new HTTPException(409, {
        message: "Source already set or report confirmed",
      });
    if (c.req.header("X-Source-Retention-Consent") !== "true")
      throw new HTTPException(422, {
        message: "Source retention consent required",
      });
    const type = z
      .enum(["application/pdf", "image/png", "image/jpeg"])
      .parse(c.req.header("Content-Type"));
    const bytes = new Uint8Array(await c.req.arrayBuffer());
    const signature =
      type === "application/pdf"
        ? bytes[0] === 37 &&
          bytes[1] === 80 &&
          bytes[2] === 68 &&
          bytes[3] === 70
        : type === "image/png"
          ? bytes[0] === 137 &&
            bytes[1] === 80 &&
            bytes[2] === 78 &&
            bytes[3] === 71
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!signature)
      throw new HTTPException(422, { message: "Invalid document signature" });
    const key = `${c.get("principal").orgId}/cbc/${row.id}/${crypto.randomUUID()}`;
    const digest = [
      ...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    ]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
    await bucket.put(key, bytes, { httpMetadata: { contentType: type } });
    try {
      const result = await dbFor(c)
        .statement(
          `UPDATE cbc_reports SET document_key=?,document_type=?,source_consent_at=?,source_consent_by=?,document_sha256=?,document_bytes=? WHERE org_id=:org AND id=? AND revision=0
      AND document_key IS NULL AND deleted_at IS NULL AND ${currentCare}`,
          key,
          type,
          new Date().toISOString(),
          c.get("principal").userId,
          digest,
          bytes.length,
          row.id,
        )
        .run();
      if (result.meta.changes !== 1)
        throw new HTTPException(409, {
          message: "Source could not be attached; report changed",
        });
    } catch (error) {
      await bucket.delete(key);
      throw error;
    }
    return c.json(await response(c, await report(c, row.id)));
  },
);
cbcRouter.get("/reports/:id/document", async (c) => {
  const row = await report(c, c.req.param("id"));
  if (c.get("cbcSourceAvailable") === false)
    throw new HTTPException(503, {
      message: "Private source storage unavailable",
    });
  if (
    !row.source_consent_at ||
    !Number.isFinite(Date.parse(row.source_consent_at)) ||
    Date.parse(row.source_consent_at) < Date.now() - 30 * 86400000
  )
    throw new HTTPException(404, {
      message: "Original source retention expired",
    });
  const object =
    row.document_key && (await c.env.CBC_DOCUMENTS?.get(row.document_key));
  if (!object)
    throw new HTTPException(404, { message: "Original source not retained" });
  await report(c, row.id);
  return new Response(object.body, {
    headers: {
      "Content-Type": row.document_type ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
      "Content-Disposition": "attachment; filename=cbc-report",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
cbcRouter.delete("/reports/:id", async (c) => {
  const row = await report(c, c.req.param("id"));
  await dbFor(c).batch([
    dbFor(c).statement(
      "UPDATE cbc_reports SET deleted_at=? WHERE org_id=:org AND id=?",
      new Date().toISOString(),
      row.id,
    ),
    dbFor(c).statement(
      "DELETE FROM cbc_revisions WHERE org_id=:org AND report_id=?",
      row.id,
    ),
    audit(c, row.encounter_id, "cbc.report.deleted"),
  ]);
  let sourceCleanupPending = false;
  if (row.document_key) {
    try {
      if (!c.env.CBC_DOCUMENTS) throw new Error("Source binding unavailable");
      await c.env.CBC_DOCUMENTS.delete(row.document_key);
      await dbFor(c)
        .statement(
          "UPDATE cbc_reports SET document_key=NULL,document_type=NULL WHERE org_id=:org AND id=?",
          row.id,
        )
        .run();
    } catch {
      sourceCleanupPending = true;
    }
  }
  return c.json(
    { deleted: true, sourceCleanupPending },
    sourceCleanupPending ? 202 : 200,
  );
});
