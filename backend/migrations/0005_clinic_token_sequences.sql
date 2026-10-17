-- Atomic per-clinic, per-day OPD token counters.
CREATE TABLE IF NOT EXISTS clinic_token_sequences (
  org_id TEXT NOT NULL,
  clinic_id TEXT NOT NULL,
  service_date TEXT NOT NULL,
  last_value INTEGER NOT NULL CHECK (last_value > 0),
  PRIMARY KEY (org_id, clinic_id, service_date)
);
