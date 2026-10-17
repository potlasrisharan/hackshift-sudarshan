import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { z } from "zod";
import { sourceSummary } from "../../packages/ai/gateway";
import {
  driftRadar,
  rxToShelf,
  sentinel,
  threadPulse,
} from "../../packages/engine";
import {
  fhirBundle,
  type Observation,
  observationSchema,
} from "../../packages/shared/contracts";
import { demoPlan, demoReadings, demoRecord } from "../../packages/shared/demo";
import { openapi } from "../../packages/shared/openapi";
import { speechGateway } from "../../services/lang-gateway";

type Audit = {
  sequence: number;
  action: string;
  at: string;
  previousHash: string;
  hash: string;
};
type Session = {
  patient: ReturnType<typeof demoRecord>["patient"];
  observations: Observation[];
  consent: boolean;
  audit: Audit[];
  expires: number;
};
const consentSchema = z.object({ granted: z.boolean() });
const readingSchema = observationSchema.omit({ patientId: true });
const algorithmSchema = z.enum([
  "sentinel",
  "rx-to-shelf",
  "drift-radar",
  "threadpulse",
]);
const functions = {
  sentinel,
  "rx-to-shelf": rxToShelf,
  "drift-radar": driftRadar,
  threadpulse: threadPulse,
};

