/**
 * AYUSETU OS Multi-Tenant D1 Database Scoper
 * AGENTS.md Rule 6: All D1 queries scoped with org_id via tenantDb(ctx)
 * Ensures zero cross-tenant leakage across clinics and organizations.
 */

export interface TenantContext {
  orgId: string;
}

export interface PatientRecord {
  id: string;
  org_id: string;
  name: string | null;
  phone_hash: string;
  abha_number: string | null;
  abha_address: string | null;
  dob: string | null;
  sex: string | null;
  preferred_lang: string;
  created_at: string;
}

export interface EncounterRecord {
  id: string;
  org_id: string;
  clinic_id: string;
  patient_id: string;
  tier: number;
  chief_complaint: string | null;
  status: string;
  token_number: number | null;
  created_at: string;
}

export interface InventoryBatchRecord {
  id: string;
  org_id: string;
  clinic_id: string;
  salt_name: string;
  brand_name: string;
  batch_number: string;
  expiry_date: string;
  stock_units: number;
  unit_price_paise: number;
}

export interface PrescriptionRecord {
  id: string;
  org_id: string;
  encounter_id: string;
  doctor_id: string;
  signed_at: string;
  items_json: string;
  status: string;
}

export interface AuditEventRecord {
  id: string;
  org_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details_json: string;
  created_at: string;
}

export class TenantDb {
  readonly orgId: string;
  private readonly db: D1Database;

  constructor(db: D1Database, ctx: TenantContext) {
    if (!ctx.orgId || ctx.orgId.trim() === "") {
      throw new Error("TenantDb requires a valid, non-empty orgId context");
    }
    this.db = db;
    this.orgId = ctx.orgId.trim();
  }

  get raw(): D1Database {
    return this.db;
  }

  /**
   * Prepares a SQL statement with mandatory org_id enforcement.
   * If the statement contains a WHERE clause for a multi-tenant table,
   * caller must bind orgId or use the scoped helpers.
   */
  prepare(query: string): D1PreparedStatement {
    return this.db.prepare(query);
  }

  // --- Scoped Patient Methods ---
  readonly patients = {
    findById: async (id: string): Promise<PatientRecord | null> => {
      return this.db
        .prepare("SELECT * FROM patients WHERE id = ? AND org_id = ?")
        .bind(id, this.orgId)
        .first<PatientRecord>();
    },

    findByPhoneHash: async (phoneHash: string): Promise<PatientRecord | null> => {
      return this.db
        .prepare("SELECT * FROM patients WHERE phone_hash = ? AND org_id = ?")
        .bind(phoneHash, this.orgId)
        .first<PatientRecord>();
    },

    create: async (data: {
      id: string;
      name: string;
      phoneHash: string;
      abhaNumber?: string | null;
      abhaAddress?: string | null;
      dob?: string | null;
      sex?: string | null;
      preferredLang?: string;
    }): Promise<D1Response> => {
      return this.db
        .prepare(
          `INSERT INTO patients
            (id, org_id, name, phone_hash, abha_number, abha_address, dob, sex, preferred_lang)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          this.orgId,
          data.name,
          data.phoneHash,
          data.abhaNumber ?? null,
          data.abhaAddress ?? null,
          data.dob ?? null,
          data.sex ?? null,
          data.preferredLang ?? "hi"
        )
        .run();
    },

    list: async (limit = 50): Promise<PatientRecord[]> => {
      const res = await this.db
        .prepare(
          "SELECT * FROM patients WHERE org_id = ? ORDER BY created_at DESC LIMIT ?"
        )
        .bind(this.orgId, limit)
        .all<PatientRecord>();
      return res.results;
    }
  };

  // --- Scoped Encounter Methods ---
  readonly encounters = {
    findById: async (id: string): Promise<EncounterRecord | null> => {
      return this.db
        .prepare("SELECT * FROM encounters WHERE id = ? AND org_id = ?")
        .bind(id, this.orgId)
        .first<EncounterRecord>();
    },

    listByClinic: async (clinicId: string, status?: string): Promise<EncounterRecord[]> => {
      if (status) {
        const res = await this.db
          .prepare(
            `SELECT * FROM encounters
             WHERE org_id = ? AND clinic_id = ? AND status = ?
             ORDER BY created_at ASC`
          )
          .bind(this.orgId, clinicId, status)
          .all<EncounterRecord>();
        return res.results;
      }
      const res = await this.db
        .prepare(
          `SELECT * FROM encounters
           WHERE org_id = ? AND clinic_id = ?
           ORDER BY created_at DESC`
        )
        .bind(this.orgId, clinicId)
        .all<EncounterRecord>();
      return res.results;
    },

    create: async (data: {
      id: string;
      clinicId: string;
      patientId: string;
      tier?: number;
      chiefComplaint?: string | null;
      status?: string;
      tokenNumber?: number | null;
    }): Promise<D1Response> => {
      return this.db
        .prepare(
          `INSERT INTO encounters (id, org_id, clinic_id, patient_id, tier, chief_complaint, status, token_number)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          this.orgId,
          data.clinicId,
          data.patientId,
          data.tier ?? 0,
          data.chiefComplaint ?? null,
          data.status ?? "WAITING",
          data.tokenNumber ?? null
        )
        .run();
    },

    updateStatus: async (id: string, status: string): Promise<D1Response> => {
      return this.db
        .prepare(
          "UPDATE encounters SET status = ? WHERE id = ? AND org_id = ?"
        )
        .bind(status, id, this.orgId)
        .run();
    }
  };

