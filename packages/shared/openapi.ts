import { z } from "zod";
import {
  demandInputSchema,
  driftInputSchema,
  observationSchema,
  planInputSchema,
  sentinelInputSchema,
} from "./contracts";

const json = (schema: z.ZodType) => ({
  "application/json": { schema: z.toJSONSchema(schema) },
});
const operation = (summary: string, schema?: z.ZodType, secure = true) => ({
  summary,
  ...(secure ? { security: [{ bearerAuth: [] }] } : {}),
  ...(schema ? { requestBody: { required: true, content: json(schema) } } : {}),
  responses: {
    "200": { description: "Success" },
    "401": { description: "Missing or expired session" },
    "403": { description: "Consent or provenance denied" },
    "422": { description: "Schema validation failure" },
  },
});
export const openapi = {
  openapi: "3.1.0",
  info: {
    title: "Dhaaga synthetic integration API",
    version: "0.1.0",
    description:
      "Synthetic fixtures only. Live upstream identity, persistence and providers are pending.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "Ephemeral opaque synthetic-demo token",
      },
    },
  },
  paths: {
    "/healthz": { get: operation("Runtime readiness", undefined, false) },
    "/api/v1/capabilities": {
      get: operation("Truthful integration capabilities", undefined, false),
    },
    "/api/v1/demo/session": {
      post: {
        ...operation("Create isolated synthetic session", undefined, false),
        responses: {
          "201": { description: "Token; expiresIn 3600 seconds" },
          "429": { description: "Rate limit" },
        },
      },
    },
    "/api/v1/consent": {
      post: operation(
        "Grant/revoke local processing",
        z.object({ granted: z.boolean() }),
      ),
    },
    "/api/v1/record": {
      get: operation("Merged synthetic longitudinal record"),
      delete: operation("Delete session observations and revoke consent"),
    },
    "/api/v1/record/fhir": {
      get: operation("Export FHIR R4 aligned collection"),
    },
    "/api/v1/summary": {
      get: operation("Local source-cited template summary"),
    },
    "/api/v1/observations": {
      post: operation(
        "Validate and dedupe manual/simulated reading",
        observationSchema.omit({ patientId: true }),
      ),
    },
    "/api/v1/algorithms/sentinel": {
      post: operation(
        "Synthetic Bayesian question selection",
        sentinelInputSchema,
      ),
    },
    "/api/v1/algorithms/rx-to-shelf": {
      post: operation(
        "Exact course-valid equivalent stock allocation",
        planInputSchema,
      ),
    },
    "/api/v1/algorithms/drift-radar": {
      post: operation("Robust baseline CUSUM", driftInputSchema),
    },
    "/api/v1/algorithms/threadpulse": {
      post: operation("Exact independent refill demand", demandInputSchema),
    },
    "/api/v1/privacy": { get: operation("Storage and provider status") },
    "/api/v1/audit/verify": {
      get: operation("Recompute per-session tamper-evident chain"),
    },
  },
};
