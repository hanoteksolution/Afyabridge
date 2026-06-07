"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ArrowRight, Play, ChevronLeft, ChevronRight, Lock,
} from "lucide-react";
import { HeroBackground } from "@/components/sections/hero-background";
import { HeroDashboard } from "@/components/sections/hero-dashboard";
import { HeroConsultingVisual } from "@/components/sections/hero-consulting-visual";
import { getLucideIcon } from "@/lib/icons";
import { parseContent, type HeroContent } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";
import type { HeroSlide } from "@prisma/client";

interface HeroSectionProps {
  section: FullSection;
}

type SlideData = Pick<
  HeroSlide,
  | "id" | "title" | "subtitle" | "image" | "videoUrl"
  | "ctaText" | "ctaLink" | "ctaText2" | "ctaLink2" | "badge"
>;

function resolveSlides(section: FullSection): SlideData[] {
  if (section.heroSlides.length > 0) {
    return section.heroSlides.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      videoUrl: s.videoUrl,
      ctaText: s.ctaText,
      ctaLink: s.ctaLink,
      ctaText2: s.ctaText2,
      ctaLink2: s.ctaLink2,
      badge: s.badge,
    }));
  }

  return [
    {
      id: "fallback-1",
      title: section.title || "Healthcare Technology for Better Care",
      subtitle:
        section.subtitle ||
        "Empowering hospitals, clinics, and healthcare networks with intelligent patient management, digital records, analytics, and operational excellence.",
      image: section.image,
      videoUrl: null,
      ctaText: section.buttonText || "Request a Demo",
      ctaLink: section.buttonLink || "/contact",
      ctaText2: section.buttonText2 || "Watch Platform Tour",
      ctaLink2: section.buttonLink2 || "/contact",
      badge: "Trusted by 500+ healthcare facilities across East Africa",
    },
  ];
}

function renderHeadline(title: string) {
  const match = title.match(/^(.+?\bfor\s+)(.+)$/i);
  if (match) {
    return (
      <>
        {match[1]}
        <span className="bg-gradient-to-r from-[#60A5FA] to-[#00C2FF] bg-clip-text text-transparent">
          {match[2]}
        </span>
      </>
    );
  }
  return title;
}

function HeroSlideVisual({
  slide,
  index,
  floatingCard,
}: {
  slide: SlideData;
  index: number;
  floatingCard?: { title: string; description?: string };
}) {
  if (slide.image) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-[#2D7FF9]/30 via-[#00C2FF]/20 to-transparent blur-3xl" />
        <div className="relative h-full overflow-hidden rounded-[32px] border border-white/25 bg-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041B52]/40 via-transparent to-transparent" />
          {floatingCard?.title && (
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
              <div className="text-sm font-bold text-white">{floatingCard.title}</div>
              {floatingCard.description && (
                <p className="mt-1 text-xs text-blue-100/80">{floatingCard.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (slide.videoUrl) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-[#2D7FF9]/30 via-[#00C2FF]/20 to-transparent blur-3xl" />
        <div className="relative h-full overflow-hidden rounded-[32px] border border-white/25 bg-black/40 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <iframe
            src={slide.videoUrl}
            title={slide.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return index % 2 === 1 ? <HeroConsultingVisual /> : <HeroDashboard />;
}

export function HeroSection({ section }: HeroSectionProps) {
  const heroContent = parseContent<HeroContent>(section.content);
  const features = heroContent.features || [];
  const floatingCard =
    heroContent.floatingCardTitle
      ? { title: heroContent.floatingCardTitle, description: heroContent.floatingCardDescription }
      : undefined;

  const slides = useMemo(() => resolveSlides(section), [section]);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + slides.length) % slides.length),
    [slides.length]
  );
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [goNext, slides.length]);

  const slide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#041B52]">
      <HeroBackground />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:left-6 lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:right-6 lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="relative mx-auto h-[min(750px,90vh)] max-w-[1440px] px-4 sm:h-[800px] sm:px-6 lg:px-10">
        <div className="grid h-full grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[45%_55%] lg:gap-6 lg:py-14">
          <div className="relative z-10 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/40 bg-[#2563EB]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-100">
                  <Shield className="h-3.5 w-3.5 text-[#60A5FA]" />
                  {slide.badge || "Trusted by 500+ healthcare facilities across East Africa"}
                </div>

                <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
                  {renderHeadline(slide.title)}
                </h1>

                {slide.subtitle && (
                  <p className="mt-6 max-w-[600px] text-base leading-relaxed text-blue-100/80 sm:text-lg">
                    {slide.subtitle}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink || "/contact"}
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:shadow-xl hover:shadow-blue-900/40"
                  >
                    {slide.ctaText || "Request a Demo"}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white/30">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href={slide.ctaLink2 || slide.videoUrl || "/contact"}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30">
                      <Play className="h-3.5 w-3.5 fill-white text-white" />
                    </span>
                    {slide.ctaText2 || "Watch Platform Tour"}
                  </Link>
                </div>

                {features.length > 0 && (
                <div className="mt-8 hidden flex-wrap gap-x-6 gap-y-3 sm:flex">
                  {features.map((f) => {
                    const Icon = getLucideIcon(f.icon, Lock);
                    return (
                      <div key={f.label} className="flex items-center gap-2 text-xs text-blue-200/70">
                        <Icon className="h-3.5 w-3.5 text-[#60A5FA]" />
                        {f.label}
                      </div>
                    );
                  })}
                </div>
                )}

                {slide.image && (
                  <div className="relative mt-8 h-56 w-full overflow-hidden rounded-2xl border border-white/20 shadow-xl lg:hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={activeIndex === 0}
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {slides.length > 1 && (
              <div className="mt-10 flex items-center gap-3" role="tablist" aria-label="Slide progress">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className="group relative h-1 overflow-hidden rounded-full bg-white/15 transition-all"
                    style={{ width: i === activeIndex ? 48 : 32 }}
                  >
                    <span
                      className={`absolute inset-y-0 left-0 rounded-full bg-[#3B82F6] transition-all duration-500 ${
                        i === activeIndex ? "w-full" : "w-0 group-hover:w-1/2"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 hidden h-[420px] lg:block lg:h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.97 }}
                transition={{ duration: 0.55 }}
                className="h-full"
              >
                <HeroSlideVisual slide={slide} index={activeIndex} floatingCard={floatingCard} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
