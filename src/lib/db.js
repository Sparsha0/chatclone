import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// NOTE: This is a workaround for a bug in Prisma 7.0.0
// https://github.com/prisma/prisma/issues/26305
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}

export default db;