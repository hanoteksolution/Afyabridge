import { SITE } from "@/content/site";

export type TrustBadgeSetting = { icon: string; label: string };

export type SiteSettings = {
  site_name: string;
  site_tagline: string;
  site_logo: string;
  site_logo_dark: string;
  contact_email: string;
  phone_ke: string;
  phone_tz: string;
  address: string;
  region: string;
  watch_demo_text: string;
  watch_demo_link: string;
  request_demo_text: string;
  request_demo_link: string;
  copyright_text: string;
  privacy_link: string;
  terms_link: string;
  social_linkedin: string;
  social_twitter: string;
  social_facebook: string;
  social_youtube: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_hero_bg: string;
  footer_newsletter_title: string;
  footer_newsletter_subtitle: string;
  footer_trust_badges: string;
  contact_response_title: string;
  contact_response_subtitle: string;
  contact_security_title: string;
  contact_security_subtitle: string;
};

const DEFAULTS: SiteSettings = {
  site_name: SITE.name,
  site_tagline: SITE.positioning,
  site_logo: "",
  site_logo_dark: "",
  contact_email: SITE.email,
  phone_ke: SITE.phoneKE,
  phone_tz: SITE.phoneTZ,
  address: SITE.address,
  region: SITE.region,
  watch_demo_text: "Watch Demo",
  watch_demo_link: "/contact",
  request_demo_text: "Request Demo",
  request_demo_link: "/contact",
  copyright_text: "",
  privacy_link: "/privacy",
  terms_link: "/terms",
  social_linkedin: "",
  social_twitter: "",
  social_facebook: "",
  social_youtube: "",
  color_primary: "#0A2A8B",
  color_secondary: "#2563EB",
  color_accent: "#00C2FF",
  color_hero_bg: "#041B52",
  footer_newsletter_title: "Stay ahead in healthcare technology",
  footer_newsletter_subtitle: "Insights on digital transformation in East African healthcare.",
  footer_trust_badges: JSON.stringify([
    { icon: "ShieldCheck", label: "Healthcare-grade data protection" },
    { icon: "Lock", label: "Role-based access & encryption" },
    { icon: "Award", label: "Audit-ready architecture" },
  ]),
  contact_response_title: "< 24h response",
  contact_response_subtitle: "Guaranteed reply time",
  contact_security_title: "Data secure",
  contact_security_subtitle: "Healthcare-grade privacy",
};

export function parseSiteSettings(raw: Record<string, unknown> = {}): SiteSettings {
  const str = (key: keyof SiteSettings) => String(raw[key] ?? DEFAULTS[key] ?? "");
  return {
    site_name: str("site_name"),
    site_tagline: str("site_tagline"),
    site_logo: str("site_logo"),
    site_logo_dark: str("site_logo_dark"),
    contact_email: str("contact_email"),
    phone_ke: str("phone_ke"),
    phone_tz: str("phone_tz"),
    address: str("address"),
    region: str("region"),
    watch_demo_text: str("watch_demo_text"),
    watch_demo_link: str("watch_demo_link"),
    request_demo_text: str("request_demo_text"),
    request_demo_link: str("request_demo_link"),
    copyright_text: str("copyright_text"),
    privacy_link: str("privacy_link"),
    terms_link: str("terms_link"),
    social_linkedin: str("social_linkedin"),
    social_twitter: str("social_twitter"),
    social_facebook: str("social_facebook"),
    social_youtube: str("social_youtube"),
    color_primary: str("color_primary"),
    color_secondary: str("color_secondary"),
    color_accent: str("color_accent"),
    color_hero_bg: str("color_hero_bg"),
    footer_newsletter_title: str("footer_newsletter_title"),
    footer_newsletter_subtitle: str("footer_newsletter_subtitle"),
    footer_trust_badges: str("footer_trust_badges"),
    contact_response_title: str("contact_response_title"),
    contact_response_subtitle: str("contact_response_subtitle"),
    contact_security_title: str("contact_security_title"),
    contact_security_subtitle: str("contact_security_subtitle"),
  };
}

export function parseTrustBadges(json: string): TrustBadgeSetting[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (b): b is TrustBadgeSetting =>
          b && typeof b === "object" && "label" in b && "icon" in b
      );
    }
  } catch {
    /* use defaults */
  }
  return JSON.parse(DEFAULTS.footer_trust_badges) as TrustBadgeSetting[];
}

export function themeToCssVars(settings: SiteSettings): Record<string, string> {
  return {
    "--primary": settings.color_primary,
    "--secondary": settings.color_secondary,
    "--accent": settings.color_accent,
    "--color-hero-bg": settings.color_hero_bg,
  };
}
