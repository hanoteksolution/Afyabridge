# Production image — incremental rebuilds via BuildKit layer + persistent cache mounts.
# Slim runner: Next.js standalone only (no second npm install).
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# --- dependencies (cached unless package-lock.json changes) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,id=afya-npm \
  npm install --no-audit --no-fund --ignore-scripts

# --- build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN --mount=type=cache,target=/root/.cache/prisma,id=afya-prisma \
  npx prisma generate

# Config first, then app source (smaller context; clearer layer boundaries)
COPY next.config.ts tsconfig.json postcss.config.mjs ./
# next-env.d.ts is gitignored; Next expects it for types — create before build
RUN printf '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n' > next-env.d.ts
COPY public ./public
COPY src ./src
COPY scripts/docker-entrypoint.mjs scripts/docker-start.sh ./scripts/

ARG DATABASE_URL
ARG DIRECT_DATABASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_DATABASE_URL=${DIRECT_DATABASE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_TYPESCRIPT_CHECK=1
ENV NODE_OPTIONS=--max-old-space-size=1536

# Persistent Next.js compile cache (speeds code-only updates on the droplet)
RUN --mount=type=cache,target=/app/.next/cache,id=afya-next-cache \
  npx next build

# --- runtime ---
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN apk add --no-cache su-exec \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.mjs ./scripts/docker-entrypoint.mjs
COPY --from=builder /app/scripts/docker-start.sh ./scripts/docker-start.sh
RUN chmod +x ./scripts/docker-start.sh \
  && mkdir -p /app/data/uploads \
  && chown -R nextjs:nodejs /app/data/uploads

USER root
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "./scripts/docker-start.sh"]
