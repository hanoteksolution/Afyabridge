# Production image for DigitalOcean Droplet / Docker
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
# ignore-scripts: postinstall runs prisma generate, but schema isn't copied yet
RUN npm install --no-audit --no-fund --ignore-scripts

FROM base AS builder
ARG DATABASE_URL
ARG DIRECT_DATABASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_DATABASE_URL=${DIRECT_DATABASE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_TYPESCRIPT_CHECK=1
ENV NODE_OPTIONS=--max-old-space-size=1536
RUN npx prisma generate
RUN npx next build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts/docker-entrypoint.mjs ./scripts/docker-entrypoint.mjs

# Minimal deps for db push/seed only — not the full builder node_modules (~500MB+)
RUN npm install --no-audit --no-fund --ignore-scripts \
    prisma@7.8.0 \
    tsx@4.22.4 \
    @prisma/client@7.8.0 \
    @prisma/adapter-pg@7.8.0 \
    pg@8.21.0 \
    bcryptjs@3.0.3 \
    dotenv@17.4.2 \
  && npx prisma generate \
  && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "scripts/docker-entrypoint.mjs"]
