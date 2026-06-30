import { randomUUID } from "crypto";
import { query, queryOne } from "@/lib/db";

export async function fetchSettingsMap() {
  const { rows } = await query<{ key: string; value: unknown }>(
    `SELECT key, value FROM "Setting" ORDER BY key ASC`
  );
  return rows.reduce(
    (acc, row) => {
      acc[row.key] = row.value;
      return acc;
    },
    {} as Record<string, unknown>
  );
}

export async function fetchPublishedPages() {
  const { rows } = await query<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    isHome: boolean;
    updatedAt: Date;
  }>(
    `SELECT id, title, slug, description, "isHome", "updatedAt"
     FROM "Page"
     WHERE "isPublished" = true
     ORDER BY "isHome" DESC, title ASC`
  );
  return rows;
}

export async function fetchPageBySlug(slug: string) {
  return queryOne<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    isPublished: boolean;
    isHome: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>(
    `SELECT id, title, slug, description, "isPublished", "isHome", "createdAt", "updatedAt"
     FROM "Page"
     WHERE slug = $1 AND "isPublished" = true`,
    [slug]
  );
}

export async function fetchPageSections(pageId: string) {
  const { rows } = await query(
    `SELECT id, "pageId", type, title, subtitle, content, image, icon,
            "buttonText", "buttonLink", "buttonText2", "buttonLink2",
            background, "isVisible", "order", "createdAt", "updatedAt"
     FROM "Section"
     WHERE "pageId" = $1 AND "isVisible" = true
     ORDER BY "order" ASC`,
    [pageId]
  );
  return rows;
}

export async function fetchPublishedBlogs() {
  const { rows } = await query(
    `SELECT id, title, slug, excerpt, "coverImage", "publishedAt", "createdAt"
     FROM "BlogPost"
     WHERE "isPublished" = true
     ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC`
  );
  return rows;
}

export async function fetchBlogBySlug(slug: string) {
  return queryOne(
    `SELECT id, title, slug, excerpt, content, "coverImage", "publishedAt", "createdAt", "updatedAt"
     FROM "BlogPost"
     WHERE slug = $1 AND "isPublished" = true`,
    [slug]
  );
}

export async function fetchVisibleFaqs() {
  const { rows } = await query(
    `SELECT id, question, answer, category, "order"
     FROM "FAQ"
     WHERE "isVisible" = true
     ORDER BY "order" ASC`
  );
  return rows;
}

export async function fetchVisibleTestimonials() {
  const { rows } = await query(
    `SELECT id, name, role, hospital, review, result, rating, photo, "order"
     FROM "Testimonial"
     WHERE "isVisible" = true
     ORDER BY "order" ASC`
  );
  return rows;
}

export async function fetchContacts() {
  const { rows } = await query(
    `SELECT id, name, "facilityName", role, "facilityType", email, phone, country,
            message, "requestDemo", status, "createdAt"
     FROM "Contact"
     ORDER BY "createdAt" DESC`
  );
  return rows;
}

export async function insertContact(data: {
  name: string;
  email: string;
  facilityName?: string;
  role?: string;
  facilityType?: string;
  phone?: string;
  country?: string;
  message?: string;
  requestDemo?: boolean;
}) {
  const { rows } = await query(
    `INSERT INTO "Contact" (
       id, name, "facilityName", role, "facilityType", email, phone, country,
       message, "requestDemo", status, "createdAt", "updatedAt"
     )
     VALUES (
       $10, $1, $2, $3, $4, $5, $6, $7, $8, $9, 'NEW', NOW(), NOW()
     )
     RETURNING id, name, email, status, "createdAt"`,
    [
      data.name,
      data.facilityName ?? null,
      data.role ?? null,
      data.facilityType ?? null,
      data.email,
      data.phone ?? null,
      data.country ?? null,
      data.message ?? null,
      data.requestDemo ?? false,
      randomUUID(),
    ]
  );
  return rows[0];
}
