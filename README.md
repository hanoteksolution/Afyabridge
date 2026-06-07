# Afya Bridge

**Bridging Technology & Care** — A premium healthcare technology company website with a fully dynamic CMS admin platform.

## Features

### Public Website
- 12 dynamic homepage sections (Hero, Trust Bar, Why Afya, Who We Serve, Platform Modules, Approach, Mission/Vision, Testimonials, Case Studies, Blog, CTA, Contact)
- Fully CMS-driven — no hardcoded content
- Premium enterprise design with Framer Motion animations
- Blog with categories and SEO
- Contact form with demo requests
- Newsletter subscription
- Dynamic sitemap, robots.txt, OpenGraph, JSON-LD structured data

### Admin CMS
- Dashboard with analytics charts and lead tracking
- Page builder with section management (reorder, duplicate, enable/disable)
- Media library with drag & drop upload
- SEO manager, menu builder, settings
- Blog, testimonials, case studies CRUD
- User & role management with RBAC
- Activity audit logs
- Lead pipeline (New → Contacted → Qualified → Converted → Closed)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Option A: Use Prisma local Postgres
npx prisma dev

# Option B: Use your own PostgreSQL
# Set DATABASE_URL and DIRECT_DATABASE_URL in .env

# Push schema and seed data
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### URLs
- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login
- **Credentials:** `admin@afyabridge.com` / `admin123`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed default content |
| `npm run db:studio` | Open Prisma Studio |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full project structure, database schema, API documentation, and CMS architecture.

## Tech Stack

Next.js 15+ · TypeScript · TailwindCSS · Shadcn UI · Framer Motion · Prisma · PostgreSQL · NextAuth · Cloudinary

## Brand Colors

| Color | Hex |
|-------|-----|
| Primary | `#0A1F78` |
| Secondary | `#2563EB` |
| Accent | `#00C2FF` |
| Success | `#10B981` |
| Background | `#F8FAFC` |
