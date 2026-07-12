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

# Docker --env-file keeps literal quotes; strip them for Prisma.
read_env() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" .env | tail -n1 || true)"
  if [[ -z "$line" ]]; then
    echo ""
    return
  fi
  local value="${line#*=}"
  value="${value%$'\r'}"
  value="${value#\"}"
  value="${value%\"}"
  value="${value#\'}"
  value="${value%\'}"
  printf '%s' "$value"
}

DATABASE_URL="$(read_env DATABASE_URL)"
DIRECT_DATABASE_URL="$(read_env DIRECT_DATABASE_URL)"

if [[ -z "$DATABASE_URL" && -z "$DIRECT_DATABASE_URL" ]]; then
  echo "DATABASE_URL / DIRECT_DATABASE_URL missing in .env"
  exit 1
fi

# Prefer DIRECT for Prisma CLI
export DATABASE_URL="${DIRECT_DATABASE_URL:-$DATABASE_URL}"
export DIRECT_DATABASE_URL="${DIRECT_DATABASE_URL:-$DATABASE_URL}"

echo "==> DB host check (scheme must be postgresql://)..."
echo "DATABASE_URL starts with: ${DATABASE_URL%%://*}://"

if [[ "$DATABASE_URL" != postgresql://* && "$DATABASE_URL" != postgres://* ]]; then
  echo "Invalid DATABASE_URL scheme. Edit .env — use no quotes around the URL."
  echo "Example:"
  echo "DATABASE_URL=postgresql://user:pass@host:25060/db?sslmode=require"
  exit 1
fi

echo "==> Applying schema + seed via temporary Node container..."
docker run --rm \
  -e DATABASE_URL \
  -e DIRECT_DATABASE_URL \
  -e NODE_ENV=production \
  -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
  -v "$ROOT/prisma:/app/prisma:ro" \
  -v "$ROOT/prisma.config.ts:/app/prisma.config.ts:ro" \
  -v "$ROOT/package.json:/app/package.json:ro" \
  -w /app \
  node:20-alpine \
  sh -c 'npm install --no-audit --no-fund --ignore-scripts prisma@7.8.0 @prisma/client@7.8.0 @prisma/adapter-pg@7.8.0 pg@8.21.0 bcryptjs@3.0.3 dotenv@17.4.2 tsx@4.22.4 && npx prisma generate && npx prisma db push && npx prisma db seed'

echo ""
echo "Done. Admin (first seed): admin@afyabridge.com / admin123"
echo "Change the password after first login."
