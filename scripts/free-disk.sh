#!/usr/bin/env bash
# Free disk on small droplets before Docker builds (safe — keeps running containers).
set -euo pipefail

echo "==> Disk before cleanup:"
df -h / | tail -1

echo "==> Removing dangling images..."
docker image prune -f

echo "==> Removing unused build cache older than 48h..."
docker builder prune -f --filter until=48h 2>/dev/null || docker builder prune -f

echo "==> Removing old .buildcache export (if present)..."
rm -rf .buildcache 2>/dev/null || true

echo "==> Disk after cleanup:"
df -h / | tail -1
