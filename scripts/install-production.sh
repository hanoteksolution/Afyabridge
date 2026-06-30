#!/usr/bin/env bash
# One-time production install — like WordPress "upload and run".
# Requires: Docker + Docker Compose (docker compose)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed."
  echo "Install it first: https://docs.docker.com/engine/install/"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is missing. Install Docker Compose v2."
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "==> Creating .env from template..."
  cp .env.example .env

  AUTH_SECRET="$(openssl rand -base64 32)"
  POSTGRES_PASSWORD="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)"

  if [[ "$(uname -s)" == "Darwin" ]]; then
    sed -i '' "s|^AUTH_SECRET=.*|AUTH_SECRET=\"${AUTH_SECRET}\"|" .env
    sed -i '' "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=\"${POSTGRES_PASSWORD}\"|" .env
  else
    sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=\"${AUTH_SECRET}\"|" .env
    sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=\"${POSTGRES_PASSWORD}\"|" .env
  fi

  echo ""
  echo "Edit .env and set your DOMAIN, then run this script again:"
  echo "  nano .env"
  echo ""
  exit 0
fi

# shellcheck disable=SC1091
source <(grep -E '^(DOMAIN|NEXTAUTH_URL|NEXT_PUBLIC_SITE_URL)=' .env | sed 's/^/export /')

if [[ -z "${DOMAIN:-}" || "${DOMAIN}" == "your-domain.com" ]]; then
  echo "Set DOMAIN=your-real-domain.com in .env before continuing."
  exit 1
fi

if grep -q 'your-domain.com' .env; then
  echo "Update NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL in .env to match your domain."
  exit 1
fi

echo "==> Building and starting (app + database + HTTPS)..."
docker compose up -d --build

echo ""
echo "==> Waiting for the site..."
sleep 8

if curl -fsS "http://127.0.0.1/api/v1/health" >/dev/null 2>&1 || \
   curl -fsS "http://127.0.0.1:80/api/v1/health" >/dev/null 2>&1; then
  echo "Health check OK."
else
  echo "Still starting — check logs: docker compose logs -f app"
fi

echo ""
echo "============================================"
echo "  Site:  https://${DOMAIN}"
echo "  Admin: https://${DOMAIN}/admin/login"
echo "  Login: admin@afyabridge.com / admin123"
echo "  (change password after first login)"
echo "============================================"
echo ""
echo "Updates later: git pull && docker compose up -d --build"
