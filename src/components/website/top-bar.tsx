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
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-[11px] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:text-xs lg:px-8">
        <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
          <span className="flex min-w-0 items-start gap-1.5 text-white/90 sm:items-center">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3B82F6] sm:mt-0" />
            <span className="line-clamp-2 sm:line-clamp-1">{site.address}</span>
          </span>
          <a
            href={`mailto:${site.contact_email}`}
            className="flex min-w-0 items-center gap-1.5 truncate text-white/90 transition hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
            <span className="truncate">{site.contact_email}</span>
          </a>
        </div>
        {socials.length > 0 && (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-white/70 sm:inline">Follow Us On :</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
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
