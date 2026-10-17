import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/integration-browser",
  use: { baseURL: "http://127.0.0.1:8790", ...devices["Desktop Chrome"] },
  webServer: { env: { INTEGRATION_DB: `.local/integration-e2e-${process.pid}.sqlite` }, command: "npm run integration:dev", url: "http://127.0.0.1:8790/healthz", reuseExistingServer: process.env.REUSE_SERVER === "1", timeout: 30000 },
  reporter: "list",
});
