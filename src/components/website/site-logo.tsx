import Image from "next/image";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteLogo({
  name,
  logoUrl,
  tagline,
  showTagline = true,
  dark = false,
  className,
}: {
  name: string;
  logoUrl?: string;
  tagline?: string;
  showTagline?: boolean;
  dark?: boolean;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={140}
        height={40}
        className={cn("h-9 w-auto object-contain object-left", className)}
        priority
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl shadow-lg",
          dark
            ? "bg-gradient-to-br from-[#2D7FF9] to-[#00C2FF]"
            : "bg-gradient-to-br from-[#0A2A8B] to-[#2D7FF9] shadow-blue-900/20"
        )}
      >
        <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
        {!dark && <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />}
      </div>
      <div className="leading-tight">
        <span className={cn("block text-base font-bold", dark ? "text-white" : "text-[#0A2A8B]")}>{name}</span>
        {showTagline && tagline && (
          <span
            className={cn(
              "block text-[10px] font-medium uppercase tracking-wider",
              dark ? "text-[#00C2FF]" : "text-[#2D7FF9]"
            )}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
