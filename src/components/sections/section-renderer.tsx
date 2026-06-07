import type { FullSection } from "@/lib/cms";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustBarSection } from "@/components/sections/trust-bar-section";
import { WhySection } from "@/components/sections/why-section";
import { WhoWeServeSection } from "@/components/sections/who-we-serve-section";
import { PlatformModulesSection } from "@/components/sections/platform-modules-section";
import { ApproachSection } from "@/components/sections/approach-section";
import { ConsultingServicesSection } from "@/components/sections/consulting-services-section";
import { MissionVisionSection } from "@/components/sections/mission-vision-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { BlogSection } from "@/components/sections/blog-section";
import { CTASection } from "@/components/sections/cta-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqListSection } from "@/components/sections/faq-section";
import type { Testimonial, CaseStudy, BlogPost, BlogCategory, User, FAQ } from "@prisma/client";

type BlogPostWithRelations = BlogPost & {
  category: BlogCategory | null;
  author: User | null;
};

interface SectionRendererProps {
  sections: FullSection[];
  testimonials?: Testimonial[];
  caseStudies?: CaseStudy[];
  blogPosts?: BlogPostWithRelations[];
  faqs?: FAQ[];
  settings?: Record<string, unknown>;
}

export function SectionRenderer({
  sections,
  testimonials = [],
  caseStudies = [],
  blogPosts = [],
  faqs = [],
  settings = {},
}: SectionRendererProps) {
  const hasHero = sections.some((s) => s.type === "HERO");
  const whySection = sections.find((s) => s.type === "WHY_AFYA");
  const whoServeSection = sections.find((s) => s.type === "WHO_WE_SERVE");
  const embedWhoServeInWhy = Boolean(whySection && whoServeSection);

  return (
    <>
      {sections.map((section) => {
        if (embedWhoServeInWhy && section.type === "WHO_WE_SERVE") {
          return null;
        }

        switch (section.type) {
          case "HERO":
            return <HeroSection key={section.id} section={section} />;
          case "TRUST_BAR":
            return (
              <TrustBarSection
                key={section.id}
                section={section}
                overlap={hasHero}
              />
            );
          case "WHY_AFYA":
            return (
              <WhySection
                key={section.id}
                section={section}
                whoServeSection={embedWhoServeInWhy ? whoServeSection : undefined}
              />
            );
          case "WHO_WE_SERVE":
            return <WhoWeServeSection key={section.id} section={section} />;
          case "PLATFORM_MODULES":
            return <PlatformModulesSection key={section.id} section={section} />;
          case "OUR_APPROACH":
            return <ApproachSection key={section.id} section={section} />;
          case "MISSION_VISION":
            return <MissionVisionSection key={section.id} section={section} />;
          case "TESTIMONIALS":
            return (
              <TestimonialsSection
                key={section.id}
                section={section}
                testimonials={testimonials}
              />
            );
          case "CASE_STUDIES":
            return (
              <CaseStudiesSection
                key={section.id}
                section={section}
                caseStudies={caseStudies}
              />
            );
          case "BLOG":
            return (
              <BlogSection key={section.id} section={section} blogPosts={blogPosts} />
            );
          case "CTA":
            return <CTASection key={section.id} section={section} />;
          case "CONTACT":
            return <ContactSection key={section.id} section={section} settings={settings} />;
          case "CUSTOM": {
            const variant = (section.content as { variant?: string } | null)?.variant;
            if (variant === "FAQ") {
              return <FaqListSection key={section.id} section={section} faqs={faqs} />;
            }
            if (variant === "CONSULTING") {
              return <ConsultingServicesSection key={section.id} section={section} />;
            }
            return null;
          }
          default:
            return null;
        }
      })}
    </>
  );
}
