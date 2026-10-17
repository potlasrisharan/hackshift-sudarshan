CREATE TABLE IF NOT EXISTS encounter_permissions (
  org_id TEXT NOT NULL, encounter_id TEXT NOT NULL, purpose TEXT NOT NULL CHECK(purpose IN ('pharmacy','home')),
  granted_at TEXT NOT NULL, revoked_at TEXT, actor_id TEXT NOT NULL,
  PRIMARY KEY(org_id,encounter_id,purpose),
  FOREIGN KEY(org_id,encounter_id) REFERENCES encounters(org_id,id),
  FOREIGN KEY(org_id,actor_id) REFERENCES users(org_id,id)
);
CREATE TABLE IF NOT EXISTS sku (
  org_id TEXT NOT NULL, id TEXT NOT NULL, brand TEXT NOT NULL, salt TEXT NOT NULL,
  strength_mg INTEGER NOT NULL CHECK(strength_mg > 0), form TEXT NOT NULL CHECK(form IN ('tablet','capsule')),
  nti INTEGER NOT NULL CHECK(nti IN (0,1)), schedule_h INTEGER NOT NULL CHECK(schedule_h IN (0,1)),
  gst_bps INTEGER NOT NULL CHECK(gst_bps BETWEEN 0 AND 10000), PRIMARY KEY(org_id,id)
);
CREATE TABLE IF NOT EXISTS inventory_batches (
  org_id TEXT NOT NULL, id TEXT NOT NULL, sku_id TEXT NOT NULL, clinic_id TEXT NOT NULL,
  batch_no TEXT NOT NULL, expiry TEXT NOT NULL,
  qty_units INTEGER NOT NULL CHECK(typeof(qty_units)='integer' AND qty_units>=0),
  reserved_units INTEGER NOT NULL DEFAULT 0 CHECK(typeof(reserved_units)='integer' AND reserved_units>=0 AND reserved_units<=qty_units),
  price_paise INTEGER NOT NULL CHECK(typeof(price_paise)='integer' AND price_paise>0),
  cost_paise INTEGER NOT NULL CHECK(typeof(cost_paise)='integer' AND cost_paise>=0),
  PRIMARY KEY(org_id,id), UNIQUE(org_id,clinic_id,sku_id,batch_no),
  FOREIGN KEY(org_id,sku_id) REFERENCES sku(org_id,id), FOREIGN KEY(org_id,clinic_id) REFERENCES clinics(org_id,id)
);
CREATE TABLE IF NOT EXISTS signed_prescriptions (
  org_id TEXT NOT NULL, id TEXT NOT NULL, encounter_id TEXT NOT NULL, clinic_id TEXT NOT NULL,
  signed_by TEXT NOT NULL, signed_at TEXT NOT NULL, signature_hash TEXT NOT NULL,
  note TEXT NOT NULL, allergies_json TEXT NOT NULL, PRIMARY KEY(org_id,id), UNIQUE(org_id,encounter_id),
  FOREIGN KEY(org_id,encounter_id) REFERENCES encounters(org_id,id),
  FOREIGN KEY(org_id,clinic_id) REFERENCES clinics(org_id,id), FOREIGN KEY(org_id,signed_by) REFERENCES users(org_id,id)
);
CREATE TABLE IF NOT EXISTS prescription_lines (
  org_id TEXT NOT NULL, id TEXT NOT NULL, prescription_id TEXT NOT NULL, sku_id TEXT NOT NULL,
  units INTEGER NOT NULL CHECK(typeof(units)='integer' AND units BETWEEN 1 AND 1000),
  course_end TEXT NOT NULL, directions TEXT NOT NULL, allow_equivalent INTEGER NOT NULL CHECK(allow_equivalent IN (0,1)),
  PRIMARY KEY(org_id,id), UNIQUE(org_id,prescription_id,sku_id),
  FOREIGN KEY(org_id,prescription_id) REFERENCES signed_prescriptions(org_id,id), FOREIGN KEY(org_id,sku_id) REFERENCES sku(org_id,id)
);
CREATE TABLE IF NOT EXISTS reservations (
  org_id TEXT NOT NULL, id TEXT NOT NULL, prescription_id TEXT NOT NULL, clinic_id TEXT NOT NULL,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('held','released','dispensed')),
  PRIMARY KEY(org_id,id), FOREIGN KEY(org_id,prescription_id) REFERENCES signed_prescriptions(org_id,id),
  FOREIGN KEY(org_id,clinic_id) REFERENCES clinics(org_id,id), FOREIGN KEY(org_id,created_by) REFERENCES users(org_id,id)
);
CREATE UNIQUE INDEX IF NOT EXISTS one_active_reservation ON reservations(org_id,prescription_id) WHERE status='held';
CREATE UNIQUE INDEX IF NOT EXISTS one_dispensed_reservation ON reservations(org_id,prescription_id) WHERE status='dispensed';
CREATE TABLE IF NOT EXISTS reservation_lines (
  org_id TEXT NOT NULL, reservation_id TEXT NOT NULL, line_id TEXT NOT NULL, batch_id TEXT NOT NULL,
  units INTEGER NOT NULL CHECK(typeof(units)='integer' AND units>0),
  unit_price_paise INTEGER NOT NULL CHECK(typeof(unit_price_paise)='integer' AND unit_price_paise>0),
  unit_cost_paise INTEGER NOT NULL CHECK(typeof(unit_cost_paise)='integer' AND unit_cost_paise>=0),
  PRIMARY KEY(org_id,reservation_id,line_id,batch_id),
  FOREIGN KEY(org_id,reservation_id) REFERENCES reservations(org_id,id),
  FOREIGN KEY(org_id,line_id) REFERENCES prescription_lines(org_id,id), FOREIGN KEY(org_id,batch_id) REFERENCES inventory_batches(org_id,id)
);
CREATE TABLE IF NOT EXISTS sales (
  org_id TEXT NOT NULL, id TEXT NOT NULL, reservation_id TEXT NOT NULL, clinic_id TEXT NOT NULL,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','completed')),
  total_paise INTEGER NOT NULL CHECK(typeof(total_paise)='integer' AND total_paise>0),
  net_paise INTEGER NOT NULL CHECK(typeof(net_paise)='integer' AND net_paise>=0),
  tax_paise INTEGER NOT NULL CHECK(typeof(tax_paise)='integer' AND tax_paise>=0),
  cgst_paise INTEGER NOT NULL CHECK(typeof(cgst_paise)='integer' AND cgst_paise>=0),
  sgst_paise INTEGER NOT NULL CHECK(typeof(sgst_paise)='integer' AND sgst_paise>=0),
  igst_paise INTEGER NOT NULL CHECK(typeof(igst_paise)='integer' AND igst_paise>=0),
  cost_paise INTEGER NOT NULL CHECK(typeof(cost_paise)='integer' AND cost_paise>=0),
  PRIMARY KEY(org_id,id), UNIQUE(org_id,reservation_id), CHECK(net_paise+tax_paise=total_paise),
  CHECK(cgst_paise+sgst_paise+igst_paise=tax_paise),
  FOREIGN KEY(org_id,reservation_id) REFERENCES reservations(org_id,id),
  FOREIGN KEY(org_id,created_by) REFERENCES users(org_id,id), FOREIGN KEY(org_id,clinic_id) REFERENCES clinics(org_id,id)
);
CREATE TABLE IF NOT EXISTS sale_payments (
  org_id TEXT NOT NULL, sale_id TEXT NOT NULL, method TEXT NOT NULL CHECK(method IN ('cash','upi','card','credit')),
  amount_paise INTEGER NOT NULL CHECK(typeof(amount_paise)='integer' AND amount_paise>=0), PRIMARY KEY(org_id,sale_id,method),
  FOREIGN KEY(org_id,sale_id) REFERENCES sales(org_id,id)
);
CREATE TABLE IF NOT EXISTS accounting_settings (org_id TEXT NOT NULL PRIMARY KEY, lock_date TEXT);
CREATE TABLE IF NOT EXISTS journals (
  org_id TEXT NOT NULL, id TEXT NOT NULL, clinic_id TEXT NOT NULL, ref_type TEXT NOT NULL,
  ref_id TEXT NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('draft','posted')),
  PRIMARY KEY(org_id,id), UNIQUE(org_id,ref_type,ref_id), FOREIGN KEY(org_id,clinic_id) REFERENCES clinics(org_id,id)
);
CREATE TABLE IF NOT EXISTS journal_lines (
  org_id TEXT NOT NULL, id TEXT NOT NULL, journal_id TEXT NOT NULL, account TEXT NOT NULL,
  debit_paise INTEGER NOT NULL CHECK(typeof(debit_paise)='integer' AND debit_paise>=0),
  credit_paise INTEGER NOT NULL CHECK(typeof(credit_paise)='integer' AND credit_paise>=0),
  PRIMARY KEY(org_id,id), CHECK((debit_paise>0 AND credit_paise=0) OR (credit_paise>0 AND debit_paise=0)),
  FOREIGN KEY(org_id,journal_id) REFERENCES journals(org_id,id)
);
CREATE TABLE IF NOT EXISTS stock_movements (
  org_id TEXT NOT NULL, id TEXT NOT NULL, batch_id TEXT NOT NULL, sale_id TEXT NOT NULL,
  units INTEGER NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(org_id,id), UNIQUE(org_id,sale_id,batch_id),
  FOREIGN KEY(org_id,batch_id) REFERENCES inventory_batches(org_id,id), FOREIGN KEY(org_id,sale_id) REFERENCES sales(org_id,id)
);
CREATE TABLE IF NOT EXISTS command_receipts (
  org_id TEXT NOT NULL, actor_id TEXT NOT NULL, kind TEXT NOT NULL, key TEXT NOT NULL,
  request_hash TEXT NOT NULL, result_id TEXT NOT NULL, PRIMARY KEY(org_id,actor_id,kind,key),
  FOREIGN KEY(org_id,actor_id) REFERENCES users(org_id,id)
);
CREATE TABLE IF NOT EXISTS outbox (
  org_id TEXT NOT NULL, id TEXT NOT NULL, event_type TEXT NOT NULL, schema_version INTEGER NOT NULL DEFAULT 1,
  reference_id TEXT NOT NULL, occurred_at TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','delivered','dead-letter')),
  attempts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(org_id,id), UNIQUE(org_id,event_type,reference_id)
);

