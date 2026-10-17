import { defineConfig } from "vitest/config";

const supportsNodeSqlite = parseInt(process.versions.node.split(".")[0], 10) >= 22;

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: supportsNodeSqlite ? [] : ["tests/integration.test.ts"],
    environment: "node",
  },
});
