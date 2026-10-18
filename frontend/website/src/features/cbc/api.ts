import { z } from "zod";
import {
  type CbcMeasurement,
  cbcCapabilitiesSchema,
  cbcListSchema,
  cbcReportSchema,
} from "../../../../../packages/shared/cbc_contracts";
import {
  encounterListSchema,
  loginResponseSchema,
  principalSchema,
} from "../../../../../packages/shared/integration";
import { CLOUDFLARE_API_BASE } from "../../lib/supabase";

export type DoctorSession = z.infer<typeof loginResponseSchema>;
export const sessionKey = "ayusetu.cbc.doctor-session.v1";
function expireCurrentSession(token?: string) {
  if (!token) return;
  try {
    const raw = sessionStorage.getItem(sessionKey);
    const current = raw
      ? z.object({ token: z.string() }).parse(JSON.parse(raw))
      : null;
    if (current?.token === token) {
      sessionStorage.removeItem(sessionKey);
      window.dispatchEvent(new Event("cbc-session-expired"));
    }
  } catch {
    sessionStorage.removeItem(sessionKey);
  }
}
export async function call<T>(
  path: string,
  schema: { parse(value: unknown): T },
  token?: string,
  method = "GET",
  body?: unknown,
  signal?: AbortSignal,
  key?: string,
): Promise<T> {
  const response = await fetch(`${CLOUDFLARE_API_BASE}${path}`, {
    method,
    signal,
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body === undefined
        ? {}
        : {
            "Content-Type": "application/json",
            "Idempotency-Key": key ?? crypto.randomUUID(),
          }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      expireCurrentSession(token);
    }
    const message =
      response.status === 401
        ? "Clinical session expired. Connect again."
        : response.status === 403
          ? "Doctor access or processing permission required."
          : response.status === 404
            ? "Authorized consented report or encounter not found."
            : response.status === 409
              ? "This report changed. Reload before continuing."
              : response.status === 422
                ? "Check all five values, units and differential total."
                : response.status === 429
                  ? "Request limit reached. Retry in a minute."
                  : "CBC service unavailable. Your consultation notes are unchanged.";
    throw new Error(message);
  }
  return schema.parse(await response.json());
}
export const cbcApi = {
  capabilities: () => call("/cbc/capabilities", cbcCapabilitiesSchema),
  login: (orgId: string, email: string, password: string) =>
    call("/auth/login", loginResponseSchema, undefined, "POST", {
      orgId,
      email,
      password,
    }),
  me: (token: string) => call("/auth/me", principalSchema, token),
  encounters: (token: string) =>
    call("/encounters", encounterListSchema, token),
  list: (
    token: string,
    encounterId: string,
    signal?: AbortSignal,
    cursor?: string,
  ) =>
    call(
      `/cbc/reports?encounterId=${encodeURIComponent(encounterId)}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      cbcListSchema,
      token,
      "GET",
      undefined,
      signal,
    ),
  create: (
    token: string,
    encounterId: string,
    researchConsent: boolean,
    key: string,
  ) =>
    call(
      "/cbc/reports",
      cbcReportSchema,
      token,
      "POST",
      { encounterId, processingConsent: true, researchConsent },
      undefined,
      key,
    ),
  confirm: (
    token: string,
    id: string,
    expectedRevision: number,
    measurements: CbcMeasurement[],
    collectionDate: string | null,
    key: string,
  ) =>
    call(
      `/cbc/reports/${id}/confirm`,
      cbcReportSchema,
      token,
      "POST",
      { expectedRevision, measurements, collectionDate, panelReviewed: true },
      undefined,
      key,
    ),
  predict: (token: string, id: string, revision: number) =>
    call(`/cbc/reports/${id}/predict`, cbcReportSchema, token, "POST", {
      revision,
    }),
  remove: (token: string, id: string) =>
    call(
      `/cbc/reports/${id}`,
      z.object({
        deleted: z.boolean(),
        sourceCleanupPending: z.boolean().optional(),
      }),
      token,
      "DELETE",
    ),
  async retain(token: string, id: string, file: File, mime: string) {
    const res = await fetch(
      `${CLOUDFLARE_API_BASE}/cbc/reports/${id}/document`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": mime,
          "X-Source-Retention-Consent": "true",
        },
        body: file,
      },
    );
    if (!res.ok)
      throw new Error(
        "Original file was not retained. Retry or save measurements without the original.",
      );
    return cbcReportSchema.parse(await res.json());
  },
  async source(token: string, id: string) {
    const res = await fetch(
      `${CLOUDFLARE_API_BASE}/cbc/reports/${id}/document`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok)
      throw new Error("Original source is unavailable or access was revoked.");
    return res.blob();
  },
};
