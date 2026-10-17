import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/app";
import { demoPlan } from "../packages/shared/demo";
import backendApp from "../backend/src/index";

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
    const data = (await res.json()) as { patient_id: string; abha_number: string; name: string };
    expect(data.patient_id).toBe("pat-048291");
    expect(data.abha_number).toBe("91-4829-1029-4821");
    expect(data.name).toBe("Ramesh Chandra");
  });

  it("checks PM-JAY coverage eligibility for Flutter App", async () => {
    const res = await backendApp.request("/api/v1/insurance/coverage-eligibility/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abha_number: "91-4829-1029-4821", patient_id: "pat-048291" }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { eligible: boolean; scheme_name: string; coverage_amount_inr: number };
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
    const normalData = (await normalRes.json()) as { red_flag: { is_triggered: boolean } };
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
    expect(redFlagData.red_flag.trigger_symptoms).toContain("chest pain");
    expect(redFlagData.reply_text).toContain("EMERGENCY ALERT");
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
    const sessRes = await backendApp.request("/api/v1/demo/session", { method: "POST" });
    expect(sessRes.status).toBe(201);
    const { token } = (await sessRes.json()) as { token: string };
    const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // Consent
    const consentRes = await backendApp.request("/api/v1/consent", {
      method: "POST",
      headers: h,
      body: JSON.stringify({ granted: true }),
    });
    expect(consentRes.status).toBe(200);

    // Record
    const recordRes = await backendApp.request("/api/v1/record", { headers: h });
    expect(recordRes.status).toBe(200);

    // FHIR
    const fhirRes = await backendApp.request("/api/v1/record/fhir", { headers: h });
    expect(fhirRes.status).toBe(200);

    // Summary
    const summaryRes = await backendApp.request("/api/v1/summary", { headers: h });
    expect(summaryRes.status).toBe(200);

    // Audit verify
    const auditRes = await backendApp.request("/api/v1/audit/verify", { headers: h });
    expect(auditRes.status).toBe(200);
    const auditData = (await auditRes.json()) as { valid: boolean };
    expect(auditData.valid).toBe(true);
  });
});

