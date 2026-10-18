import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const result = spawnSync(
  process.execPath,
  [
    resolve("node_modules/wrangler/bin/wrangler.js"),
    "deploy",
    "--config",
    "backend/wrangler.jsonc",
    "--dry-run",
    "--outdir",
    resolve("dist/integration-worker"),
  ],
  { stdio: "inherit", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } },
);
process.exitCode = result.status ?? 1;
