"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Briefcase,
  X,
  Sparkles,
  Search,
  Loader2,
  Save,
  ArrowUpRight,
  FileCheck,
  ImageIcon,
} from "lucide-react";
import {
  saveCaseStudy,
  deleteCaseStudy,
  reorderCaseStudies,
} from "@/actions/cms";
import { toast } from "sonner";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import {
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { cn } from "@/lib/utils";

export type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  story: string | null;
  image: string | null;
  pdfUrl: string | null;
  order: number;
  isPublished: boolean;
};

type CaseStudyForm = {
  title: string;
  slug: string;
  summary: string;
  story: string;
  image: string;
  isPublished: boolean;
};

const EMPTY: CaseStudyForm = {
  title: "",
  slug: "",
  summary: "",
  story: "",
  image: "",
  isPublished: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function CaseStudyFormPanel({
  form,
  setForm,
  creating,
  saving,
  onSave,
  onClose,
}: {
  form: CaseStudyForm;
  setForm: (f: CaseStudyForm) => void;
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
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-blue-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-white shadow-md">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New case study" : "Edit case study"}
            </h4>
            <p className="text-xs text-slate-500">
              Title, story, cover image, and publish status
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
            Basic details
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: creating && !form.slug ? slugify(title) : form.slug,
                  });
                }}
                className={adminFieldClass}
                placeholder="Nairobi Central Clinic"
              />
            </div>
            <div>
              <Label className="text-slate-700">Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className={adminFieldClass}
                placeholder="nairobi-central"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-slate-700">Summary</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className={adminTextareaClass}
                rows={2}
                placeholder="40% reduction in patient wait times"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Full story
          </h5>
          <Textarea
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            className={adminTextareaClass}
            rows={6}
            placeholder="Tell the complete client success story..."
          />
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cover image
          </h5>
          <ImageUploadField
            label="Image shown on the case study card"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-slate-800">Published</p>
              <p className="text-xs text-slate-500">Make this case study visible on the site</p>
            </div>
            <Switch
              checked={form.isPublished}
              onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-xs text-slate-500">Save to update case studies on your site</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {creating ? "Add case study" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function CaseStudyManager({
  caseStudies: initial,
}: {
  caseStudies: CaseStudyRow[];
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CaseStudyForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (cs) =>
        cs.title.toLowerCase().includes(q) ||
        cs.slug.toLowerCase().includes(q) ||
        cs.summary?.toLowerCase().includes(q) ||
        cs.story?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const publishedCount = items.filter((c) => c.isPublished).length;
  const withPdfCount = items.filter((c) => c.pdfUrl).length;

  function openNew() {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  }

  function openEdit(cs: CaseStudyRow) {
    setForm({
      title: cs.title,
      slug: cs.slug,
      summary: cs.summary || "",
      story: cs.story || "",
      image: cs.image || "",
      isPublished: cs.isPublished,
    });
    setEditing(cs.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    const res = await saveCaseStudy(creating ? undefined : editing!, form);
    setSaving(false);

    if (res.success && res.caseStudy) {
      const row: CaseStudyRow = {
        id: res.caseStudy.id,
        title: res.caseStudy.title,
        slug: res.caseStudy.slug,
        summary: res.caseStudy.summary,
        story: res.caseStudy.story,
        image: res.caseStudy.image,
        pdfUrl: res.caseStudy.pdfUrl,
        order: res.caseStudy.order,
        isPublished: res.caseStudy.isPublished,
      };
      if (creating) setItems((list) => [...list, row]);
      else setItems((list) => list.map((i) => (i.id === editing ? row : i)));
      toast.success(creating ? "Case study added" : "Case study updated");
      closeForm();
    } else {
      toast.error("Failed to save case study");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this case study?")) return;
    await deleteCaseStudy(id);
    setItems((list) => list.filter((i) => i.id !== id));
    if (editing === id) closeForm();
    toast.success("Case study deleted");
  }

  async function handleTogglePublished(cs: CaseStudyRow) {
    const next = !cs.isPublished;
    const res = await saveCaseStudy(cs.id, {
      title: cs.title,
      slug: cs.slug,
      summary: cs.summary || undefined,
      story: cs.story || undefined,
      image: cs.image || undefined,
      isPublished: next,
    });
    if (res.success) {
      setItems((list) =>
        list.map((i) => (i.id === cs.id ? { ...i, isPublished: next } : i))
      );
      toast.success(next ? "Case study published" : "Moved to drafts");
    }
  }

  async function handleMove(index: number, dir: "up" | "down") {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered);
    await reorderCaseStudies(reordered.map((i) => i.id));
    toast.success("Order updated");
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Client success stories
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Case studies
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Highlight real outcomes with summaries, full stories, and cover
              images for your resources section.
            </p>
          </div>
          <Button
            onClick={openNew}
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Plus className="h-4 w-4" />
            Add case study
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total case studies", value: items.length, icon: "Briefcase", variant: "indigo" },
          { title: "Published", value: publishedCount, icon: "CheckCircle2", variant: "emerald" },
          { title: "Drafts", value: items.length - publishedCount, icon: "Clock", variant: "amber" },
          { title: "With PDF", value: withPdfCount, icon: "FileCheck", variant: "blue" },
        ]}
      />

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <CaseStudyFormPanel
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0A1F78]">All case studies</h3>
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
              placeholder="Search title, slug, summary..."
              className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
            />
          </div>
        </div>

        <div className="space-y-3 p-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F78]/5">
                <Briefcase className="h-6 w-6 text-[#2563EB]" />
              </div>
              <p className="font-medium text-slate-700">
                {query ? "No matching case studies" : "No case studies yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {query
                  ? "Try a different search term"
                  : "Add your first success story to showcase impact"}
              </p>
              {!query && (
                <Button onClick={openNew} className="mt-5 rounded-xl">
                  <Plus className="h-4 w-4" />
                  Add case study
                </Button>
              )}
            </div>
          ) : (
            filtered.map((cs, displayIndex) => {
              const index = items.findIndex((i) => i.id === cs.id);
              const isActive = editing === cs.id;

              return (
                <motion.div
                  key={cs.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: displayIndex * 0.03 }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-white transition-all",
                    isActive
                      ? "border-[#2563EB]/40 shadow-md ring-2 ring-blue-100"
                      : "border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm",
                    !cs.isPublished && "opacity-80"
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="w-1 shrink-0 self-stretch bg-gradient-to-b from-[#0A1F78] to-[#2563EB] sm:w-1" />

                    <div className="relative mx-4 mt-4 h-20 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:mx-0 sm:mt-0 sm:h-16 sm:w-24">
                      {cs.image ? (
                        <Image
                          src={cs.image}
                          alt={cs.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                      <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 px-4 pb-4 sm:px-0 sm:py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#0A1F78]">{cs.title}</p>
                        <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                          /{cs.slug}
                        </code>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            cs.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {cs.isPublished ? "Published" : "Draft"}
                        </span>
                        {cs.pdfUrl && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                            <FileCheck className="h-3 w-3" />
                            PDF
                          </span>
                        )}
                      </div>
                      {cs.summary && (
                        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">
                          {cs.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 border-t border-slate-100 px-3 py-2 sm:border-0 sm:py-4 sm:pr-4">
                      <Switch
                        checked={cs.isPublished}
                        onCheckedChange={() => handleTogglePublished(cs)}
                      />
                      <div className="mx-1 h-5 w-px bg-slate-200" />
                      {cs.isPublished && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#2563EB]"
                          asChild
                        >
                          <Link
                            href={`/resources#${cs.slug}`}
                            target="_blank"
                            title="View on site"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
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
                        onClick={() => openEdit(cs)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(cs.id)}
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
