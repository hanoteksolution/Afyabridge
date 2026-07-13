#!/usr/bin/env bash
# Diagnose DNS + HTTPS for production.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env"
  exit 1
fi

# shellcheck disable=SC1091
source <(grep -E '^DOMAIN=' .env | sed 's/^/export /')
DOMAIN="${DOMAIN:-afyabridge.com}"

resolve_a() {
  dig +short A "$1" 2>/dev/null | grep -E '^[0-9]+\.' || true
}

server_ipv4() {
  curl -4fsS --max-time 5 https://ifconfig.me/ip 2>/dev/null \
    || curl -4fsS --max-time 5 http://ifconfig.me/ip 2>/dev/null \
    || true
}

SERVER_IP="$(server_ipv4)"

echo "=== SSL / DNS diagnostic ==="
echo "Server IPv4:     ${SERVER_IP:-unknown}"
echo ""
echo "${DOMAIN}:"
resolve_a "${DOMAIN}" | while read -r ip; do
  if [[ "${ip}" == "${SERVER_IP}" ]]; then
    echo "  A  ${ip}  ✓ points to this droplet"
  else
    echo "  A  ${ip}  ✗ WRONG (should be ${SERVER_IP})"
  fi
done
echo ""
echo "www.${DOMAIN}:"
WWW="$(resolve_a "www.${DOMAIN}")"
if [[ -z "${WWW}" ]]; then
  echo "  (no A record — add www → ${SERVER_IP} or CNAME www → ${DOMAIN})"
else
  echo "${WWW}" | while read -r ip; do
    if [[ "${ip}" == "${SERVER_IP}" ]]; then
      echo "  A  ${ip}  ✓ points to this droplet"
    else
      echo "  A  ${ip}  ✗ WRONG (should be ${SERVER_IP})"
    fi
  done
fi

echo ""
echo "=== Local HTTPS test ==="
for host in "${DOMAIN}" "www.${DOMAIN}"; do
  echo -n "${host}: "
  if curl -fsSI --max-time 8 "https://${host}/api/v1/health" 2>/dev/null | head -1; then
    :
  else
    echo "FAILED (no valid HTTPS)"
  fi
done

echo ""
echo "=== Caddy logs (last 20 lines) ==="
docker compose logs --tail=20 caddy 2>/dev/null || true
