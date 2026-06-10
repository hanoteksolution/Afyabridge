"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  X,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Loader2,
  Save,
  ArrowUpRight,
} from "lucide-react";
import { saveFAQ, deleteFAQ, reorderFAQs } from "@/actions/cms";
import { toast } from "sonner";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import {
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { cn } from "@/lib/utils";

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  isVisible: boolean;
};

type FaqForm = {
  question: string;
  answer: string;
  category: string;
  isVisible: boolean;
};

const EMPTY: FaqForm = {
  question: "",
  answer: "",
  category: "",
  isVisible: true,
};

function FaqFormPanel({
  form,
  setForm,
  creating,
  saving,
  onSave,
  onClose,
}: {
  form: FaqForm;
  setForm: (f: FaqForm) => void;
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
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-cyan-50/80 to-blue-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-[#2563EB] text-white shadow-md">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New question" : "Edit question"}
            </h4>
            <p className="text-xs text-slate-500">
              Question, answer, and visibility on the FAQ page
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5 p-6">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Question & answer
          </h5>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700">Question *</Label>
              <Input
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className={adminFieldClass}
                placeholder="What is Afya Bridge?"
              />
            </div>
            <div>
              <Label className="text-slate-700">Answer *</Label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className={adminTextareaClass}
                rows={4}
                placeholder="Provide a clear, helpful answer..."
              />
            </div>
            <div>
              <Label className="text-slate-700">Category (optional)</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={adminFieldClass}
                placeholder="General, Pricing, Support..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Visible on FAQ page</p>
            <p className="text-xs text-slate-500">Show this question to visitors</p>
          </div>
          <Switch
            checked={form.isVisible}
            onCheckedChange={(v) => setForm({ ...form, isVisible: v })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-xs text-slate-500">Save to update the public FAQ page</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-cyan-600 to-[#2563EB] shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {creating ? "Add question" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function FaqManager({ faqs: initial }: { faqs: FaqRow[] }) {
  const [faqs, setFaqs] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FaqForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const visibleCount = faqs.filter((f) => f.isVisible).length;
  const categoryCount = new Set(faqs.map((f) => f.category).filter(Boolean)).size;

  function openNew() {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  }

  function openEdit(faq: FaqRow) {
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      isVisible: faq.isVisible,
    });
    setEditing(faq.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setSaving(true);
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || undefined,
      isVisible: form.isVisible,
    };
    const res = await saveFAQ(creating ? undefined : editing!, payload);
    setSaving(false);

    if (res.success && res.faq) {
      const row: FaqRow = {
        id: res.faq.id,
        question: res.faq.question,
        answer: res.faq.answer,
        category: res.faq.category,
        order: res.faq.order,
        isVisible: res.faq.isVisible,
      };
      if (creating) {
        setFaqs((f) => [...f, row]);
      } else {
        setFaqs((f) => f.map((item) => (item.id === editing ? row : item)));
      }
      toast.success(creating ? "Question added" : "Question updated");
      closeForm();
    } else {
      toast.error("Failed to save FAQ");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await deleteFAQ(id);
    setFaqs((f) => f.filter((item) => item.id !== id));
    if (editing === id) closeForm();
    toast.success("FAQ deleted");
  }

  async function handleToggleVisibility(faq: FaqRow) {
    const next = !faq.isVisible;
    const res = await saveFAQ(faq.id, {
      question: faq.question,
      answer: faq.answer,
      category: faq.category || undefined,
      isVisible: next,
    });
    if (res.success && res.faq) {
      setFaqs((f) =>
        f.map((item) =>
          item.id === faq.id ? { ...item, isVisible: next } : item
        )
      );
      toast.success(next ? "Question visible" : "Question hidden");
    }
  }

  async function handleMove(index: number, dir: "up" | "down") {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;
    const reordered = [...faqs];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setFaqs(reordered);
    await reorderFAQs(reordered.map((f) => f.id));
    toast.success("Order updated");
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Visitor support
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Frequently asked questions
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Manage questions and answers shown on your public FAQ page. Reorder
              items to control display sequence.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/faq" target="_blank">
                <ArrowUpRight className="h-4 w-4" />
                View FAQ page
              </Link>
            </Button>
            <Button
              onClick={openNew}
              size="lg"
              className="h-11 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
            >
              <Plus className="h-4 w-4" />
              Add question
            </Button>
          </div>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total questions", value: faqs.length, icon: "MessageSquare", variant: "indigo" },
          { title: "Visible", value: visibleCount, icon: "Eye", variant: "emerald" },
          { title: "Hidden", value: faqs.length - visibleCount, icon: "EyeOff", variant: "amber" },
          { title: "Categories", value: categoryCount, icon: "Layers", variant: "cyan" },
        ]}
      />

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <FaqFormPanel
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-[#2563EB] text-white shadow-md">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0A1F78]">Question list</h3>
              <p className="text-sm text-slate-500">
                {filtered.length} of {faqs.length} questions
              </p>
            </div>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
            />
          </div>
        </div>

        <div className="space-y-3 p-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
                <HelpCircle className="h-6 w-6 text-cyan-600" />
              </div>
              <p className="font-medium text-slate-700">
                {query ? "No matching questions" : "No questions yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {query
                  ? "Try a different search term"
                  : "Add your first FAQ to help visitors find answers"}
              </p>
              {!query && (
                <Button onClick={openNew} className="mt-5 rounded-xl">
                  <Plus className="h-4 w-4" />
                  Add question
                </Button>
              )}
            </div>
          ) : (
            filtered.map((faq, displayIndex) => {
              const index = faqs.findIndex((f) => f.id === faq.id);
              const isActive = editing === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: displayIndex * 0.03 }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-white transition-all",
                    isActive
                      ? "border-cyan-300/60 shadow-md ring-2 ring-cyan-100"
                      : "border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm",
                    !faq.isVisible && "opacity-75"
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="w-1 shrink-0 self-stretch bg-gradient-to-b from-cyan-500 to-[#2563EB] sm:w-1" />

                    <div className="flex min-w-0 flex-1 gap-3 px-4 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0A1F78]/8 font-mono text-xs font-bold text-[#0A1F78]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#0A1F78]">
                            {faq.question}
                          </p>
                          {faq.category && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                              {faq.category}
                            </span>
                          )}
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                              faq.isVisible
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            )}
                          >
                            {faq.isVisible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                            {faq.isVisible ? "Visible" : "Hidden"}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                          {faq.answer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 border-t border-slate-100 px-3 py-2 sm:border-0 sm:py-4 sm:pr-4">
                      <Switch
                        checked={faq.isVisible}
                        onCheckedChange={() => handleToggleVisibility(faq)}
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
                        disabled={index === faqs.length - 1}
                        onClick={() => handleMove(index, "down")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEdit(faq)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(faq.id)}
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
