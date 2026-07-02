# Afya Bridge

**Bridging Technology & Care** — Healthcare marketing website with a WordPress-style CMS admin.

**Repository:** https://github.com/hanoteksolution/Afyabridge

---

## New team member? (local development)

One command after clone:

```bash
git clone https://github.com/hanoteksolution/Afyabridge.git
cd Afyabridge
npm run setup
npm run dev
```

| URL | Address |
|-----|---------|
| Website | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| Login | `admin@afyabridge.com` / `admin123` |

`npm run setup` will:

1. Install dependencies  
2. Create `.env` from `env.development.example`  
3. Start local PostgreSQL (Prisma dev)  
4. Apply database schema  
5. **Seed all company content** (pages, menus, homepage, blog, FAQs, admin user)

Re-seed anytime:

```bash
npm run db:seed
```

Full reset (wipe DB + seed):

```bash
npm run db:reset
```

### Prerequisites

- Node.js 20+
- npm

---

## Server deployment (production)

**Send this to your server team:** [DEPLOY.md](./DEPLOY.md)

Quick summary on a Linux server with Docker:

```bash
git clone https://github.com/hanoteksolution/Afyabridge.git
cd Afyabridge
bash scripts/install-production.sh
# Edit .env with your domain + DO Managed PostgreSQL URLs, then run the script again
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | **First-time dev setup** (install + DB + seed) |
| `npm run setup:dev` | Dev setup without `npm install` |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed / refresh company content |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run deploy` | Production: `docker compose up -d --build` |
| `npm run deploy:install` | Production first-time install script |
| `npm run deploy:update` | Pull latest + rebuild containers |

---

## Tech stack

Next.js 16 · TypeScript · TailwindCSS · Prisma · PostgreSQL · NextAuth · Docker · Caddy
