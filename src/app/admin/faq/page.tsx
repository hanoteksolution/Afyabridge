import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { FaqManager } from "@/components/admin/faq-manager";

export default async function FaqAdminPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <AdminHeader title="FAQ" />
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">Manage frequently asked questions shown on the FAQ page.</p>
        <FaqManager faqs={faqs} />
      </div>
    </div>
  );
}
