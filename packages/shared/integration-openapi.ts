import { z } from "zod";
import {
  encounterListSchema,
  encounterSchema,
  intakeSchema,
  loginResponseSchema,
  loginSchema,
  principalSchema,
  reviewSchema,
} from "./integration";

const content = (schema: z.ZodType) => ({
  "application/json": { schema: z.toJSONSchema(schema) },
});
const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string(),
  }),
});
function operation(
  summary: string,
  response: z.ZodType,
  request?: z.ZodType,
  secure = true,
  status = "200",
) {
  return {
    summary,
    ...(secure ? { security: [{ bearerAuth: [] }] } : {}),
    ...(request
      ? { requestBody: { required: true, content: content(request) } }
      : {}),
    responses: {
      [status]: { description: "Success", content: content(response) },
      ...Object.fromEntries(
        [400, 401, 403, 404, 409, 413, 422, 429, 503].map((code) => [
          String(code),
          {
            description: "Request denied or unavailable",
            content: content(errorSchema),
          },
        ]),
      ),
    },
  };
}
const id = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};
export const integrationOpenapi = {
  openapi: "3.1.0",
  info: {
    title: "Dhaaga persistent synthetic intake API",
    version: "0.2.0",
    description:
      "Staff-assisted intake and clinician review only. Local development credentials; production login disabled. No live providers, prescription signing or dispensing.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description:
          "Opaque persisted one-hour staff session; no JWT claims accepted from the client",
      },
    },
  },
  paths: {
    "/api/v1/auth/login": {
      post: operation(
        "Synthetic staff login",
        loginResponseSchema,
        loginSchema,
        false,
      ),
    },
    "/api/v1/auth/me": {
      get: operation(
        "Current server-authorized role and clinic",
        principalSchema,
      ),
    },
    "/api/v1/auth/logout": {
      post: operation(
        "Revoke current session",
        z.object({ loggedOut: z.literal(true) }),
      ),
    },
    "/api/v1/encounters": {
      get: operation(
        "Latest 100 consented encounters in the staff clinic",
        encounterListSchema,
      ),
      post: {
        ...operation(
          "Create consented intake atomically",
          encounterSchema,
          intakeSchema,
          true,
          "201",
        ),
        parameters: [
          {
            name: "Idempotency-Key",
            in: "header",
            required: true,
            schema: { type: "string", format: "uuid" },
            description:
              "Reuse with the same payload for safe retry; replay returns 200",
          },
        ],
      },
    },
    "/api/v1/encounters/{id}": {
      parameters: [id],
      get: operation(
        "Read a consented encounter in the staff clinic",
        encounterSchema,
      ),
    },
    "/api/v1/encounters/{id}/review": {
      parameters: [id],
      post: operation(
        "Doctor-only routine review; cannot downgrade emergency",
        z.object({ reviewed: z.literal(true) }),
        reviewSchema,
      ),
    },
    "/api/v1/encounters/{id}/revoke": {
      parameters: [id],
      post: operation(
        "Staff records withdrawal of care consent",
        z.object({ revoked: z.literal(true) }),
      ),
    },
  },
};
