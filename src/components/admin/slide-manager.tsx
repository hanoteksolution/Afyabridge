"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  X,
  Sparkles,
  GalleryHorizontal,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Play,
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
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import {
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { cn } from "@/lib/utils";

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

function SlideForm({
  form,
  setForm,
  creating,
  saving,
  onSave,
  onClose,
}: {
  form: SlideInput;
  setForm: (f: SlideInput) => void;
  creating: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="overflow-hidden rounded-2xl border border-[#2563EB]/25 bg-white shadow-lg shadow-[#0A1F78]/8"
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-blue-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New slide" : "Edit slide"}
            </h4>
            <p className="text-xs text-slate-500">
              Headline, media, badges, and call-to-action buttons
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Headline content
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-slate-700">Headline *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={adminFieldClass}
                placeholder="Healthcare Technology for Better Care"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-slate-700">Subheadline</Label>
              <Textarea
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className={adminTextareaClass}
                rows={3}
              />
            </div>
            <div>
              <Label className="text-slate-700">Badge text</Label>
              <Input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className={adminFieldClass}
                placeholder="Trusted across East Africa"
              />
            </div>
            <div>
              <Label className="text-slate-700">Video URL (optional)</Label>
              <Input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                className={adminFieldClass}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Slide media
          </h5>
          <ImageUploadField
            value={form.image || ""}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-slate-800">Visible on homepage</p>
              <p className="text-xs text-slate-500">Show this slide in the hero rotation</p>
            </div>
            <Switch
              checked={form.isVisible}
              onCheckedChange={(v) => setForm({ ...form, isVisible: v })}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Call-to-action buttons
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">Primary button text</Label>
              <Input
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className={adminFieldClass}
                placeholder="Request a Demo"
              />
            </div>
            <div>
              <Label className="text-slate-700">Primary button link</Label>
              <Input
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                className={adminFieldClass}
                placeholder="#contact"
              />
            </div>
            <div>
              <Label className="text-slate-700">Secondary button text</Label>
              <Input
                value={form.ctaText2}
                onChange={(e) => setForm({ ...form, ctaText2: e.target.value })}
                className={adminFieldClass}
                placeholder="See It In Action"
              />
            </div>
            <div>
              <Label className="text-slate-700">Secondary button link</Label>
              <Input
                value={form.ctaLink2}
                onChange={(e) => setForm({ ...form, ctaLink2: e.target.value })}
                className={adminFieldClass}
                placeholder="#platform"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-xs text-slate-500">Save to apply changes to the homepage hero</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-[#2563EB] shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {creating ? "Create slide" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

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

  const visibleCount = slides.filter((s) => s.isVisible).length;
  const withImageCount = slides.filter((s) => s.image).length;
  const withVideoCount = slides.filter((s) => s.videoUrl).length;

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
    if (editing === id) closeForm();
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
      <div className="rounded-2xl border border-dashed border-amber-300/80 bg-gradient-to-br from-amber-50 to-orange-50/40 p-10 text-center">
        <p className="font-medium text-amber-900">No hero section found</p>
        <p className="mt-1 text-sm text-amber-800/80">
          Run the seed script or add a hero section to the home page first.
        </p>
        <Button asChild className="mt-5 rounded-xl">
          <Link href="/admin/pages">Go to pages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Homepage hero
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Hero slider
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Manage rotating slides with headlines, imagery, badges, and
              call-to-action buttons on your homepage.
            </p>
          </div>
          <Button
            onClick={openCreate}
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Plus className="h-4 w-4" />
            Add slide
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total slides", value: slides.length, icon: "GalleryHorizontal", variant: "indigo" },
          { title: "Visible", value: visibleCount, icon: "Eye", variant: "emerald" },
          { title: "With image", value: withImageCount, icon: "Image", variant: "blue" },
          { title: "With video", value: withVideoCount, icon: "PlayCircle", variant: "cyan" },
        ]}
      />

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <SlideForm
            key={creating ? "create" : editing}
            form={form}
            setForm={setForm}
            creating={creating}
            saving={saving}
            onSave={handleSave}
            onClose={closeForm}
          />
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
              <GalleryHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#0A1F78]">
                Slide lineup
              </h3>
              <p className="text-sm text-slate-500">
                {slides.length} slide{slides.length === 1 ? "" : "s"} in rotation order
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-6">
          {slides.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                <GalleryHorizontal className="h-6 w-6 text-violet-600" />
              </div>
              <p className="font-medium text-slate-700">No slides yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Add your first hero slide to get started
              </p>
              <Button onClick={openCreate} className="mt-5 rounded-xl">
                <Plus className="h-4 w-4" />
                Add slide
              </Button>
            </div>
          ) : (
            slides.map((slide, index) => {
              const isActive = editing === slide.id;
              return (
                <motion.div
                  key={slide.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={cn(
                    "group flex flex-col gap-4 overflow-hidden rounded-2xl border bg-white transition-all sm:flex-row sm:items-center",
                    isActive
                      ? "border-violet-300/60 shadow-md ring-2 ring-violet-100"
                      : "border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm",
                    !slide.isVisible && "opacity-75"
                  )}
                >
                  <div className="w-1.5 shrink-0 self-stretch bg-gradient-to-b from-violet-500 to-purple-600 sm:w-1.5" />

                  <div className="relative mx-4 mt-4 h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:mx-0 sm:mt-0 sm:h-20 sm:w-32">
                    {slide.image ? (
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 px-4 pb-4 sm:px-0 sm:py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#0A1F78]">
                        {slide.title}
                      </span>
                      {slide.badge && (
                        <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-800">
                          {slide.badge}
                        </span>
                      )}
                      {slide.videoUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                          <Play className="h-3 w-3" />
                          Video
                        </span>
                      )}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          slide.isVisible
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {slide.isVisible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {slide.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    {slide.subtitle && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {slide.subtitle}
                      </p>
                    )}
                    {(slide.ctaText || slide.ctaText2) && (
                      <p className="mt-2 text-xs text-slate-400">
                        CTA: {[slide.ctaText, slide.ctaText2].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 border-t border-slate-100 p-2 sm:border-0 sm:p-4">
                    <Switch
                      checked={slide.isVisible}
                      onCheckedChange={(v) => handleToggle(slide.id, v)}
                    />
                    <div className="mx-1 h-5 w-px bg-slate-200" />
                    <button
                      type="button"
                      title="Move up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={index === slides.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => openEdit(slide)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDelete(slide.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.section>
    </div>
  );
}
