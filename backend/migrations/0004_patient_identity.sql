-- Keep kiosk-created patient identity fields in D1 while storing phone numbers
-- only as the existing tenant-scoped hash.
ALTER TABLE patients ADD COLUMN name TEXT;
ALTER TABLE patients ADD COLUMN abha_number TEXT;
ALTER TABLE patients ADD COLUMN abha_address TEXT;
