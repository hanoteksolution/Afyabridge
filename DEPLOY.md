# Afya Bridge — Production Deployment Guide

**Repository:** https://github.com/hanoteksolution/Afyabridge  
**Stack:** Next.js 16 · Docker · Caddy (HTTPS) · DigitalOcean Managed PostgreSQL  
**Audience:** Server / DevOps team responsible for hosting the production environment

---

## 1. Overview

Afya Bridge is deployed as a containerized application. The production stack consists of two containers plus a managed database:

| Service | Purpose |
|---------|---------|
| **app** | Next.js website and admin panel |
| **caddy** | Reverse proxy with automatic HTTPS (Let's Encrypt) |
| **DO Managed PostgreSQL** | External managed database service |

No Node.js, Nginx, or PostgreSQL installation is required on the droplet. Docker and Docker Compose are the only prerequisites.

On first startup, the application automatically applies the database schema and seeds default content (pages, menus, admin user) when the database is empty.

---

## 2. Server Requirements

| Item | Requirement |
|------|-------------|
| Operating system | Ubuntu 22.04 LTS or equivalent Linux |
| Memory | 2 GB RAM minimum (4 GB recommended) |
| CPU | 1 vCPU minimum |
| Storage | 20 GB or more |
| Software | Docker Engine + Docker Compose v2 |
| DNS | A record pointing the domain to the server public IP |
| Firewall | Ports **80** (HTTP) and **443** (HTTPS) open |

---

## 3. Initial Deployment

### 3.1 Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Log out and log back in so the `docker` group membership takes effect.

### 3.2 Clone and run the install script

```bash
git clone https://github.com/hanoteksolution/Afyabridge.git
cd Afyabridge
bash scripts/install-production.sh
```

The first run creates a `.env` file from `.env.example` and exits so required values can be configured.

### 3.3 Configure environment variables

Edit `.env`:

```bash
nano .env
```

Required values:

```env
DOMAIN=your-domain.com
ACME_EMAIL=admin@your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
DATABASE_URL=<DO managed pooled URL, sslmode=require>
DIRECT_DATABASE_URL=<DO direct URL, sslmode=require>
AUTH_SECRET=<output of: openssl rand -base64 32>
```

Optional (performance):

```env
CMS_REVALIDATE_SECONDS=120
```

### 3.4 Complete deployment

```bash
bash scripts/install-production.sh
```

This builds the containers and starts the application stack. The app connects to DigitalOcean Managed PostgreSQL using your environment variables.

---

## 4. Post-Deployment Verification

Run the following checks:

```bash
docker compose ps
docker compose logs -f app
curl -s http://127.0.0.1/api/v1/health
```

**Expected results**

- Both containers (`app`, `caddy`) report status `running`.
- Health endpoint returns a successful response.
- Website loads at `https://your-domain.com`.
- Admin panel loads at `https://your-domain.com/admin/login`.

**Default administrator credentials (first seed only)**

| Field | Value |
|-------|-------|
| Email | `admin@afyabridge.com` |
| Password | `admin123` |

Change this password immediately after the first login.

---

## 5. Deploying Updates

When a new version is released:

```bash
cd Afyabridge
git pull
docker compose up -d --build
```

Alternatively:

```bash
bash scripts/deploy-droplet.sh
```

---

## 6. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DOMAIN` | Yes | Public hostname (e.g. `afyabridge.com`) |
| `ACME_EMAIL` | Yes | Email address for Let's Encrypt certificates |
| `NEXTAUTH_URL` | Yes | Full site URL including `https://` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Same value as `NEXTAUTH_URL` |
| `AUTH_SECRET` | Yes | Random secret (`openssl rand -base64 32`) |
| `DATABASE_URL` | Yes | Managed PostgreSQL connection string (pooled) |
| `DIRECT_DATABASE_URL` | Yes | Managed PostgreSQL direct connection string |
| `NODE_ENV` | No | Set to `production` in Docker |
| `CMS_REVALIDATE_SECONDS` | No | CMS data cache TTL in seconds (default: `120`) |

Use `.env.example` as the template. **Do not commit `.env` to version control.**

---

## 7. Performance and Caching

The production build is configured for fast page loads and efficient delivery of images and static assets.

### 7.1 How caching works

| Layer | Behaviour |
|-------|-----------|
| **Public pages** | Regenerated at most every 2 minutes |
| **CMS data** | Cached in memory; TTL controlled by `CMS_REVALIDATE_SECONDS` |
| **Admin changes** | Cache is cleared immediately when content is saved in the admin panel |
| **Uploaded media** (`/uploads/*`) | Long-term browser cache (1 year) |
| **Static assets** (`/_next/static/*`) | Long-term browser cache (1 year) |
| **Optimized images** | 24-hour cache via the Next.js image optimizer |

Visitors see admin updates within seconds. No container restart is required after content changes.

### 7.2 Development vs production

Caching is **disabled in local development** so editors always see live data. Caching applies only when `NODE_ENV=production` (Docker deployment).

### 7.3 Media at scale

For high-traffic production environments, configure **Cloudinary** under Admin → Settings for CDN-backed image delivery.

---

## 8. Media and Backup Ownership

Uploaded files are stored in the Docker volume `uploads`, mounted at `/app/public/uploads` inside the application container.

Include the `uploads` volume in your droplet backup strategy for locally stored media.

Database backups, point-in-time recovery, monitoring, and maintenance are handled through DigitalOcean Managed PostgreSQL.

---

## 9. Operational Commands

```bash
# Re-run database seed (safe — uses upserts)
docker compose exec app npx prisma db seed

# Stop all services
docker compose down

# Stop and remove local volumes (destructive for uploads only)
docker compose down -v
```

---

## 10. Troubleshooting

| Symptom | Recommended action |
|---------|-------------------|
| Site does not load | Run `docker compose ps` and confirm all services are `running` |
| SSL certificate error | Verify DNS A record points to this server; confirm ports 80 and 443 are open |
| 502 Bad Gateway | Run `docker compose logs app` and wait for the application to finish starting |
| Database connection errors | Verify managed DB host/user/password/SSL settings; then run `docker compose restart app` |
| Health check fails | Inspect `docker compose logs -f app` for Prisma or startup errors |
| Stale content after admin edit | Confirm the save completed successfully; changes should appear within seconds |

---

## 11. Local Development (Reference)

Developers work on laptops using Node.js, not Docker. After cloning the repository:

```bash
npm run setup
npm run dev
```

See `README.md` for full developer documentation. This workflow is separate from the production deployment described above.

---

## 12. Support

- **Repository:** https://github.com/hanoteksolution/Afyabridge  
- **Admin login:** `/admin/login`  
- **Health check:** `/api/v1/health`

For deployment questions related to this release, contact the Afya Bridge development team.
