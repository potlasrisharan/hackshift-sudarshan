-- Migration: 0003_ayusetu_vitalis.sql
-- AyuSetu Vitalis Relational Schema for D1 Database
-- Stores profiles, assessments, goals, exercise & nutrition plans, biomarker observations, scores, and audit events.

CREATE TABLE IF NOT EXISTS vitalis_profiles (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL UNIQUE,
  year_of_birth INTEGER NOT NULL,
  sex TEXT DEFAULT 'OTHER',
  height_cm REAL,
  weight_kg REAL,
  waist_circumference_cm REAL,
  diagnosed_conditions_json TEXT DEFAULT '[]',
  medications_json TEXT DEFAULT '[]',
  allergies_json TEXT DEFAULT '[]',
  diet_preference TEXT DEFAULT 'vegetarian',
  activity_limitations_json TEXT DEFAULT '[]',
  goals_json TEXT DEFAULT '[]',
  smoking_status TEXT DEFAULT 'never',
  alcohol_intake TEXT DEFAULT 'none',
  clinician_restricted_exertion INTEGER DEFAULT 0,
  onboarding_version TEXT DEFAULT '2026.1',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vitalis_profiles_patient ON vitalis_profiles(org_id, patient_id);

CREATE TABLE IF NOT EXISTS vitalis_consents (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  vitalis_health_data INTEGER DEFAULT 1,
  wearable_sync INTEGER DEFAULT 1,
  clinician_sharing INTEGER DEFAULT 0,
  research_anonymized INTEGER DEFAULT 0,
  her_menstrual_sharing INTEGER DEFAULT 0,
  granted_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vitalis_consents_patient ON vitalis_consents(org_id, patient_id);

CREATE TABLE IF NOT EXISTS vitalis_assessments (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  questionnaire_version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'in_progress',
  answers_json TEXT NOT NULL DEFAULT '{}',
  result_category TEXT NOT NULL DEFAULT 'wellness_plan_available',
  triage_notes_json TEXT DEFAULT '[]',
  started_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vitalis_assessments_patient ON vitalis_assessments(org_id, patient_id);

CREATE TABLE IF NOT EXISTS vitalis_observations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  metric_code TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value_numeric REAL NOT NULL,
  value_text TEXT,
  unit TEXT NOT NULL,
  observed_start_utc TEXT NOT NULL,
  observed_end_utc TEXT,
  iana_timezone TEXT DEFAULT 'Asia/Kolkata',
  source_type TEXT NOT NULL,
  source_id TEXT DEFAULT 'manual',
  source_record_id TEXT,
  method TEXT,
  quality TEXT DEFAULT 'verified',
  reference_range TEXT,
  is_abnormal INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vitalis_obs_patient_metric ON vitalis_observations(org_id, patient_id, metric_code, observed_start_utc);

CREATE TABLE IF NOT EXISTS vitalis_goals (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  baseline REAL,
  target REAL NOT NULL,
  unit TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vitalis_goals_patient ON vitalis_goals(org_id, patient_id);

CREATE TABLE IF NOT EXISTS vitalis_plans (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'exercise' | 'nutrition'
  plan_json TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  approved_by TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vitalis_plans_patient ON vitalis_plans(org_id, patient_id, kind);

CREATE TABLE IF NOT EXISTS vitalis_doctor_summaries (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  summary_data_json TEXT NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  passcode_hash TEXT,
  expires_at TEXT,
  is_clinician_confirmed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vitalis_summaries_token ON vitalis_doctor_summaries(share_token);

CREATE TABLE IF NOT EXISTS vitalis_audit_events (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vitalis_audit_patient ON vitalis_audit_events(org_id, patient_id, created_at);
