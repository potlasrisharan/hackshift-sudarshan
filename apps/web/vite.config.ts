import { defineConfig } from "vite";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const tailwindcss = require(resolve("frontend/website/node_modules/tailwindcss"));
const autoprefixer = require(resolve("frontend/website/node_modules/autoprefixer"));
export default defineConfig({
 root:"apps/web",
 resolve:{alias:{"@":resolve("frontend/website/src")}},
 css:{postcss:{plugins:[tailwindcss({config:resolve("frontend/website/tailwind.config.js"),content:[resolve("frontend/website/src/**/*.{ts,tsx}"),resolve("frontend/website/erp.html")]}),autoprefixer()]}},
 esbuild:{jsx:"automatic"},
 build:{outDir:"../../dist/web",emptyOutDir:true,rollupOptions:{input:{index:resolve("apps/web/index.html"),erp:resolve("apps/web/erp.html")}}},
 server:{proxy:{"/api":"http://127.0.0.1:8787","/healthz":"http://127.0.0.1:8787"}}
});
