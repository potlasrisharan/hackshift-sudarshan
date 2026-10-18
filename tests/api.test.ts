import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/app";
import backendApp from "../backend/src/index";
import { demoPlan } from "../packages/shared/demo";

const app = createApp();
async function session() {
  const res = await app.request("/api/v1/demo/session", { method: "POST" });
  const data = (await res.json()) as { token: string };
  return {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": "application/json",
  };
}
async function consent(headers: Record<string, string>, granted = true) {
  return app.request("/api/v1/consent", {
    method: "POST",
    headers,
    body: JSON.stringify({ granted }),
  });
}
describe("API security and integration", () => {
  it("denies anonymous record access", async () => {
    expect((await app.request("/api/v1/record")).status).toBe(401);
  });
  it("enforces purpose consent, including revocation", async () => {
    const h = await session();
    expect((await app.request("/api/v1/record", { headers: h })).status).toBe(
      403,
    );
    await consent(h);
    expect((await app.request("/api/v1/record", { headers: h })).status).toBe(
      200,
    );
    await consent(h, false);
    expect(
      (await app.request("/api/v1/record/fhir", { headers: h })).status,
    ).toBe(403);
  });
  it("combines both sources and exports FHIR reference links", async () => {
    const h = await session();
    await consent(h);
    const r = await app.request("/api/v1/record", { headers: h });
    const data = (await r.json()) as { observations: { source: string }[] };
    expect(data.observations.map((o) => o.source)).toEqual([
      "project-1",
      "project-2",
    ]);
    const f = await app.request("/api/v1/record/fhir", { headers: h });
    expect(((await f.json()) as { resourceType: string }).resourceType).toBe(
      "Bundle",
    );
  });
  it("isolates session mutations from other patients", async () => {
    const a = await session(),
      b = await session();
    await consent(a);
    await consent(b);
    await app.request("/api/v1/record", { method: "DELETE", headers: a });
    const rb = await app.request("/api/v1/record", { headers: b });
    expect(
      ((await rb.json()) as { observations: unknown[] }).observations,
    ).toHaveLength(2);
  });
  it("preserves a serialised audit chain under concurrent reads", async () => {
    const h = await session();
    await consent(h);
    await Promise.all(
      Array.from({ length: 20 }, () =>
        app.request("/api/v1/record", { headers: h }),
      ),
    );
    const r = await app.request("/api/v1/audit/verify", { headers: h });
    expect(await r.json()).toEqual({
      valid: true,
      entries: 21,
      scope: "Tamper-evident in-memory chain; not immutable storage",
    });
  });
  it("runs the cross-project prescription-to-stock algorithm", async () => {
    const h = await session();
    await consent(h);
    const r = await app.request("/api/v1/algorithms/rx-to-shelf", {
      method: "POST",
      headers: h,
      body: JSON.stringify(demoPlan()),
    });
    expect(r.status).toBe(200);
    expect(
      ((await r.json()) as { plans: { costPaise: number }[] }).plans[0]
        ?.costPaise,
    ).toBe(6400);
  });
  it("rejects malformed JSON and invalid data without leaking internals", async () => {
    const h = await session();
    await consent(h);
    expect(
      (
        await app.request("/api/v1/algorithms/sentinel", {
          method: "POST",
          headers: h,
          body: "{",
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await app.request("/api/v1/algorithms/threadpulse", {
          method: "POST",
          headers: h,
          body: JSON.stringify({ probabilities: [2], stock: -1 }),
        })
      ).status,
    ).toBe(422);
  });
  it("does not accept patient-assigned upstream provenance", async () => {
    const h = await session();
    await consent(h);
    const r = await app.request("/api/v1/observations", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        id: "x",
        code: "8867-4",
        value: 72,
        unit: "/min",
        sampledAt: "2026-10-17T08:00:00Z",
        source: "project-1",
      }),
    });
    expect(r.status).toBe(403);
  });
  it("rejects mixed units and implausible readings", async () => {
    const h = await session();
    await consent(h);
    for (const reading of [
      { code: "8867-4", value: 999, unit: "/min" },
      { code: "8480-6", value: 125, unit: "%" },
    ]) {
      expect(
        (
          await app.request("/api/v1/observations", {
            method: "POST",
            headers: h,
            body: JSON.stringify({
              ...reading,
              id: "r",
              source: "manual",
              sampledAt: "2026-10-17T08:00:00Z",
            }),
          })
        ).status,
      ).toBe(422);
    }
  });
  it("blocks cross-origin writes", async () => {
    const r = await app.request("/api/v1/demo/session", {
      method: "POST",
      headers: { Origin: "https://evil.example" },
    });
    expect(r.status).toBe(403);
  });
  it("sets private-response cache and security headers", async () => {
    const r = await app.request("/api/v1/capabilities");
    expect(r.headers.get("Cache-Control")).toBe("no-store");
    expect(r.headers.get("Content-Security-Policy")).toContain(
      "frame-ancestors 'none'",
    );
    expect(r.headers.get("X-Request-Id")).toBeTruthy();
  });
});

