"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { savePageSEO } from "@/actions/cms";
import { toast } from "sonner";
import type { SEO } from "@prisma/client";

export function SeoForm({ pageId, seo }: { pageId: string; seo: SEO | null }) {
  const [form, setForm] = useState({
    metaTitle: seo?.metaTitle || "",
    metaDescription: seo?.metaDescription || "",
    metaKeywords: seo?.metaKeywords || "",
    ogTitle: seo?.ogTitle || "",
    ogDescription: seo?.ogDescription || "",
    ogImage: seo?.ogImage || "",
    noIndex: seo?.noIndex || false,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await savePageSEO(pageId, form);
    setSaving(false);
    if (res.success) toast.success("SEO saved");
    else toast.error("Failed to save SEO");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      <h3 className="font-semibold text-[#0A1F78]">SEO Settings</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Meta Title</Label>
          <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label>Meta Description</Label>
          <Textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="mt-1.5" rows={2} />
        </div>
        <div className="sm:col-span-2">
          <Label>Keywords</Label>
          <Input value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>OG Title</Label>
          <Input value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>OG Image URL</Label>
          <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <Switch checked={form.noIndex} onCheckedChange={(v) => setForm({ ...form, noIndex: v })} />
          <span className="text-sm">Hide from search engines (noindex)</span>
        </div>
      </div>
      <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save SEO"}</Button>
    </div>
  );
}
