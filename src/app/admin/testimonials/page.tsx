import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { TestimonialManager } from "@/components/admin/testimonial-manager";

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <AdminHeader title="Testimonials" />
      <div className="p-6"><TestimonialManager testimonials={testimonials} /></div>
    </div>
  );
}
