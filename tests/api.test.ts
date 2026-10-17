import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/app";
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
