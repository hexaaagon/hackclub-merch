import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

let _sql: ReturnType<typeof neon> | null = null;
let _db: NeonHttpDatabase | null = null;

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please check your .env file.",
    );
  }
  return connectionString;
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    if (!_sql) {
      _sql = neon(getConnectionString());
    }
    return Reflect.get(_sql, prop);
  },
  apply(_target, thisArg, args) {
    if (!_sql) {
      _sql = neon(getConnectionString());
    }
    return Reflect.apply(_sql as unknown as CallableFunction, thisArg, args);
  },
});

export const db = new Proxy({} as NeonHttpDatabase, {
  get(_target, prop) {
    if (!_db) {
      if (!_sql) {
        _sql = neon(getConnectionString());
      }
      _db = drizzle({ client: _sql });
    }
    return Reflect.get(_db, prop);
  },
});
