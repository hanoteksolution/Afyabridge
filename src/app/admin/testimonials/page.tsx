import { AdminHeader } from "@/components/admin/header";
import {
  TestimonialManager,
  type TestimonialRow,
} from "@/components/admin/testimonial-manager";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await withDbRetry((prisma) =>
    prisma.testimonial.findMany({ orderBy: { order: "asc" } })
  );

  const rows: TestimonialRow[] = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    hospital: t.hospital,
    review: t.review,
    result: t.result,
    rating: t.rating,
    photo: t.photo,
    order: t.order,
    isVisible: t.isVisible,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Testimonials" />
      <div className="p-6 lg:p-8">
        <TestimonialManager testimonials={rows} />
      </div>
    </div>
  );
}
