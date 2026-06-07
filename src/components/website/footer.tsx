import Link from "next/link";
import { Mail, MapPin, Phone, Share2 } from "lucide-react";
import { SocialIcon, type SocialPlatform } from "@/components/website/social-icons";
import { getLucideIcon } from "@/lib/icons";
import { SiteLogo } from "@/components/website/site-logo";
import { NewsletterForm } from "@/components/website/newsletter-form";
import { FOOTER_NAV, SITE } from "@/content/site";
import { parseSiteSettings, parseTrustBadges } from "@/lib/site-settings";

export function Footer({
  footerNav,
  settings = {},
}: {
  footerNav?: Record<string, { label: string; href: string }[]>;
  settings?: Record<string, unknown>;
}) {
  const site = parseSiteSettings(settings);
  const nav = footerNav && Object.keys(footerNav).length > 0 ? footerNav : FOOTER_NAV;
  const year = new Date().getFullYear();
  const copyright =
    site.copyright_text || `© ${year} ${site.site_name}. All rights reserved.`;

  const trustBadges = parseTrustBadges(site.footer_trust_badges);

  const socials = (
    [
      { platform: "LinkedIn" as const, url: site.social_linkedin },
      { platform: "Twitter" as const, url: site.social_twitter },
      { platform: "Facebook" as const, url: site.social_facebook },
      { platform: "YouTube" as const, url: site.social_youtube },
    ] satisfies { platform: SocialPlatform; url: string }[]
  ).filter((s) => s.url);

  return (
    <footer className="relative overflow-hidden bg-[#050C36] text-white">
      <div className="absolute inset-0 bg-mesh-dark opacity-80" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <SiteLogo
              name={site.site_name}
              logoUrl={site.site_logo_dark || site.site_logo || undefined}
              tagline={site.site_tagline || SITE.tagline}
              dark
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100/70">
              {site.site_tagline || SITE.positioning}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition-colors hover:border-[#00C2FF]/40 hover:bg-[#00C2FF]/20"
                  >
                    <SocialIcon platform={platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {Object.entries(nav).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#00C2FF]">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link href={link.href} className="text-sm text-blue-100/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-8 border-t border-white/10 py-10 lg:grid-cols-2">
          <div>
            <h4 className="text-lg font-semibold">{site.footer_newsletter_title}</h4>
            <p className="mt-1 text-sm text-blue-100/70">{site.footer_newsletter_subtitle}</p>
            <div className="mt-4 max-w-md"><NewsletterForm /></div>
          </div>
          <div className="flex flex-col justify-center gap-3 text-sm text-blue-100/80">
            {site.contact_email && (
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#00C2FF]" /> {site.contact_email}</div>
            )}
            {(site.phone_ke || site.phone_tz) && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00C2FF]" />
                {site.phone_ke}{site.phone_tz ? ` · ${site.phone_tz}` : ""}
              </div>
            )}
            {site.address && (
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#00C2FF]" /> {site.address}</div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 py-6">
          {trustBadges.map(({ icon, label }) => {
            const Icon = getLucideIcon(icon, Share2);
            return (
            <div key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <Icon className="h-4 w-4 text-[#00C2FF]" />
              <span className="text-xs font-medium text-blue-100/80">{label}</span>
            </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-sm text-blue-200/60">{copyright}</p>
          <div className="flex gap-6 text-sm text-blue-200/60">
            {site.privacy_link && (
              <Link href={site.privacy_link} className="hover:text-white">Privacy Policy</Link>
            )}
            {site.terms_link && (
              <Link href={site.terms_link} className="hover:text-white">Terms of Service</Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
