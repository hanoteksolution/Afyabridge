import { MapPin, Mail } from "lucide-react";
import { SocialIcon, type SocialPlatform } from "@/components/website/social-icons";
import { parseSiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

export function TopBar({
  settings = {},
  compact = false,
}: {
  settings?: Record<string, unknown>;
  compact?: boolean;
}) {
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
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col gap-1.5 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 lg:px-8",
          compact ? "py-1.5 text-[10px] sm:text-[11px]" : "py-2 text-[11px] sm:text-xs"
        )}
      >
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-0">
          <span
            className={cn(
              "flex min-w-0 items-center gap-1.5 text-white/90",
              compact && "hidden md:flex"
            )}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
            <span className="line-clamp-1">{site.address}</span>
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
            <span className={cn("text-white/70", compact ? "hidden lg:inline" : "hidden sm:inline")}>
              Follow Us On :
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {socials.map(({ platform, url }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className={cn(
                    "flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-[#2563EB] hover:bg-[#2563EB]",
                    compact ? "h-6 w-6" : "h-7 w-7"
                  )}
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
