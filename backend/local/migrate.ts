import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { LocalDatabase } from "./database";

/** Split our SQLite migration scripts while retaining complete trigger bodies. */
export function splitSqlScript(sql: string): string[] {
  const statements: string[] = [];
  let start = 0,
    index = 0,
    depth = 0;
  let trigger = false,
    prefix = "";
  while (index < sql.length) {
    const char = sql[index];
    if (char === "'" || char === '"' || char === "`") {
      const quote = char;
      index++;
      while (index < sql.length) {
        if (sql[index] === quote) {
          if (sql[index + 1] === quote) {
            index += 2;
            continue;
          }
          index++;
          break;
        }
        index++;
      }
      continue;
    }
    if (char === "-" && sql[index + 1] === "-") {
      while (index < sql.length && sql[index] !== "\n") index++;
      continue;
    }
    if (char === "/" && sql[index + 1] === "*") {
      const end = sql.indexOf("*/", index + 2);
      if (end < 0) throw new Error("Unclosed migration comment");
      index = end + 2;
      continue;
    }
    if (char && /[a-zA-Z_]/.test(char)) {
      const tokenStart = index++;
      while (index < sql.length && /[a-zA-Z_0-9]/.test(sql[index] ?? ""))
        index++;
      const token = sql.slice(tokenStart, index).toUpperCase();
      if (prefix.length < 100) prefix += `${token} `;
      if (/^CREATE\s+(TEMP\s+)?TRIGGER\s/.test(prefix)) trigger = true;
      if (trigger && (token === "BEGIN" || token === "CASE")) depth++;
      if (trigger && token === "END") depth--;
      continue;
    }
    if (char === ";" && depth === 0) {
      const statement = sql.slice(start, index + 1).trim();
      if (statement) statements.push(statement);
      start = index + 1;
      prefix = "";
      trigger = false;
    }
    index++;
  }
  if (depth !== 0) throw new Error("Unclosed migration trigger");
  const remaining = sql.slice(start).trim();
  if (remaining) statements.push(remaining);
  return statements;
}
export function migrationScripts() {
  const canonical = [
    "0001_intake.sql",
    "0002_pharmacy.sql",
    "0002_ayusetu_her.sql",
    "0003_ayusetu_vitalis.sql",
  ];
  return canonical.map((name) =>
    readFileSync(join("backend/migrations", name), "utf8"),
  );
}
export function migrateLocal(db: LocalDatabase) {
  // Current scripts are additive/idempotent. Keep the schema files in order.
  for (const script of migrationScripts()) db.raw.exec(script);
}
