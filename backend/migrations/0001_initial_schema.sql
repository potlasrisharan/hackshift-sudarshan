-- Migration: 0001_initial_schema.sql
-- DHAAGA OS Unified Schema for D1 Database

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  phone_hash TEXT NOT NULL,
  dob TEXT,
  sex TEXT,
  preferred_lang TEXT DEFAULT 'hi',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_patients_org_phone ON patients(org_id, phone_hash);

CREATE TABLE IF NOT EXISTS encounters (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  clinic_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 0,
  chief_complaint TEXT,
  status TEXT NOT NULL DEFAULT 'WAITING',
  token_number INTEGER,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_encounters_org_clinic ON encounters(org_id, clinic_id, status);

CREATE TABLE IF NOT EXISTS inventory_batches (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  clinic_id TEXT NOT NULL,
  salt_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  stock_units INTEGER NOT NULL DEFAULT 0,
  unit_price_paise INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inventory_org_clinic ON inventory_batches(org_id, clinic_id, salt_name);

CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  encounter_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  signed_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  items_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_org_encounter ON prescriptions(org_id, encounter_id);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_audit_events_org ON audit_events(org_id, created_at);
