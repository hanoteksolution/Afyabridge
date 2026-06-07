"use client";

import Image from "next/image";
import { Trash2, Copy } from "lucide-react";
import { deleteMedia } from "@/actions/admin";
import { toast } from "sonner";
import type { Media } from "@prisma/client";

export function MediaGrid({ media }: { media: Media[] }) {
  if (!media.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
        <p className="text-slate-500">No media uploaded yet</p>
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media?")) return;
    await deleteMedia(id);
    toast.success("Media deleted");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {media.map((item) => (
        <div key={item.id} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="aspect-square relative bg-slate-100">
            {item.mimeType?.startsWith("image/") ? (
              <Image src={item.url} alt={item.alt || item.filename} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs p-2 text-center">
                {item.originalName}
              </div>
            )}
          </div>
          <div className="p-2">
            <p className="text-xs text-slate-600 truncate">{item.originalName}</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => copyUrl(item.url)} className="rounded-lg bg-white/90 p-1.5 shadow hover:bg-white">
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-white/90 p-1.5 shadow hover:bg-red-50 text-red-500">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
