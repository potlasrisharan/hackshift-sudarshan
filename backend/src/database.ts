export type DbValue = string | number | null;
export type WriteResult = { meta: { changes: number } };
export interface Statement {
  bind(...values: DbValue[]): Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<WriteResult>;
}
export interface Database {
  prepare(sql: string): Statement;
  batch(statements: Statement[]): Promise<WriteResult[]>;
}
/** Scoped repository SQL uses the organization as its first bound parameter.
 * Named :org markers are compiled here so write SET values cannot displace it.
 */
export function tenantDb(context: { db: Database; orgId: string }) {
  return {
    statement(sql: string, ...values: DbValue[]) {
      const parts = sql.split(":org");
      if (parts.length !== 2 || !/\borg_id\b/.test(sql))
        throw new Error("Expected exactly one tenant marker");
      const before = (parts[0]?.match(/\?/g) ?? []).length;
      const parameters = [...values];
      parameters.splice(before, 0, context.orgId);
      return context.db.prepare(sql.replace(":org", "?")).bind(...parameters);
    },
    batch(statements: Statement[]) {
      return context.db.batch(statements);
    },
  };
}