it("accepts HTTPS viewer Origin only when the proxy is explicitly trusted", async () => {
  const proxied = createApp({ trustedProxy: true });
  const response = await proxied.request(
    "http://demo.example/api/v1/demo/session",
    {
      method: "POST",
      headers: {
        Origin: "https://demo.example",
        "CloudFront-Forwarded-Proto": "https",
      },
    },
  );
  expect(response.status).toBe(201);
  const untrusted = createApp();
  expect(
    (
      await untrusted.request("http://demo.example/api/v1/demo/session", {
        method: "POST",
        headers: {
          Origin: "https://demo.example",
          "CloudFront-Forwarded-Proto": "https",
        },
      })
    ).status,
  ).toBe(403);
});
it("bounds streaming request bodies without trusting content-length", async () => {
  const h = await session();
  await consent(h);
  expect(
    (
      await app.request("/api/v1/algorithms/sentinel", {
        method: "POST",
        headers: h,
        body: JSON.stringify({ text: "x".repeat(100001) }),
      })
    ).status,
  ).toBe(413);
});

describe("Unified Cloudflare Worker API & Frontends Integration", () => {
  it("verifies ABHA for Flutter Patient/Kiosk app", async () => {
    const res = await backendApp.request("/api/v1/abdm/abha/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abha_number: "91-4829-1029-4821" }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      patient_id: string;
      abha_number: string;
      name: string;
    };
    expect(data.patient_id).toBe("pat-048291");
    expect(data.abha_number).toBe("91-4829-1029-4821");
    expect(data.name).toBe("Ramesh Chandra");
  });

  it("checks PM-JAY coverage eligibility for Flutter App", async () => {
    const res = await backendApp.request(
      "/api/v1/insurance/coverage-eligibility/check",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          abha_number: "91-4829-1029-4821",
          patient_id: "pat-048291",
        }),
      },
    );
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      eligible: boolean;
      scheme_name: string;
      coverage_amount_inr: number;
    };
    expect(data.eligible).toBe(true);
    expect(data.scheme_name).toBe("Ayushman Bharat PM-JAY");
    expect(data.coverage_amount_inr).toBe(500000.0);
  });

  it("handles conversational triage and detects red flag symptoms", async () => {
    // Normal input
    const normalRes = await backendApp.request("/api/v1/intake/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encounter_id: "enc-0042",
        current_input: "Mujhe halke sar dard ki shikayat hai",
        system_type: "ALLOPATHY",
      }),
    });
    expect(normalRes.status).toBe(200);
    const normalData = (await normalRes.json()) as {
      red_flag: { is_triggered: boolean };
    };
    expect(normalData.red_flag.is_triggered).toBe(false);

    // Emergency red-flag input (chest pain)
    const redFlagRes = await backendApp.request("/api/v1/intake/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encounter_id: "enc-0042",
        current_input: "Severe chest pain and shortness of breath",
        system_type: "ALLOPATHY",
      }),
    });
    expect(redFlagRes.status).toBe(200);
    const redFlagData = (await redFlagRes.json()) as {
      reply_text: string;
      red_flag: { is_triggered: boolean; trigger_symptoms: string[] };
    };
    expect(redFlagData.red_flag.is_triggered).toBe(true);
    expect(redFlagData.red_flag.trigger_symptoms).toEqual(
      expect.arrayContaining(["chest_pain", "breathlessness"]),
    );
    expect(redFlagData.reply_text).toContain("alert the clinic staff now");
  });

  it("extracts structured medications and lab results from documents/ocr", async () => {
    const res = await backendApp.request("/api/v1/documents/ocr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encounter_id: "enc-0042" }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      medications: { name: string }[];
      lab_results: { test_name: string }[];
      confidence_score: number;
    };
    expect(data.medications.length).toBeGreaterThan(0);
    expect(data.lab_results.length).toBeGreaterThan(0);
    expect(data.confidence_score).toBe(0.96);
  });

  it("serves demo and legacy compatibility endpoints on unified worker", async () => {
    // Session creation
    const sessRes = await backendApp.request("/api/v1/demo/session", {
      method: "POST",
    });
    expect(sessRes.status).toBe(201);
    const { token } = (await sessRes.json()) as { token: string };
    const h = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Consent
    const consentRes = await backendApp.request("/api/v1/consent", {
      method: "POST",
      headers: h,
      body: JSON.stringify({ granted: true }),
    });
    expect(consentRes.status).toBe(200);

    // Record
    const recordRes = await backendApp.request("/api/v1/record", {
      headers: h,
    });
    expect(recordRes.status).toBe(200);

    // FHIR
    const fhirRes = await backendApp.request("/api/v1/record/fhir", {
      headers: h,
    });
    expect(fhirRes.status).toBe(200);

    // Summary
    const summaryRes = await backendApp.request("/api/v1/summary", {
      headers: h,
    });
    expect(summaryRes.status).toBe(200);

    // Audit verify
    const auditRes = await backendApp.request("/api/v1/audit/verify", {
      headers: h,
    });
    expect(auditRes.status).toBe(200);
    const auditData = (await auditRes.json()) as { valid: boolean };
    expect(auditData.valid).toBe(true);
  });

  it("evaluates savings-meter and double-entry ledger via /api/v1/algorithms", async () => {
    // 1. Savings Meter
    const smRes = await backendApp.request("/api/v1/algorithms/savings-meter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prescription: {
          salt: "metformin",
          strengthMg: 500,
          form: "tablet",
          units: 30,
          courseEnd: "2026-11-01",
          brandedPricePaise: 400,
        },
        genericBatches: [
          {
            id: "b1",
            brand: "Jan Aushadhi",
            salt: "metformin",
            strengthMg: 500,
            form: "tablet",
            stock: 60,
            pricePaise: 100,
            expiry: "2027-12-31",
          },
        ],
      }),
    });
    expect(smRes.status).toBe(200);
    const smData = (await smRes.json()) as any;
    expect(smData.status).toBe("GENERIC_AVAILABLE");
    expect(smData.savingsPercentage).toBe(75);
    expect(smData.savingsPaise).toBe(9000);

    // 2. Double-Entry Ledger
    const ledgerRes = await backendApp.request(
      "/api/v1/algorithms/double-entry-ledger",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journals: [
            {
              id: "j1",
              referenceId: "ref1",
              date: "2026-10-18",
              lines: [
                { account: "cash", type: "debit", amountPaise: 10000 },
                { account: "revenue", type: "credit", amountPaise: 10000 },
              ],
            },
          ],
        }),
      },
    );
    expect(ledgerRes.status).toBe(200);
    const ledgerData = (await ledgerRes.json()) as any;
    expect(ledgerData.balanced).toBe(true);
    expect(ledgerData.revenuePaise).toBe(10000);
    expect(ledgerData.profitPaise).toBe(10000);

    // 3. Proactive Refill Warning
    const refillRes = await backendApp.request(
      "/api/v1/algorithms/refill-warning",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStockUnits: 10,
          leadTimeDays: 3,
          patients: [
            {
              patientId: "p1",
              drugSalt: "metformin",
              strengthMg: 500,
              dailyDoseUnits: 2,
              remainingUnits: 2,
            },
          ],
        }),
      },
    );
    expect(refillRes.status).toBe(200);
    const refillData = (await refillRes.json()) as any;
    expect(refillData.isRefillWarningActive).toBe(true);
    expect(refillData.stockStatus).toBe("CRITICAL_STOCKOUT_RISK");
  });

  it("serves operational endpoints for inventory radar, pos sale, and ledger summary", async () => {
    // 1. Inventory radar
    const radarRes = await backendApp.request("/api/v1/ops/inventory/radar");
    expect(radarRes.status).toBe(200);
    const radarData = (await radarRes.json()) as any;
    expect(radarData.totalSkus).toBe(120);
    expect(radarData.refillAnalysis).toBeDefined();

    // 2. POS sale with double-entry ledger integration
    const posRes = await backendApp.request("/api/v1/ops/pos/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        units: 30,
        unitPricePaise: 1500,
        unitCostPaise: 800,
      }),
    });
    expect(posRes.status).toBe(200);
    const posData = (await posRes.json()) as any;
    expect(posData.status).toBe("completed");
    expect(posData.totalPaise).toBe(45000);
    expect(posData.cogsPaise).toBe(24000);
    expect(posData.ledger.balanced).toBe(true);

    // 3. Savings meter via ops
    const smRes = await backendApp.request("/api/v1/ops/savings-meter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(smRes.status).toBe(200);

    // 4. Ledger summary
    const sumRes = await backendApp.request("/api/v1/ops/ledger/summary");
    expect(sumRes.status).toBe(200);
    const sumData = (await sumRes.json()) as any;
    expect(sumData.isBalanced).toBe(true);
    expect(sumData.revenuePaise).toBe(12500000);
    expect(sumData.cogsPaise).toBe(8200000);
    expect(sumData.operatingExpensesPaise).toBe(2100000);
    expect(sumData.netProfitPaise).toBe(2200000);
  });
});

