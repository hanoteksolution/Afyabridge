# Afya Bridge — Project Architecture

## Overview

Afya Bridge is a production-ready healthcare technology company website with a fully dynamic CMS admin platform. Built with Next.js 15 App Router, TypeScript, Prisma, PostgreSQL, and NextAuth.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Shadcn UI, Framer Motion |
| Backend | Next.js Server Actions, REST API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 with RBAC |
| Storage | Local uploads + Cloudinary (optional) |
| SEO | Dynamic metadata, sitemap, robots.txt, JSON-LD |

## Folder Structure

```
src/
├── app/
│   ├── (site)/              # Public marketing website
│   │   ├── layout.tsx       # Header + Footer wrapper
│   │   ├── page.tsx         # Dynamic home page
│   │   └── blog/            # Blog listing + posts
│   ├── admin/               # CMS admin panel
│   │   ├── dashboard/       # Analytics dashboard
│   │   ├── pages/           # Page management + builder
│   │   ├── sections/        # Section overview
│   │   ├── media/           # Media library
│   │   ├── seo/             # SEO manager
│   │   ├── menus/           # Menu builder
│   │   ├── blogs/           # Blog CMS
│   │   ├── testimonials/    # Testimonials CRUD
│   │   ├── case-studies/    # Case studies CRUD
│   │   ├── contacts/        # Lead tracking
│   │   ├── users/           # User management
│   │   ├── roles/           # Role & permissions
│   │   ├── activity/        # Audit logs
│   │   ├── settings/        # Global settings
│   │   └── login/           # Admin authentication
│   ├── api/
│   │   ├── auth/            # NextAuth handlers
│   │   └── media/upload/    # File upload endpoint
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── components/
│   ├── ui/                  # Shadcn-style UI primitives
│   ├── admin/               # Admin panel components
│   ├── website/             # Header, footer, forms
│   └── sections/            # Dynamic section renderers
├── actions/                 # Server actions
│   ├── admin.ts             # CMS operations
│   └── contact.ts           # Form submissions
├── lib/
│   ├── prisma.ts            # Database client
│   ├── auth.ts              # NextAuth config
│   ├── cms.ts               # Content fetching
│   ├── cloudinary.ts        # Media storage
│   ├── activity.ts          # Audit logging
│   └── constants.ts         # Site config
└── middleware.ts            # Auth protection
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Default content seeder
```

## Database Schema

### Core CMS Tables
- **pages** — Website pages with slug, publish status
- **sections** — Dynamic page sections with type, content, visibility, order
- **hero_slides** — Hero carousel slides
- **trust_stats** — Animated counter statistics
- **why_cards** — Why Afya Bridge benefit cards
- **industries** — Who We Serve tab content
- **service_modules** — Platform module cards
- **approach_steps** — Implementation timeline steps
- **mission_values** — Mission, vision, values content

### Content Tables
- **testimonials** — Client testimonials with ratings
- **case_studies** — Case studies with KPIs and PDFs
- **blog_posts** — Blog with categories, tags, SEO
- **faq** — Frequently asked questions

### System Tables
- **users** / **roles** — RBAC authentication
- **menus** / **menu_items** — Navigation builder
- **settings** — Global site configuration
- **seo** — Per-page SEO metadata
- **media** — Media library assets
- **contacts** — Form submissions & leads
- **newsletter_subscribers** — Email subscribers
- **activity_logs** — Audit trail

## Page Builder

Admin can manage sections per page:
- Add / Remove / Reorder / Duplicate sections
- Enable / Disable section visibility
- Each section type has dedicated sub-entities (slides, cards, modules, etc.)
- All content is database-driven — zero hardcoded content on the public site

## Section Types

| Type | Description |
|------|------------|
| HERO | Headline, CTAs, stats, video popup, floating cards |
| TRUST_BAR | Animated counter statistics |
| WHY_AFYA | Benefit cards with icons |
| WHO_WE_SERVE | Tabbed industry segments |
| PLATFORM_MODULES | Service module grid |
| OUR_APPROACH | Timeline process steps |
| MISSION_VISION | Mission, vision, values, guiding principle |
| TESTIMONIALS | Slider with ratings |
| CASE_STUDIES | Project cards with KPIs |
| BLOG | Latest blog posts |
| CTA | Call-to-action banner |
| CONTACT | Advanced contact form |

## API Structure

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication |
| `/api/media/upload` | POST | File upload (auth required) |

## Server Actions

- `submitContactForm` — Store contact/demo requests
- `subscribeNewsletter` — Newsletter signup
- `toggleSectionVisibility` — Enable/disable sections
- `reorderSections` — Drag-and-drop reorder
- `duplicateSection` — Clone section with children
- `deleteSection` — Remove section
- `updateSection` — Edit section content
- `updateContactStatus` — Lead pipeline management
- `deleteMedia` — Remove media assets

## Authentication & RBAC

Roles: Super Admin, Editor (extensible)
Permissions: Granular per-module (pages:read, pages:write, etc.)
Middleware protects all `/admin/*` routes except `/admin/login`

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run database migration
npx prisma migrate dev

# Seed default content
npx prisma db seed

# Start development server
npm run dev
```

**Admin Login:** admin@afyabridge.com / admin123
