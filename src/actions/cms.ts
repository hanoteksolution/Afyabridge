"use server";

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

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function createPage(data: {
  title: string;
  slug: string;
  description?: string;
  isPublished?: boolean;
}) {
  const session = await requireAuth();
  const slug = data.slug.replace(/^\//, "").toLowerCase();
  if (slug === "home") return { success: false, error: "Use isHome flag for home page" };

  const page = await prisma.page.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      isPublished: data.isPublished ?? true,
    },
  });
  await prisma.sEO.create({ data: { pageId: page.id, metaTitle: data.title } });
  await logActivity({ userId: session.user.id, action: "CREATE", entity: "Page", entityId: page.id });
  revalidatePublicSite([`/${slug}`]);
  return { success: true, page };
}

export async function updatePage(
  id: string,
  data: { title?: string; slug?: string; description?: string; isPublished?: boolean }
) {
  const session = await requireAuth();
  const page = await prisma.page.update({
    where: { id },
    data: {
      ...data,
      slug: data.slug?.replace(/^\//, "").toLowerCase(),
    },
  });
  await logActivity({ userId: session.user.id, action: "UPDATE", entity: "Page", entityId: id });
  revalidatePublicSite([`/${page.slug}`, page.isHome ? "/" : ""]);
  return { success: true, page };
}

export async function deletePage(id: string) {
  const session = await requireAuth();
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return { success: false, error: "Not found" };
  if (page.isHome) return { success: false, error: "Cannot delete home page" };
  await prisma.page.delete({ where: { id } });
  await logActivity({ userId: session.user.id, action: "DELETE", entity: "Page", entityId: id });
  revalidatePublicSite([`/${page.slug}`]);
  return { success: true };
}

export async function createSection(pageId: string, type: SectionType) {
  const session = await requireAuth();
  const maxOrder = await prisma.section.aggregate({ where: { pageId }, _max: { order: true } });
  const section = await prisma.section.create({
    data: { pageId, type, order: (maxOrder._max.order ?? -1) + 1, isVisible: true },
  });
  await logActivity({ userId: session.user.id, action: "CREATE", entity: "Section", entityId: section.id });
  revalidatePublicSite();
  return { success: true, section };
}

export async function saveSection(
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
    isVisible?: boolean;
  }
) {
  const session = await requireAuth();
  const section = await prisma.section.update({
    where: { id: sectionId },
    data: {
      title: data.title,
      subtitle: data.subtitle,
      content: data.content as Prisma.InputJsonValue | undefined,
      image: data.image,
      icon: data.icon,
      buttonText: data.buttonText,
      buttonLink: data.buttonLink,
      buttonText2: data.buttonText2,
      buttonLink2: data.buttonLink2,
      isVisible: data.isVisible,
    },
  });
  await logActivity({ userId: session.user.id, action: "UPDATE", entity: "Section", entityId: sectionId });
  revalidatePublicSite();
  return { success: true, section };
}

// ─── Nested section items ────────────────────────────────────────────────────

type ItemInput = Record<string, unknown>;

async function nextChildOrder(
  model: "trustStat" | "whyCard" | "industry" | "serviceModule" | "approachStep" | "missionValue",
  sectionId: string
) {
  const aggregate = {
    trustStat: () => prisma.trustStat.aggregate({ where: { sectionId }, _max: { order: true } }),
    whyCard: () => prisma.whyCard.aggregate({ where: { sectionId }, _max: { order: true } }),
    industry: () => prisma.industry.aggregate({ where: { sectionId }, _max: { order: true } }),
    serviceModule: () => prisma.serviceModule.aggregate({ where: { sectionId }, _max: { order: true } }),
    approachStep: () => prisma.approachStep.aggregate({ where: { sectionId }, _max: { order: true } }),
    missionValue: () => prisma.missionValue.aggregate({ where: { sectionId }, _max: { order: true } }),
  }[model];
  const max = await aggregate();
  return (max._max.order ?? -1) + 1;
}

