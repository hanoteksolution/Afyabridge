import "dotenv/config";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

/** Standard PostgreSQL URL (not prisma+postgres proxy). */
export function getDatabaseUrl() {
  const direct = process.env.DIRECT_DATABASE_URL;
  const url = process.env.DATABASE_URL;

  if (direct && !direct.startsWith("prisma+")) {
    return direct;
  }

  if (url && !url.startsWith("prisma+")) {
    return url;
  }

  throw new Error(
    "Set DATABASE_URL or DIRECT_DATABASE_URL to a postgresql:// connection string. " +
      "Example: postgresql://postgres:postgres@localhost:5432/afya"
  );
}

function poolSsl(connectionString: string) {
  if (
    process.env.NODE_ENV === "production" ||
    connectionString.includes("sslmode=require") ||
    connectionString.includes("ondigitalocean.com")
  ) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

function createPool() {
  const connectionString = getDatabaseUrl();
  const isDev = process.env.NODE_ENV === "development";
  return new Pool({
    connectionString,
    ssl: poolSsl(connectionString),
    max: isDev ? 5 : 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: isDev ? 15_000 : 10_000,
    keepAlive: true,
  });
}

export function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = createPool();
  }
  return globalForDb.pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return getPool().query<T>(text, params);
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const result = await query<T>(text, params);
  return result.rows[0] ?? null;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function checkDatabaseConnection() {
  await query("SELECT 1 AS ok");
}
