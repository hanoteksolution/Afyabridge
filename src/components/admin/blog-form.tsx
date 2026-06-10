"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { BlogEditorHero } from "@/components/admin/blog-editor-hero";
import {
  AdminFormPanel,
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { saveBlogPost, deleteBlogPost } from "@/actions/cms";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { BlogPost, BlogCategory } from "@prisma/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function BlogForm({
  post,
  categories,
}: {
  post?: BlogPost;
  categories: BlogCategory[];
}) {
  const router = useRouter();
  const isNew = !post;
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
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    const res = await saveBlogPost(post?.id, {
      ...form,
      slug: form.slug || slugify(form.title),
      categoryId: form.categoryId || undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success(isNew ? "Post created" : "Post saved");
      router.push("/admin/blogs");
      router.refresh();
    } else {
      toast.error("Failed to save post");
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this post? This cannot be undone.")) return;
    await deleteBlogPost(post.id);
    toast.success("Post deleted");
    router.push("/admin/blogs");
  }

  const excerptLen = form.excerpt.length;

  return (
    <div className="space-y-6">
      <BlogEditorHero
        title={form.title || "Untitled post"}
        slug={form.slug}
        isPublished={form.isPublished}
        mode={isNew ? "new" : "edit"}
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <AdminFormPanel
            title="Post details"
            description="Title, URL slug, and summary for listings and SEO."
            icon={FileText}
            iconTone="indigo"
            delay={0.05}
          >
            <div className="space-y-5">
              <div>
                <Label className="text-slate-700">Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({
                      ...form,
                      title,
                      slug:
                        !slugTouched && isNew
                          ? slugify(title)
                          : form.slug,
                    });
                  }}
                  className={adminFieldClass}
                  placeholder="Digital transformation in healthcare"
                />
              </div>
              <div>
                <Label className="text-slate-700">Slug</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    /blog/
                  </span>
                  <Input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm({ ...form, slug: slugify(e.target.value) });
                    }}
                    className={cn(adminFieldClass, "pl-14 font-mono text-sm")}
                    placeholder="post-slug"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700">Excerpt</Label>
                  <span
                    className={cn(
                      "text-xs",
                      excerptLen > 200 ? "text-amber-600" : "text-slate-400"
                    )}
                  >
                    {excerptLen}/200
                  </span>
                </div>
                <Textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className={adminTextareaClass}
                  rows={3}
                  placeholder="Short summary shown on the blog listing and in search results..."
                />
              </div>
            </div>
          </AdminFormPanel>

          <AdminFormPanel
            title="Article content"
            description="Main body — HTML tags are supported for headings, lists, and links."
            icon={BookOpen}
            iconTone="violet"
            delay={0.1}
          >
            <div>
              <Label className="text-slate-700">Content *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className={cn(
                  adminTextareaClass,
                  "min-h-[320px] font-mono text-sm leading-relaxed"
                )}
                rows={16}
                placeholder="<p>Write your article here...</p>"
              />
              <p className="mt-2 text-xs text-slate-400">
                Use HTML for formatting, or plain text paragraphs.
              </p>
            </div>
          </AdminFormPanel>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <AdminFormPanel
            title="Cover & category"
            description="Featured image and taxonomy for the post."
            icon={ImageIcon}
            iconTone="blue"
            delay={0.07}
          >
            <div className="space-y-5">
              <ImageUploadField
                label="Cover image"
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
              />
              <div>
                <Label className="text-slate-700">Category</Label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className={cn(
                    adminFieldClass,
                    "w-full cursor-pointer bg-white"
                  )}
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </AdminFormPanel>

          <AdminFormPanel
            title="Publishing"
            description="Control visibility on the public blog."
            icon={Globe}
            iconTone="emerald"
            delay={0.12}
            footer={
              <div className="flex w-full flex-wrap gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-[#2563EB] shadow-md sm:flex-none"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isNew ? "Publish post" : "Save post"}
                    </>
                  )}
                </Button>
                {post && (
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            }
          >
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {form.isPublished ? "Published" : "Draft"}
                </p>
                <p className="text-xs text-slate-500">
                  {form.isPublished
                    ? "Visible on the public blog"
                    : "Only visible in admin until published"}
                </p>
              </div>
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
              />
            </div>
          </AdminFormPanel>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2563EB]/20 bg-white/95 px-6 py-4 shadow-lg shadow-[#0A1F78]/10 backdrop-blur-sm xl:hidden"
      >
        <p className="text-sm text-slate-600">
          {form.isPublished ? "Will be live after save" : "Saved as draft"}
        </p>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save post
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
