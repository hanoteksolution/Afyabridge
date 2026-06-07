import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getConnectionString() {
  const connectionString =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_DATABASE_URL must be set");
  }

  if (connectionString.startsWith("prisma+")) {
    throw new Error(
      "Set DIRECT_DATABASE_URL to the TCP postgres:// URL from `npx prisma dev` (press t). Do not use prisma+postgres:// in application code."
    );
  }

  return connectionString;
}

function isPoolEnded(pool: Pool) {
  return Boolean((pool as Pool & { ended?: boolean }).ended);
}

function createPool() {
  const isDev = process.env.NODE_ENV === "development";
  return new Pool({
    connectionString: getConnectionString(),
    max: isDev ? 5 : 10,
    idleTimeoutMillis: isDev ? 60_000 : 30_000,
    connectionTimeoutMillis: isDev ? 30_000 : 10_000,
    keepAlive: true,
  });
}

function getPool() {
  if (!globalForPrisma.pgPool || isPoolEnded(globalForPrisma.pgPool)) {
    globalForPrisma.pgPool = createPool();
  }
  return globalForPrisma.pgPool;
}

function createPrismaClient() {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrismaClient() {
  const poolStale =
    globalForPrisma.pgPool && isPoolEnded(globalForPrisma.pgPool);
  if (!globalForPrisma.prisma || poolStale) {
    if (poolStale) resetPrismaClient();
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export function resetPrismaClient() {
  globalForPrisma.prisma = undefined;
  globalForPrisma.pgPool = undefined;
}

function isConnectionError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  const message = e.message ?? "";
  return (
    e.code === "P1017" ||
    e.code === "P1001" ||
    e.code === "ECONNRESET" ||
    e.code === "ECONNREFUSED" ||
    message.includes("Server has closed the connection") ||
    message.includes("Connection terminated unexpectedly") ||
    message.includes("pool after calling end") ||
    message.includes("ConnectionClosed") ||
    message.includes("timeout exceeded")
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Retry after resetting the pool when the DB connection was dropped. */
export async function withDbRetry<T>(fn: (db: PrismaClient) => Promise<T>): Promise<T> {
  const maxAttempts = 4;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn(getPrismaClient());
    } catch (error) {
      lastError = error;
      if (!isConnectionError(error) || attempt === maxAttempts - 1) throw error;
      resetPrismaClient();
      await sleep(500 * (attempt + 1));
    }
  }

  throw lastError;
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
