"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { Prisma, type SectionType } from "@prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function toggleSectionVisibility(sectionId: string, isVisible: boolean) {
  const session = await requireAuth();
  const section = await prisma.section.update({
    where: { id: sectionId },
    data: { isVisible },
  });
  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Section",
    entityId: sectionId,
    details: { isVisible },
  });
  revalidatePublicSite();
  revalidatePath("/admin/sections");
  return section;
}

export async function reorderSections(pageId: string, sectionIds: string[]) {
  const session = await requireAuth();
  await Promise.all(
    sectionIds.map((id, index) =>
      prisma.section.update({ where: { id }, data: { order: index } })
    )
  );
  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Section",
    details: { pageId, sectionIds },
  });
  revalidatePublicSite();
  revalidatePath(`/admin/pages/${pageId}`);
  return { success: true };
}

export async function duplicateSection(sectionId: string) {
  const session = await requireAuth();
  const original = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      heroSlides: true,
      trustStats: true,
      whyCards: true,
      industries: true,
      serviceModules: true,
      approachSteps: true,
      missionValues: true,
    },
  });
  if (!original) throw new Error("Section not found");

  const maxOrder = await prisma.section.aggregate({
    where: { pageId: original.pageId },
    _max: { order: true },
  });

  const { id, createdAt, updatedAt, heroSlides, trustStats, whyCards, industries, serviceModules, approachSteps, missionValues, content, background, ...data } = original;

  const duplicate = await prisma.section.create({
    data: {
      ...data,
      content: content === null ? undefined : (content as Prisma.InputJsonValue),
      background: background === null ? undefined : (background as Prisma.InputJsonValue),
      title: `${data.title || data.type} (Copy)`,
      order: (maxOrder._max.order ?? 0) + 1,
      heroSlides: { create: heroSlides.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, ...s }) => s) },
      trustStats: { create: trustStats.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, ...s }) => s) },
      whyCards: {
        create: whyCards.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, bullets, ...s }) => ({
          ...s,
          bullets: bullets === null ? undefined : (bullets as Prisma.InputJsonValue),
        })),
      },
      industries: {
        create: industries.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, benefits, ...s }) => ({
          ...s,
          benefits: benefits === null ? undefined : (benefits as Prisma.InputJsonValue),
        })),
      },
      serviceModules: {
        create: serviceModules.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, benefits, ...s }) => ({
          ...s,
          benefits: benefits === null ? undefined : (benefits as Prisma.InputJsonValue),
        })),
      },
      approachSteps: { create: approachSteps.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, ...s }) => s) },
      missionValues: { create: missionValues.map(({ id: _, sectionId: __, createdAt: ___, updatedAt: ____, ...s }) => s) },
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "Section",
    entityId: duplicate.id,
    details: { duplicatedFrom: sectionId },
  });
  revalidatePublicSite();
  return duplicate;
}

export async function deleteSection(sectionId: string) {
  const session = await requireAuth();
  await prisma.section.delete({ where: { id: sectionId } });
  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "Section",
    entityId: sectionId,
  });
  revalidatePublicSite();
  revalidatePath("/admin/sections");
}

export async function updateSection(
  sectionId: string,
  data: {
    title?: string;
    subtitle?: string;
    content?: unknown;
    image?: string;
    icon?: string;
    buttonText?: string;
    buttonLink?: string;
    buttonText2?: string;
    buttonLink2?: string;
    background?: unknown;
    isVisible?: boolean;
    type?: SectionType;
  }
) {
  const session = await requireAuth();
  const section = await prisma.section.update({
    where: { id: sectionId },
    data: {
      ...data,
      content: data.content as Prisma.InputJsonValue | undefined,
      background: data.background as Prisma.InputJsonValue | undefined,
    },
  });
  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Section",
    entityId: sectionId,
  });
  revalidatePublicSite();
  return section;
}

export async function updateContactStatus(
  contactId: string,
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "CLOSED"
) {
  const session = await requireAuth();
  const contact = await prisma.contact.update({
    where: { id: contactId },
    data: { status },
  });
  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Contact",
    entityId: contactId,
    details: { status },
  });
  revalidatePath("/admin/contacts");
  return contact;
}

export async function deleteMedia(mediaId: string) {
  const session = await requireAuth();
  await prisma.media.delete({ where: { id: mediaId } });
  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "Media",
    entityId: mediaId,
  });
  revalidatePublicSite();
  revalidatePath("/admin/media");
}
