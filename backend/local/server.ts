import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { createIntegrationApp } from "../src/index";
import { LocalDatabase } from "./database";
import { migrateLocal } from "./migrate";
import { seedDemo } from "./seed";

mkdirSync(".local", { recursive: true });
const db = new LocalDatabase(
  resolve(process.env.INTEGRATION_DB ?? ".local/integration.sqlite"),
);
migrateLocal(db);
await seedDemo(db);
const assets = new Hono();
assets.use("*", serveStatic({ root: "dist/integration" }));
assets.get("*", serveStatic({ path: "dist/integration/index.html" }));
const app = createIntegrationApp();
// The unified Worker serves assets itself; the standalone local server needs
// the same fallback after the clinical API routes have been registered.
app.get("*", (c) => {
  if (c.req.path.startsWith("/api/") || !c.env.ASSETS) return c.notFound();
  return c.env.ASSETS.fetch(c.req.raw);
});
const integrationPort = Number(process.env.INTEGRATION_PORT ?? 8790);
serve(
  {
    fetch: (request) =>
      app.fetch(request, {
        DB: db,
        ENVIRONMENT: "development",
        ASSETS: { fetch: (req) => Promise.resolve(assets.fetch(req)) },
      }),
    hostname: "127.0.0.1",
    port: integrationPort,
  },
  () => {
    console.log(
      `DHAAGA integration: http://127.0.0.1:${integrationPort} (synthetic data only; persistent local SQLite)`,
    );
  },
);
