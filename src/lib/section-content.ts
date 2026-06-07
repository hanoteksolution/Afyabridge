export type TrustBadge = { label: string; icon: string };

export type HeroFeature = { label: string; icon: string };

export type ConsultingService = { title: string; description: string; icon: string };

export type SectionMeta = {
  eyebrow?: string;
};

export type WhyPillarContent = SectionMeta & {
  productTitle?: string;
  productDescription?: string;
  productFeatures?: string[];
  productImage?: string;
  productLink?: string;
  productLinkText?: string;
  consultingTitle?: string;
  consultingDescription?: string;
  consultingFeatures?: string[];
  consultingImage?: string;
  consultingLink?: string;
  consultingLinkText?: string;
};

export type WhoServeContent = SectionMeta & {
  consultingEyebrow?: string;
  consultingTitle?: string;
  consultingSubtitle?: string;
  consultingServices?: ConsultingService[];
};

export type HeroContent = SectionMeta & {
  trustBadges?: TrustBadge[];
  floatingCardTitle?: string;
  floatingCardDescription?: string;
  features?: HeroFeature[];
};

export type CtaContent = SectionMeta & {
  badge?: string;
};

export type ContactContent = SectionMeta & {
  emailLabel?: string;
  phoneLabel?: string;
  addressLabel?: string;
};

export type IndustryBenefits = {
  icon?: string;
  items: string[];
  stat?: { v: string; l: string };
};

export function parseContent<T>(content: unknown): T {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return content as T;
  }
  return {} as T;
}

export function sectionEyebrow(
  section: { subtitle?: string | null; content?: unknown },
  fallback: string
): string {
  const c = parseContent<SectionMeta>(section.content);
  return c.eyebrow || section.subtitle || fallback;
}

export function industryIcon(benefits: unknown): string | undefined {
  return parseIndustryBenefits(benefits).icon;
}

export function parseIndustryBenefits(benefits: unknown): IndustryBenefits {
  if (benefits && typeof benefits === "object" && !Array.isArray(benefits)) {
    const b = benefits as { icon?: string; items?: string[]; stat?: { v: string; l: string } };
    return {
      icon: b.icon,
      items: Array.isArray(b.items) ? b.items : [],
      stat: b.stat,
    };
  }
  if (Array.isArray(benefits)) {
    return { items: benefits.filter((x): x is string => typeof x === "string") };
  }
  return { items: [] };
}

export function parseBullets(bullets: unknown): string[] {
  if (Array.isArray(bullets)) {
    return bullets.filter((b): b is string => typeof b === "string");
  }
  return [];
}
