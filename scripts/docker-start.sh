#!/bin/sh
set -e
# Volume mounts are often root-owned; app runs as nextjs (uid 1001)
UPLOAD_DIR="${UPLOAD_DIR:-/app/data/uploads}"
mkdir -p "$UPLOAD_DIR"
chown -R nextjs:nodejs "$UPLOAD_DIR"
chmod 775 "$UPLOAD_DIR"
exec su-exec nextjs node /app/scripts/docker-entrypoint.mjs
