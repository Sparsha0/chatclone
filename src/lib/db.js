import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// NOTE: This is a workaround for a bug in Prisma 7.0.0
// https://github.com/prisma/prisma/issues/26305
// Add ssl config for Neon and other hosted Postgres providers when needed.
const poolConfig = { connectionString };
if (connectionString && (connectionString.includes("neon.tech") || connectionString.includes("sslmode=require"))) {
  poolConfig.ssl = { rejectUnauthorized: false };
}
const pool = new Pool(poolConfig);
const adapter = new PrismaPg(pool);

const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}

export default db;