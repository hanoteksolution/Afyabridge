"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export function MediaUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/media/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        toast.success(`${file.name} uploaded`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    router.refresh();
  }, [router]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragOver ? "border-[#2563EB] bg-blue-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
      <p className="text-sm font-medium text-slate-600">
        {uploading ? "Uploading..." : "Drag & drop files here, or click to browse"}
      </p>
      <input
        type="file"
        multiple
        accept="image/*,.pdf"
        className="mt-4 text-sm"
        onChange={(e) => handleUpload(e.target.files)}
        disabled={uploading}
      />
    </div>
  );
}
