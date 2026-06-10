"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronUp,
  ChevronDown,
  Quote,
  X,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Star,
  User,
  ImageIcon,
} from "lucide-react";
import {
  saveTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "@/actions/cms";
import { toast } from "sonner";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import {
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { cn } from "@/lib/utils";

export type TestimonialRow = {
  id: string;
  name: string;
  role: string | null;
  hospital: string | null;
  review: string;
  result: string | null;
  rating: number;
  photo: string | null;
  order: number;
  isVisible: boolean;
};

type TestimonialForm = {
  name: string;
  role: string;
  hospital: string;
  review: string;
  result: string;
  rating: number;
  photo: string;
  isVisible: boolean;
};

const EMPTY: TestimonialForm = {
  name: "",
  role: "",
  hospital: "",
  review: "",
  result: "",
  rating: 5,
  photo: "",
  isVisible: true,
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "rounded-md p-1 transition-colors",
            n <= value ? "text-amber-400" : "text-slate-300 hover:text-amber-200"
          )}
        >
          <Star className={cn("h-5 w-5", n <= value && "fill-current")} />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-slate-600">{value}/5</span>
    </div>
  );
}

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3.5 w-3.5",
            n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          )}
        />
      ))}
    </div>
  );
}

function TestimonialFormPanel({
  form,
  setForm,
  creating,
  saving,
  onSave,
  onClose,
}: {
  form: TestimonialForm;
  setForm: (f: TestimonialForm) => void;
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
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-amber-50/80 to-violet-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-violet-600 text-white shadow-md">
            <Quote className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New testimonial" : "Edit testimonial"}
            </h4>
            <p className="text-xs text-slate-500">
              Person details, review, photo, and visibility
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Person details
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={adminFieldClass}
                placeholder="Dr. Sarah Kimani"
              />
            </div>
            <div>
              <Label className="text-slate-700">Role</Label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={adminFieldClass}
                placeholder="Medical Director"
              />
            </div>
            <div>
              <Label className="text-slate-700">Hospital / organization</Label>
              <Input
                value={form.hospital}
                onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                className={adminFieldClass}
                placeholder="Nairobi Central Clinic"
              />
            </div>
            <div>
              <Label className="text-slate-700">Rating</Label>
              <div className="mt-2">
                <StarRating
                  value={form.rating}
                  onChange={(rating) => setForm({ ...form, rating })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Review content
          </h5>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700">Review *</Label>
              <Textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                className={adminTextareaClass}
                rows={4}
                placeholder="Share what they said about your product or service..."
              />
            </div>
            <div>
              <Label className="text-slate-700">Result badge (optional)</Label>
              <Input
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                className={adminFieldClass}
                placeholder="-40% wait time"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Card image
          </h5>
          <ImageUploadField
            label="Photo shown on the testimonial card"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
          />
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-slate-800">Visible on site</p>
              <p className="text-xs text-slate-500">Show this testimonial publicly</p>
            </div>
            <Switch
              checked={form.isVisible}
              onCheckedChange={(v) => setForm({ ...form, isVisible: v })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-xs text-slate-500">Save to update testimonials on your site</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-violet-600 shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {creating ? "Add testimonial" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialManager({
  testimonials: initial,
}: {
  testimonials: TestimonialRow[];
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<TestimonialForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.role?.toLowerCase().includes(q) ||
        t.hospital?.toLowerCase().includes(q) ||
        t.review.toLowerCase().includes(q) ||
        t.result?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const visibleCount = items.filter((t) => t.isVisible).length;
  const avgRating = items.length
    ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1)
    : "—";

  function openNew() {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  }

  function openEdit(t: TestimonialRow) {
    setForm({
      name: t.name,
      role: t.role || "",
      hospital: t.hospital || "",
      review: t.review,
      result: t.result || "",
      rating: t.rating,
      photo: t.photo || "",
      isVisible: t.isVisible,
    });
    setEditing(t.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.review.trim()) {
      toast.error("Name and review are required");
      return;
    }
    setSaving(true);
    const res = await saveTestimonial(creating ? undefined : editing!, form);
    setSaving(false);

    if (res.success && res.testimonial) {
      const row: TestimonialRow = {
        id: res.testimonial.id,
        name: res.testimonial.name,
        role: res.testimonial.role,
        hospital: res.testimonial.hospital,
        review: res.testimonial.review,
        result: res.testimonial.result,
        rating: res.testimonial.rating,
        photo: res.testimonial.photo,
        order: res.testimonial.order,
        isVisible: res.testimonial.isVisible,
      };
      if (creating) setItems((l) => [...l, row]);
      else setItems((l) => l.map((i) => (i.id === editing ? row : i)));
      toast.success(creating ? "Testimonial added" : "Testimonial updated");
      closeForm();
    } else {
      toast.error("Failed to save testimonial");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    setItems((l) => l.filter((i) => i.id !== id));
    if (editing === id) closeForm();
    toast.success("Testimonial deleted");
  }

  async function handleToggleVisibility(t: TestimonialRow) {
    const next = !t.isVisible;
    const res = await saveTestimonial(t.id, {
      name: t.name,
      role: t.role || undefined,
      hospital: t.hospital || undefined,
      review: t.review,
      result: t.result || undefined,
      rating: t.rating,
      photo: t.photo || undefined,
      isVisible: next,
    });
    if (res.success) {
      setItems((l) =>
        l.map((i) => (i.id === t.id ? { ...i, isVisible: next } : i))
      );
      toast.success(next ? "Testimonial visible" : "Testimonial hidden");
    }
  }

  async function handleMove(index: number, dir: "up" | "down") {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered);
    await reorderTestimonials(reordered.map((i) => i.id));
    toast.success("Order updated");
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Social proof
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Testimonials
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Showcase client stories with photos, ratings, and result badges on
              your website.
            </p>
          </div>
          <Button
            onClick={openNew}
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Plus className="h-4 w-4" />
            Add testimonial
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total testimonials", value: items.length, icon: "Quote", variant: "indigo" },
          { title: "Visible", value: visibleCount, icon: "Eye", variant: "emerald" },
          { title: "Hidden", value: items.length - visibleCount, icon: "EyeOff", variant: "amber" },
          { title: "Avg. rating", value: avgRating, icon: "Star", variant: "blue" },
        ]}
      />

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <TestimonialFormPanel
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
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-violet-600 text-white shadow-md">
              <Quote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0A1F78]">All testimonials</h3>
              <p className="text-sm text-slate-500">
                {filtered.length} of {items.length} shown
              </p>
            </div>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, hospital, review..."
              className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
            />
          </div>
        </div>

        <div className="space-y-3 p-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                <Quote className="h-6 w-6 text-amber-600" />
              </div>
              <p className="font-medium text-slate-700">
                {query ? "No matching testimonials" : "No testimonials yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {query
                  ? "Try a different search term"
                  : "Add your first client story to build trust"}
              </p>
              {!query && (
                <Button onClick={openNew} className="mt-5 rounded-xl">
                  <Plus className="h-4 w-4" />
                  Add testimonial
                </Button>
              )}
            </div>
          ) : (
            filtered.map((t, displayIndex) => {
              const index = items.findIndex((i) => i.id === t.id);
              const isActive = editing === t.id;

              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: displayIndex * 0.03 }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-white transition-all",
                    isActive
                      ? "border-amber-300/60 shadow-md ring-2 ring-amber-100"
                      : "border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm",
                    !t.isVisible && "opacity-75"
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="w-1 shrink-0 self-stretch bg-gradient-to-b from-amber-400 to-violet-500 sm:w-1" />

                    <div className="flex min-w-0 flex-1 items-start gap-4 px-4 py-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-violet-100 ring-2 ring-white shadow-sm">
                        {t.photo ? (
                          <Image
                            src={t.photo}
                            alt={t.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="font-semibold text-[#0A1F78]">{t.name}</p>
                          {t.role && (
                            <span className="text-sm text-slate-500">· {t.role}</span>
                          )}
                          <StarsDisplay rating={t.rating} />
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                              t.isVisible
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            )}
                          >
                            {t.isVisible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                            {t.isVisible ? "Visible" : "Hidden"}
                          </span>
                        </div>
                        {t.hospital && (
                          <p className="mt-0.5 text-sm text-slate-600">{t.hospital}</p>
                        )}
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                          &ldquo;{t.review}&rdquo;
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {t.result && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              {t.result}
                            </span>
                          )}
                          {!t.photo && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                              <ImageIcon className="h-3 w-3" />
                              No photo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 border-t border-slate-100 px-3 py-2 sm:border-0 sm:py-4 sm:pr-4">
                      <Switch
                        checked={t.isVisible}
                        onCheckedChange={() => handleToggleVisibility(t)}
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
                        disabled={index === items.length - 1}
                        onClick={() => handleMove(index, "down")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEdit(t)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(t.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
