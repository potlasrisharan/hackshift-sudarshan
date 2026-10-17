PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS clinics (
  org_id TEXT NOT NULL, id TEXT NOT NULL, name TEXT NOT NULL,
  PRIMARY KEY (org_id, id)
);
CREATE TABLE IF NOT EXISTS users (
  org_id TEXT NOT NULL, id TEXT NOT NULL, clinic_id TEXT NOT NULL,
  email TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('HOSPITAL_ADMIN','DOCTOR','NURSE','CASHIER')),
  password_salt TEXT NOT NULL, password_hash TEXT NOT NULL,
  PRIMARY KEY (org_id, id), UNIQUE (org_id, email),
  FOREIGN KEY (org_id, clinic_id) REFERENCES clinics(org_id, id)
);
CREATE TABLE IF NOT EXISTS sessions (
  org_id TEXT NOT NULL, token_hash TEXT NOT NULL, user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL, PRIMARY KEY (org_id, token_hash),
  FOREIGN KEY (org_id, user_id) REFERENCES users(org_id, id)
);
CREATE TABLE IF NOT EXISTS patients (
  org_id TEXT NOT NULL, id TEXT NOT NULL, name TEXT NOT NULL, birth_date TEXT NOT NULL,
  gender TEXT NOT NULL, language TEXT NOT NULL, synthetic INTEGER NOT NULL CHECK(synthetic = 1),
  PRIMARY KEY (org_id, id)
);
CREATE TABLE IF NOT EXISTS encounters (
  org_id TEXT NOT NULL, id TEXT NOT NULL, patient_id TEXT NOT NULL, clinic_id TEXT NOT NULL,
  chief_complaint TEXT NOT NULL, answers_json TEXT NOT NULL, red_flags_json TEXT NOT NULL,
  next_question TEXT, status TEXT NOT NULL CHECK(status IN ('waiting','emergency','reviewed')),
  created_at TEXT NOT NULL, reviewed_by TEXT, reviewed_at TEXT, review_note TEXT,
  PRIMARY KEY (org_id, id),
  FOREIGN KEY (org_id, patient_id) REFERENCES patients(org_id, id),
  FOREIGN KEY (org_id, clinic_id) REFERENCES clinics(org_id, id),
  FOREIGN KEY (org_id, reviewed_by) REFERENCES users(org_id, id)
);
CREATE INDEX IF NOT EXISTS encounter_queue ON encounters(org_id, clinic_id, created_at);
CREATE TABLE IF NOT EXISTS consents (
  org_id TEXT NOT NULL, patient_id TEXT NOT NULL, encounter_id TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK(purpose = 'care'), granted_at TEXT NOT NULL, revoked_at TEXT,
  PRIMARY KEY (org_id, encounter_id, purpose),
  FOREIGN KEY (org_id, patient_id) REFERENCES patients(org_id, id),
  FOREIGN KEY (org_id, encounter_id) REFERENCES encounters(org_id, id)
);
CREATE TABLE IF NOT EXISTS idempotency (
  org_id TEXT NOT NULL, user_id TEXT NOT NULL, key TEXT NOT NULL, request_hash TEXT NOT NULL,
  encounter_id TEXT NOT NULL, PRIMARY KEY (org_id, user_id, key),
  FOREIGN KEY (org_id, user_id) REFERENCES users(org_id, id),
  FOREIGN KEY (org_id, encounter_id) REFERENCES encounters(org_id, id)
);
CREATE TABLE IF NOT EXISTS activity (
  org_id TEXT NOT NULL, id TEXT NOT NULL, encounter_id TEXT NOT NULL,
  actor_id TEXT NOT NULL, action TEXT NOT NULL, created_at TEXT NOT NULL,
  PRIMARY KEY (org_id, id),
  FOREIGN KEY (org_id, encounter_id) REFERENCES encounters(org_id, id),
  FOREIGN KEY (org_id, actor_id) REFERENCES users(org_id, id)
);
CREATE TABLE IF NOT EXISTS login_attempts (
  org_id TEXT NOT NULL, key_hash TEXT NOT NULL, attempts INTEGER NOT NULL, window_end TEXT NOT NULL,
  PRIMARY KEY (org_id, key_hash)
);
