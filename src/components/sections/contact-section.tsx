"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/actions/contact";
import { toast } from "sonner";
import { parseContent, type ContactContent } from "@/lib/section-content";
import { parseSiteSettings } from "@/lib/site-settings";
import type { FullSection } from "@/lib/cms";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  facilityName: z.string().optional(),
  role: z.string().optional(),
  facilityType: z.string().optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  country: z.string().optional(),
  message: z.string().optional(),
  requestDemo: z.boolean(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactSectionProps {
  section: FullSection;
  settings?: Record<string, unknown>;
}

export function ContactSection({ section, settings = {} }: ContactSectionProps) {
  const site = parseSiteSettings(settings);
  const content = parseContent<ContactContent>(section.content);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { requestDemo: true },
  });

  async function onSubmit(data: ContactFormData) {
    setLoading(true);
    const result = await submitContactForm(data);
    setLoading(false);
    if (result.success) {
      toast.success("Thank you! We'll be in touch within 24 hours.");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-slate-200/70 shadow-[0_30px_80px_rgba(10,42,139,0.12)] lg:grid lg:grid-cols-2">
          {/* LEFT — info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-[#050C36] p-8 text-white sm:p-10 lg:p-12"
          >
            <div className="absolute inset-0 bg-mesh-dark" />
            <div className="relative">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#00C2FF]">
                {content.eyebrow || "Contact"}
              </span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                {section.title || "Let's start a conversation"}
              </h2>
              <p className="mt-4 text-blue-100/80">
                {section.subtitle || "Tell us about your facility and we'll show you exactly how Afya Bridge can help."}
              </p>

              <div className="mt-10 space-y-5">
                {[
                  { icon: Mail, label: content.emailLabel || "Email us", value: site.contact_email },
                  {
                    icon: Phone,
                    label: content.phoneLabel || "Call us",
                    value: [site.phone_ke, site.phone_tz].filter(Boolean).join(" · "),
                  },
                  { icon: MapPin, label: content.addressLabel || "Visit us", value: site.address },
                ]
                  .filter((row) => row.value)
                  .map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                      <Icon className="h-5 w-5 text-[#00C2FF]" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-blue-200/70">{label}</div>
                      <div className="font-medium text-white">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <Clock className="mb-2 h-5 w-5 text-[#00C2FF]" />
                  <div className="text-sm font-semibold">{site.contact_response_title}</div>
                  <div className="text-xs text-blue-100/70">{site.contact_response_subtitle}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <ShieldCheck className="mb-2 h-5 w-5 text-[#00C2FF]" />
                  <div className="text-sm font-semibold">{site.contact_security_title}</div>
                  <div className="text-xs text-blue-100/70">{site.contact_security_subtitle}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 sm:p-10 lg:p-12"
          >
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#0A2A8B]">Message sent!</h3>
                <p className="mt-2 text-slate-600">Our team will reach out within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...register("name")} className="mt-1.5 rounded-xl" placeholder="Dr. Jane Doe" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="facilityName">Facility Name</Label>
                    <Input id="facilityName" {...register("facilityName")} className="mt-1.5 rounded-xl" placeholder="City Hospital" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="role">Your Role</Label>
                    <Input id="role" {...register("role")} className="mt-1.5 rounded-xl" placeholder="Medical Director" />
                  </div>
                  <div>
                    <Label htmlFor="facilityType">Facility Type</Label>
                    <Input id="facilityType" {...register("facilityType")} className="mt-1.5 rounded-xl" placeholder="Hospital / Clinic" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email")} className="mt-1.5 rounded-xl" placeholder="you@facility.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} className="mt-1.5 rounded-xl" placeholder="+254 ..." />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register("country")} className="mt-1.5 rounded-xl" placeholder="Kenya, Tanzania..." />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" {...register("message")} className="mt-1.5 rounded-xl" rows={4} placeholder="Tell us about your facility's needs..." />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" {...register("requestDemo")} className="rounded" defaultChecked />
                  I would like to request a demo
                </label>
                <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-to-r from-[#0A2A8B] to-[#2D7FF9]">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
