import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { LocalDatabase } from "../backend/local/database";
import { demoPassword, seedDemo } from "../backend/local/seed";
import { tenantDb } from "../backend/src/database";
import { createIntegrationApp } from "../backend/src/index";
import { tokenHash } from "../backend/src/security";
import {
  encounterSchema,
  intakeSchema,
  loginResponseSchema,
} from "../packages/shared/integration";

const temporary = mkdtempSync(join(tmpdir(), "dhaaga-integration-"));
const path = join(temporary, "test.sqlite");
let db = new LocalDatabase(path);
let app = createIntegrationApp();
const env = () => ({ DB: db, ENVIRONMENT: "test" });
const input = {
  patient: {
    name: "Synthetic Sunita",
    birthDate: "1974-03-15",
    gender: "female",
    language: "hi-IN",
  },
  chiefComplaint: "Synthetic patient reports two days of fever",
  answers: { chestPain: "no", breathless: "no", fainting: "no", fever: "yes" },
  careConsent: true,
  synthetic: true,
};
async function login(user = "doctor", orgId = "demo") {
  const response = await app.request(
    "/api/v1/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgId,
        email: `${user}@demo.test`,
        password: demoPassword,
      }),
    },
    env(),
  );
  expect(response.status).toBe(200);
  return loginResponseSchema.parse(await response.json()).token;
}
async function request(
  token: string,
  route: string,
  method = "GET",
  body?: unknown,
  key = crypto.randomUUID(),
) {
  return app.request(
    `/api/v1${route}`,
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
async function create(token: string, body: unknown = input) {
  const response = await request(token, "/encounters", "POST", body);
  expect(response.status).toBe(201);
  return encounterSchema.parse(await response.json());
}
beforeAll(async () => {
  db.raw.exec(readFileSync("backend/migrations/0001_intake.sql", "utf8"));
  await seedDemo(db);
});
beforeEach(async () => {
  for (const orgId of ["demo", "other-org"])
    await tenantDb({ db, orgId })
      .statement("DELETE FROM login_attempts WHERE org_id = :org")
      .run();
});
afterAll(() => {
  db.close();
  rmSync(temporary, { recursive: true });
});

describe("persistent integration boundaries", () => {
  it("uses canonical patient languages and validates red-flag screening", () => {
    expect(
      intakeSchema.safeParse({
        ...input,
        patient: { ...input.patient, language: "pa-IN" },
      }).success,
    ).toBe(true);
    expect(intakeSchema.safeParse({ ...input, answers: {} }).success).toBe(
      false,
    );
    expect(
      intakeSchema.safeParse({ ...input, careConsent: false }).success,
    ).toBe(false);
  });
  it("denies anonymous, wrong-password and client role escalation", async () => {
    expect((await app.request("/api/v1/encounters", {}, env())).status).toBe(
      401,
    );
    for (const extra of [
      { password: "wrong" },
      { password: demoPassword, role: "DOCTOR" },
    ]) {
      const response = await app.request(
        "/api/v1/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            orgId: "demo",
            email: "nurse@demo.test",
            ...extra,
          }),
        },
        env(),
      );
      expect([401, 422]).toContain(response.status);
    }
    const nurse = await login("nurse");
    expect((await request(nurse, "/auth/me")).status).toBe(200);
  });
  it("persists consented intake across independent app and DB lifecycles", async () => {
    const token = await login();
    const encounter = await create(token);
    db.close();
    db = new LocalDatabase(path);
    app = createIntegrationApp();
    const response = await request(token, `/encounters/${encounter.id}`);
    expect(encounterSchema.parse(await response.json())).toEqual(encounter);
    const doctorView = await request(await login(), "/encounters");
    expect(JSON.stringify(await doctorView.json())).toContain(encounter.id);
  });
  it("isolates tenants, clinics and cashier access on reads and writes", async () => {
    const owner = await login();
    const encounter = await create(owner);
    for (const token of [
      await login("doctor", "other-org"),
      await login("east-doctor"),
    ]) {
      expect((await request(token, `/encounters/${encounter.id}`)).status).toBe(
        404,
      );
      expect(
        JSON.stringify(await (await request(token, "/encounters")).json()),
      ).not.toContain(encounter.id);
      expect(
        (
          await request(token, `/encounters/${encounter.id}/review`, "POST", {
            note: "Not permitted",
          })
        ).status,
      ).toBe(409);
      expect(
        (await request(token, `/encounters/${encounter.id}/revoke`, "POST"))
          .status,
      ).toBe(404);
    }
    expect((await request(await login("cashier"), "/encounters")).status).toBe(
      403,
    );
    // Altering the tenant prefix invalidates the stored token hash.
    expect(
      (await request(owner.replace(/^demo\./, "other-org."), "/encounters"))
        .status,
    ).toBe(401);
  });
  it("commits concurrent intake retries exactly once and rejects changed payloads", async () => {
    const token = await login();
    const key = crypto.randomUUID();
    const responses = await Promise.all(
      Array.from({ length: 5 }, () =>
        request(token, "/encounters", "POST", input, key),
      ),
    );
    expect(responses.map((response) => response.status).sort()).toEqual([
      200, 200, 200, 200, 201,
    ]);
    const encounters = await Promise.all(
      responses.map(async (response) =>
        encounterSchema.parse(await response.json()),
      ),
    );
    expect(new Set(encounters.map((encounter) => encounter.id)).size).toBe(1);
    expect(
      (
        await request(
          token,
          "/encounters",
          "POST",
          { ...input, chiefComplaint: "Different complaint" },
          key,
        )
      ).status,
    ).toBe(409);
    const result = await tenantDb({ db, orgId: "demo" })
      .statement(
        "SELECT COUNT(*) AS total FROM activity WHERE org_id = :org AND encounter_id = ?",
        encounters[0]?.id ?? "",
      )
      .first<{ total: number }>();
    expect(result?.total).toBe(1);
  });
  it("rolls back a failed batch without orphaning a patient", async () => {
    const repo = tenantDb({ db, orgId: "demo" });
    const patientId = crypto.randomUUID();
    await expect(
      repo.batch([
        repo.statement(
          "INSERT INTO patients (org_id,id,name,birth_date,gender,language,synthetic) VALUES (:org,?,'Synthetic','1974-01-01','female','en-IN',1)",
          patientId,
        ),
        repo.statement(
          "INSERT INTO clinics (org_id,id,name) VALUES (:org,'north','Duplicate')",
        ),
      ]),
    ).rejects.toThrow();
    expect(
      await repo
        .statement(
          "SELECT id FROM patients WHERE org_id = :org AND id = ?",
          patientId,
        )
        .first(),
    ).toBeNull();
  });
  it("allows doctor review once, denies nurse review and never downgrades emergencies", async () => {
    const doctor = await login();
    const encounter = await create(doctor);
    expect(
      (
        await request(
          await login("nurse"),
          `/encounters/${encounter.id}/review`,
          "POST",
          { note: "Nurse cannot sign" },
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await request(doctor, `/encounters/${encounter.id}/review`, "POST", {
          note: "Synthetic patient reviewed. Further assessment required.",
        })
      ).status,
    ).toBe(200);
    expect(
      (
        await request(doctor, `/encounters/${encounter.id}/review`, "POST", {
          note: "Overwrite attempt",
        })
      ).status,
    ).toBe(409);
    const saved = encounterSchema.parse(
      await (await request(doctor, `/encounters/${encounter.id}`)).json(),
    );
    expect(saved.status).toBe("reviewed");
    expect(saved.reviewedBy).toBe("doctor");
    const emergency = await create(doctor, {
      ...input,
      answers: { chestPain: "yes" },
    });
    expect(emergency.status).toBe("emergency");
    expect(
      (
        await request(doctor, `/encounters/${emergency.id}/review`, "POST", {
          note: "Downgrade attempt",
        })
      ).status,
    ).toBe(409);
  });
  it("revocation removes records and prevents replay and further review", async () => {
    const token = await login();
    const key = crypto.randomUUID();
    const response = await request(token, "/encounters", "POST", input, key);
    const encounter = encounterSchema.parse(await response.json());
    expect(
      (await request(token, `/encounters/${encounter.id}/revoke`, "POST"))
        .status,
    ).toBe(200);
    expect((await request(token, `/encounters/${encounter.id}`)).status).toBe(
      404,
    );
    expect(
      JSON.stringify(await (await request(token, "/encounters")).json()),
    ).not.toContain(encounter.id);
    expect(
      (await request(token, "/encounters", "POST", input, key)).status,
    ).toBe(403);
    expect(
      (
        await request(token, `/encounters/${encounter.id}/review`, "POST", {
          note: "Cannot review",
        })
      ).status,
    ).toBe(409);
  });
  it("invalidates logged-out and expired persisted sessions", async () => {
    const token = await login();
    expect((await request(token, "/auth/logout", "POST")).status).toBe(200);
    expect((await request(token, "/auth/me")).status).toBe(401);
    const expired = await login();
    await tenantDb({ db, orgId: "demo" })
      .statement(
        "UPDATE sessions SET expires_at='2000-01-01T00:00:00.000Z' WHERE org_id = :org AND token_hash = ?",
        await tokenHash(expired),
      )
      .run();
    expect((await request(expired, "/auth/me")).status).toBe(401);
  });
  it("rejects malformed/oversized requests and cross-origin writes", async () => {
    const token = await login();
    expect(
      (
        await app.request(
          "/api/v1/encounters",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: "{",
          },
          env(),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await request(token, "/encounters", "POST", {
          ...input,
          padding: "x".repeat(33000),
        })
      ).status,
    ).toBe(413);
    expect(
      (
        await app.request(
          "/api/v1/auth/login",
          {
            method: "POST",
            headers: { Origin: "https://evil.example" },
            body: "{}",
          },
          env(),
        )
      ).status,
    ).toBe(403);
    expect((await request(token, "/ops/pos/sale", "POST", {})).status).toBe(
      501,
    );
  });
  it("throttles persisted login attempts and fails closed outside development", async () => {
    for (let i = 0; i < 11; i++) {
      const response = await app.request(
        "/api/v1/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            orgId: "demo",
            email: "missing@demo.test",
            password: "wrong",
          }),
        },
        env(),
      );
      expect(response.status).toBe(i < 10 ? 401 : 429);
    }
    expect(
      (
        await app.request(
          "/api/v1/auth/login",
          { method: "POST", body: "{}" },
          { DB: db, ENVIRONMENT: "production" },
        )
      ).status,
    ).toBe(503);
  });
});
