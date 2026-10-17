import type { Principal } from "../../packages/shared/integration";
import type { Database } from "./database";
export type Env = {
  DB: Database;
  ENVIRONMENT: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
};
export type IntegrationContext = {
  Bindings: Env;
  Variables: { principal: Principal; requestId: string };
};
