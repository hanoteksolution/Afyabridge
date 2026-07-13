#!/usr/bin/env bash
# Enable HTTPS after DNS A record points to this droplet.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — run: bash scripts/install-production.sh"
  exit 1
fi

# shellcheck disable=SC1091
source <(grep -E '^(DOMAIN|ACME_EMAIL|NEXTAUTH_URL|NEXT_PUBLIC_SITE_URL)=' .env | sed 's/^/export /')

if [[ -z "${DOMAIN:-}" || "${DOMAIN}" == "your-domain.com" || "${DOMAIN}" == "localhost" ]]; then
  echo "Set DOMAIN=afyabridge.com in .env first."
  exit 1
fi

if [[ -z "${ACME_EMAIL:-}" || "${ACME_EMAIL}" == "you@your-domain.com" ]]; then
  echo "Set ACME_EMAIL=your@email.com in .env for Let's Encrypt."
  exit 1
fi

HTTPS_URL="https://${DOMAIN}"

echo "==> Updating app URLs to ${HTTPS_URL}..."
if [[ "$(uname -s)" == "Darwin" ]]; then
  sed -i '' "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=${HTTPS_URL}|" .env
  sed -i '' "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${HTTPS_URL}|" .env
else
  sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=${HTTPS_URL}|" .env
  sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${HTTPS_URL}|" .env
fi

# Ensure AUTH_TRUST_HOST for production behind Caddy
if ! grep -q '^AUTH_TRUST_HOST=' .env; then
  echo "AUTH_TRUST_HOST=true" >> .env
fi

echo "==> Checking DNS (A record should point to this server)..."
RESOLVED="$(getent hosts "${DOMAIN}" 2>/dev/null | awk '{print $1}' | head -1 || true)"
PUBLIC_IP="$(curl -fsS --max-time 5 https://ifconfig.me 2>/dev/null || curl -fsS --max-time 5 http://ifconfig.me 2>/dev/null || true)"
echo "   ${DOMAIN} resolves to: ${RESOLVED:-unknown}"
echo "   This server public IP: ${PUBLIC_IP:-unknown}"

echo "==> Rebuilding app (NEXT_PUBLIC_SITE_URL baked into client bundle)..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker compose build app

echo "==> Restarting stack (Caddy will request Let's Encrypt certificate)..."
docker compose up -d

echo "==> Waiting for HTTPS..."
sleep 12

if curl -fsSI "https://${DOMAIN}/api/v1/health" >/dev/null 2>&1; then
  echo ""
  echo "============================================"
  echo "  HTTPS is live: ${HTTPS_URL}"
  echo "  Admin:         ${HTTPS_URL}/admin/login"
  echo "============================================"
else
  echo ""
  echo "HTTPS not ready yet. Check:"
  echo "  1. DNS A record for ${DOMAIN} → droplet IP"
  echo "  2. Ports 80 and 443 open in firewall"
  echo "  3. docker compose logs caddy"
  echo ""
  echo "Retry: bash scripts/enable-ssl.sh"
fi
