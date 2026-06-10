"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export type UserInput = {
  name: string;
  email: string;
  password?: string;
  roleId: string;
  isActive?: boolean;
};

export async function createUser(data: UserInput) {
  const session = await requireAuth();
  const email = data.email.trim().toLowerCase();

  if (!data.name.trim() || !email) {
    return { success: false, error: "Name and email are required" };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "A user with this email already exists" };
  }

  const role = await prisma.role.findUnique({ where: { id: data.roleId } });
  if (!role) {
    return { success: false, error: "Invalid role selected" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      roleId: data.roleId,
      isActive: data.isActive ?? true,
    },
    include: { role: true },
  });

  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "User",
    entityId: user.id,
    details: { email: user.email, role: role.slug },
  });

  revalidatePath("/admin/users");
  return { success: true, user };
}

export async function updateUser(id: string, data: UserInput) {
  const session = await requireAuth();
  const email = data.email.trim().toLowerCase();

  if (!data.name.trim() || !email) {
    return { success: false, error: "Name and email are required" };
  }

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id } },
  });
  if (existing) {
    return { success: false, error: "A user with this email already exists" };
  }

  const role = await prisma.role.findUnique({ where: { id: data.roleId } });
  if (!role) {
    return { success: false, error: "Invalid role selected" };
  }

  if (session.user.id === id && data.isActive === false) {
    return { success: false, error: "You cannot deactivate your own account" };
  }

  const updateData: {
    name: string;
    email: string;
    roleId: string;
    isActive: boolean;
    password?: string;
  } = {
    name: data.name.trim(),
    email,
    roleId: data.roleId,
    isActive: data.isActive ?? true,
  };

  if (data.password && data.password.length >= 6) {
    updateData.password = await bcrypt.hash(data.password, 12);
  } else if (data.password && data.password.length > 0) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { role: true },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "User",
    entityId: user.id,
    details: { email: user.email, role: role.slug },
  });

  revalidatePath("/admin/users");
  return { success: true, user };
}

export async function deleteUser(id: string) {
  const session = await requireAuth();

  if (session.user.id === id) {
    return { success: false, error: "You cannot delete your own account" };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  await prisma.user.delete({ where: { id } });

  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "User",
    entityId: id,
    details: { email: user.email },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserActive(id: string, isActive: boolean) {
  const session = await requireAuth();

  if (session.user.id === id && !isActive) {
    return { success: false, error: "You cannot deactivate your own account" };
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
    include: { role: true },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "User",
    entityId: id,
    details: { isActive },
  });

  revalidatePath("/admin/users");
  return { success: true, user };
}
