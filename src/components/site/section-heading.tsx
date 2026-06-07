import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  dark?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, center = true, dark = false }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <span className={cn("text-sm font-semibold uppercase tracking-wider", dark ? "text-[#00C2FF]" : "text-[#2D7FF9]")}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn("mt-3 text-3xl font-bold sm:text-4xl lg:text-[2.6rem]", dark ? "text-white" : "text-[#0A2A8B]")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-blue-100/80" : "text-slate-600")}>{subtitle}</p>
      )}
    </Reveal>
  );
}
