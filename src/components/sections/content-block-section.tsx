import type { FullSection } from "@/lib/cms";

export function ContentBlockSection({ section }: { section: FullSection }) {
  const content = section.content as { body?: string } | null;
  if (!content?.body) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div
        className="cms-content mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-slate-700 leading-relaxed [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0A2A8B] [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
    </section>
  );
}
