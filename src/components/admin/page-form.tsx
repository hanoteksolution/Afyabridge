"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Globe, Loader2, Trash2 } from "lucide-react";
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
    <AdminFormPanel
      title="Page details"
      description="Core information and publish settings for this page."
      icon={FileText}
      iconTone="indigo"
      footer={
        <>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : page ? (
              "Save page"
            ) : (
              "Create page"
            )}
          </Button>
          {page && !page.isHome && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete page
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <Label className="text-slate-700">Page title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={adminFieldClass}
            placeholder="Contact Us"
          />
        </div>

        <div>
          <Label className="text-slate-700">URL slug</Label>
          <Input
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value.replace(/^\//, "") })
            }
            className={adminFieldClass}
            placeholder="contact"
          />
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
            <Globe className="h-4 w-4 shrink-0 text-[#2563EB]" />
            <span className="truncate font-mono text-xs text-slate-600">
              /{form.slug || "slug"}
            </span>
          </div>
        </div>

        <div>
          <Label className="text-slate-700">Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={adminTextareaClass}
            rows={3}
            placeholder="Short summary shown in listings and previews"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Published</p>
            <p className="text-xs text-slate-500">
              Make this page visible on the public website
            </p>
          </div>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
          />
        </div>
      </div>
    </AdminFormPanel>
  );
}
