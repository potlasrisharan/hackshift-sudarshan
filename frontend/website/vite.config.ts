import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);
const tailwindcss = require(resolve(__dirname, "node_modules/tailwindcss"));
const autoprefixer = require(resolve(__dirname, "node_modules/autoprefixer"));

export default defineConfig({
  root: __dirname,
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: resolve(__dirname, "tailwind.config.js"),
          content: [resolve(__dirname, "src/**/*.{ts,tsx}")],
        }),
        autoprefixer(),
      ],
    },
  },
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  build: {
    outDir: resolve(__dirname, "../../dist/integration"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        erp: resolve(__dirname, "erp.html"),
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://127.0.0.1:8790",
      "/healthz": "http://127.0.0.1:8790",
    },
  },
});
