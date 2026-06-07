"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil } from "lucide-react";
import { saveFAQ, deleteFAQ } from "@/actions/cms";
import { toast } from "sonner";
import type { FAQ } from "@prisma/client";

export function FaqManager({ faqs: initial }: { faqs: FAQ[] }) {
  const [faqs, setFaqs] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", isVisible: true });

  function openNew() {
    setForm({ question: "", answer: "", isVisible: true });
    setEditing("new");
  }

  function openEdit(faq: FAQ) {
    setForm({ question: faq.question, answer: faq.answer, isVisible: faq.isVisible });
    setEditing(faq.id);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer required");
      return;
    }
    const res = await saveFAQ(editing === "new" ? undefined : editing!, form);
    if (res.success && res.faq) {
      if (editing === "new") setFaqs((f) => [...f, res.faq]);
      else setFaqs((f) => f.map((item) => (item.id === editing ? res.faq : item)));
      setEditing(null);
      toast.success("FAQ saved");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await deleteFAQ(id);
    setFaqs((f) => f.filter((item) => item.id !== id));
    toast.success("FAQ deleted");
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-slate-500">{faqs.length} questions</p>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button>
      </div>

      {editing && (
        <div className="rounded-xl border bg-white p-5 space-y-3">
          <div>
            <Label>Question</Label>
            <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="mt-1.5" rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isVisible} onCheckedChange={(v) => setForm({ ...form, isVisible: v })} />
            <span className="text-sm">Visible</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {faqs.map((faq) => (
        <div key={faq.id} className="flex items-start justify-between rounded-xl border bg-white p-4">
          <div>
            <p className="font-medium text-[#0A1F78]">{faq.question}</p>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{faq.answer}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(faq.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
