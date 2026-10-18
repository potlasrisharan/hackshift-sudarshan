import { createRequire } from "node:module";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { cbcAssets } from "../../scripts/cbc-assets";

// Resolve CSS tooling from the root package so clean Pages installs need no nested install.
const require = createRequire(import.meta.url);
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

export default defineConfig({
  plugins: [cbcAssets()],
  root: "apps/web",
  resolve: {
    alias: { "@": resolve("frontend/website/src") },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: resolve("frontend/website/tailwind.config.js"),
          content: [
            resolve("frontend/website/src/**/*.{ts,tsx}"),
            resolve("frontend/website/erp.html"),
          ],
        }),
        autoprefixer(),
      ],
    },
  },
  esbuild: { jsx: "automatic" },
  build: {
    outDir: "../../dist/web",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve("apps/web/index.html"),
        erp: resolve("apps/web/erp.html"),
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8787",
      "/healthz": "http://127.0.0.1:8787",
    },
  },
});
