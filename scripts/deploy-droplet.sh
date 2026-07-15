#!/usr/bin/env bash
# Fast production update: pull + rebuild only what changed (persistent BuildKit cache).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — run: bash scripts/install-production.sh"
  exit 1
fi

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

CACHE_DIR="${ROOT}/.buildcache"
mkdir -p "$CACHE_DIR"

echo "==> Pulling latest code..."
OLD_HEAD="$(git rev-parse HEAD)"
git pull --ff-only
NEW_HEAD="$(git rev-parse HEAD)"

# Skip Docker rebuild when the update doesn't touch app/build inputs
if [[ "${FORCE_REBUILD:-}" != "1" && "$OLD_HEAD" != "$NEW_HEAD" ]]; then
  CHANGED="$(git diff --name-only "$OLD_HEAD" "$NEW_HEAD" || true)"
  if [[ -n "$CHANGED" ]] && ! echo "$CHANGED" | grep -qE '^(src/|prisma/|public/|package\.json|package-lock\.json|next\.config|tsconfig|postcss\.config|next-env|Dockerfile|\.dockerignore|scripts/docker-)'; then
    echo "==> No app/build files changed — restarting container only (no rebuild)."
    docker compose up -d --no-deps app
    sleep 5
    curl -fsS "http://127.0.0.1/api/v1/health" >/dev/null 2>&1 && echo "OK — site is running" || echo "Check logs: docker compose logs -f app"
    exit 0
  fi
fi

echo "==> Building app (reuses npm, Prisma, and Next.js caches when possible)..."
echo "    Cache directory: ${CACHE_DIR}"
START=$(date +%s)

# cache_from: previous image + local BuildKit cache (survives across deploys)
docker compose build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  app

ELAPSED=$(( $(date +%s) - START ))
echo "==> Build finished in ${ELAPSED}s"

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
