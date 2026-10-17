import { defineConfig } from "vite";
export default defineConfig({
  root: "frontend/website",
  esbuild: { jsx: "automatic" },
  build: { outDir: "../../dist/integration", emptyOutDir: true },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://127.0.0.1:8790",
      "/healthz": "http://127.0.0.1:8790",
    },
  },
});
