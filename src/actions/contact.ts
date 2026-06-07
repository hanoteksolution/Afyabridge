"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  facilityName: z.string().optional(),
  role: z.string().optional(),
  facilityType: z.string().optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  country: z.string().optional(),
  message: z.string().optional(),
  requestDemo: z.boolean().default(false),
});

export async function submitContactForm(data: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid data" };
  }

  try {
    const contact = await prisma.contact.create({ data: parsed.data });
    await logActivity({
      action: "CREATE",
      entity: "Contact",
      entityId: contact.id,
      details: { email: contact.email, requestDemo: contact.requestDemo },
    });
    return { success: true, id: contact.id };
  } catch {
    return { success: false, error: "Failed to submit. Please try again." };
  }
}

export async function subscribeNewsletter(email: string) {
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) {
    return { success: false, error: "Valid email required" };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      create: { email: parsed.data },
      update: { isActive: true },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Subscription failed" };
  }
}
