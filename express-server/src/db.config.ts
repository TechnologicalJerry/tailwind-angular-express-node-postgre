import { Pool, QueryResult } from "pg";
import { config } from "./config";

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: config.db.maxConnections,
  idleTimeoutMillis: config.db.idleTimeoutMs,
  connectionTimeoutMillis: config.db.connectionTimeoutMs,
  ssl: config.db.ssl ? { rejectUnauthorized: config.db.sslRejectUnauthorized } : false,
  application_name: "express-user-service",
});

const USERS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

export const db = {
  query<T>(text: string, values?: unknown[]): Promise<QueryResult<T>> {
    return pool.query<T>(text, values);
  },
  async initialize(): Promise<void> {
    await pool.query("SELECT 1");
    await pool.query(USERS_TABLE_SQL);
  },
  async healthcheck(): Promise<boolean> {
    try {
      await pool.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  },
  async close(): Promise<void> {
    await pool.end();
  },
};
