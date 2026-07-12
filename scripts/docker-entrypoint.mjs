import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const connectionString =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL — check your .env file.");
  process.exit(1);
}

async function waitForDatabase() {
  let Pool;
  try {
    ({ Pool } = require("pg"));
  } catch {
    console.log("==> pg not found in image; skipping DB wait and starting app...");
    return;
  }

  for (let attempt = 1; attempt <= 30; attempt++) {
    const pool = new Pool({ connectionString, max: 1, ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined });
    try {
      await pool.query("SELECT 1");
      await pool.end();
      return;
    } catch {
      await pool.end().catch(() => {});
      console.log(`Waiting for database (${attempt}/30)...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Database did not become ready in time.");
}

async function main() {
  console.log("==> Waiting for database...");
  await waitForDatabase();

  console.log("==> Starting application...");
  console.log("==> Tip: first-time schema/seed → bash scripts/init-production-db.sh");
  execSync("node server.js", { stdio: "inherit" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
