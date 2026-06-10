"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { ADMIN_PERMISSIONS, type Permission } from "@/lib/constants";
import { Prisma } from "@prisma/client";

const PROTECTED_SLUGS = ["super-admin"] as const;

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function sanitizePermissions(permissions: string[]): Permission[] {
  const allowed = new Set<string>(ADMIN_PERMISSIONS);
  return permissions.filter((p): p is Permission => allowed.has(p));
}

export type RoleInput = {
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
};

export async function createRole(data: RoleInput) {
  const session = await requireAuth();
  const name = data.name.trim();
  const slug = slugify(data.slug || name);

  if (!name || !slug) {
    return { success: false, error: "Name and slug are required" };
  }

  const existing = await prisma.role.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) {
    return { success: false, error: "A role with this name or slug already exists" };
  }

  const permissions = sanitizePermissions(data.permissions);
  const role = await prisma.role.create({
    data: {
      name,
      slug,
      description: data.description?.trim() || null,
      permissions: permissions as unknown as Prisma.InputJsonValue,
    },
    include: { _count: { select: { users: true } } },
  });

  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "Role",
    entityId: role.id,
    details: { slug: role.slug, permissions: permissions.length },
  });

  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { success: true, role };
}

export async function updateRole(id: string, data: RoleInput) {
  const session = await requireAuth();
  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Role not found" };
  }

  const name = data.name.trim();
  let slug = slugify(data.slug || name);

  if (PROTECTED_SLUGS.includes(existing.slug as (typeof PROTECTED_SLUGS)[number])) {
    slug = existing.slug;
  }

  if (!name || !slug) {
    return { success: false, error: "Name and slug are required" };
  }

  const duplicate = await prisma.role.findFirst({
    where: { OR: [{ name }, { slug }], NOT: { id } },
  });
  if (duplicate) {
    return { success: false, error: "A role with this name or slug already exists" };
  }

  const permissions = sanitizePermissions(data.permissions);

  if (existing.slug === "super-admin" && permissions.length === 0) {
    return { success: false, error: "Super Admin must have at least one permission" };
  }

  const role = await prisma.role.update({
    where: { id },
    data: {
      name,
      slug,
      description: data.description?.trim() || null,
      permissions: permissions as unknown as Prisma.InputJsonValue,
    },
    include: { _count: { select: { users: true } } },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Role",
    entityId: role.id,
    details: { slug: role.slug, permissions: permissions.length },
  });

  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { success: true, role };
}

export async function deleteRole(id: string) {
  const session = await requireAuth();
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });

  if (!role) {
    return { success: false, error: "Role not found" };
  }

  if (PROTECTED_SLUGS.includes(role.slug as (typeof PROTECTED_SLUGS)[number])) {
    return { success: false, error: "This system role cannot be deleted" };
  }

  if (role._count.users > 0) {
    return {
      success: false,
      error: `Cannot delete role with ${role._count.users} assigned user(s)`,
    };
  }

  await prisma.role.delete({ where: { id } });

  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "Role",
    entityId: id,
    details: { slug: role.slug },
  });

  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { success: true };
}
