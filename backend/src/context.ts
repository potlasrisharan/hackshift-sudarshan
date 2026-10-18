import type { Principal } from "../../packages/shared/integration";
import type { Database } from "./database";
export type Env = {
  DB: Database;
  ENVIRONMENT: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
  CBC_DOCUMENTS?: R2Bucket;
  CBC_ENABLED?: string;
  CBC_INFERENCE_ENABLED?: string;
  CBC_MAINTENANCE_ORGS?: string;
};
export type IntegrationContext = {
  Bindings: Env;
  Variables: { principal: Principal; requestId: string; cbcSourceAvailable?: boolean };
};
