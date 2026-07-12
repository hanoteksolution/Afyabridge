#!/usr/bin/env bash
# Fast production update: pull + rebuild only what changed (keeps Docker/BuildKit caches).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — run: bash scripts/install-production.sh"
  exit 1
fi

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "==> Pulling latest code..."
git pull --ff-only

echo "==> Building app (cached layers + Next.js cache; deps skipped if lockfile unchanged)..."
# Build only the app service — do not restart/rebuild Caddy unless needed
docker compose build app

echo "==> Restarting app (Caddy left running)..."
docker compose up -d --no-deps app

echo "==> Waiting for health check..."
sleep 8
if curl -fsS "http://127.0.0.1/api/v1/health" >/dev/null 2>&1; then
  echo "OK — site is running"
else
  echo "Check logs: docker compose logs -f app"
  exit 1
fi
