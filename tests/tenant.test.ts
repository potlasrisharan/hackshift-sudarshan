import { describe, expect, it } from "vitest";
import { tenantDb } from "../backend/src/db/tenant";

// Lightweight mock of Cloudflare D1Database for unit testing query scoping
function createMockD1() {
  const store: Record<string, Record<string, unknown>[]> = {
    patients: [
      {
        id: "pat_1",
        org_id: "org-alpha",
        phone_hash: "hash123",
        preferred_lang: "hi",
      },
      {
        id: "pat_2",
        org_id: "org-beta",
        phone_hash: "hash456",
        preferred_lang: "ta",
      },
    ],
    encounters: [
      {
        id: "enc_1",
        org_id: "org-alpha",
        clinic_id: "clinic_1",
        patient_id: "pat_1",
        status: "WAITING",
      },
      {
        id: "enc_2",
        org_id: "org-beta",
        clinic_id: "clinic_2",
        patient_id: "pat_2",
        status: "IN_CONSULTATION",
      },
    ],
  };

  const executedQueries: { sql: string; params: unknown[] }[] = [];

  const mockDb = {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async first<T = unknown>() {
              executedQueries.push({ sql, params });
              // Simple pattern matching for mock
              if (sql.includes("FROM patients WHERE id = ? AND org_id = ?")) {
                const [id, orgId] = params as [string, string];
                const found = store.patients?.find(
                  (p) => p.id === id && p.org_id === orgId,
                );
                return (found as T) ?? null;
              }
              return null;
            },
            async all<T = unknown>() {
              executedQueries.push({ sql, params });
              if (sql.includes("FROM patients WHERE org_id = ?")) {
                const [orgId] = params as [string];
                const results = (store.patients?.filter(
                  (p) => p.org_id === orgId,
                ) ?? []) as T[];
                return { results, success: true, meta: {} };
              }
              if (
                sql.includes("FROM encounters") &&
                sql.includes("org_id = ?")
              ) {
                const [orgId] = params as [string];
                const results = (store.encounters?.filter(
                  (e) => e.org_id === orgId,
                ) ?? []) as T[];
                return { results, success: true, meta: {} };
              }
              return { results: [], success: true, meta: {} };
            },
            async run() {
              executedQueries.push({ sql, params });
              return { success: true, meta: {} };
            },
          };
        },
      };
    },
  } as unknown as D1Database;

  return { mockDb, executedQueries, store };
}

describe("tenantDb multi-tenancy isolation (AGENTS.md Rule 6)", () => {
  it("rejects empty orgId context to prevent cross-tenant data leaks", () => {
    const { mockDb } = createMockD1();
    expect(() => tenantDb(mockDb, { orgId: "" })).toThrow(
      /valid, non-empty orgId/,
    );
    expect(() => tenantDb(mockDb, { orgId: "   " })).toThrow(
      /valid, non-empty orgId/,
    );
  });

  it("scopes findById to the tenant's org_id", async () => {
    const { mockDb, executedQueries } = createMockD1();
    const dbAlpha = tenantDb(mockDb, { orgId: "org-alpha" });

    const patient = await dbAlpha.patients.findById("pat_1");
    expect(patient).toBeDefined();
    expect(patient?.id).toBe("pat_1");
    expect(patient?.org_id).toBe("org-alpha");

    const lastQuery = executedQueries.at(-1);
    expect(lastQuery?.sql).toContain("org_id = ?");
    expect(lastQuery?.params).toContain("org-alpha");
  });

  it("cross-tenant query isolation: org-alpha cannot see org-beta patient", async () => {
    const { mockDb } = createMockD1();
    const dbAlpha = tenantDb(mockDb, { orgId: "org-alpha" });

    // Requesting pat_2 (which belongs to org-beta) under org-alpha context
    const patientCrossTenant = await dbAlpha.patients.findById("pat_2");
    expect(patientCrossTenant).toBeNull();
  });

  it("cross-tenant list isolation: returns 0 rows of other tenants", async () => {
    const { mockDb } = createMockD1();
    const dbAlpha = tenantDb(mockDb, { orgId: "org-alpha" });
    const dbBeta = tenantDb(mockDb, { orgId: "org-beta" });

    const alphaPatients = await dbAlpha.patients.list();
    expect(alphaPatients.length).toBe(1);
    expect(alphaPatients[0]?.id).toBe("pat_1");
    expect(alphaPatients.every((p) => p.org_id === "org-alpha")).toBe(true);

    const betaPatients = await dbBeta.patients.list();
    expect(betaPatients.length).toBe(1);
    expect(betaPatients[0]?.id).toBe("pat_2");
    expect(betaPatients.every((p) => p.org_id === "org-beta")).toBe(true);

    // Completely unknown org returns 0 rows
    const dbGamma = tenantDb(mockDb, { orgId: "org-gamma" });
    const gammaPatients = await dbGamma.patients.list();
    expect(gammaPatients.length).toBe(0);
  });
});
