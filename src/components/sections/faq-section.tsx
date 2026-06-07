import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaBand } from "@/components/site/cta-band";
import type { FAQ } from "@prisma/client";
import type { FullSection } from "@/lib/cms";

export function FaqListSection({ section, faqs }: { section: FullSection; faqs: FAQ[] }) {
  return (
    <>
      <PageHero
        breadcrumb="FAQ"
        eyebrow={section.subtitle || "Frequently Asked Questions"}
        title={section.title || "Everything You Need to Know"}
        subtitle="Answers to the questions clinics and hospitals ask most."
      />
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <FaqAccordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
          </Reveal>
        </div>
      </section>
      <CtaBand
        title="Ready to Get Started?"
        subtitle="Simply request a demo. Our team will assess your needs and guide you through the next steps."
      />
    </>
  );
}
