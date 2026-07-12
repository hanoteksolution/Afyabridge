#!/usr/bin/env bash
# One-time (or occasional) DB schema + seed using a temporary container.
# Does not bloat the production app image. Safe to re-run (seed uses upserts).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — configure DATABASE_URL first."
  exit 1
fi

echo "==> Applying schema + seed via temporary Node container..."
docker run --rm \
  --env-file .env \
  -v "$ROOT/prisma:/app/prisma:ro" \
  -v "$ROOT/prisma.config.ts:/app/prisma.config.ts:ro" \
  -v "$ROOT/package.json:/app/package.json:ro" \
  -w /app \
  node:20-alpine \
  sh -c 'npm install --no-audit --no-fund --ignore-scripts prisma@7.8.0 @prisma/client@7.8.0 @prisma/adapter-pg@7.8.0 pg@8.21.0 bcryptjs@3.0.3 dotenv@17.4.2 tsx@4.22.4 && npx prisma generate && npx prisma db push && npx prisma db seed'

echo ""
echo "Done. Admin (first seed): admin@afyabridge.com / admin123"
echo "Change the password after first login."
