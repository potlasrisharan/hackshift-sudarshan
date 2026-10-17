import { z } from "zod";
import {
  encounterListSchema,
  encounterSchema,
  intakeSchema,
  loginResponseSchema,
  loginSchema,
  principalSchema,
} from "../shared/integration";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export function integrationClient(token = "", transport: typeof fetch = fetch) {
  async function request(
    path: string,
    method = "GET",
    body?: unknown,
    key?: string,
  ): Promise<unknown> {
    const response = await transport(`/api/v1${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        ...(key ? { "Idempotency-Key": key } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data: unknown = await response.json();
    if (!response.ok) {
      const error = z
        .object({ error: z.object({ message: z.string() }) })
        .safeParse(data);
      throw new ApiError(
        error.success
          ? error.data.error.message
          : `Request failed (${response.status})`,
        response.status,
      );
    }
    return data;
  }
  return {
    login: async (input: z.infer<typeof loginSchema>) =>
      loginResponseSchema.parse(
        await request("/auth/login", "POST", loginSchema.parse(input)),
      ),
    me: async () => principalSchema.parse(await request("/auth/me")),
    logout: () => request("/auth/logout", "POST"),
    encounters: async () =>
      encounterListSchema.parse(await request("/encounters")),
    encounter: async (id: string) =>
      encounterSchema.parse(
        await request(`/encounters/${encodeURIComponent(id)}`),
      ),
    intake: async (input: z.infer<typeof intakeSchema>, key: string) =>
      encounterSchema.parse(
        await request("/encounters", "POST", intakeSchema.parse(input), key),
      ),
    review: (id: string, note: string) =>
      request(`/encounters/${encodeURIComponent(id)}/review`, "POST", { note }),
    revoke: (id: string) =>
      request(`/encounters/${encodeURIComponent(id)}/revoke`, "POST"),
  };
}
