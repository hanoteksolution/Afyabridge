import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const rawConnectionString =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!rawConnectionString) {
  console.error("Missing DATABASE_URL — check your .env file.");
  process.exit(1);
}

function connectionForPool(connectionString) {
  const needsRelaxedSsl =
    connectionString.includes("ondigitalocean.com") ||
    connectionString.includes("sslmode=require") ||
    process.env.NODE_ENV === "production";

  if (!needsRelaxedSsl) {
    return { connectionString, ssl: undefined };
  }

  let url = connectionString;
  try {
    const parsed = new URL(connectionString);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("ssl");
    url = parsed.toString();
  } catch {
    url = connectionString
      .replace(/[?&]sslmode=[^&]*/g, "")
      .replace(/\?&/, "?")
      .replace(/\?$/, "");
  }

  return { connectionString: url, ssl: { rejectUnauthorized: false } };
}

async function waitForDatabase() {
  let Pool;
  try {
    ({ Pool } = require("pg"));
  } catch {
    console.log("==> pg not found in image; skipping DB wait and starting app...");
    return;
  }

  const { connectionString, ssl } = connectionForPool(rawConnectionString);
  let lastError = null;

  for (let attempt = 1; attempt <= 30; attempt++) {
    const pool = new Pool({ connectionString, ssl, max: 1 });
    try {
      await pool.query("SELECT 1");
      await pool.end();
      console.log("==> Database is ready.");
      return;
    } catch (err) {
      lastError = err;
      await pool.end().catch(() => {});
      console.log(`Waiting for database (${attempt}/30)...`);
      if (attempt === 1 || attempt === 30) {
        console.log(`   last error: ${err?.message || err}`);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  throw new Error(
    `Database did not become ready in time. Last error: ${lastError?.message || lastError}`
  );
}

async function main() {
  console.log("==> Waiting for database...");
  await waitForDatabase();

  console.log("==> Starting application...");
  execSync("node server.js", { stdio: "inherit" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
