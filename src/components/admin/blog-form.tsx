"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { saveBlogPost, deleteBlogPost } from "@/actions/cms";
import { toast } from "sonner";
import type { BlogPost, BlogCategory } from "@prisma/client";

export function BlogForm({ post, categories }: { post?: BlogPost; categories: BlogCategory[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    categoryId: post?.categoryId || "",
    isPublished: post?.isPublished || false,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.title || !form.content) {
      toast.error("Title and content required");
      return;
    }
    setSaving(true);
    const res = await saveBlogPost(post?.id, {
      ...form,
      categoryId: form.categoryId || undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Post saved");
      router.push("/admin/blogs");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this post?")) return;
    await deleteBlogPost(post.id);
    toast.success("Deleted");
    router.push("/admin/blogs");
  }

  return (
    <div className="rounded-xl border bg-white p-6 space-y-4 max-w-3xl">
      <div>
        <Label>Title *</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="mt-1.5" />
      </div>
      <div>
        <Label>Slug</Label>
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1.5" />
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-1.5" rows={2} />
      </div>
      <ImageUploadField label="Cover Image" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
      <div>
        <Label>Category</Label>
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">None</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <Label>Content *</Label>
        <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="mt-1.5 font-mono text-sm" rows={12} />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
        <span className="text-sm">Published</span>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Post"}</Button>
        {post && <Button variant="destructive" onClick={handleDelete}>Delete</Button>}
      </div>
    </div>
  );
}
