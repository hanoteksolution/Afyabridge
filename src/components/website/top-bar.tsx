import { MapPin, Mail } from "lucide-react";
import { SocialIcon, type SocialPlatform } from "@/components/website/social-icons";
import { parseSiteSettings } from "@/lib/site-settings";

export function TopBar({ settings = {} }: { settings?: Record<string, unknown> }) {
  const site = parseSiteSettings(settings);

  const socials = (
    [
      { platform: "Facebook" as const, url: site.social_facebook },
      { platform: "Twitter" as const, url: site.social_twitter },
      { platform: "LinkedIn" as const, url: site.social_linkedin },
      { platform: "YouTube" as const, url: site.social_youtube },
    ] satisfies { platform: SocialPlatform; url: string }[]
  ).filter((s) => s.url);

  return (
    <div className="bg-[#001A41] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5 text-white/90">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
            {site.address}
          </span>
          <span className="flex items-center gap-1.5 text-white/90">
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
            {site.contact_email}
          </span>
        </div>
        {socials.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-white/70">Follow Us On :</span>
            <div className="flex items-center gap-2">
              {socials.map(({ platform, url }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-[#2563EB] hover:bg-[#2563EB]"
                >
                  <SocialIcon platform={platform} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
