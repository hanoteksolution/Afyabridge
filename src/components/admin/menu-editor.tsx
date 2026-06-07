"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { saveMenuItem, deleteMenuItem } from "@/actions/cms";
import { toast } from "sonner";
import type { MenuItem } from "@prisma/client";

type MenuItemWithChildren = MenuItem & { children?: MenuItem[] };

export function MenuEditor({ menuId, items: initial }: { menuId: string; items: MenuItemWithChildren[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ label: "", url: "" });

  async function handleAdd(parentId?: string) {
    if (!form.label || !form.url) {
      toast.error("Label and URL required");
      return;
    }
    const res = await saveMenuItem(menuId, undefined, { label: form.label, url: form.url, parentId });
    if (res.success && res.item) {
      if (parentId) {
        setItems((list) => list.map((i) => i.id === parentId ? { ...i, children: [...(i.children || []), res.item] } : i));
      } else {
        setItems((list) => [...list, { ...res.item, children: [] }]);
      }
      setForm({ label: "", url: "" });
      toast.success("Menu item added");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete menu item?")) return;
    await deleteMenuItem(id);
    setItems((list) => list.filter((i) => i.id !== id).map((i) => ({ ...i, children: i.children?.filter((c) => c.id !== id) })));
    toast.success("Deleted");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Label</Label>
          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>URL</Label>
          <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="mt-1.5" placeholder="/platform" />
        </div>
        <div className="flex items-end">
          <Button onClick={() => handleAdd()}><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
        </div>
      </div>

      {items.map((item) => (
        <div key={item.id} className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{item.label}</span>
              <span className="ml-2 text-sm text-slate-500">{item.url}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="mt-3 ml-4 space-y-2 border-l-2 border-slate-100 pl-4">
              {item.children.map((child) => (
                <div key={child.id} className="flex items-center justify-between text-sm">
                  <span>{child.label} <span className="text-slate-400">{child.url}</span></span>
                  <Button variant="ghost" size="icon" className="text-red-500 h-7 w-7" onClick={() => handleDelete(child.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
