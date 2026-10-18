import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocalDatabase } from "../backend/local/database";
import { migrateLocal } from "../backend/local/migrate";
import { demoPassword, seedDemo } from "../backend/local/seed";
import { tenantDb } from "../backend/src/database";
import worker, { createIntegrationApp, type Env } from "../backend/src/index";
import {
  type CbcReport,
  cbcFields,
  cbcReportSchema,
} from "../packages/shared/cbc_contracts";
import {
  encounterSchema,
  loginResponseSchema,
} from "../packages/shared/integration";

let db: LocalDatabase;
let app = createIntegrationApp();
const env = () => ({ DB: db, ENVIRONMENT: "test" });
const values = {
  wbc: 8.95,
  rbc: 4.41,
  neutrophils: 65,
  lymphocytes: 25,
  monocytes: 9,
};
const measurements = cbcFields.map((field) => ({
  field,
  value: values[field],
  unit: field === "wbc" ? "10^9/L" : field === "rbc" ? "10^12/L" : "%",
  method: "manual",
  page: null,
  evidence: "",
}));
async function login(user = "doctor", orgId = "demo") {
  const res = await app.request(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        orgId,
        email: `${user}@demo.test`,
        password: demoPassword,
      }),
    },
    env(),
  );
  expect(res.status).toBe(200);
  return loginResponseSchema.parse(await res.json()).token;
}
async function req(
  token: string,
  path: string,
  method = "GET",
  body?: unknown,
  key: string = crypto.randomUUID(),
) {
  return app.request(
    `/api/v1${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
    env(),
  );
}
async function encounter(token: string) {
  const res = await req(token, "/encounters", "POST", {
    patient: {
      name: "Synthetic CBC",
      birthDate: "1980-01-01",
      gender: "female",
      language: "en-IN",
    },
    chiefComplaint: "Synthetic CBC evaluation",
    answers: { chestPain: "no", breathless: "no", fainting: "no" },
    careConsent: true,
    synthetic: true,
  });
  expect(res.status).toBe(201);
  return encounterSchema.parse(await res.json());
}
async function create(
  token: string,
  encounterId: string,
  researchConsent = true,
  key?: string,
) {
  const res = await req(
    token,
    "/cbc/reports",
    "POST",
    { encounterId, processingConsent: true, researchConsent },
    key,
  );
  expect([200, 201]).toContain(res.status);
  return cbcReportSchema.parse(await res.json());
}
async function confirm(token: string, report: CbcReport, key?: string) {
  const res = await req(
    token,
    `/cbc/reports/${report.id}/confirm`,
    "POST",
    {
      expectedRevision: report.revision,
      measurements,
      collectionDate: null,
      panelReviewed: true,
    },
    key,
  );
  expect(res.status).toBe(200);
  return cbcReportSchema.parse(await res.json());
}
beforeEach(async () => {
  db = new LocalDatabase();
  migrateLocal(db);
  await seedDemo(db);
  app = createIntegrationApp();
});
afterEach(() => db.close());
describe("CBC protected clinical workflow", () => {
  it("keeps measurements available while optional source storage is unavailable", async () => {
    const token = await login(),
      e = await encounter(token),
      draft = await create(token, e.id);
    const unavailable = {
      list: async () => {
        throw new Error("Synthetic provider outage");
      },
    } as unknown as R2Bucket;
    const res = await app.request(
      `/api/v1/cbc/reports/${draft.id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { ...env(), CBC_DOCUMENTS: unavailable },
    );
    expect(res.status).toBe(200);
    const source = await app.request(
      `/api/v1/cbc/reports/${draft.id}/document`,
      { headers: { Authorization: `Bearer ${token}` } },
      { ...env(), CBC_DOCUMENTS: unavailable },
    );
    expect(source.status).toBe(503);
  });
  it("requires verified doctor sessions through both router entrypoints", async () => {
    for (const token of ["", "demo-token", "mock-jwt-token"]) {
      expect((await req(token, "/cbc/reports?encounterId=x")).status).toBe(401);
      const res = await worker.request(
        "/api/v1/cbc/reports?encounterId=x",
        { headers: { Authorization: `Bearer ${token}` } },
        env() as unknown as Env,
      );
      expect(res.status).toBe(401);
    }
    for (const user of ["nurse", "cashier", "admin"])
      expect(
        (await req(await login(user), "/cbc/reports?encounterId=x")).status,
      ).toBe(403);
  });
  it("saves immutable revisions, predicts exactly and deduplicates retries", async () => {
    const token = await login(),
      e = await encounter(token),
      createKey = crypto.randomUUID();
    const draft = await create(token, e.id, true, createKey);
    expect((await create(token, e.id, true, createKey)).id).toBe(draft.id);
    expect(
      (
        await req(token, `/cbc/reports/${draft.id}/predict`, "POST", {
          revision: 1,
        })
      ).status,
    ).toBe(409);
    const key = crypto.randomUUID(),
      saved = await confirm(token, draft, key);
    expect((await confirm(token, draft, key)).revision).toBe(1);
    const run = await req(token, `/cbc/reports/${draft.id}/predict`, "POST", {
      revision: 1,
    });
    expect(run.status).toBe(200);
    const result = cbcReportSchema.parse(await run.json());
    expect(result.revisions[0]?.prediction?.score).toBeCloseTo(
      0.6528833817519397,
      12,
    );
    app = createIntegrationApp();
    const persisted = await req(token, `/cbc/reports/${draft.id}`);
    expect(cbcReportSchema.parse(await persisted.json())).toEqual(result);
    const edited = await confirm(token, saved);
    expect(edited.revisions).toHaveLength(2);
    expect(edited.revisions[1]?.prediction).not.toBeNull();
    expect(edited.revisions[0]?.prediction).toBeNull();
    expect(
      (
        await req(token, `/cbc/reports/${draft.id}/predict`, "POST", {
          revision: 1,
        })
      ).status,
    ).toBe(409);
  });
  it("isolates tenant/clinic/encounter and denies revoked care and unpermitted research", async () => {
    const token = await login(),
      e = await encounter(token),
      draft = await create(token, e.id, false);
    await confirm(token, draft);
    expect(
      (
        await req(token, `/cbc/reports/${draft.id}/predict`, "POST", {
          revision: 1,
        })
      ).status,
    ).toBe(403);
    for (const other of [
      await login("doctor", "other-org"),
      await login("east-doctor"),
    ]) {
      for (const route of [
        `/cbc/reports/${draft.id}`,
        `/cbc/reports?encounterId=${e.id}`,
      ])
        expect((await req(other, route)).status).toBe(404);
      expect(
        (await req(other, `/cbc/reports/${draft.id}/confirm`, "POST", {}))
          .status,
      ).toBe(404);
    }
    await req(token, `/encounters/${e.id}/revoke`, "POST");
    for (const route of [
      `/cbc/reports/${draft.id}`,
      `/cbc/reports?encounterId=${e.id}`,
      `/cbc/reports/${draft.id}/document`,
    ])
      expect((await req(token, route)).status).toBe(404);
  });
  it("rejects unconfirmed/invalid inputs, idempotency conflicts, source unavailability and deletion reads", async () => {
    const token = await login(),
      e = await encounter(token),
      key = crypto.randomUUID(),
      draft = await create(token, e.id, true, key);
    const conflict = await req(
      token,
      "/cbc/reports",
      "POST",
      { encounterId: e.id, processingConsent: true, researchConsent: false },
      key,
    );
    expect(conflict.status).toBe(409);
    const invalid = await req(
      token,
      `/cbc/reports/${draft.id}/confirm`,
      "POST",
      {
        expectedRevision: 0,
        measurements: measurements.map((m) => ({ ...m, value: -1 })),
        collectionDate: null,
        panelReviewed: true,
      },
    );
    expect(invalid.status).toBe(422);
    const source = await app.request(
      `/api/v1/cbc/reports/${draft.id}/document`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf",
        },
        body: "%PDF-1.7",
      },
      env(),
    );
    expect(source.status).toBe(503);
    expect(
      (await req(token, `/cbc/reports/${draft.id}`, "DELETE")).status,
    ).toBe(200);
    expect((await req(token, `/cbc/reports/${draft.id}`)).status).toBe(404);
    expect(
      (await req(token, `/cbc/reports/${draft.id}/confirm`, "POST", {})).status,
    ).toBe(404);
  });
  it("does not echo arbitrary request values and gates production capability", async () => {
    const token = await login();
    const res = await req(token, "/cbc/reports", "POST", {
      patientName: "NEVER_ECHO_PHI",
    });
    expect(res.status).toBe(422);
    expect(await res.text()).not.toContain("NEVER_ECHO_PHI");
    const caps = await worker.request("/api/v1/cbc/capabilities", {}, {
      ...env(),
      ENVIRONMENT: "production",
    } as unknown as Env);
    expect(await caps.json()).toMatchObject({
      enabled: false,
      inference: false,
    });
    const fresh = new LocalDatabase();
    migrateLocal(fresh);
    migrateLocal(fresh);
    fresh.close();
    const count = await tenantDb({ db, orgId: "demo" })
      .statement("SELECT COUNT(*) AS count FROM cbc_reports WHERE org_id=:org")
      .first<{ count: number }>();
    expect(count?.count).toBe(0);
  });
  it("handles concurrent create/confirm retries and prediction-key conflicts", async () => {
    const token = await login(),
      e = await encounter(token),
      key = crypto.randomUUID();
    const created = await Promise.all(
      Array.from({ length: 4 }, () => create(token, e.id, true, key)),
    );
    expect(new Set(created.map((item) => item.id)).size).toBe(1);
    const firstCreated = created[0];
    if (!firstCreated) throw new Error("Missing created fixture");
    const confirmationKey = crypto.randomUUID();
    const confirmed = await Promise.all(
      created.map((item) => confirm(token, item, confirmationKey)),
    );
    expect(confirmed.every((item) => item.revision === 1)).toBe(true);
    const predictionKey = crypto.randomUUID();
    expect(
      (
        await req(
          token,
          `/cbc/reports/${firstCreated.id}/predict`,
          "POST",
          { revision: 1 },
          predictionKey,
        )
      ).status,
    ).toBe(200);
    const firstConfirmed = confirmed[0];
    if (!firstConfirmed) throw new Error("Missing confirmed fixture");
    await confirm(token, firstConfirmed);
    expect(
      (
        await req(
          token,
          `/cbc/reports/${firstCreated.id}/predict`,
          "POST",
          { revision: 2 },
          predictionKey,
        )
      ).status,
    ).toBe(409);
  });
  it("keeps two encounters for one patient separate and rejects wrong-dimension units", async () => {
    const token = await login(),
      first = await encounter(token),
      second = await encounter(token);
    const dbFor = tenantDb({ db, orgId: "demo" });
    await dbFor.batch([
      dbFor.statement(
        "UPDATE encounters SET patient_id=? WHERE org_id=:org AND id=?",
        first.patientId,
        second.id,
      ),
      dbFor.statement(
        "UPDATE consents SET patient_id=? WHERE org_id=:org AND encounter_id=?",
        first.patientId,
        second.id,
      ),
    ]);
    const a = await create(token, first.id),
      b = await create(token, second.id);
    expect(a.patientId).toBe(b.patientId);
    expect(a.encounterId).not.toBe(b.encounterId);
    const list = await req(token, `/cbc/reports?encounterId=${first.id}`);
    const data = (await list.json()) as { reports: CbcReport[] };
    expect(data.reports.map((item) => item.id)).toEqual([a.id]);
    expect(
      (
        await req(token, `/cbc/reports/${a.id}/confirm`, "POST", {
          expectedRevision: 0,
          measurements: measurements.map((item) => ({ ...item, unit: "%" })),
          collectionDate: null,
          panelReviewed: true,
        })
      ).status,
    ).toBe(422);
  });
});
