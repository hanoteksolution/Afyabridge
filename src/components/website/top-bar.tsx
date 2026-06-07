import { MapPin, Mail } from "lucide-react";
import { parseSiteSettings } from "@/lib/site-settings";

export function TopBar({ settings = {} }: { settings?: Record<string, unknown> }) {
  const site = parseSiteSettings(settings);

  const socials = [
    { label: "Facebook", url: site.social_facebook },
    { label: "Twitter", url: site.social_twitter },
    { label: "LinkedIn", url: site.social_linkedin },
    { label: "YouTube", url: site.social_youtube },
  ].filter((s) => s.url);

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
              {socials.map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold transition hover:bg-[#2563EB]"
                >
                  {label[0]}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