async function upsertChild(
  model: "trustStat" | "whyCard" | "industry" | "serviceModule" | "approachStep" | "missionValue",
  sectionId: string,
  id: string | undefined,
  data: ItemInput
) {
  if (id) {
    switch (model) {
      case "trustStat":
        return prisma.trustStat.update({ where: { id }, data: data as { label: string; value: number; suffix?: string; icon?: string } });
      case "whyCard":
        return prisma.whyCard.update({ where: { id }, data: data as { title: string; description?: string; icon?: string } });
      case "industry":
        return prisma.industry.update({ where: { id }, data: data as Prisma.IndustryUpdateInput });
      case "serviceModule":
        return prisma.serviceModule.update({ where: { id }, data: data as Prisma.ServiceModuleUpdateInput });
      case "approachStep":
        return prisma.approachStep.update({ where: { id }, data: data as { title: string; description?: string; icon?: string } });
      case "missionValue":
        return prisma.missionValue.update({ where: { id }, data: data as { title: string; description?: string; icon?: string; type?: string } });
    }
  }
  const order = await nextChildOrder(model, sectionId);
  const createData = { ...data, sectionId, order };
  switch (model) {
    case "trustStat":
      return prisma.trustStat.create({ data: createData as Prisma.TrustStatUncheckedCreateInput });
    case "whyCard":
      return prisma.whyCard.create({ data: createData as Prisma.WhyCardUncheckedCreateInput });
    case "industry":
      return prisma.industry.create({ data: createData as Prisma.IndustryUncheckedCreateInput });
    case "serviceModule":
      return prisma.serviceModule.create({ data: createData as Prisma.ServiceModuleUncheckedCreateInput });
    case "approachStep":
      return prisma.approachStep.create({ data: createData as Prisma.ApproachStepUncheckedCreateInput });
    case "missionValue":
      return prisma.missionValue.create({ data: createData as Prisma.MissionValueUncheckedCreateInput });
  }
}

export async function saveTrustStat(sectionId: string, id: string | undefined, data: { label: string; value: number; suffix?: string; icon?: string }) {
  await requireAuth();
  await upsertChild("trustStat", sectionId, id, data);
  revalidatePublicSite();
  return { success: true };
}

