import { z } from "zod";
import { observationSchema, patientSchema } from "../shared/contracts";

const recordSchema = z.object({
  patient: patientSchema,
  observations: z.array(observationSchema),
});
/** Same contract for web/mobile; token stays in the caller's secure session. */
export function client(
  baseUrl: string,
  token: string,
  transport: typeof fetch = fetch,
) {
  async function request(path: string, method = "GET", body?: unknown) {
    const response = await transport(`${baseUrl}/api/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok)
      throw new Error(`API request failed (${response.status})`);
    return response.json() as Promise<unknown>;
  }
  return {
    record: async () => recordSchema.parse(await request("/record")),
    consent: async (granted: boolean) =>
      z
        .object({ granted: z.boolean() })
        .parse(await request("/consent", "POST", { granted })),
    deleteRecord: () => request("/record", "DELETE"),
  };
}
