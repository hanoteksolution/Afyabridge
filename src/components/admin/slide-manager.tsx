"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, ImageIcon, X,
} from "lucide-react";
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  toggleHeroSlideVisibility,
  reorderHeroSlides,
  type SlideInput,
} from "@/actions/slides";
import { toast } from "sonner";
import type { HeroSlide } from "@prisma/client";
import { ImageUploadField } from "@/components/admin/image-upload-field";

const EMPTY: SlideInput = {
  title: "",
  subtitle: "",
  image: "",
  videoUrl: "",
  ctaText: "",
  ctaLink: "",
  ctaText2: "",
  ctaLink2: "",
  badge: "",
  isVisible: true,
};

export function SlideManager({
  slides: initial,
  hasHeroSection,
}: {
  slides: HeroSlide[];
  hasHeroSection: boolean;
}) {
  const [slides, setSlides] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<SlideInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  }

  function openEdit(slide: HeroSlide) {
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || "",
      image: slide.image || "",
      videoUrl: slide.videoUrl || "",
      ctaText: slide.ctaText || "",
      ctaLink: slide.ctaLink || "",
      ctaText2: slide.ctaText2 || "",
      ctaLink2: slide.ctaLink2 || "",
      badge: slide.badge || "",
      isVisible: slide.isVisible,
    });
    setEditing(slide.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Headline is required");
      return;
    }
    setSaving(true);
    if (creating) {
      const res = await createHeroSlide(form);
      setSaving(false);
      if (res.success && res.slide) {
        setSlides((s) => [...s, res.slide]);
        toast.success("Slide created");
        closeForm();
      } else {
        toast.error(res.error || "Failed to create slide");
      }
    } else if (editing) {
      const res = await updateHeroSlide(editing, form);
      setSaving(false);
      if (res.success && res.slide) {
        setSlides((s) => s.map((sl) => (sl.id === editing ? res.slide : sl)));
        toast.success("Slide updated");
        closeForm();
      } else {
        toast.error("Failed to update slide");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this slide?")) return;
    await deleteHeroSlide(id);
    setSlides((s) => s.filter((sl) => sl.id !== id));
    toast.success("Slide deleted");
  }

  async function handleToggle(id: string, isVisible: boolean) {
    await toggleHeroSlideVisibility(id, isVisible);
    setSlides((s) => s.map((sl) => (sl.id === id ? { ...sl, isVisible } : sl)));
    toast.success(isVisible ? "Slide shown" : "Slide hidden");
  }

  async function handleMove(index: number, dir: "up" | "down") {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSlides(reordered);
    await reorderHeroSlides(reordered.map((s) => s.id));
    toast.success("Slides reordered");
  }

  if (!hasHeroSection) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center">
        <p className="text-amber-700">
          No hero section exists yet. Run the seed script or add a hero section to a page first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0A1F78]">
          Slides ({slides.length})
        </h3>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Add Slide
        </Button>
      </div>

      {(creating || editing) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New Slide" : "Edit Slide"}
            </h4>
            <Button variant="ghost" size="icon" onClick={closeForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Headline *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1.5"
                placeholder="Empower Clinics & Hospitals..."
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="subtitle">Subheadline</Label>
              <Textarea
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="mt-1.5"
                placeholder="Trusted across East Africa"
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL (optional)</Label>
              <Input
                id="videoUrl"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                className="mt-1.5"
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            <ImageUploadField
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
            />
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={form.isVisible}
                onCheckedChange={(v) => setForm({ ...form, isVisible: v })}
              />
              <span className="text-sm text-slate-600">Visible</span>
            </div>
            <div>
              <Label htmlFor="ctaText">Primary Button Text</Label>
              <Input
                id="ctaText"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className="mt-1.5"
                placeholder="Request a Demo"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink">Primary Button Link</Label>
              <Input
                id="ctaLink"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                className="mt-1.5"
                placeholder="#contact"
              />
            </div>
            <div>
              <Label htmlFor="ctaText2">Secondary Button Text</Label>
              <Input
                id="ctaText2"
                value={form.ctaText2}
                onChange={(e) => setForm({ ...form, ctaText2: e.target.value })}
                className="mt-1.5"
                placeholder="See It In Action"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink2">Secondary Button Link</Label>
              <Input
                id="ctaLink2"
                value={form.ctaLink2}
                onChange={(e) => setForm({ ...form, ctaLink2: e.target.value })}
                className="mt-1.5"
                placeholder="#platform"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : creating ? "Create Slide" : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {slides.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-slate-500">No slides yet. Add your first hero slide.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {slide.image ? (
                  <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0A1F78] truncate">{slide.title}</span>
                  {slide.badge && <Badge variant="accent" className="text-xs">{slide.badge}</Badge>}
                  {!slide.isVisible && <Badge variant="outline" className="text-xs">Hidden</Badge>}
                </div>
                {slide.subtitle && (
                  <p className="text-sm text-slate-500 truncate mt-0.5">{slide.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Switch
                  checked={slide.isVisible}
                  onCheckedChange={(v) => handleToggle(slide.id, v)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")} disabled={index === slides.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(slide)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(slide.id)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
