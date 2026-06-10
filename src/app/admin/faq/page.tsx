import { AdminHeader } from "@/components/admin/header";
import { FaqManager, type FaqRow } from "@/components/admin/faq-manager";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const faqs = await withDbRetry((prisma) =>
    prisma.fAQ.findMany({ orderBy: { order: "asc" } })
  );

  const rows: FaqRow[] = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    order: faq.order,
    isVisible: faq.isVisible,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="FAQ" />
      <div className="p-6 lg:p-8">
        <FaqManager faqs={rows} />
      </div>
    </div>
  );
}
