import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value: string | undefined, fallbackValue: number): number => {
  if (!value) {
    return fallbackValue;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isNaN(parsedValue) ? fallbackValue : parsedValue;
};

const parseBoolean = (value: string | undefined, fallbackValue: boolean): boolean => {
  if (!value) {
    return fallbackValue;
  }

  return value.toLowerCase() === "true";
};

export const config = {
  environment: process.env.NODE_ENV ?? "development",
  port: parseNumber(process.env.PORT, 8080),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: parseNumber(process.env.DB_PORT, 5432),
    database: process.env.DB_NAME ?? "postgres",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    ssl: parseBoolean(process.env.DB_SSL, false),
    sslRejectUnauthorized: parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, true),
    maxConnections: parseNumber(process.env.DB_MAX_CONNECTIONS, 10),
    idleTimeoutMs: parseNumber(process.env.DB_IDLE_TIMEOUT_MS, 10000),
    connectionTimeoutMs: parseNumber(process.env.DB_CONNECTION_TIMEOUT_MS, 5000),
  },
} as const;