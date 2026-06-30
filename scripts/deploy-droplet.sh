#!/usr/bin/env bash
# Update production after git push — same as WordPress "pull and refresh".
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — run: bash scripts/install-production.sh"
  exit 1
fi

echo "==> Pulling latest code..."
git pull --ff-only

echo "==> Rebuilding and restarting..."
docker compose up -d --build

echo "==> Waiting for health check..."
sleep 8
if curl -fsS "http://127.0.0.1/api/v1/health" >/dev/null 2>&1; then
  echo "OK — site is running"
else
  echo "Check logs: docker compose logs -f app"
fi
