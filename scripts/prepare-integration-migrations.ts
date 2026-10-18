import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// Same explicit schema family as backend/local/migrate.ts; never mix the operational schema.
const destination = resolve(".local/integration-migrations");
mkdirSync(destination, { recursive: true });
for (const name of [
  "0001_intake.sql",
  "0002_pharmacy.sql",
  "0002_ayusetu_her.sql",
  "0003_ayusetu_vitalis.sql",
])
  copyFileSync(`backend/migrations/${name}`, `${destination}/${name}`);
copyFileSync(
  "backend/cbc-migrations/0006_cbc.sql",
  `${destination}/0006_cbc.sql`,
);
console.log("Prepared the canonical clinical migration set (including CBC).");
