"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Plus, Trash2, Pencil } from "lucide-react";
import { saveTestimonial, deleteTestimonial } from "@/actions/cms";
import { toast } from "sonner";
import type { Testimonial } from "@prisma/client";

export function TestimonialManager({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", hospital: "", review: "", result: "", rating: 5, photo: "", isVisible: true });

  function openNew() {
    setForm({ name: "", role: "", hospital: "", review: "", result: "", rating: 5, photo: "", isVisible: true });
    setEditing("new");
  }

  function openEdit(t: Testimonial) {
    setForm({ name: t.name, role: t.role || "", hospital: t.hospital || "", review: t.review, result: t.result || "", rating: t.rating, photo: t.photo || "", isVisible: t.isVisible });
    setEditing(t.id);
  }

  async function handleSave() {
    if (!form.name || !form.review) { toast.error("Name and review required"); return; }
    const res = await saveTestimonial(editing === "new" ? undefined : editing!, form);
    if (res.success && res.testimonial) {
      if (editing === "new") setItems((l) => [...l, res.testimonial]);
      else setItems((l) => l.map((i) => i.id === editing ? res.testimonial : i));
      setEditing(null);
      toast.success("Saved");
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>
      {editing && (
        <div className="rounded-xl border bg-white p-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Hospital</Label><Input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className="mt-1.5" /></div>
          </div>
          <div><Label>Review *</Label><Textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="mt-1.5" rows={3} /></div>
          <div><Label>Result badge (e.g. -40% wait time)</Label><Input value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} className="mt-1.5" /></div>
          <ImageUploadField
            label="Card image (shown at top of testimonial card)"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
          />
          <div className="flex items-center gap-2"><Switch checked={form.isVisible} onCheckedChange={(v) => setForm({ ...form, isVisible: v })} /><span className="text-sm">Visible</span></div>
          <div className="flex gap-2"><Button onClick={handleSave}>Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      )}
      {items.map((t) => (
        <div key={t.id} className="flex justify-between gap-4 rounded-xl border bg-white p-4">
          {t.photo && (
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.photo} alt={t.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium">{t.name} — {t.hospital}</p>
            <p className="text-sm text-slate-500 line-clamp-2">{t.review}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={async () => { await deleteTestimonial(t.id); setItems((l) => l.filter((i) => i.id !== t.id)); }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
