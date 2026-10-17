import { type Database, tenantDb } from "../src/database";
import { passwordHash } from "../src/security";
export const demoPassword = "Dhaaga-demo-2026!";
/** Only explicit local development calls this synthetic seed. */
export async function seedDemo(database: Database) {
  for (const orgId of ["demo", "other-org"]) {
    const db = tenantDb({ db: database, orgId });
    await db.batch([
      db.statement(
        "INSERT OR IGNORE INTO clinics (org_id,id,name) VALUES (:org,'north','North Clinic')",
      ),
      db.statement(
        "INSERT OR IGNORE INTO clinics (org_id,id,name) VALUES (:org,'east','East Clinic')",
      ),
    ]);
    for (const [id, clinic, role] of [
      ["doctor", "north", "DOCTOR"],
      ["nurse", "north", "NURSE"],
      ["admin", "north", "HOSPITAL_ADMIN"],
      ["cashier", "north", "CASHIER"],
      ["east-doctor", "east", "DOCTOR"],
    ] as const) {
      const salt = crypto.randomUUID();
      await db
        .statement(
          "INSERT OR IGNORE INTO users (org_id,id,clinic_id,email,role,password_salt,password_hash) VALUES (:org,?,?,?,?,?,?)",
          id,
          clinic,
          `${id}@demo.test`,
          role,
          salt,
          await passwordHash(demoPassword, salt),
        )
        .run();
    }
  }
}