export async function deleteTrustStat(id: string) {
  await requireAuth();
  await prisma.trustStat.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

export async function saveWhyCard(
  sectionId: string,
  id: string | undefined,
  data: {
    title: string;
    description?: string;
    icon?: string;
    image?: string;
    metricValue?: string;
    metricLabel?: string;
    bullets?: string[];
  }
) {
  await requireAuth();
  await upsertChild("whyCard", sectionId, id, {
    ...data,
    bullets: data.bullets as Prisma.InputJsonValue | undefined,
  });
  revalidatePublicSite();
  return { success: true };
}

export async function deleteWhyCard(id: string) {
  await requireAuth();
  await prisma.whyCard.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

export async function saveIndustry(
  sectionId: string,
  id: string | undefined,
  data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    ctaText?: string;
    ctaLink?: string;
    benefits?: string[];
    statValue?: string;
    statLabel?: string;
  }
) {
  await requireAuth();

  const benefitsJson: Record<string, unknown> = {
    items: data.benefits || [],
  };
  if (data.icon) benefitsJson.icon = data.icon;
  if (data.statValue) {
    benefitsJson.stat = { v: data.statValue, l: data.statLabel || "" };
  }

  await upsertChild("industry", sectionId, id, {
    name: data.name,
    slug: data.slug,
    description: data.description,
    image: data.image,
    ctaText: data.ctaText,
    ctaLink: data.ctaLink,
    benefits: benefitsJson as Prisma.InputJsonValue,
  });
  revalidatePublicSite();
  return { success: true };
}

export async function deleteIndustry(id: string) {
  await requireAuth();
  await prisma.industry.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

export async function saveServiceModule(sectionId: string, id: string | undefined, data: { name: string; slug: string; description?: string; icon?: string; image?: string; benefits?: string[] }) {
  await requireAuth();
  await upsertChild("serviceModule", sectionId, id, { ...data, benefits: data.benefits as Prisma.InputJsonValue });
  revalidatePublicSite();
  return { success: true };
}

export async function deleteServiceModule(id: string) {
  await requireAuth();
  await prisma.serviceModule.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

export async function saveApproachStep(sectionId: string, id: string | undefined, data: { title: string; description?: string; icon?: string }) {
  await requireAuth();
  await upsertChild("approachStep", sectionId, id, data);
  revalidatePublicSite();
  return { success: true };
}

export async function deleteApproachStep(id: string) {
  await requireAuth();
  await prisma.approachStep.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

export async function saveMissionValue(sectionId: string, id: string | undefined, data: { type: string; title: string; content?: string; icon?: string }) {
  await requireAuth();
  await upsertChild("missionValue", sectionId, id, data);
  revalidatePublicSite();
  return { success: true };
}

export async function deleteMissionValue(id: string) {
  await requireAuth();
  await prisma.missionValue.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export async function saveFAQ(id: string | undefined, data: { question: string; answer: string; category?: string; isVisible?: boolean }) {
  const session = await requireAuth();
  const faq = id
    ? await prisma.fAQ.update({ where: { id }, data })
    : await prisma.fAQ.create({
        data: { ...data, order: await prisma.fAQ.count() },
      });
  await logActivity({ userId: session.user.id, action: id ? "UPDATE" : "CREATE", entity: "FAQ", entityId: faq.id });
  revalidatePublicSite(["/faq"]);
  return { success: true, faq };
}

export async function deleteFAQ(id: string) {
  const session = await requireAuth();
  await prisma.fAQ.delete({ where: { id } });
  await logActivity({ userId: session.user.id, action: "DELETE", entity: "FAQ", entityId: id });
  revalidatePublicSite(["/faq"]);
  return { success: true };
}

export async function reorderFAQs(faqIds: string[]) {
  await requireAuth();
  await Promise.all(
    faqIds.map((id, order) => prisma.fAQ.update({ where: { id }, data: { order } }))
  );
  revalidatePublicSite(["/faq"]);
  return { success: true };
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function saveBlogPost(
  id: string | undefined,
  data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    categoryId?: string;
    isPublished?: boolean;
  }
) {
  const session = await requireAuth();
  const slug = data.slug.toLowerCase().replace(/\s+/g, "-");
  const post = id
    ? await prisma.blogPost.update({
        where: { id },
        data: {
          ...data,
          slug,
          publishedAt: data.isPublished ? new Date() : null,
        },
      })
    : await prisma.blogPost.create({
        data: {
          ...data,
          slug,
          authorId: session.user.id,
          publishedAt: data.isPublished ? new Date() : null,
        },
      });
  await logActivity({ userId: session.user.id, action: id ? "UPDATE" : "CREATE", entity: "BlogPost", entityId: post.id });
  revalidatePublicSite(["/blog", `/blog/${slug}`]);
  return { success: true, post };
}

export async function deleteBlogPost(id: string) {
  const session = await requireAuth();
  await prisma.blogPost.delete({ where: { id } });
  await logActivity({ userId: session.user.id, action: "DELETE", entity: "BlogPost", entityId: id });
  revalidatePublicSite(["/blog"]);
  return { success: true };
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function saveTestimonial(
  id: string | undefined,
  data: { name: string; role?: string; hospital?: string; review: string; result?: string; rating?: number; photo?: string; isVisible?: boolean }
) {
  const session = await requireAuth();
  const payload = {
    name: data.name,
    role: data.role || null,
    hospital: data.hospital || null,
    review: data.review,
    result: data.result?.trim() || null,
    rating: data.rating ?? 5,
    photo: data.photo || null,
    isVisible: data.isVisible ?? true,
  };
  const t = id
    ? await prisma.testimonial.update({ where: { id }, data: payload })
    : await prisma.testimonial.create({ data: { ...payload, order: await prisma.testimonial.count() } });
  await logActivity({ userId: session.user.id, action: id ? "UPDATE" : "CREATE", entity: "Testimonial", entityId: t.id });
  revalidatePublicSite();
  return { success: true, testimonial: t };
}

export async function deleteTestimonial(id: string) {
  const session = await requireAuth();
  await prisma.testimonial.delete({ where: { id } });
  await logActivity({ userId: session.user.id, action: "DELETE", entity: "Testimonial", entityId: id });
  revalidatePublicSite();
  return { success: true };
}

export async function reorderTestimonials(testimonialIds: string[]) {
  await requireAuth();
  await Promise.all(
    testimonialIds.map((id, order) =>
      prisma.testimonial.update({ where: { id }, data: { order } })
    )
  );
  revalidatePublicSite();
  return { success: true };
}

// ─── Case Studies ────────────────────────────────────────────────────────────

export async function saveCaseStudy(
  id: string | undefined,
  data: { title: string; slug: string; summary?: string; story?: string; image?: string; isPublished?: boolean }
) {
  const session = await requireAuth();
  const cs = id
    ? await prisma.caseStudy.update({ where: { id }, data: { ...data, slug: data.slug.toLowerCase() } })
    : await prisma.caseStudy.create({ data: { ...data, slug: data.slug.toLowerCase(), order: await prisma.caseStudy.count() } });
  await logActivity({ userId: session.user.id, action: id ? "UPDATE" : "CREATE", entity: "CaseStudy", entityId: cs.id });
  revalidatePublicSite();
  return { success: true, caseStudy: cs };
}

export async function deleteCaseStudy(id: string) {
  const session = await requireAuth();
  await prisma.caseStudy.delete({ where: { id } });
  await logActivity({ userId: session.user.id, action: "DELETE", entity: "CaseStudy", entityId: id });
  revalidatePublicSite();
  return { success: true };
}

export async function reorderCaseStudies(caseStudyIds: string[]) {
  await requireAuth();
  await Promise.all(
    caseStudyIds.map((id, order) =>
      prisma.caseStudy.update({ where: { id }, data: { order } })
    )
  );
  revalidatePublicSite();
  return { success: true };
}

// ─── Menus ───────────────────────────────────────────────────────────────────

export async function saveMenuItem(
  menuId: string,
  id: string | undefined,
  data: { label: string; url: string; parentId?: string | null; isVisible?: boolean }
) {
  await requireAuth();
  const item = id
    ? await prisma.menuItem.update({ where: { id }, data })
    : await prisma.menuItem.create({
        data: {
          menuId,
          label: data.label,
          url: data.url,
          parentId: data.parentId || null,
          isVisible: data.isVisible ?? true,
          order: await prisma.menuItem.count({ where: { menuId, parentId: data.parentId || null } }),
        },
      });
  revalidatePublicSite();
  return { success: true, item };
}

export async function deleteMenuItem(id: string) {
  await requireAuth();
  await prisma.menuItem.delete({ where: { id } });
  revalidatePublicSite();
  return { success: true };
}

export async function reorderMenuItems(menuId: string, itemIds: string[]) {
  await requireAuth();
  await Promise.all(itemIds.map((id, order) => prisma.menuItem.update({ where: { id }, data: { order } })));
  revalidatePublicSite();
  return { success: true };
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function updateSetting(key: string, value: unknown, group?: string) {
  const session = await requireAuth();
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as Prisma.InputJsonValue, group },
    update: { value: value as Prisma.InputJsonValue, group },
  });
  await logActivity({ userId: session.user.id, action: "UPDATE", entity: "Setting", details: { key } });
  revalidatePublicSite();
  return { success: true };
}

export async function saveSettings(data: Record<string, string>) {
  const session = await requireAuth();
  const groups: Record<string, string> = {
    site_name: "branding", site_tagline: "branding", site_logo: "branding", site_logo_dark: "branding", site_favicon: "branding",
    color_primary: "theme", color_secondary: "theme", color_accent: "theme", color_hero_bg: "theme",
    contact_email: "contact", phone_ke: "contact", phone_tz: "contact", address: "contact", region: "contact",
    contact_response_title: "contact", contact_response_subtitle: "contact",
    contact_security_title: "contact", contact_security_subtitle: "contact",
    watch_demo_text: "header", watch_demo_link: "header", request_demo_text: "header", request_demo_link: "header",
    copyright_text: "footer", privacy_link: "footer", terms_link: "footer",
    footer_newsletter_title: "footer", footer_newsletter_subtitle: "footer", footer_trust_badges: "footer",
    social_linkedin: "social", social_twitter: "social", social_facebook: "social", social_youtube: "social",
  };
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value, group: groups[key] || "general" },
        update: { value, group: groups[key] || "general" },
      })
    )
  );
  await logActivity({ userId: session.user.id, action: "UPDATE", entity: "Setting", details: { keys: Object.keys(data) } });
  revalidatePublicSite();
  return { success: true };
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

export async function savePageSEO(
  pageId: string,
  data: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  }
) {
  const session = await requireAuth();
  const seo = await prisma.sEO.upsert({
    where: { pageId },
    create: { pageId, ...data },
    update: data,
  });
  await logActivity({ userId: session.user.id, action: "UPDATE", entity: "SEO", entityId: seo.id });
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  revalidatePublicSite(page ? [page.isHome ? "/" : `/${page.slug}`] : ["/"]);
  return { success: true, seo };
}
