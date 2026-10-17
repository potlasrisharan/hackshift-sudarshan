import { Hono } from "hono";
import { cors } from "hono/cors";
import { intakeRouter } from "./modules/intake/routes";
import { opsRouter } from "./modules/ops/routes";
import { bridgeRouter } from "./modules/bridge/routes";
import { homeRouter } from "./modules/home/routes";
import { platformRouter } from "./modules/platform/routes";

// Export Durable Objects for Cloudflare runtime binding
export { ClinicInventory } from "./do/ClinicInventory";
export { ClinicHub } from "./do/ClinicHub";
export { TriageSession } from "./do/TriageSession";
export { OrgAudit } from "./do/OrgAudit";

export type Env = {
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
  CLINIC_INVENTORY: DurableObjectNamespace;
  CLINIC_HUB: DurableObjectNamespace;
  TRIAGE_SESSION: DurableObjectNamespace;
  ORG_AUDIT: DurableObjectNamespace;
  ENVIRONMENT: string;
  API_VERSION: string;
};

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for both Web (port 3000/5173) and Mobile App requests
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Tenant-Id"]
  })
);

// Liveness check
app.get("/healthz", (c) => {
  return c.json({
    status: "ok",
    service: "dhaaga-backend",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Mount module routers under /api/v1
const v1 = new Hono<{ Bindings: Env }>();
v1.route("/intake", intakeRouter);
v1.route("/ops", opsRouter);
v1.route("/bridge", bridgeRouter);
v1.route("/home", homeRouter);
v1.route("/platform", platformRouter);

app.route("/api/v1", v1);

export default app;
