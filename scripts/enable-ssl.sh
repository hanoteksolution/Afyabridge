#!/usr/bin/env bash
# Enable HTTPS after DNS A records point to this droplet.
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

resolve_a() {
  local host="$1"
  dig +short A "${host}" 2>/dev/null | grep -E '^[0-9]+\.' | head -1 || true
}

server_ipv4() {
  curl -4fsS --max-time 5 https://ifconfig.me/ip 2>/dev/null \
    || curl -4fsS --max-time 5 http://ifconfig.me/ip 2>/dev/null \
    || true
}

echo "==> Checking DNS (must point to THIS droplet before HTTPS works)..."
SERVER_IP="$(server_ipv4)"
APEX_IP="$(resolve_a "${DOMAIN}")"
WWW_IP="$(resolve_a "www.${DOMAIN}")"

echo "   Server IPv4:        ${SERVER_IP:-unknown}"
echo "   ${DOMAIN} A:        ${APEX_IP:-NOT SET}"
echo "   www.${DOMAIN} A:    ${WWW_IP:-NOT SET (optional but recommended)}"

DNS_OK=true
if [[ -z "${SERVER_IP}" ]]; then
  echo "WARNING: Could not detect this server's public IPv4."
elif [[ "${APEX_IP}" != "${SERVER_IP}" ]]; then
  echo ""
  echo "ERROR: ${DOMAIN} does NOT point to this server."
  echo "       Expected A record → ${SERVER_IP}"
  echo "       Currently resolves → ${APEX_IP:-nothing}"
  echo ""
  echo "Update DNS at your registrar, then wait 5–30 minutes and re-run:"
  echo "  bash scripts/enable-ssl.sh"
  echo ""
  DNS_OK=false
fi

if [[ -n "${WWW_IP}" && -n "${SERVER_IP}" && "${WWW_IP}" != "${SERVER_IP}" ]]; then
  echo ""
  echo "WARNING: www.${DOMAIN} points to ${WWW_IP}, not ${SERVER_IP}."
  echo "         Add/update:  www  →  A  →  ${SERVER_IP}"
  echo "         (or CNAME www → ${DOMAIN})"
  echo ""
fi

if [[ "${DNS_OK}" == "false" ]]; then
  exit 1
fi

echo "==> Updating app URLs to ${HTTPS_URL}..."
if [[ "$(uname -s)" == "Darwin" ]]; then
  sed -i '' "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=${HTTPS_URL}|" .env
  sed -i '' "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${HTTPS_URL}|" .env
else
  sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=${HTTPS_URL}|" .env
  sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${HTTPS_URL}|" .env
fi

if ! grep -q '^AUTH_TRUST_HOST=' .env; then
  echo "AUTH_TRUST_HOST=true" >> .env
fi

echo "==> Rebuilding app (NEXT_PUBLIC_SITE_URL baked into client bundle)..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker compose build app

echo "==> Restarting stack (Caddy will request Let's Encrypt certificates)..."
docker compose up -d --force-recreate caddy app

echo "==> Waiting for certificates..."
sleep 15

HTTPS_OK=false
if curl -fsSI "https://${DOMAIN}/api/v1/health" 2>/dev/null | grep -qi "HTTP/"; then
  HTTPS_OK=true
fi

echo ""
if [[ "${HTTPS_OK}" == "true" ]]; then
  echo "============================================"
  echo "  HTTPS is live: ${HTTPS_URL}"
  echo "  www redirects: https://www.${DOMAIN} → ${HTTPS_URL}"
  echo "  Admin:         ${HTTPS_URL}/admin/login"
  echo "============================================"
  echo ""
  echo "Use https://${DOMAIN} (no www) as the canonical URL."
else
  echo "HTTPS not ready yet. Check:"
  echo "  1. DNS A record for ${DOMAIN} → ${SERVER_IP}"
  echo "  2. DNS A/CNAME for www.${DOMAIN} → ${SERVER_IP}"
  echo "  3. Ports 80 and 443 open (DigitalOcean Cloud Firewall + ufw)"
  echo "  4. docker compose logs caddy"
  echo ""
  echo "Retry after DNS propagates: bash scripts/enable-ssl.sh"
  exit 1
fi
