"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({ value, onChange, label = "Slide Image" }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const media = await res.json();
      onChange(media.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="sm:col-span-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>

      {value ? (
        <div className="mt-2 flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
            <Image src={value} alt="Slide preview" fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="truncate text-xs text-slate-500">{value}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-1 h-3.5 w-3.5" />}
                Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="text-red-500 hover:text-red-600">
                <X className="mr-1 h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`mt-2 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? "border-[#2D7FF9] bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
          }`}
        >
          {uploading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2D7FF9]" />
          ) : (
            <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
          )}
          <p className="mt-2 text-sm font-medium text-slate-600">
            {uploading ? "Uploading..." : "Drag & drop an image, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-slate-400">PNG, JPG, WebP up to 10MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
    </div>
  );
}
