import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/** Package local OCR assets for both existing website builds; no runtime CDN calls. */
export function cbcAssets(): Plugin {
  const root = resolve(import.meta.dirname, "..");
  const assets = new Map<string, string>([
    [
      "worker.min.js",
      resolve(root, "node_modules/tesseract.js/dist/worker.min.js"),
    ],
    [
      "eng.traineddata.gz",
      resolve(
        root,
        "node_modules/@tesseract.js-data/eng/4.0.0/eng.traineddata.gz",
      ),
    ],
    [
      "TESSERACT-LICENSE.txt",
      resolve(root, "node_modules/tesseract.js/LICENSE.md"),
    ],
    [
      "CORE-LICENSE.txt",
      resolve(root, "node_modules/tesseract.js-core/LICENSE"),
    ],
  ]);
  const core = resolve(root, "node_modules/tesseract.js-core");
  for (const file of readdirSync(core))
    if (/^tesseract-core.*\.(js|wasm)$/.test(file))
      assets.set(file, resolve(core, file));
  for (const directory of ["cmaps", "standard_fonts", "wasm"]) {
    const path = resolve(root, "node_modules/pdfjs-dist", directory);
    for (const file of readdirSync(path, { withFileTypes: true })) {
      if (file.isFile())
        assets.set(`pdf/${directory}/${file.name}`, resolve(path, file.name));
    }
  }
  assets.set(
    "PDFJS-LICENSE.txt",
    resolve(root, "node_modules/pdfjs-dist/LICENSE"),
  );
  assets.set(
    "ENGLISH-DATA-README.md",
    resolve(root, "node_modules/@tesseract.js-data/eng/README.md"),
  );
  return {
    name: "cbc-local-ocr-assets",
    generateBundle() {
      for (const [name, path] of assets)
        this.emitFile({
          type: "asset",
          fileName: `cbc-assets/${name}`,
          source: readFileSync(path),
        });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split("?")[0]?.replace(/^\/cbc-assets\//, "");
        if (!req.url?.startsWith("/cbc-assets/") || !name || !assets.has(name))
          return next();
        const path = assets.get(name);
        if (!path) return next();
        res.setHeader(
          "Content-Type",
          name.endsWith(".js")
            ? "text/javascript"
            : name.endsWith(".wasm")
              ? "application/wasm"
              : "application/octet-stream",
        );
        res.end(readFileSync(path));
      });
    },
  };
}
