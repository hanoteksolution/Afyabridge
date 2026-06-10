"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Link2,
  Menu,
  Loader2,
  CornerDownRight,
  ArrowUpRight,
} from "lucide-react";
import {
  saveMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} from "@/actions/cms";
import { toast } from "sonner";
import { adminFieldClass } from "@/components/admin/admin-form-panel";
import { cn } from "@/lib/utils";

export type MenuItemRow = {
  id: string;
  label: string;
  url: string;
  order: number;
  isVisible: boolean;
  children?: MenuItemRow[];
};

type MenuItemWithChildren = MenuItemRow;

export function MenuEditor({
  menuId,
  items: initial,
}: {
  menuId: string;
  items: MenuItemWithChildren[];
}) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ label: "", url: "" });
  const [adding, setAdding] = useState(false);
  const [childParentId, setChildParentId] = useState<string | null>(null);
  const [childForm, setChildForm] = useState({ label: "", url: "" });
  const [savingChild, setSavingChild] = useState(false);

  async function handleAdd(parentId?: string) {
    const payload = parentId ? childForm : form;
    if (!payload.label.trim() || !payload.url.trim()) {
      toast.error("Label and URL are required");
      return;
    }
    setAdding(true);
    const res = await saveMenuItem(menuId, undefined, {
      label: payload.label.trim(),
      url: payload.url.trim(),
      parentId,
    });
    setAdding(false);
    setSavingChild(false);

    if (res.success && res.item) {
      const newItem: MenuItemRow = {
        id: res.item.id,
        label: res.item.label,
        url: res.item.url,
        order: res.item.order,
        isVisible: res.item.isVisible,
        children: [],
      };
      if (parentId) {
        setItems((list) =>
          list.map((i) =>
            i.id === parentId
              ? { ...i, children: [...(i.children || []), newItem] }
              : i
          )
        );
        setChildForm({ label: "", url: "" });
        setChildParentId(null);
      } else {
        setItems((list) => [...list, newItem]);
        setForm({ label: "", url: "" });
      }
      toast.success(parentId ? "Sub-item added" : "Menu item added");
    } else {
      toast.error("Failed to add item");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(id);
    setItems((list) =>
      list
        .filter((i) => i.id !== id)
        .map((i) => ({
          ...i,
          children: i.children?.filter((c) => c.id !== id),
        }))
    );
    toast.success("Item deleted");
  }

  async function handleToggleVisibility(
    item: MenuItemRow,
    parentId?: string
  ) {
    const next = !item.isVisible;
    const res = await saveMenuItem(menuId, item.id, {
      label: item.label,
      url: item.url,
      isVisible: next,
      parentId: parentId ?? null,
    });
    if (res.success) {
      const update = (row: MenuItemRow): MenuItemRow =>
        row.id === item.id
          ? { ...row, isVisible: next }
          : {
              ...row,
              children: row.children?.map(update),
            };
      setItems((list) => list.map(update));
      toast.success(next ? "Link visible" : "Link hidden");
    }
  }

  async function handleMoveParent(index: number, dir: "up" | "down") {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setItems(reordered);
    await reorderMenuItems(menuId, reordered.map((i) => i.id));
    toast.success("Order updated");
  }

  async function handleMoveChild(
    parentId: string,
    childIndex: number,
    dir: "up" | "down"
  ) {
    const parent = items.find((i) => i.id === parentId);
    if (!parent?.children) return;
    const target = dir === "up" ? childIndex - 1 : childIndex + 1;
    if (target < 0 || target >= parent.children.length) return;
    const children = [...parent.children];
    [children[childIndex], children[target]] = [
      children[target],
      children[childIndex],
    ];
    setItems((list) =>
      list.map((i) => (i.id === parentId ? { ...i, children } : i))
    );
    await reorderMenuItems(menuId, children.map((c) => c.id));
    toast.success("Sub-item order updated");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/80 to-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A1F78]">Add menu link</p>
            <p className="text-xs text-slate-500">Create a new top-level navigation item</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <Label className="text-slate-700">Label</Label>
            <Input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={cn(adminFieldClass, "mt-1.5")}
              placeholder="Platform"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div>
            <Label className="text-slate-700">URL</Label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className={cn(adminFieldClass, "mt-1.5")}
              placeholder="/platform"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => handleAdd()}
              disabled={adding}
              className="h-10 w-full rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md sm:w-auto"
            >
              {adding && !childParentId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add item
            </Button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F78]/5">
            <Menu className="h-6 w-6 text-[#2563EB]" />
          </div>
          <p className="font-medium text-slate-700">No menu items yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Add your first link using the form above
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white transition-shadow",
                item.isVisible
                  ? "border-slate-200/70 hover:shadow-sm"
                  : "border-slate-200/50 opacity-80"
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="w-1 shrink-0 self-stretch bg-gradient-to-b from-[#2563EB] to-[#00C2FF] sm:w-1" />

                <div className="flex min-w-0 flex-1 items-start gap-3 px-4 py-4 sm:items-center">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0A1F78]/8 font-mono text-xs font-bold text-[#0A1F78] sm:mt-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#0A1F78]">
                        {item.label}
                      </span>
                      <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                        {item.url}
                      </code>
                      {!item.isVisible && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                          Hidden
                        </span>
                      )}
                      {(item.children?.length ?? 0) > 0 && (
                        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700">
                          {item.children!.length} sub-items
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 px-3 py-2 sm:border-0 sm:py-4 sm:pr-4">
                  <Switch
                    checked={item.isVisible}
                    onCheckedChange={() => handleToggleVisibility(item)}
                  />
                  <div className="mx-1 h-5 w-px bg-slate-200" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#2563EB]"
                    asChild
                  >
                    <Link href={item.url} target="_blank" title="Open link">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <button
                    type="button"
                    title="Move up"
                    disabled={index === 0}
                    onClick={() => handleMoveParent(index, "up")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={index === items.length - 1}
                    onClick={() => handleMoveParent(index, "down")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                    onClick={() =>
                      setChildParentId((id) =>
                        id === item.id ? null : item.id
                      )
                    }
                  >
                    <CornerDownRight className="h-3.5 w-3.5" />
                    Sub-item
                  </Button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => handleDelete(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {childParentId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-100 bg-slate-50/60"
                  >
                    <div className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <Label className="text-xs text-slate-600">Sub-item label</Label>
                        <Input
                          value={childForm.label}
                          onChange={(e) =>
                            setChildForm({ ...childForm, label: e.target.value })
                          }
                          className={cn(adminFieldClass, "mt-1 h-9")}
                          placeholder="For Clinics"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600">Sub-item URL</Label>
                        <Input
                          value={childForm.url}
                          onChange={(e) =>
                            setChildForm({ ...childForm, url: e.target.value })
                          }
                          className={cn(adminFieldClass, "mt-1 h-9")}
                          placeholder="/clinics"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => setChildParentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-lg"
                          disabled={savingChild}
                          onClick={() => {
                            setSavingChild(true);
                            handleAdd(item.id);
                          }}
                        >
                          {savingChild ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {item.children && item.children.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-3">
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <Link2 className="h-3 w-3" />
                    Nested links
                  </p>
                  <div className="space-y-2">
                    {item.children.map((child, childIndex) => (
                      <div
                        key={child.id}
                        className={cn(
                          "flex flex-col gap-2 rounded-xl border border-slate-200/60 bg-white px-3 py-2.5 sm:flex-row sm:items-center",
                          !child.isVisible && "opacity-70"
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2 pl-2">
                          <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                          <span className="font-medium text-slate-800">
                            {child.label}
                          </span>
                          <code className="truncate font-mono text-xs text-slate-400">
                            {child.url}
                          </code>
                        </div>
                        <div className="flex items-center gap-1 sm:shrink-0">
                          <Switch
                            checked={child.isVisible}
                            onCheckedChange={() =>
                              handleToggleVisibility(child, item.id)
                            }
                          />
                          <button
                            type="button"
                            disabled={childIndex === 0}
                            onClick={() =>
                              handleMoveChild(item.id, childIndex, "up")
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={
                              childIndex === (item.children?.length ?? 0) - 1
                            }
                            onClick={() =>
                              handleMoveChild(item.id, childIndex, "down")
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(child.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
