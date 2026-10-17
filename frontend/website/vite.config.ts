import { defineConfig } from "vite";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const tailwindcss = require(resolve("frontend/website/node_modules/tailwindcss"));
const autoprefixer = require(resolve("frontend/website/node_modules/autoprefixer"));
export default defineConfig({
  root: "frontend/website",
  css: { postcss: { plugins: [tailwindcss({ config: resolve("frontend/website/tailwind.config.js"), content: [resolve("frontend/website/src/**/*.{ts,tsx}")] }), autoprefixer()] } },
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": resolve("frontend/website/src") } },
  build: { outDir: "../../dist/integration", emptyOutDir: true, rollupOptions: { input: { index: resolve("frontend/website/index.html"), erp: resolve("frontend/website/erp.html") } } },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://127.0.0.1:8790",
      "/healthz": "http://127.0.0.1:8790",
    },
  },
});
