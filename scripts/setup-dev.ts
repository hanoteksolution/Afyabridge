/**
 * One-command local setup for new team members after git clone.
 * Usage: npm run setup   (install + DB + seed + ready to dev)
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

const root = join(__dirname, "..");
const envPath = join(root, ".env");
const devExample = join(root, "env.development.example");

const shell =
  process.platform === "win32"
    ? (process.env.ComSpec ?? "cmd.exe")
    : "/bin/sh";

function run(command: string, opts?: { silent?: boolean }) {
  execSync(command, {
    cwd: root,
    stdio: opts?.silent ? "pipe" : "inherit",
    shell,
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
}

function readDirectUrl() {
  const env = readFileSync(envPath, "utf8");
  const match = env.match(/DIRECT_DATABASE_URL="([^"]+)"/);
  return match?.[1];
}

async function waitForDb(url: string, attempts = 30) {
  for (let i = 1; i <= attempts; i++) {
    const pool = new Pool({ connectionString: url, max: 1 });
    try {
      await pool.query("SELECT 1");
      await pool.end();
      return;
    } catch {
      await pool.end().catch(() => {});
      console.log(`Waiting for database (${i}/${attempts})...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Database did not become ready. Try: npm run db:restart && npm run setup:dev");
}

async function main() {
  console.log("\n=== Afya Bridge — local development setup ===\n");

  if (!existsSync(envPath)) {
    if (!existsSync(devExample)) {
      console.error("Missing env.development.example");
      process.exit(1);
    }
    copyFileSync(devExample, envPath);
    console.log("Created .env from env.development.example");
  } else {
    console.log("Using existing .env");
  }

  console.log("\n==> Starting local PostgreSQL (Prisma dev)...");
  try {
    run("npx prisma dev --detach", { silent: true });
  } catch {
    console.log("Prisma dev may already be running — continuing.");
  }

  await new Promise((r) => setTimeout(r, 4000));

  console.log("==> Syncing database URL...");
  run("npx tsx scripts/sync-db-url.ts");

  const directUrl = readDirectUrl();
  if (!directUrl) {
    console.error("DIRECT_DATABASE_URL missing in .env");
    process.exit(1);
  }

  await waitForDb(directUrl);

  console.log("\n==> Applying database schema...");
  run("npx prisma db push");

  console.log("\n==> Seeding company content (pages, menus, admin user)...");
  run("npx prisma db seed");

  console.log(`
============================================
  Setup complete!

  Start the app:  npm run dev

  Website:  http://localhost:3000
  Admin:    http://localhost:3000/admin/login

  Login:    admin@afyabridge.com
  Password: admin123

  Re-seed anytime:  npm run db:seed
  Reset database:   npm run db:reset
============================================
`);
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message ?? err);
  process.exit(1);
});
