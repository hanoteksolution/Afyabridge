import type { SectionType } from "@prisma/client";

export const SECTION_LABELS: Record<SectionType, string> = {
  HERO: "Hero Section",
  TRUST_BAR: "Trust Bar",
  WHY_AFYA: "Why Afya Bridge",
  WHO_WE_SERVE: "Who We Serve",
  PLATFORM_MODULES: "Platform Modules",
  OUR_APPROACH: "Our Approach",
  MISSION_VISION: "Mission & Vision",
  TESTIMONIALS: "Testimonials",
  CASE_STUDIES: "Case Studies",
  BLOG: "Blog",
  CTA: "Call to Action",
  CONTACT: "Contact Form",
  CUSTOM: "Custom Section",
};

export const SECTION_SHORT_LABELS: Record<SectionType, string> = {
  HERO: "Hero",
  TRUST_BAR: "Trust Bar",
  WHY_AFYA: "Why Afya",
  WHO_WE_SERVE: "Who We Serve",
  PLATFORM_MODULES: "Modules",
  OUR_APPROACH: "Approach",
  MISSION_VISION: "Mission/Vision",
  TESTIMONIALS: "Testimonials",
  CASE_STUDIES: "Case Studies",
  BLOG: "Blog",
  CTA: "CTA",
  CONTACT: "Contact",
  CUSTOM: "Custom",
};

export const SECTION_META: Record<
  SectionType,
  { icon: string; accent: string; chip: string }
> = {
  HERO: { icon: "Sparkles", accent: "from-violet-500 to-purple-600", chip: "bg-violet-50 text-violet-700" },
  TRUST_BAR: { icon: "Shield", accent: "from-[#2563EB] to-[#3b82f6]", chip: "bg-blue-50 text-blue-700" },
  WHY_AFYA: { icon: "Heart", accent: "from-rose-500 to-pink-600", chip: "bg-rose-50 text-rose-700" },
  WHO_WE_SERVE: { icon: "Users", accent: "from-cyan-500 to-sky-600", chip: "bg-cyan-50 text-cyan-800" },
  PLATFORM_MODULES: { icon: "LayoutGrid", accent: "from-indigo-500 to-blue-600", chip: "bg-indigo-50 text-indigo-700" },
  OUR_APPROACH: { icon: "Workflow", accent: "from-teal-500 to-emerald-600", chip: "bg-teal-50 text-teal-700" },
  MISSION_VISION: { icon: "Star", accent: "from-amber-500 to-orange-500", chip: "bg-amber-50 text-amber-800" },
  TESTIMONIALS: { icon: "Quote", accent: "from-fuchsia-500 to-purple-600", chip: "bg-fuchsia-50 text-fuchsia-700" },
  CASE_STUDIES: { icon: "Briefcase", accent: "from-[#0A1F78] to-[#3730a3]", chip: "bg-[#0A1F78]/10 text-[#0A1F78]" },
  BLOG: { icon: "BookOpen", accent: "from-sky-500 to-blue-600", chip: "bg-sky-50 text-sky-700" },
  CTA: { icon: "Rocket", accent: "from-[#00C2FF] to-[#2563EB]", chip: "bg-cyan-50 text-cyan-800" },
  CONTACT: { icon: "Mail", accent: "from-emerald-500 to-green-600", chip: "bg-emerald-50 text-emerald-700" },
  CUSTOM: { icon: "Plus", accent: "from-slate-500 to-slate-600", chip: "bg-slate-100 text-slate-700" },
};
