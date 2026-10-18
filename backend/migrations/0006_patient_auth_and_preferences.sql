-- Migration: 0006_patient_auth_and_preferences.sql
-- Enables mobile patient authentication, rich clinical demographics,
-- Ayurvedic Tridosha/Prakriti profiles, and app customization preferences.

-- 1. Extend patients table with rich demographics & contact attributes
ALTER TABLE patients ADD COLUMN phone_encrypted TEXT;
ALTER TABLE patients ADD COLUMN blood_group TEXT;
ALTER TABLE patients ADD COLUMN address TEXT;
ALTER TABLE patients ADD COLUMN emergency_contact TEXT;
ALTER TABLE patients ADD COLUMN allergies_json TEXT DEFAULT '[]';
ALTER TABLE patients ADD COLUMN chronic_conditions_json TEXT DEFAULT '[]';
ALTER TABLE patients ADD COLUMN metadata_json TEXT DEFAULT '{}';
ALTER TABLE patients ADD COLUMN updated_at TEXT;

-- 2. Dedicated Patient Credentials Table for Phone/Email/Password Auth
CREATE TABLE IF NOT EXISTS patient_credentials (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  phone_hash TEXT NOT NULL,
  email TEXT,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  phone_verified INTEGER NOT NULL DEFAULT 1 CHECK(phone_verified IN (0,1)),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','SUSPENDED','LOCKED')),
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  lockout_until TEXT,
  last_login TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_patient_creds_org_phone ON patient_credentials(org_id, phone_hash);
CREATE INDEX IF NOT EXISTS idx_patient_creds_org_email ON patient_credentials(org_id, email);

-- 3. Dedicated Patient Session Table
CREATE TABLE IF NOT EXISTS patient_sessions (
  org_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  device_name TEXT,
  platform TEXT CHECK(platform IN ('ANDROID','IOS','WEB')),
  fcm_token TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (org_id, token_hash),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_patient_sessions_patient ON patient_sessions(org_id, patient_id);

-- 4. Ayurvedic Prakriti & Dosha Profile Table
CREATE TABLE IF NOT EXISTS patient_ayurvedic_profiles (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL UNIQUE,
  primary_dosha TEXT NOT NULL,
  secondary_dosha TEXT DEFAULT 'NONE',
  prakriti_summary TEXT NOT NULL,
  vikriti_aggravation TEXT,
  agni_type TEXT NOT NULL DEFAULT 'SAMAGNI',
  koshtha_type TEXT NOT NULL DEFAULT 'MADHYAMA',
  dietary_guidelines_json TEXT NOT NULL DEFAULT '[]',
  yoga_recommendations_json TEXT NOT NULL DEFAULT '[]',
  assessed_by TEXT NOT NULL DEFAULT 'SELF_ASSESSMENT',
  assessed_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ayurvedic_profiles_org_patient ON patient_ayurvedic_profiles(org_id, patient_id);

-- 5. Mobile App Customization & Preferences Table
CREATE TABLE IF NOT EXISTS patient_app_preferences (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  patient_id TEXT NOT NULL UNIQUE,
  primary_focus TEXT NOT NULL DEFAULT 'longevity',
  primary_modules_json TEXT NOT NULL DEFAULT '["prescriptions","vitalis","her","yoga"]',
  theme_mode TEXT NOT NULL DEFAULT 'light',
  color_accent TEXT NOT NULL DEFAULT 'botanical_teal',
  language TEXT NOT NULL DEFAULT 'hi',
  notifications_enabled INTEGER NOT NULL DEFAULT 1 CHECK(notifications_enabled IN (0,1)),
  medicine_reminders_enabled INTEGER NOT NULL DEFAULT 1 CHECK(medicine_reminders_enabled IN (0,1)),
  cycle_reminders_enabled INTEGER NOT NULL DEFAULT 1 CHECK(cycle_reminders_enabled IN (0,1)),
  vitals_drift_alerts_enabled INTEGER NOT NULL DEFAULT 1 CHECK(vitals_drift_alerts_enabled IN (0,1)),
  biometric_login_enabled INTEGER NOT NULL DEFAULT 0 CHECK(biometric_login_enabled IN (0,1)),
  reminder_morning_time TEXT NOT NULL DEFAULT '08:00',
  reminder_afternoon_time TEXT NOT NULL DEFAULT '13:00',
  reminder_night_time TEXT NOT NULL DEFAULT '20:30',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_patient_app_prefs_org_patient ON patient_app_preferences(org_id, patient_id);
