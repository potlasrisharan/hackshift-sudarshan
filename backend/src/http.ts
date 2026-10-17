import { HTTPException } from "hono/http-exception";
export async function jsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HTTPException(400, { message: "Invalid JSON" });
  }
}
