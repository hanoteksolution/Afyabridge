"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createPage, updatePage, deletePage } from "@/actions/cms";
import { toast } from "sonner";
import type { Page } from "@prisma/client";

export function PageForm({ page }: { page?: Page }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    description: page?.description || "",
    isPublished: page?.isPublished ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    const res = page
      ? await updatePage(page.id, form)
      : await createPage(form);
    setSaving(false);
    if (res.success && res.page) {
      toast.success(page ? "Page updated" : "Page created");
      router.push(`/admin/pages/${res.page.id}`);
      router.refresh();
    } else {
      toast.error("error" in res && res.error ? res.error : "Failed to save");
    }
  }

  async function handleDelete() {
    if (!page || !confirm("Delete this page and all its sections?")) return;
    const res = await deletePage(page.id);
    if (res.success) {
      toast.success("Page deleted");
      router.push("/admin/pages");
    } else {
      toast.error("error" in res && res.error ? res.error : "Cannot delete");
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 max-w-2xl">
      <div>
        <Label>Page Title *</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5" />
      </div>
      <div>
        <Label>URL Slug *</Label>
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/^\//, "") })} className="mt-1.5" placeholder="about" />
        <p className="mt-1 text-xs text-slate-500">Public URL: /{form.slug || "slug"}</p>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={2} />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
        <span className="text-sm text-slate-600">Published</span>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : page ? "Save Page" : "Create Page"}</Button>
        {page && !page.isHome && (
          <Button variant="destructive" onClick={handleDelete}>Delete Page</Button>
        )}
      </div>
    </div>
  );
}
