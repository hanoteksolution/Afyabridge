export const SITE_CONFIG = {
  name: "Afya Bridge",
  tagline: "Bridging Technology & Care",
  description:
    "Modern healthcare software that improves patient flow, operational efficiency, and decision-making — with local support.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://afyabridge.com",
  email: "hello@afyabridge.com",
  phone: "+254 700 000 000",
  address: "Nairobi, Kenya",
};

export const BRAND_COLORS = {
  primary: "#0A1F78",
  secondary: "#2563EB",
  accent: "#00C2FF",
  success: "#10B981",
  background: "#F8FAFC",
};

export const ADMIN_PERMISSIONS = [
  "dashboard:read",
  "pages:read",
  "pages:write",
  "sections:read",
  "sections:write",
  "media:read",
  "media:write",
  "seo:read",
  "seo:write",
  "menus:read",
  "menus:write",
  "settings:read",
  "settings:write",
  "users:read",
  "users:write",
  "roles:read",
  "roles:write",
  "blogs:read",
  "blogs:write",
  "testimonials:read",
  "testimonials:write",
  "case-studies:read",
  "case-studies:write",
  "contacts:read",
  "contacts:write",
  "activity:read",
] as const;

export type Permission = (typeof ADMIN_PERMISSIONS)[number];
