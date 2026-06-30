import { execSync } from "node:child_process";
import { Pool } from "pg";

const connectionString =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL — check your .env file.");
  process.exit(1);
}

async function waitForDatabase() {
  for (let attempt = 1; attempt <= 30; attempt++) {
    const pool = new Pool({ connectionString, max: 1 });
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

async function userCount() {
  const pool = new Pool({ connectionString, max: 1 });
  try {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS count FROM "User"'
    );
    return rows[0]?.count ?? 0;
  } catch {
    return 0;
  } finally {
    await pool.end().catch(() => {});
  }
}

async function main() {
  console.log("==> Waiting for database...");
  await waitForDatabase();

  console.log("==> Applying database schema...");
  execSync("npx prisma db push", { stdio: "inherit" });

  const count = await userCount();
  if (count === 0) {
    console.log("==> First run — creating admin user and demo content...");
    execSync("npx prisma db seed", { stdio: "inherit" });
    console.log("==> Default login: admin@afyabridge.com / admin123");
  }

  console.log("==> Starting application...");
  execSync("node server.js", { stdio: "inherit" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
