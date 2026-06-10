import "dotenv/config";
import { PrismaClient } from "@prisma/client";

export type { PrismaClient };
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
  dbQueue: Promise<unknown>;
  resetting: Promise<void> | undefined;
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

function getPool() {
  if (!globalForPrisma.pgPool || isPoolEnded(globalForPrisma.pgPool)) {
    const isDev = process.env.NODE_ENV === "development";
    globalForPrisma.pgPool = new Pool({
      connectionString: getConnectionString(),
      // Prisma dev Postgres is fragile under many parallel connections.
      max: isDev ? 3 : 10,
      idleTimeoutMillis: isDev ? 30_000 : 30_000,
      connectionTimeoutMillis: isDev ? 15_000 : 10_000,
      keepAlive: true,
    });
  }
  return globalForPrisma.pgPool;
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg(getPool()),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export async function resetPrismaClient() {
  if (globalForPrisma.resetting) {
    await globalForPrisma.resetting;
    return;
  }

  globalForPrisma.resetting = (async () => {
    if (globalForPrisma.prisma) {
      await globalForPrisma.prisma.$disconnect().catch(() => {});
    }
    globalForPrisma.prisma = undefined;
  })();

  try {
    await globalForPrisma.resetting;
  } finally {
    globalForPrisma.resetting = undefined;
  }
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

/** Serialize DB work in dev — Prisma dev Postgres drops parallel connections. */
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  if (process.env.NODE_ENV !== "development") {
    return fn();
  }

  const tail = globalForPrisma.dbQueue ?? Promise.resolve();
  const next = tail.catch(() => {}).then(fn);
  globalForPrisma.dbQueue = next.catch(() => {});
  return next;
}

/** Retry when the DB connection was dropped. */
export async function withDbRetry<T>(fn: (db: PrismaClient) => Promise<T>): Promise<T> {
  return enqueue(async () => {
    const maxAttempts = 5;
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn(getPrismaClient());
      } catch (error) {
        lastError = error;
        if (!isConnectionError(error) || attempt === maxAttempts - 1) throw error;
        // Wait before retry; only reset the client after the first failure.
        if (attempt > 0) {
          await resetPrismaClient();
        }
        await sleep(400 * (attempt + 1));
      }
    }

    throw lastError;
  });
}

/** Always resolves to the current singleton (survives resetPrismaClient). */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function"
      ? (...args: unknown[]) =>
          enqueue(() =>
            (value as (...a: unknown[]) => unknown).apply(client, args)
          )
      : value;
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = getPrismaClient();
}
