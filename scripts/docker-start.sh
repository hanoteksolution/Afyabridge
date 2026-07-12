#!/bin/sh
set -e
# Volume mounts are often root-owned; app runs as nextjs (uid 1001)
mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads
chmod 775 /app/public/uploads
exec su-exec nextjs node /app/scripts/docker-entrypoint.mjs
