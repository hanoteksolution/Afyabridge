"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AdminFormPanel,
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { savePageSEO } from "@/actions/cms";
import { toast } from "sonner";
import type { SEO } from "@prisma/client";

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const tone =
    len > max ? "text-red-500" : len > max * 0.9 ? "text-amber-600" : "text-slate-400";
  return (
    <span className={`text-xs ${tone}`}>
      {len}/{max}
    </span>
  );
}

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

  const previewTitle = form.metaTitle || "Page title preview";
  const previewDesc =
    form.metaDescription ||
    "Add a meta description to improve how this page appears in search results.";

  return (
    <AdminFormPanel
      title="SEO settings"
      description="Optimize how this page appears in search engines and social shares."
      icon={Search}
      iconTone="violet"
      delay={0.06}
      footer={
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-[#2563EB] shadow-md"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save SEO"
          )}
        </Button>
      }
    >
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Search preview
        </p>
        <p className="truncate text-base text-[#1a0dab]">{previewTitle}</p>
        <p className="mt-0.5 truncate text-xs text-emerald-700">
          afyabridge.com › page
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{previewDesc}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-700">Meta title</Label>
            <CharCount value={form.metaTitle} max={60} />
          </div>
          <Input
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            className={adminFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-700">Meta description</Label>
            <CharCount value={form.metaDescription} max={160} />
          </div>
          <Textarea
            value={form.metaDescription}
            onChange={(e) =>
              setForm({ ...form, metaDescription: e.target.value })
            }
            className={adminTextareaClass}
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-slate-700">Keywords</Label>
          <Input
            value={form.metaKeywords}
            onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
            className={adminFieldClass}
            placeholder="healthcare, EMR, hospital software"
          />
        </div>
        <div>
          <Label className="text-slate-700">Open Graph title</Label>
          <Input
            value={form.ogTitle}
            onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
            className={adminFieldClass}
          />
        </div>
        <div>
          <Label className="text-slate-700">OG image URL</Label>
          <Input
            value={form.ogImage}
            onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
            className={adminFieldClass}
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Hide from search engines</p>
            <p className="text-xs text-slate-500">Adds a noindex directive for this page</p>
          </div>
          <Switch
            checked={form.noIndex}
            onCheckedChange={(v) => setForm({ ...form, noIndex: v })}
          />
        </div>
      </div>
    </AdminFormPanel>
  );
}
