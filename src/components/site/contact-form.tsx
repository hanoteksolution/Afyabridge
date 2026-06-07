"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/actions/contact";
import { toast } from "sonner";

const schema = z.object({
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

type FormData = z.infer<typeof schema>;

export function ContactForm({ defaultFacilityType }: { defaultFacilityType?: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { requestDemo: true, facilityType: defaultFacilityType || "" },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    const res = await submitContactForm(data);
    setLoading(false);
    if (res.success) {
      toast.success("Thank you! Our team will reach out within 24 hours.");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      toast.error(res.error);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-[#0A2A8B]">Message sent!</h3>
        <p className="mt-2 text-slate-600">Our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
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
          <Input id="role" {...register("role")} className="mt-1.5 rounded-xl" placeholder="Administrator / IT" />
        </div>
        <div>
          <Label htmlFor="facilityType">Facility Type</Label>
          <Input id="facilityType" {...register("facilityType")} className="mt-1.5 rounded-xl" placeholder="Clinic / Hospital" />
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
        <Input id="country" {...register("country")} className="mt-1.5 rounded-xl" placeholder="Kenya / Tanzania" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register("message")} className="mt-1.5 rounded-xl" rows={4} placeholder="Tell us about your facility and goals..." />
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
  );
}