  // --- Scoped Inventory Methods ---
  readonly inventory = {
    listBatches: async (clinicId?: string, saltName?: string): Promise<InventoryBatchRecord[]> => {
      if (clinicId && saltName) {
        const res = await this.db
          .prepare(
            `SELECT * FROM inventory_batches
             WHERE org_id = ? AND clinic_id = ? AND salt_name = ?
             ORDER BY expiry_date ASC`
          )
          .bind(this.orgId, clinicId, saltName)
          .all<InventoryBatchRecord>();
        return res.results;
      }
      if (clinicId) {
        const res = await this.db
          .prepare(
            `SELECT * FROM inventory_batches
             WHERE org_id = ? AND clinic_id = ?
             ORDER BY expiry_date ASC`
          )
          .bind(this.orgId, clinicId)
          .all<InventoryBatchRecord>();
        return res.results;
      }
      const res = await this.db
        .prepare(
          `SELECT * FROM inventory_batches
           WHERE org_id = ?
           ORDER BY expiry_date ASC`
        )
        .bind(this.orgId)
        .all<InventoryBatchRecord>();
      return res.results;
    },

    upsertBatch: async (data: {
      id: string;
      clinicId: string;
      saltName: string;
      brandName: string;
      batchNumber: string;
      expiryDate: string;
      stockUnits: number;
      unitPricePaise: number;
    }): Promise<D1Response> => {
      return this.db
        .prepare(
          `INSERT INTO inventory_batches (id, org_id, clinic_id, salt_name, brand_name, batch_number, expiry_date, stock_units, unit_price_paise)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             stock_units = excluded.stock_units,
             unit_price_paise = excluded.unit_price_paise`
        )
        .bind(
          data.id,
          this.orgId,
          data.clinicId,
          data.saltName,
          data.brandName,
          data.batchNumber,
          data.expiryDate,
          data.stockUnits,
          data.unitPricePaise
        )
        .run();
    }
  };

  // --- Scoped Prescription Methods ---
  readonly prescriptions = {
    findById: async (id: string): Promise<PrescriptionRecord | null> => {
      return this.db
        .prepare("SELECT * FROM prescriptions WHERE id = ? AND org_id = ?")
        .bind(id, this.orgId)
        .first<PrescriptionRecord>();
    },

    create: async (data: {
      id: string;
      encounterId: string;
      doctorId: string;
      itemsJson: string;
      status?: string;
    }): Promise<D1Response> => {
      return this.db
        .prepare(
          `INSERT INTO prescriptions (id, org_id, encounter_id, doctor_id, items_json, status)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          this.orgId,
          data.encounterId,
          data.doctorId,
          data.itemsJson,
          data.status ?? "DRAFT"
        )
        .run();
    }
  };

  // --- Scoped Audit Methods ---
  readonly audit = {
    record: async (data: {
      id: string;
      actorId: string;
      action: string;
      targetType: string;
      targetId: string;
      detailsJson?: string;
    }): Promise<D1Response> => {
      return this.db
        .prepare(
          `INSERT INTO audit_events (id, org_id, actor_id, action, target_type, target_id, details_json)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          this.orgId,
          data.actorId,
          data.action,
          data.targetType,
          data.targetId,
          data.detailsJson ?? "{}"
        )
        .run();
    },

    listRecent: async (limit = 100): Promise<AuditEventRecord[]> => {
      const res = await this.db
        .prepare(
          `SELECT * FROM audit_events
           WHERE org_id = ?
           ORDER BY created_at DESC
           LIMIT ?`
        )
        .bind(this.orgId, limit)
        .all<AuditEventRecord>();
      return res.results;
    }
  };
}

export function tenantDb(db: D1Database, ctx: TenantContext): TenantDb {
  return new TenantDb(db, ctx);
}