CREATE TRIGGER IF NOT EXISTS prescription_authorization BEFORE INSERT ON signed_prescriptions BEGIN
  SELECT RAISE(ABORT,'PRESCRIPTION_NOT_AUTHORIZED') WHERE NOT EXISTS (
    SELECT 1 FROM encounters e JOIN users u ON u.org_id=e.org_id AND u.clinic_id=e.clinic_id
    JOIN consents c ON c.org_id=e.org_id AND c.encounter_id=e.id AND c.purpose='care' AND c.revoked_at IS NULL
    JOIN encounter_permissions p ON p.org_id=e.org_id AND p.encounter_id=e.id AND p.purpose='pharmacy' AND p.revoked_at IS NULL
    WHERE e.org_id=NEW.org_id AND e.id=NEW.encounter_id AND e.clinic_id=NEW.clinic_id AND e.status='reviewed' AND u.id=NEW.signed_by AND u.role='DOCTOR');
END;
CREATE TRIGGER IF NOT EXISTS prescription_immutable BEFORE UPDATE ON signed_prescriptions BEGIN SELECT RAISE(ABORT,'SIGNED_PRESCRIPTION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS prescription_no_delete BEFORE DELETE ON signed_prescriptions BEGIN SELECT RAISE(ABORT,'SIGNED_PRESCRIPTION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS rx_line_immutable BEFORE UPDATE ON prescription_lines BEGIN SELECT RAISE(ABORT,'SIGNED_PRESCRIPTION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS rx_line_no_delete BEFORE DELETE ON prescription_lines BEGIN SELECT RAISE(ABORT,'SIGNED_PRESCRIPTION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS batch_metadata_immutable BEFORE UPDATE ON inventory_batches
WHEN NEW.sku_id<>OLD.sku_id OR NEW.org_id<>OLD.org_id OR NEW.clinic_id<>OLD.clinic_id OR NEW.expiry<>OLD.expiry OR NEW.price_paise<>OLD.price_paise OR NEW.cost_paise<>OLD.cost_paise OR NEW.batch_no<>OLD.batch_no BEGIN
  SELECT RAISE(ABORT,'BATCH_METADATA_IMMUTABLE');
END;
CREATE TRIGGER IF NOT EXISTS hold_authorization BEFORE INSERT ON reservations BEGIN
  SELECT RAISE(ABORT,'PRESCRIPTION_UNAVAILABLE') WHERE NOT EXISTS (
    SELECT 1 FROM signed_prescriptions rx JOIN consents c ON c.org_id=rx.org_id AND c.encounter_id=rx.encounter_id AND c.revoked_at IS NULL
    JOIN encounter_permissions p ON p.org_id=rx.org_id AND p.encounter_id=rx.encounter_id AND p.purpose='pharmacy' AND p.revoked_at IS NULL
    WHERE rx.org_id=NEW.org_id AND rx.id=NEW.prescription_id AND rx.clinic_id=NEW.clinic_id);
  SELECT RAISE(ABORT,'ALREADY_DISPENSED') WHERE EXISTS (SELECT 1 FROM reservations WHERE org_id=NEW.org_id AND prescription_id=NEW.prescription_id AND status='dispensed');
END;
CREATE TRIGGER IF NOT EXISTS hold_line_insert BEFORE INSERT ON reservation_lines BEGIN
  SELECT RAISE(ABORT,'INVALID_ALLOCATION') WHERE NOT EXISTS (
    SELECT 1 FROM reservations r JOIN prescription_lines l ON l.org_id=r.org_id AND l.prescription_id=r.prescription_id
    JOIN sku wanted ON wanted.org_id=l.org_id AND wanted.id=l.sku_id
    JOIN inventory_batches b ON b.org_id=r.org_id AND b.id=NEW.batch_id AND b.clinic_id=r.clinic_id
    JOIN sku actual ON actual.org_id=b.org_id AND actual.id=b.sku_id
    WHERE r.org_id=NEW.org_id AND r.id=NEW.reservation_id AND r.status='held' AND l.id=NEW.line_id
    AND (b.sku_id=l.sku_id OR (l.allow_equivalent=1 AND wanted.nti=0 AND actual.nti=0))
    AND actual.salt=wanted.salt COLLATE NOCASE AND actual.strength_mg=wanted.strength_mg AND actual.form=wanted.form
    AND b.expiry>=date(l.course_end,'+14 days') AND l.course_end>=date('now')
    AND NEW.unit_price_paise=b.price_paise AND NEW.unit_cost_paise=b.cost_paise);
  SELECT RAISE(ABORT,'ALLOCATION_EXCEEDS_PRESCRIPTION') WHERE NEW.units + COALESCE((SELECT SUM(units) FROM reservation_lines WHERE org_id=NEW.org_id AND reservation_id=NEW.reservation_id AND line_id=NEW.line_id),0) > (SELECT units FROM prescription_lines WHERE org_id=NEW.org_id AND id=NEW.line_id);
END;
CREATE TRIGGER IF NOT EXISTS hold_stock AFTER INSERT ON reservation_lines BEGIN
  UPDATE inventory_batches SET reserved_units=reserved_units+NEW.units WHERE org_id=NEW.org_id AND id=NEW.batch_id AND qty_units-reserved_units>=NEW.units;
  SELECT RAISE(ABORT,'STOCK_CONFLICT') WHERE changes()<>1;
END;
CREATE TRIGGER IF NOT EXISTS hold_line_immutable BEFORE UPDATE ON reservation_lines BEGIN SELECT RAISE(ABORT,'ALLOCATION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS hold_line_no_delete BEFORE DELETE ON reservation_lines BEGIN SELECT RAISE(ABORT,'ALLOCATION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS reservation_transition BEFORE UPDATE ON reservations BEGIN
  SELECT RAISE(ABORT,'INVALID_RESERVATION_TRANSITION') WHERE OLD.status<>'held' OR NEW.status NOT IN ('released','dispensed') OR NEW.org_id<>OLD.org_id OR NEW.id<>OLD.id OR NEW.prescription_id<>OLD.prescription_id OR NEW.clinic_id<>OLD.clinic_id OR NEW.expires_at<>OLD.expires_at OR NEW.created_by<>OLD.created_by OR NEW.created_at<>OLD.created_at;
END;
CREATE TRIGGER IF NOT EXISTS release_stock AFTER UPDATE OF status ON reservations WHEN OLD.status='held' AND NEW.status='released' BEGIN
  UPDATE inventory_batches SET reserved_units=reserved_units-(SELECT SUM(units) FROM reservation_lines l WHERE l.org_id=NEW.org_id AND l.reservation_id=NEW.id AND l.batch_id=inventory_batches.id)
    WHERE org_id=NEW.org_id AND EXISTS (SELECT 1 FROM reservation_lines l WHERE l.org_id=NEW.org_id AND l.reservation_id=NEW.id AND l.batch_id=inventory_batches.id);
END;
CREATE TRIGGER IF NOT EXISTS sale_authorization BEFORE INSERT ON sales BEGIN
  SELECT RAISE(ABORT,'RESERVATION_UNAVAILABLE') WHERE NOT EXISTS (
    SELECT 1 FROM reservations r JOIN signed_prescriptions rx ON rx.org_id=r.org_id AND rx.id=r.prescription_id
    JOIN consents c ON c.org_id=rx.org_id AND c.encounter_id=rx.encounter_id AND c.revoked_at IS NULL
    JOIN encounter_permissions p ON p.org_id=rx.org_id AND p.encounter_id=rx.encounter_id AND p.purpose='pharmacy' AND p.revoked_at IS NULL
    WHERE r.org_id=NEW.org_id AND r.id=NEW.reservation_id AND r.clinic_id=NEW.clinic_id AND r.status='held' AND r.expires_at>strftime('%Y-%m-%dT%H:%M:%fZ','now'));
  SELECT RAISE(ABORT,'TOTAL_MISMATCH') WHERE NEW.total_paise<>(SELECT SUM(units*unit_price_paise) FROM reservation_lines WHERE org_id=NEW.org_id AND reservation_id=NEW.reservation_id);
  SELECT RAISE(ABORT,'INCOMPLETE_PRESCRIPTION') WHERE EXISTS (
    SELECT 1 FROM prescription_lines l JOIN reservations r ON r.org_id=l.org_id AND r.prescription_id=l.prescription_id
    WHERE r.org_id=NEW.org_id AND r.id=NEW.reservation_id AND l.units<>COALESCE((SELECT SUM(units) FROM reservation_lines rl WHERE rl.org_id=l.org_id AND rl.reservation_id=r.id AND rl.line_id=l.id),0));
  SELECT RAISE(ABORT,'COURSE_EXPIRED') WHERE EXISTS (
    SELECT 1 FROM prescription_lines l JOIN reservations r ON r.org_id=l.org_id AND r.prescription_id=l.prescription_id WHERE r.org_id=NEW.org_id AND r.id=NEW.reservation_id AND l.course_end<date('now'));
END;
CREATE TRIGGER IF NOT EXISTS consume_stock AFTER UPDATE OF status ON reservations WHEN OLD.status='held' AND NEW.status='dispensed' BEGIN
  SELECT RAISE(ABORT,'SALE_REQUIRED') WHERE NOT EXISTS (SELECT 1 FROM sales WHERE org_id=NEW.org_id AND reservation_id=NEW.id AND status='pending');
  UPDATE inventory_batches SET qty_units=qty_units-(SELECT SUM(units) FROM reservation_lines l WHERE l.org_id=NEW.org_id AND l.reservation_id=NEW.id AND l.batch_id=inventory_batches.id),
    reserved_units=reserved_units-(SELECT SUM(units) FROM reservation_lines l WHERE l.org_id=NEW.org_id AND l.reservation_id=NEW.id AND l.batch_id=inventory_batches.id)
    WHERE org_id=NEW.org_id AND EXISTS (SELECT 1 FROM reservation_lines l WHERE l.org_id=NEW.org_id AND l.reservation_id=NEW.id AND l.batch_id=inventory_batches.id);
  INSERT INTO stock_movements (org_id,id,batch_id,sale_id,units,created_at)
    SELECT NEW.org_id,lower(hex(randomblob(16))),l.batch_id,s.id,-SUM(l.units),s.created_at FROM reservation_lines l
    JOIN sales s ON s.org_id=l.org_id AND s.reservation_id=l.reservation_id
    WHERE l.org_id=NEW.org_id AND l.reservation_id=NEW.id GROUP BY l.batch_id;
END;
CREATE TRIGGER IF NOT EXISTS revoke_pharmacy_on_care AFTER UPDATE OF revoked_at ON consents WHEN NEW.revoked_at IS NOT NULL AND OLD.revoked_at IS NULL BEGIN
  UPDATE encounter_permissions SET revoked_at=NEW.revoked_at WHERE org_id=NEW.org_id AND encounter_id=NEW.encounter_id AND revoked_at IS NULL;
  UPDATE reservations SET status='released' WHERE org_id=NEW.org_id AND status='held' AND prescription_id IN (SELECT id FROM signed_prescriptions WHERE org_id=NEW.org_id AND encounter_id=NEW.encounter_id);
END;
CREATE TRIGGER IF NOT EXISTS journal_no_direct_post BEFORE INSERT ON journals WHEN NEW.status<>'draft' BEGIN SELECT RAISE(ABORT,'JOURNAL_MUST_START_DRAFT'); END;
CREATE TRIGGER IF NOT EXISTS journal_post BEFORE UPDATE ON journals BEGIN
  SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE') WHERE OLD.status='posted' OR NEW.status<>'posted' OR NEW.org_id<>OLD.org_id OR NEW.id<>OLD.id OR NEW.clinic_id<>OLD.clinic_id OR NEW.date<>OLD.date OR NEW.ref_id<>OLD.ref_id OR NEW.ref_type<>OLD.ref_type;
  SELECT RAISE(ABORT,'PERIOD_LOCKED') WHERE NEW.date<=COALESCE((SELECT lock_date FROM accounting_settings WHERE org_id=NEW.org_id),'');
  SELECT RAISE(ABORT,'UNBALANCED_JOURNAL') WHERE NOT EXISTS (SELECT 1 FROM journal_lines WHERE org_id=NEW.org_id AND journal_id=NEW.id)
    OR (SELECT SUM(debit_paise)-SUM(credit_paise) FROM journal_lines WHERE org_id=NEW.org_id AND journal_id=NEW.id)<>0;
END;
CREATE TRIGGER IF NOT EXISTS journal_no_delete BEFORE DELETE ON journals BEGIN SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS journal_line_insert BEFORE INSERT ON journal_lines BEGIN
  SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE') WHERE NOT EXISTS (SELECT 1 FROM journals WHERE org_id=NEW.org_id AND id=NEW.journal_id AND status='draft');
END;
CREATE TRIGGER IF NOT EXISTS journal_line_update BEFORE UPDATE ON journal_lines BEGIN SELECT RAISE(ABORT,'JOURNAL_LINE_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS journal_line_delete BEFORE DELETE ON journal_lines BEGIN SELECT RAISE(ABORT,'JOURNAL_LINE_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS payment_insert BEFORE INSERT ON sale_payments BEGIN
  SELECT RAISE(ABORT,'SALE_IMMUTABLE') WHERE NOT EXISTS (SELECT 1 FROM sales WHERE org_id=NEW.org_id AND id=NEW.sale_id AND status='pending');
END;
CREATE TRIGGER IF NOT EXISTS payment_update BEFORE UPDATE ON sale_payments BEGIN SELECT RAISE(ABORT,'SALE_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS payment_delete BEFORE DELETE ON sale_payments BEGIN SELECT RAISE(ABORT,'SALE_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS sale_complete BEFORE UPDATE ON sales BEGIN
  SELECT RAISE(ABORT,'SALE_IMMUTABLE') WHERE OLD.status<>'pending' OR NEW.status<>'completed' OR NEW.org_id<>OLD.org_id OR NEW.id<>OLD.id OR NEW.total_paise<>OLD.total_paise OR NEW.net_paise<>OLD.net_paise OR NEW.tax_paise<>OLD.tax_paise OR NEW.cost_paise<>OLD.cost_paise OR NEW.cgst_paise<>OLD.cgst_paise OR NEW.sgst_paise<>OLD.sgst_paise OR NEW.igst_paise<>OLD.igst_paise OR NEW.reservation_id<>OLD.reservation_id OR NEW.clinic_id<>OLD.clinic_id OR NEW.created_at<>OLD.created_at OR NEW.created_by<>OLD.created_by;
  SELECT RAISE(ABORT,'PAYMENT_TOTAL_MISMATCH') WHERE NEW.total_paise<>COALESCE((SELECT SUM(amount_paise) FROM sale_payments WHERE org_id=NEW.org_id AND sale_id=NEW.id),0);
  SELECT RAISE(ABORT,'JOURNAL_REQUIRED') WHERE NOT EXISTS (SELECT 1 FROM journals WHERE org_id=NEW.org_id AND ref_type='sale' AND ref_id=NEW.id AND status='posted');
  SELECT RAISE(ABORT,'DISPENSE_REQUIRED') WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE org_id=NEW.org_id AND id=NEW.reservation_id AND status='dispensed');
END;
CREATE TRIGGER IF NOT EXISTS sale_no_delete BEFORE DELETE ON sales BEGIN SELECT RAISE(ABORT,'SALE_IMMUTABLE'); END;
