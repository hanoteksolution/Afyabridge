import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DiscoverButton({
  href,
  label = "Discover More",
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#2563EB] py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/25 transition hover:bg-[#1d4ed8]",
        className
      )}
    >
      {label}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2563EB] transition group-hover:scale-105">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