export function createApp(
  options: {
    speechKey?: string;
    speechEnabled?: boolean;
    trustedProxy?: boolean;
  } = {},
) {
  const speech = speechGateway({
    key: options.speechKey,
    enabled: options.speechEnabled,
  });
  const sessions = new Map<string, Session>();
  const rate = new Map<string, { count: number; until: number }>();
  let nextCleanup = 0;
  const app = new Hono<{
    Variables: { requestId: string; session: Session };
  }>();
  app.use(
    "*",
    secureHeaders({
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
      referrerPolicy: "no-referrer",
    }),
  );
  app.use("*", async (c, next) => {
    const id = crypto.randomUUID();
    c.set("requestId", id);
    c.header("X-Request-Id", id);
    if (c.req.path.startsWith("/api")) c.header("Cache-Control", "no-store");
    const origin = c.req.header("origin");
    const reqOrigin = requestOrigin(c.req.raw, options.trustedProxy ?? false);
    const isAllowedOrigin = Boolean(
      origin &&
        (origin === reqOrigin ||
          origin.endsWith(".pages.dev") ||
          origin.includes("localhost") ||
          origin.includes("127.0.0.1")),
    );
    if (origin && isAllowedOrigin) {
      c.header("Access-Control-Allow-Origin", origin);
      c.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
      c.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Request-Id",
      );
    }
    if (c.req.method === "OPTIONS") {
      return c.body(null, 204);
    }
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      if (origin && !isAllowedOrigin)
        throw new HTTPException(403, {
          message: "Cross-origin writes are disabled",
        });
      if (Number(c.req.header("content-length") ?? 0) > 100000)
        throw new HTTPException(413, { message: "Request too large" });
    }
    const now = Date.now();
    if (now > nextCleanup) {
      for (const [k, v] of sessions) if (v.expires < now) sessions.delete(k);
      for (const [k, v] of rate) if (v.until < now) rate.delete(k);
      nextCleanup = now + 60000;
    }
    await next();
  });
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
          code: status === 422 ? "VALIDATION_ERROR" : `HTTP_${status}`,
          message: status === 500 ? "Internal error" : error.message,
          requestId: c.get("requestId"),
        },
      },
      status,
    );
  });
  app.get("/openapi.json", (c) => c.json(openapi));
  app.get("/docs", (c) =>
    c.html(
      '<!doctype html><html lang="en"><meta charset="utf-8"><title>AYUSETU API</title><h1>AYUSETU API v1</h1><p>Synthetic demonstration only.</p><p><a href="/openapi.json">OpenAPI 3.1 specification</a></p><p>POST /api/v1/demo/session returns an opaque token. Supply Authorization: Bearer TOKEN, grant /api/v1/consent, then access records and algorithms.</p></html>',
    ),
  );
  app.get("/healthz", (c) =>
    c.json({
      status: "ok",
      mode: "synthetic-demo",
      externalClinicalAI: false,
      speechConfigured: speech.stats().configured,
      persistentStorage: false,
    }),
  );
  app.get("/api/v1/capabilities", (c) =>
    c.json({
      demo: true,
      liveUpstreams: false,
      sarvam: speech.stats().configured ? "configured-unverified" : false,
      cognee: false,
      healthConnect: false,
      healthKit: false,
      ble: "simulator",
      rawPhiAllowed: false,
    }),
  );
  app.post("/api/v1/demo/session", async (c) => {
    // Public demo sessions expose only independent synthetic fixtures. No staff impersonation.
    const bucket = rate.get("sessions") ?? {
      count: 0,
      until: Date.now() + 60000,
    };
    if (bucket.until < Date.now()) {
      bucket.count = 0;
      bucket.until = Date.now() + 60000;
    }
    if (++bucket.count > 30 || sessions.size >= 500)
      throw new HTTPException(429, {
        message: "Demo capacity reached; retry later",
      });
    rate.set("sessions", bucket);
    const token = crypto.randomUUID() + crypto.randomUUID();
    const record = demoRecord();
    sessions.set(token, {
      ...record,
      consent: false,
      audit: [],
      expires: Date.now() + 3600000,
    });
    return c.json(
      { token, expiresIn: 3600, patientId: record.patient.id, demo: true },
      201,
    );
  });
  app.use("/api/v1/*", async (c, next) => {
    if (c.req.path === "/api/v1/capabilities") return next();
    const token = c.req.header("Authorization")?.replace(/^Bearer /, "") ?? "";
    const session = sessions.get(token);
    if (!session || session.expires < Date.now())
      throw new HTTPException(401, { message: "Start a new demo session" });
    const b = rate.get(token) ?? { count: 0, until: Date.now() + 60000 };
    if (b.until < Date.now()) {
      b.count = 0;
      b.until = Date.now() + 60000;
    }
    rate.set(token, b);
    if (++b.count > 120)
      throw new HTTPException(429, { message: "Rate limit reached" });
    c.set("session", session);
    await next();
  });
  async function audit(s: Session, action: string) {
    // Hash chain writes are serialized by this per-session promise queue below.
    const previousHash = s.audit.at(-1)?.hash ?? "0";
    const at = new Date().toISOString();
    const sequence = s.audit.length + 1;
    const hash = await digest(
      JSON.stringify({ sequence, action, at, previousHash }),
    );
    s.audit.push({ sequence, action, at, previousHash, hash });
  }
  const queues = new WeakMap<Session, Promise<void>>();
  async function append(s: Session, action: string) {
    const task = (queues.get(s) ?? Promise.resolve()).then(() =>
      audit(s, action),
    );
    queues.set(
      s,
      task.catch(() => {}),
    );
    await task;
  }
  async function read(c: { get: (key: "session") => Session }, action: string) {
    const s = c.get("session");
    if (!s.consent)
      throw new HTTPException(403, {
        message: "Grant local demo processing consent first",
      });
    await append(s, action);
    return s;
  }
  app.post("/api/v1/consent", async (c) => {
    const input = consentSchema.parse(await body(c.req.raw));
    const s = c.get("session");
    s.consent = input.granted;
    await append(s, input.granted ? "consent.granted" : "consent.revoked");
    return c.json({
      granted: s.consent,
      purpose: "local-demo-processing",
      externalSharing: false,
    });
  });
  app.get("/api/v1/record", async (c) => {
    const s = await read(c, "record.read");
    return c.json({
      patient: s.patient,
      observations: s.observations,
      demo: true,
    });
  });
  app.get("/api/v1/record/fhir", async (c) => {
    const s = await read(c, "record.export");
    return c.json(fhirBundle(s.patient, s.observations));
  });
  app.post("/api/v1/lang/welcome", async (c) => {
    await read(c, "speech.welcome");
    return c.json(await speech.welcome(await body(c.req.raw)));
  });
  app.get("/api/v1/summary", async (c) => {
    const s = await read(c, "summary.read");
    return c.json(
      sourceSummary(
        s.observations.map((o) => ({
          id: o.id,
          text: `${o.code}: ${o.value} ${o.unit}, recorded ${o.sampledAt}; source ${o.source}`,
        })),
      ),
    );
  });
  app.post("/api/v1/observations", async (c) => {
    const s = await read(c, "observation.ingest");
    const r = readingSchema.parse(await body(c.req.raw));
    if (r.source !== "ble-simulator" && r.source !== "manual")
      throw new HTTPException(403, {
        message: "Upstream source provenance cannot be assigned by a patient",
      });
    const codeUnits = {
      "8480-6": "mm[Hg]",
      "8867-4": "/min",
      "59408-5": "%",
      "41950-7": "{steps}",
    };
    if (codeUnits[r.code] !== r.unit)
      throw new HTTPException(422, { message: "Code and unit mismatch" });
    const bounds = {
      "8480-6": [60, 250],
      "8867-4": [25, 240],
      "59408-5": [50, 100],
      "41950-7": [0, 100000],
    };
    const [lo, hi] = bounds[r.code];
    if (
      r.value < (lo ?? 0) ||
      r.value > (hi ?? 0) ||
      new Date(r.sampledAt).getTime() > Date.now() + 300000
    )
      throw new HTTPException(422, {
        message: "Implausible value or future timestamp; confirm measurement",
      });
    if (s.observations.length >= 1000)
      throw new HTTPException(413, { message: "Demo record full" });
    const existing = s.observations.find((o) => o.id === r.id);
    if (
      existing &&
      JSON.stringify({ ...existing, patientId: undefined }) !==
        JSON.stringify({ ...r, patientId: undefined })
    )
      throw new HTTPException(409, {
        message: "Duplicate ID with conflicting measurement",
      });
    if (!existing) s.observations.push({ ...r, patientId: s.patient.id });
    return c.json({ accepted: true, duplicate: !!existing }, 201);
  });
  app.get("/api/v1/demo/scenario", async (c) => {
    await read(c, "scenario.read");
    return c.json({
      plan: demoPlan(),
      readings: demoReadings,
      probabilities: [0.9, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.8, 0.9, 0.7],
      stock: 5,
    });
  });
  app.post("/api/v1/algorithms/:name", async (c) => {
    await read(c, "algorithm.run");
    const name = algorithmSchema.parse(c.req.param("name"));
    return c.json(functions[name](await body(c.req.raw)));
  });
  app.get("/api/v1/privacy", async (c) => {
    const s = c.get("session");
    return c.json({
      demo: true,
      storage: "Server process memory; synthetic data only",
      expiresAt: new Date(s.expires).toISOString(),
      consent: s.consent,
      externalAIEnabled: speech.stats().configured,
      externalAIRequests: speech.stats().requests,
      networkMonitor:
        "Not implemented; this counter covers configured AI providers only",
      cognee: "Not connected",
      audit: s.audit,
      observationCount: s.observations.length,
    });
  });
  app.get("/api/v1/audit/verify", async (c) => {
    const s = c.get("session");
    let previous = "0";
    let valid = true;
    for (const a of s.audit) {
      const hash = await digest(
        JSON.stringify({
          sequence: a.sequence,
          action: a.action,
          at: a.at,
          previousHash: a.previousHash,
        }),
      );
      if (hash !== a.hash || a.previousHash !== previous) valid = false;
      previous = a.hash;
    }
    return c.json({
      valid,
      entries: s.audit.length,
      scope: "Tamper-evident in-memory chain; not immutable storage",
    });
  });
  app.delete("/api/v1/record", async (c) => {
    const s = c.get("session");
    s.observations = [];
    s.consent = false;
    await append(s, "record.deleted");
    return c.json({
      deleted: true,
      scope:
        "Session observations; synthetic fixture identity and non-PHI audit retained until session expiry",
    });
  });
  app.notFound((c) =>
    c.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Route not found",
          requestId: c.get("requestId"),
        },
      },
      404,
    ),
  );
  return app;
}
async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
async function body(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new HTTPException(400, { message: "JSON body required" });
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 100000) {
      await reader.cancel();
      throw new HTTPException(413, { message: "Request too large" });
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new HTTPException(400, { message: "Invalid JSON" });
  }
}

function requestOrigin(request: Request, trustedProxy: boolean): string {
  const url = new URL(request.url);
  const protocol = request.headers.get("cloudfront-forwarded-proto");
  return trustedProxy && (protocol === "https" || protocol === "http")
    ? `${protocol}://${url.host}`
    : url.origin;
}
