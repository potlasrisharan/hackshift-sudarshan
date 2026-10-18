import { defineConfig, devices } from "@playwright/test";
const databasePath = process.env.CBC_E2E_DB ?? `.local/cbc-e2e-${process.pid}.sqlite`;
process.env.CBC_E2E_DB = databasePath;
export default defineConfig({
  testDir: "tests/cbc-browser", timeout: 90000, workers: 1,
  use: { baseURL: "http://127.0.0.1:8791", ...devices["Desktop Chrome"], trace: "retain-on-failure" },
  webServer: {
    command: "node --import tsx backend/local/server.ts",
    env: { INTEGRATION_PORT: "8791", INTEGRATION_DB: databasePath },
    url: "http://127.0.0.1:8791/healthz", timeout: 30000, reuseExistingServer: false,
  },
});
