# Production image — optimized for incremental rebuilds (BuildKit layer + mount caches).
# Slim runner: Next.js standalone only (no second npm install).
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# --- dependencies (cached unless package-lock.json changes) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm install --no-audit --no-fund --ignore-scripts

# --- build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
# Prisma generate only re-runs when schema / config change
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY . .

# Build-time env after source copy so URL-only changes don't redo npm/prisma layers
ARG DATABASE_URL
ARG DIRECT_DATABASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_DATABASE_URL=${DIRECT_DATABASE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_TYPESCRIPT_CHECK=1
ENV NODE_OPTIONS=--max-old-space-size=1536

# Reuse Next.js compile cache across builds (code-only updates stay much faster)
RUN --mount=type=cache,target=/app/.next/cache \
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
  && mkdir -p /app/public/uploads \
  && chown -R nextjs:nodejs /app/public/uploads

USER root
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "./scripts/docker-start.sh"]
