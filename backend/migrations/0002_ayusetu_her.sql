-- Migration: 0002_ayusetu_her.sql
-- AyuSetu HER Relational Schema for D1 Database
-- Complete storage for cycles, symptoms, screening evidence, questionnaires, doctor summaries, and audit logs.

CREATE TABLE IF NOT EXISTS her_profiles (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL UNIQUE,
  year_of_birth INTEGER NOT NULL,
  menarche_age INTEGER,
  is_pregnant_or_lactating INTEGER DEFAULT 0,
  hormonal_contraception INTEGER DEFAULT 0,
  diet_preference TEXT DEFAULT 'vegetarian',
  allergies_json TEXT DEFAULT '[]',
  lifestyle_goals_json TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_profiles_org_patient ON her_profiles(org_id, patient_id);

CREATE TABLE IF NOT EXISTS her_consents (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  granted INTEGER NOT NULL DEFAULT 1,
  granted_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_her_consents_patient ON her_consents(org_id, patient_id, consent_type);

CREATE TABLE IF NOT EXISTS her_cycles (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  cycle_length_days INTEGER,
  period_length_days INTEGER,
  flow_intensity TEXT DEFAULT 'medium',
  cramps_severity INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_cycles_patient ON her_cycles(org_id, patient_id, start_date);

CREATE TABLE IF NOT EXISTS her_symptoms (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  log_date TEXT NOT NULL,
  energy_level INTEGER,
  mood TEXT,
  pelvic_pain INTEGER DEFAULT 0,
  bloating INTEGER DEFAULT 0,
  headache INTEGER DEFAULT 0,
  acne_severity TEXT,
  sleep_hours REAL,
  tags_json TEXT DEFAULT '[]',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_symptoms_patient_date ON her_symptoms(org_id, patient_id, log_date);

CREATE TABLE IF NOT EXISTS her_questionnaires (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  questionnaire_code TEXT NOT NULL,
  answers_json TEXT NOT NULL DEFAULT '{}',
  completed_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_questionnaires_patient ON her_questionnaires(org_id, patient_id, questionnaire_code);

CREATE TABLE IF NOT EXISTS her_screenings (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  findings_json TEXT NOT NULL DEFAULT '[]',
  rule_version TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_screenings_patient ON her_screenings(org_id, patient_id, created_at);

CREATE TABLE IF NOT EXISTS her_observations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  category TEXT NOT NULL,
  metric TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  source TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  metadata_json TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_her_observations_patient ON her_observations(org_id, patient_id, metric, recorded_at);

CREATE TABLE IF NOT EXISTS her_doctor_summaries (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  summary_data_json TEXT NOT NULL,
  include_cycle_history INTEGER DEFAULT 1,
  include_symptoms INTEGER DEFAULT 1,
  include_labs INTEGER DEFAULT 1,
  include_wearables INTEGER DEFAULT 1,
  passcode_hash TEXT,
  expires_at TEXT,
  revoked INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_summaries_patient ON her_doctor_summaries(org_id, patient_id);

CREATE TABLE IF NOT EXISTS her_shares (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  summary_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  revoked INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_shares_token ON her_shares(share_token);

CREATE TABLE IF NOT EXISTS her_notifications (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  scheduled_for TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_notifs_patient ON her_notifications(org_id, patient_id);

CREATE TABLE IF NOT EXISTS her_audit_events (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_her_audit_patient ON her_audit_events(org_id, patient_id, created_at);
