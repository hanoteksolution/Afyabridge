"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Plus, Trash2, Pencil } from "lucide-react";
import { saveCaseStudy, deleteCaseStudy } from "@/actions/cms";
import { toast } from "sonner";
import type { CaseStudy } from "@prisma/client";

export function CaseStudyManager({ caseStudies: initial }: { caseStudies: CaseStudy[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", summary: "", story: "", image: "", isPublished: true });

  function openNew() {
    setForm({ title: "", slug: "", summary: "", story: "", image: "", isPublished: true });
    setEditing("new");
  }

  function openEdit(cs: CaseStudy) {
    setForm({
      title: cs.title,
      slug: cs.slug,
      summary: cs.summary || "",
      story: cs.story || "",
      image: cs.image || "",
      isPublished: cs.isPublished,
    });
    setEditing(cs.id);
  }

  async function handleSave() {
    if (!form.title || !form.slug) {
      toast.error("Title and slug required");
      return;
    }
    const res = await saveCaseStudy(editing === "new" ? undefined : editing!, form);
    if (res.success && res.caseStudy) {
      if (editing === "new") setItems((list) => [...list, res.caseStudy]);
      else setItems((list) => list.map((i) => (i.id === editing ? res.caseStudy : i)));
      setEditing(null);
      toast.success("Saved");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this case study?")) return;
    await deleteCaseStudy(id);
    setItems((list) => list.filter((i) => i.id !== id));
    toast.success("Deleted");
  }

  return (
    <div className="space-y-4">
      <Button onClick={openNew}>
        <Plus className="h-4 w-4 mr-1" /> Add Case Study
      </Button>

      {editing && (
        <div className="rounded-xl border bg-white p-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Summary</Label>
            <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="mt-1.5" rows={2} />
          </div>
          <div>
            <Label>Story</Label>
            <Textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className="mt-1.5" rows={5} />
          </div>
          <ImageUploadField label="Image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <div className="flex items-center gap-2">
            <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
            <span className="text-sm">Published</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {items.map((cs) => (
        <div key={cs.id} className="flex justify-between rounded-xl border bg-white p-4">
          <div>
            <p className="font-medium text-[#0A1F78]">{cs.title}</p>
            <p className="text-sm text-slate-500">/{cs.slug}</p>
            {cs.summary && <p className="mt-1 text-sm text-slate-600 line-clamp-2">{cs.summary}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => openEdit(cs)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(cs.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
