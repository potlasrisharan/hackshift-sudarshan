import type { Env } from "../../context";
import { tenantDb } from "../../database";

/** Raw sources expire after 30 days; care withdrawal immediately blocks reads. */
export async function pruneCbcSources(env: Env, orgId: string) {
  if (!env.CBC_DOCUMENTS || !["test", "development"].includes(env.ENVIRONMENT))
    return;
  const db = tenantDb({ db: env.DB, orgId });
  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();
  const { results } = await db
    .statement(
      `SELECT id,document_key FROM cbc_reports WHERE org_id=:org AND document_key IS NOT NULL
    AND (deleted_at IS NOT NULL OR source_consent_at < ? OR EXISTS (SELECT 1 FROM consents c
      WHERE c.org_id=cbc_reports.org_id AND c.encounter_id=cbc_reports.encounter_id AND c.purpose='care' AND c.revoked_at IS NOT NULL)) LIMIT 3`,
      cutoff,
    )
    .all<{ id: string; document_key: string }>();
  for (const report of results) {
    await env.CBC_DOCUMENTS.delete(report.document_key);
    await db
      .statement(
        "UPDATE cbc_reports SET document_key=NULL,document_type=NULL WHERE org_id=:org AND id=? AND document_key=?",
        report.id,
        report.document_key,
      )
      .run();
  }
  // Reconcile uploads interrupted after R2.put but before metadata commit. A 24h
  // grace period prevents racing an in-flight upload; the namespace is tenant-scoped.
  const state = await db
    .statement("SELECT r2_cursor FROM cbc_maintenance WHERE org_id=:org")
    .first<{ r2_cursor: string | null }>();
  const objects = await env.CBC_DOCUMENTS.list({
    prefix: `${orgId}/cbc/`,
    cursor: state?.r2_cursor ?? undefined,
    limit: 10,
  });
  for (const object of objects.objects) {
    if (object.uploaded.getTime() > Date.now() - 86400000) continue;
    const linked = await db
      .statement(
        "SELECT id FROM cbc_reports WHERE org_id=:org AND document_key=? AND deleted_at IS NULL",
        object.key,
      )
      .first<{ id: string }>();
    if (!linked) await env.CBC_DOCUMENTS.delete(object.key);
  }
  await db
    .statement(
      "INSERT INTO cbc_maintenance(org_id,r2_cursor) VALUES(:org,?) ON CONFLICT(org_id) DO UPDATE SET r2_cursor=excluded.r2_cursor",
      objects.truncated ? objects.cursor : null,
    )
    .run();
}
