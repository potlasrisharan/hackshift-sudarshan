// Local Node adapter only. This file is never imported by the Cloudflare Worker.
import { DatabaseSync } from "node:sqlite";
import type {
  Database,
  DbValue,
  Statement,
  WriteResult,
} from "../src/database";

class LocalStatement implements Statement {
  values: DbValue[] = [];
  constructor(
    private database: DatabaseSync,
    private sql: string,
  ) {}
  bind(...values: DbValue[]) {
    this.values = values;
    return this;
  }
  async first<T>(): Promise<T | null> {
    return (
      (this.database.prepare(this.sql).get(...this.values) as T | undefined) ??
      null
    );
  }
  async all<T>() {
    return {
      results: this.database.prepare(this.sql).all(...this.values) as T[],
    };
  }
  execute(): WriteResult {
    const result = this.database.prepare(this.sql).run(...this.values);
    return { meta: { changes: Number(result.changes) } };
  }
  async run() {
    return this.execute();
  }
}
export class LocalDatabase implements Database {
  readonly raw: DatabaseSync;
  constructor(path = ":memory:") {
    this.raw = new DatabaseSync(path);
    this.raw.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
  }
  prepare(sql: string) {
    return new LocalStatement(this.raw, sql);
  }
  async batch(statements: Statement[]) {
    this.raw.exec("BEGIN IMMEDIATE");
    try {
      // No await inside the transaction: another request cannot interleave.
      const results = statements.map((statement) => {
        if (!(statement instanceof LocalStatement))
          throw new Error("Foreign statement");
        return statement.execute();
      });
      this.raw.exec("COMMIT");
      return results;
    } catch (error) {
      this.raw.exec("ROLLBACK");
      throw error;
    }
  }
  close() {
    this.raw.close();
  }
}
