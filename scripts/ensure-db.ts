import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

const root = join(__dirname, "..");
const shell =
  process.platform === "win32"
    ? (process.env.ComSpec ?? "cmd.exe")
    : "/bin/sh";

function run(command: string) {
  return execSync(command, {
    cwd: root,
    encoding: "utf8",
    shell,
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
}

function readDirectDatabaseUrl() {
  const env = readFileSync(join(root, ".env"), "utf8");
  const match = env.match(/DIRECT_DATABASE_URL="([^"]+)"/);
  return match?.[1] ?? process.env.DIRECT_DATABASE_URL;
}

function isPrismaDevRunning(output: string) {
  const plain = output.replace(/\x1b\[[0-9;]*m/g, "");
  return /\bdefault\b[^\n]*\brunning\b/i.test(plain);
}

async function canConnect(connectionString?: string) {
  if (!connectionString) return false;
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 4_000,
  });
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  } finally {
    await pool.end().catch(() => {});
  }
}

async function waitForDatabase(connectionString?: string) {
  for (let attempt = 0; attempt < 20; attempt++) {
    if (await canConnect(connectionString)) return true;
    await new Promise((resolve) => setTimeout(resolve, 1_500));
    try {
      run("npx tsx scripts/sync-db-url.ts 2>&1");
    } catch {
      /* keep waiting */
    }
  }
  return false;
}

async function main() {
  let status = "";
  try {
    status = run("npx prisma dev ls 2>&1");
  } catch {
    /* not running */
  }

  if (!isPrismaDevRunning(status)) {
    console.log("Starting Prisma dev database...");
    run("npx prisma dev --detach 2>&1");
  } else {
    console.log("Prisma dev process is running.");
  }

  try {
    run("npx tsx scripts/sync-db-url.ts 2>&1");
  } catch {
    console.log("Waiting for Prisma dev to publish its TCP port...");
  }

  const url = readDirectDatabaseUrl();
  const ready = await waitForDatabase(url);
  if (!ready) {
    console.error(
      "Database is not accepting connections. Try:\n  npm run db:restart\n  npm run db:sync-url"
    );
    process.exit(1);
  }

  console.log("Database ready.");
}

main();
