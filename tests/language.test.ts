import { expect, it } from "vitest";
import { speechGateway } from "../services/lang-gateway";

it("missing credentials returns a truthful text fallback", async () => {
  const gateway = speechGateway();
  expect((await gateway.welcome({ language: "hi-IN" })).source).toBe(
    "fallback",
  );
  expect(gateway.stats().requests).toBe(0);
});
it("sends only allowlisted nonclinical text and caches audio", async () => {
  let sent = "";
  const gateway = speechGateway({
    enabled: true,
    key: "synthetic-test-key",
    transport: async (_url, options) => {
      sent = String(options?.body);
      return Response.json({ audios: ["UklGRg=="] });
    },
  });
  expect((await gateway.welcome({ language: "hi-IN" })).source).toBe("sarvam");
  expect((await gateway.welcome({ language: "hi-IN" })).source).toBe("cache");
  expect(gateway.stats().requests).toBe(1);
  expect(sent).toContain("हर दिन");
  expect(sent).not.toContain("Sunita");
});
it("rejects unknown language IDs", async () => {
  await expect(
    speechGateway().welcome({ language: "unknown" }),
  ).rejects.toThrow();
});
it("enforces local request budget", async () => {
  const gateway = speechGateway({
    enabled: true,
    key: "synthetic",
    maxCalls: 0,
  });
  expect((await gateway.welcome({ language: "en-IN" })).warning).toContain(
    "budget",
  );
  expect(gateway.stats().requests).toBe(0);
});
it("handles rejected credentials without leaking provider details", async () => {
  const gateway = speechGateway({
    enabled: true,
    key: "synthetic",
    transport: async () =>
      new Response("sensitive provider response", { status: 403 }),
  });
  const result = await gateway.welcome({ language: "en-IN" });
  expect(result.source).toBe("fallback");
  expect(JSON.stringify(result)).not.toContain("sensitive provider response");
});
