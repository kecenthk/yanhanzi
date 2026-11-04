import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../db/schema";

type Database = MySql2Database<typeof schema>;

let pool: mysql.Pool | null = null;
let database: Database | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDb(): Database | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!pool) {
    pool = mysql.createPool({ uri: url, connectionLimit: 5, waitForConnections: true, enableKeepAlive: true });
  }
  database ??= drizzle(pool, { schema, mode: "default" });
  return database;
}
