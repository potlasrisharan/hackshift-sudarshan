CREATE TABLE IF NOT EXISTS cbc_reports (
 org_id TEXT NOT NULL, id TEXT NOT NULL, encounter_id TEXT NOT NULL,
 patient_id TEXT NOT NULL, clinic_id TEXT NOT NULL, created_by TEXT NOT NULL,
 created_at TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0,
 research_consent INTEGER NOT NULL CHECK(research_consent IN (0,1)),
 deleted_at TEXT, document_key TEXT, document_type TEXT,
 source_consent_at TEXT, source_consent_by TEXT, document_sha256 TEXT, document_bytes INTEGER,
 create_key TEXT NOT NULL, create_hash TEXT NOT NULL,
 PRIMARY KEY(org_id,id), UNIQUE(org_id,created_by,create_key),
 FOREIGN KEY(org_id,encounter_id) REFERENCES encounters(org_id,id),
 FOREIGN KEY(org_id,patient_id) REFERENCES patients(org_id,id)
);
CREATE INDEX IF NOT EXISTS cbc_report_encounter ON cbc_reports(org_id,encounter_id,created_at,id);
CREATE TABLE IF NOT EXISTS cbc_revisions (
 org_id TEXT NOT NULL, report_id TEXT NOT NULL, revision INTEGER NOT NULL,
 values_json TEXT NOT NULL, measurements_json TEXT NOT NULL, collection_date TEXT,
 confirmed_by TEXT NOT NULL, confirmed_at TEXT NOT NULL, input_hash TEXT NOT NULL,
 operation_key TEXT NOT NULL, request_hash TEXT NOT NULL,
 prediction_json TEXT, predicted_at TEXT, predicted_by TEXT,
 PRIMARY KEY(org_id,report_id,revision), UNIQUE(org_id,report_id,operation_key),
 FOREIGN KEY(org_id,report_id) REFERENCES cbc_reports(org_id,id)
);
CREATE TABLE IF NOT EXISTS cbc_limits (
 org_id TEXT NOT NULL, actor_id TEXT NOT NULL, window_start TEXT NOT NULL,
 operations INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(org_id,actor_id,window_start)
);
CREATE TABLE IF NOT EXISTS cbc_prediction_keys (
 org_id TEXT NOT NULL, actor_id TEXT NOT NULL, operation_key TEXT NOT NULL,
 report_id TEXT NOT NULL, revision INTEGER NOT NULL,
 PRIMARY KEY(org_id,actor_id,operation_key),
 FOREIGN KEY(org_id,report_id) REFERENCES cbc_reports(org_id,id)
);
CREATE TABLE IF NOT EXISTS cbc_maintenance (
 org_id TEXT PRIMARY KEY, r2_cursor TEXT
);
