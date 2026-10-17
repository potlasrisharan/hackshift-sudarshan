import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convertV4MiniflareOptions, Miniflare } from "miniflare";
import { demoPassword, seedDemo } from "../backend/local/seed";
import { tenantDb } from "../backend/src/database";
import {
  encounterSchema,
  loginResponseSchema,
} from "../packages/shared/integration";

const worker = new Miniflare(
  convertV4MiniflareOptions({
    modules: true,
    scriptPath: "dist/integration-worker/index.js",
    compatibilityDate: "2026-10-17",
    d1Databases: ["DB"],
    bindings: { ENVIRONMENT: "test" },
  }),
);
try {
  const db = await worker.getD1Database("DB");
  // This initial migration contains plain statements only (no trigger bodies).
  const migration = readFileSync("backend/migrations/0001_intake.sql", "utf8");
  await db.batch(
    migration
      .split(";")
      .map((sql) => sql.trim())
      .filter(Boolean)
      .map((sql) => db.prepare(sql)),
  );
  await seedDemo(db);
  const auth = await worker.dispatchFetch(
    "http://localhost/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        orgId: "demo",
        email: "doctor@demo.test",
        password: demoPassword,
      }),
    },
  );
  assert.equal(auth.status, 200);
  const { token } = loginResponseSchema.parse(await auth.json());
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  };
  const input = {
    patient: {
      name: "Synthetic D1 Sunita",
      birthDate: "1974-03-15",
      gender: "female",
      language: "hi-IN",
    },
    chiefComplaint: "Synthetic D1 fever intake",
    answers: { chestPain: "no", breathless: "no", fainting: "no" },
    careConsent: true,
    synthetic: true,
  };
  const created = await worker.dispatchFetch(
    "http://localhost/api/v1/encounters",
    { method: "POST", headers, body: JSON.stringify(input) },
  );
  assert.equal(created.status, 201);
  const encounter = encounterSchema.parse(await created.json());
  const replay = await worker.dispatchFetch(
    "http://localhost/api/v1/encounters",
    { method: "POST", headers, body: JSON.stringify(input) },
  );
  assert.equal(replay.status, 200);
  assert.equal(encounterSchema.parse(await replay.json()).id, encounter.id);
  const concurrentHeaders = {
    ...headers,
    "Idempotency-Key": crypto.randomUUID(),
  };
  const retries = await Promise.all(
    Array.from({ length: 5 }, () =>
      worker.dispatchFetch("http://localhost/api/v1/encounters", {
        method: "POST",
        headers: concurrentHeaders,
        body: JSON.stringify(input),
      }),
    ),
  );
  assert.deepEqual(
    retries.map((response) => response.status).sort(),
    [200, 200, 200, 200, 201],
  );
  const retryRecords = await Promise.all(
    retries.map(async (response) =>
      encounterSchema.parse(await response.json()),
    ),
  );
  assert.equal(new Set(retryRecords.map((record) => record.id)).size, 1);
  const repo = tenantDb({ db, orgId: "demo" });
  const rollbackId = crypto.randomUUID();
  await assert.rejects(
    repo.batch([
      repo.statement(
        "INSERT INTO patients (org_id,id,name,birth_date,gender,language,synthetic) VALUES (:org,?,'Synthetic rollback','1974-01-01','female','en-IN',1)",
        rollbackId,
      ),
      repo.statement(
        "INSERT INTO clinics (org_id,id,name) VALUES (:org,'north','Duplicate clinic')",
      ),
    ]),
  );
  assert.equal(
    await repo
      .statement(
        "SELECT id FROM patients WHERE org_id = :org AND id = ?",
        rollbackId,
      )
      .first(),
    null,
  );
  const review = await worker.dispatchFetch(
    `http://localhost/api/v1/encounters/${encounter.id}/review`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ note: "Synthetic D1 review" }),
    },
  );
  assert.equal(review.status, 200);
  const revoke = await worker.dispatchFetch(
    `http://localhost/api/v1/encounters/${encounter.id}/revoke`,
    { method: "POST", headers },
  );
  assert.equal(revoke.status, 200);
  const denied = await worker.dispatchFetch(
    `http://localhost/api/v1/encounters/${encounter.id}`,
    { headers },
  );
  assert.equal(denied.status, 404);
  console.log(
    "PASS: real local workerd/D1 login, atomic intake, concurrent replay, batch rollback, review and revocation",
  );
} finally {
  await worker.dispose();
}
