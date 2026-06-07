"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateSite(paths: string[] = ["/"]) {
  const all = new Set(["/", ...paths, "/admin/slides"]);
  for (const p of all) revalidatePath(p);
  revalidatePath("/", "layout");
}

async function getHeroSectionId(): Promise<string | null> {
  const section = await prisma.section.findFirst({
    where: { type: "HERO", page: { isHome: true } },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  return section?.id ?? null;
}

export type SlideInput = {
  title: string;
  subtitle?: string;
  image?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaText2?: string;
  ctaLink2?: string;
  badge?: string;
  isVisible?: boolean;
};

export async function createHeroSlide(data: SlideInput) {
  const session = await requireAuth();
  const sectionId = await getHeroSectionId();
  if (!sectionId) {
    return { success: false, error: "No hero section found. Create a hero section first." };
  }

  const maxOrder = await prisma.heroSlide.aggregate({
    where: { sectionId },
    _max: { order: true },
  });

  const slide = await prisma.heroSlide.create({
    data: {
      sectionId,
      title: data.title,
      subtitle: data.subtitle || null,
      image: data.image || null,
      videoUrl: data.videoUrl || null,
      ctaText: data.ctaText || null,
      ctaLink: data.ctaLink || null,
      ctaText2: data.ctaText2 || null,
      ctaLink2: data.ctaLink2 || null,
      badge: data.badge || null,
      isVisible: data.isVisible ?? true,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "HeroSlide",
    entityId: slide.id,
  });
  revalidateSite();
  return { success: true, slide };
}

export async function updateHeroSlide(id: string, data: SlideInput) {
  const session = await requireAuth();
  const slide = await prisma.heroSlide.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      image: data.image || null,
      videoUrl: data.videoUrl || null,
      ctaText: data.ctaText || null,
      ctaLink: data.ctaLink || null,
      ctaText2: data.ctaText2 || null,
      ctaLink2: data.ctaLink2 || null,
      badge: data.badge || null,
      ...(data.isVisible !== undefined ? { isVisible: data.isVisible } : {}),
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "HeroSlide",
    entityId: id,
  });
  revalidateSite();
  return { success: true, slide };
}

export async function toggleHeroSlideVisibility(id: string, isVisible: boolean) {
  const session = await requireAuth();
  await prisma.heroSlide.update({ where: { id }, data: { isVisible } });
  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "HeroSlide",
    entityId: id,
    details: { isVisible },
  });
  revalidateSite();
  return { success: true };
}

export async function reorderHeroSlides(slideIds: string[]) {
  const session = await requireAuth();
  await Promise.all(
    slideIds.map((id, index) =>
      prisma.heroSlide.update({ where: { id }, data: { order: index } })
    )
  );
  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "HeroSlide",
    details: { slideIds },
  });
  revalidateSite();
  return { success: true };
}

export async function deleteHeroSlide(id: string) {
  const session = await requireAuth();
  await prisma.heroSlide.delete({ where: { id } });
  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "HeroSlide",
    entityId: id,
  });
  revalidateSite();
  return { success: true };
}
