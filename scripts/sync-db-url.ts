import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const envPath = join(__dirname, "..", ".env");
let content = readFileSync(envPath, "utf8");

// Parse before stripping OSC hyperlinks — Prisma embeds the TCP URL inside them
const raw = execSync("npx prisma dev ls 2>&1", {
  cwd: join(__dirname, ".."),
  encoding: "utf8",
  shell: true,
  env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
});

const match =
  raw.match(/postgres:\/\/postgres:postgres@(?:localhost|127\.0\.0\.1):(\d+)\/template1/) ??
  raw.match(/localhost:(\d+)\/template1/) ??
  raw.match(/localhost -p (\d+) -U postgres/);
if (!match) {
  console.log("Prisma dev not running. Start it with: npm run db:dev");
  process.exit(1);
}

const port = match[1];
const tcpUrl = `postgresql://postgres:postgres@127.0.0.1:${port}/template1?sslmode=disable&connection_limit=10`;

if (!/DIRECT_DATABASE_URL="[^"]*"/.test(content)) {
  console.log("DIRECT_DATABASE_URL not found in .env");
  process.exit(1);
}

content = content.replace(/DIRECT_DATABASE_URL="[^"]*"/, `DIRECT_DATABASE_URL="${tcpUrl}"`);
writeFileSync(envPath, content);
console.log(`Updated DIRECT_DATABASE_URL to port ${port}`);