describe("Backend Patient CRUD API (/api/v1/patients)", () => {
  let createdPatientId: string;

  it("creates a new patient via POST /api/v1/patients", async () => {
    const payload = {
      name: "Sunita Devi",
      phone: "+91 9988776655",
      dob: "1985-03-20",
      gender: "FEMALE",
      preferredLang: "hi",
      bloodGroup: "B+",
      allergies: ["Dust", "Aspirin"],
    };

    const res = await backendApp.request("/api/v1/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.patient).toBeDefined();
    expect(body.patient.id).toMatch(/^pat-/);
    expect(body.patient.name).toBe("Sunita Devi");
    expect(body.patient.phone).toBe("+91 9988776655");
    expect(body.patient.phoneHash).toBeDefined();
    expect(typeof body.patient.phoneHash).toBe("string");
    expect(body.patient.phoneHash.length).toBeGreaterThan(0);
    expect(body.patient.allergies).toEqual(["Dust", "Aspirin"]);
    expect(body.patient.bloodGroup).toBe("B+");

    createdPatientId = body.patient.id;
  });

  it("fetches patient by ID via GET /api/v1/patients/:id", async () => {
    // 1. Fetch newly created patient
    const res = await backendApp.request(
      `/api/v1/patients/${createdPatientId}`,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.patient.id).toBe(createdPatientId);
    expect(body.patient.name).toBe("Sunita Devi");
    expect(body.patient.allergies).toEqual(["Dust", "Aspirin"]);

    // 2. Fetch non-existent patient ID pat-non-existent-999
    const notFoundRes = await backendApp.request(
      "/api/v1/patients/pat-non-existent-999",
    );
    expect(notFoundRes.status).toBe(404);
    const notFoundBody = (await notFoundRes.json()) as any;
    expect(notFoundBody.success).toBe(false);
    expect(notFoundBody.error).toBeDefined();

    // 3. Fetch seeded patient pat-048291 (Ramesh Chandra) and check linked prescriptions
    const seededRes = await backendApp.request("/api/v1/patients/pat-048291");
    expect(seededRes.status).toBe(200);
    const seededBody = (await seededRes.json()) as any;
    expect(seededBody.success).toBe(true);
    expect(seededBody.patient).toBeDefined();
    expect(seededBody.patient.name).toBe("Ramesh Chandra");
    expect(seededBody.prescriptions).toBeDefined();
    expect(Array.isArray(seededBody.prescriptions)).toBe(true);
    expect(seededBody.prescriptions.length).toBeGreaterThan(0);
  });

  it("lists and filters patients via GET /api/v1/patients", async () => {
    // 1. List patients: Expect success: true, count > 0, array contains seeded and newly created
    const listRes = await backendApp.request("/api/v1/patients");
    expect(listRes.status).toBe(200);
    const listBody = (await listRes.json()) as any;
    expect(listBody.success).toBe(true);
    expect(listBody.count).toBeGreaterThan(0);
    expect(Array.isArray(listBody.patients)).toBe(true);
    const names = listBody.patients.map((p: any) => p.name);
    expect(names).toContain("Ramesh Chandra");
    expect(names).toContain("Sunita Devi");

    // 2. Query filter by phone ?phone=9988776655
    const phoneRes = await backendApp.request(
      "/api/v1/patients?phone=9988776655",
    );
    expect(phoneRes.status).toBe(200);
    const phoneBody = (await phoneRes.json()) as any;
    expect(phoneBody.success).toBe(true);
    expect(phoneBody.patients.some((p: any) => p.name === "Sunita Devi")).toBe(
      true,
    );

    // 3. Query filter by name ?name=Sunita
    const nameRes = await backendApp.request("/api/v1/patients?name=Sunita");
    expect(nameRes.status).toBe(200);
    const nameBody = (await nameRes.json()) as any;
    expect(nameBody.success).toBe(true);
    expect(nameBody.patients.some((p: any) => p.name.includes("Sunita"))).toBe(
      true,
    );
  });

  it("updates patient fields via PUT /api/v1/patients/:id", async () => {
    const updatePayload = {
      address: "Varanasi, Uttar Pradesh",
      bloodGroup: "B+",
    };

    const res = await backendApp.request(
      `/api/v1/patients/${createdPatientId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      },
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.patient).toBeDefined();
    expect(body.patient.address).toBe("Varanasi, Uttar Pradesh");
    expect(body.patient.bloodGroup).toBe("B+");
  });

  it("automatically creates a patient from Encounter registration", async () => {
    const encounterRes = await backendApp.request("/api/v1/intake/encounter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_name: "Rajesh Kumar",
        name: "Rajesh Kumar",
        phone: "+91 9123456789",
        chief_complaint: "Fever and headache",
      }),
    });

    expect(encounterRes.status).toBe(200);
    const encBody = (await encounterRes.json()) as any;
    expect(encBody.success).toBe(true);
    expect(encBody.encounter).toBeDefined();

    // Verify patient is automatically accessible via /api/v1/patients or /api/v1/patients/:id
    const searchRes = await backendApp.request("/api/v1/patients?name=Rajesh");
    expect(searchRes.status).toBe(200);
    const searchBody = (await searchRes.json()) as any;
    expect(searchBody.success).toBe(true);
    expect(
      searchBody.patients.some((p: any) => p.name === "Rajesh Kumar"),
    ).toBe(true);

    if (encBody.encounter.patient_id) {
      const patRes = await backendApp.request(
        `/api/v1/patients/${encBody.encounter.patient_id}`,
      );
      expect(patRes.status).toBe(200);
      const patBody = (await patRes.json()) as any;
      expect(patBody.success).toBe(true);
      expect(patBody.patient.name).toBe("Rajesh Kumar");
    }
  });

  describe("AYUSETU Backend Bridge Operations & Clinical Integration", () => {
    it("intakeRouter.get('/queue') returns active encounters filtered by status and clinic_id", async () => {
      // 1. All queue items
      const resAll = await backendApp.request("/api/v1/intake/queue");
      expect(resAll.status).toBe(200);
      const dataAll = (await resAll.json()) as any;
      expect(dataAll.success).toBe(true);
      expect(Array.isArray(dataAll.queue)).toBe(true);
      expect(dataAll.queue.length).toBeGreaterThanOrEqual(2);

      // 2. Filter by status=STAT_ALERT for Emergency Triage
      const resStat = await backendApp.request(
        "/api/v1/intake/queue?status=STAT_ALERT",
      );
      expect(resStat.status).toBe(200);
      const dataStat = (await resStat.json()) as any;
      expect(dataStat.queue.every((e: any) => e.status === "STAT_ALERT")).toBe(
        true,
      );
      expect(
        dataStat.queue.some((e: any) => e.patient_id === "pat-048291"),
      ).toBe(true);

      // 3. Filter by status=WAITING for Doctor Consultation
      const resWaiting = await backendApp.request(
        "/api/v1/intake/queue?status=WAITING",
      );
      expect(resWaiting.status).toBe(200);
      const dataWaiting = (await resWaiting.json()) as any;
      expect(dataWaiting.queue.every((e: any) => e.status === "WAITING")).toBe(
        true,
      );

      // 4. Filter by clinic_id
      const resClinic = await backendApp.request(
        "/api/v1/intake/queue?clinic_id=clinic-delhi-01",
      );
      expect(resClinic.status).toBe(200);
      const dataClinic = (await resClinic.json()) as any;
      expect(
        dataClinic.queue.every((e: any) => e.clinic_id === "clinic-delhi-01"),
      ).toBe(true);
    });

    it("intakeRouter.patch('/encounter/:id') updates bay, assigned doctor, and consultation status", async () => {
      // 1. Patch encounter to IN_CONSULT with bay assignment
      const patchRes = await backendApp.request(
        "/api/v1/intake/encounter/enc_ramesh_01",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "IN_CONSULT",
            bay: "Emergency Bay 2",
            assigned_doctor: "Dr. Ananya Sharma",
          }),
        },
      );
      expect(patchRes.status).toBe(200);
      const patchData = (await patchRes.json()) as any;
      expect(patchData.success).toBe(true);
      expect(patchData.encounter.status).toBe("IN_CONSULT");
      expect(patchData.encounter.bay).toBe("Emergency Bay 2");
      expect(patchData.encounter.assigned_doctor).toBe("Dr. Ananya Sharma");

      // 2. Transition status via POST /encounter/:id/status
      const statusRes = await backendApp.request(
        "/api/v1/intake/encounter/enc_ramesh_01/status",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "DISPENSED",
          }),
        },
      );
      expect(statusRes.status).toBe(200);
      const statusData = (await statusRes.json()) as any;
      expect(statusData.encounter.status).toBe("DISPENSED");

      // 3. Reset back to STAT_ALERT
      await backendApp.request("/api/v1/intake/encounter/enc_ramesh_01", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "STAT_ALERT", bay: "Emergency Bay 1" }),
      });
    });

    it("opsRouter.post('/pos/sale') updates inventory stock and records balanced double-entry ledger with clinic and prescription linkage", async () => {
      const saleRes = await backendApp.request("/api/v1/ops/pos/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_id: "clinic-delhi-01",
          prescription_id: "#RX-2026-A8921",
          patient_id: "pat-048291",
          items: [
            {
              name: "Aspirin 300mg",
              units: 2,
              pricePaise: 600,
              costPaise: 300,
            },
            {
              name: "Clopidogrel 300mg",
              units: 2,
              pricePaise: 1800,
              costPaise: 900,
            },
          ],
        }),
      });
      expect(saleRes.status).toBe(200);
      const saleData = (await saleRes.json()) as any;
      expect(saleData.status).toBe("completed");
      expect(saleData.clinicId).toBe("clinic-delhi-01");
      expect(saleData.prescriptionId).toBe("#RX-2026-A8921");
      expect(saleData.patientId).toBe("pat-048291");
      expect(saleData.totalPaise).toBe(4800);
      expect(saleData.cogsPaise).toBe(2400);
      expect(saleData.stockUpdated).toBe(true);
      expect(saleData.inventory.clinicId).toBe("clinic-delhi-01");
      expect(saleData.ledger.balanced).toBe(true);
    });

    it("opsRouter.get('/inventory/radar') supports clinic_id and compares live clinic stock vs HQ group inventory", async () => {
      const radarRes = await backendApp.request(
        "/api/v1/ops/inventory/radar?clinic_id=clinic-delhi-01",
      );
      expect(radarRes.status).toBe(200);
      const radarData = (await radarRes.json()) as any;
      expect(radarData.clinicId).toBe("clinic-delhi-01");
      expect(radarData.totalSkus).toBe(120);
      expect(typeof radarData.clinicStockUnits).toBe("number");
      expect(typeof radarData.hqGroupStockUnits).toBe("number");
      expect(radarData.hqGroupStockUnits).toBeGreaterThanOrEqual(
        radarData.clinicStockUnits,
      );
      expect(Array.isArray(radarData.inventoryRadar)).toBe(true);
      expect(radarData.rebalancing).toBeDefined();
    });

    it("opsRouter.get('/ledger/summary') supports clinic_id and org-wide aggregation", async () => {
      // 1. Clinic specific summary
      const clinicRes = await backendApp.request(
        "/api/v1/ops/ledger/summary?clinic_id=clinic-delhi-01",
      );
      expect(clinicRes.status).toBe(200);
      const clinicData = (await clinicRes.json()) as any;
      expect(clinicData.clinicId).toBe("clinic-delhi-01");
      expect(clinicData.scope).toBe("CLINIC_SPECIFIC");
      expect(clinicData.isBalanced).toBe(true);
      expect(clinicData.revenuePaise).toBeGreaterThan(0);
      expect(clinicData.cogsPaise).toBeGreaterThan(0);

      // 2. Org-wide aggregation
      const orgRes = await backendApp.request("/api/v1/ops/ledger/summary");
      expect(orgRes.status).toBe(200);
      const orgData = (await orgRes.json()) as any;
      expect(orgData.scope).toBe("ORG_WIDE");
      expect(orgData.isBalanced).toBe(true);
      expect(orgData.revenuePaise).toBe(12500000);
      expect(orgData.cogsPaise).toBe(8200000);
      expect(orgData.operatingExpensesPaise).toBe(2100000);
      expect(orgData.netProfitPaise).toBe(2200000);
      expect(Array.isArray(orgData.clinicBreakdown)).toBe(true);
    });

    it("prescriptionsRouter.get('/') lists signed prescriptions for clinic dispensing queue", async () => {
      const rxRes = await backendApp.request(
        "/api/v1/prescriptions?clinic_id=clinic-delhi-01&status=SIGNED",
      );
      expect(rxRes.status).toBe(200);
      const rxData = (await rxRes.json()) as any;
      expect(rxData.success).toBe(true);
      expect(Array.isArray(rxData.prescriptions)).toBe(true);
      expect(rxData.count).toBeGreaterThanOrEqual(1);
      expect(
        rxData.prescriptions.some((r: any) => r.patientId === "pat-048291"),
      ).toBe(true);
      expect(rxData.prescriptions[0].medicines.length).toBeGreaterThan(0);
    });
  });
});
