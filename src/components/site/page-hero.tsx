import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
}

export function PageHero({ eyebrow, title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#050C36] pt-14 pb-20 text-white sm:pt-16">
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#00C2FF]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-blue-200/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{breadcrumb}</span>
          </nav>
          <span className="text-sm font-semibold uppercase tracking-wider text-[#00C2FF]">{eyebrow}</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-blue-100/85">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}
