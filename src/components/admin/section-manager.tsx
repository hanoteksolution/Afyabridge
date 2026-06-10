"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  toggleSectionVisibility,
  duplicateSection,
  deleteSection,
  reorderSections,
} from "@/actions/admin";
import { createSection } from "@/actions/cms";
import { toast } from "sonner";
import { SectionEditor } from "@/components/admin/section-editor";
import { getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { SECTION_LABELS, SECTION_META } from "@/lib/section-admin-meta";
import type {
  Section,
  SectionType,
  TrustStat,
  WhyCard,
  Industry,
  ServiceModule,
  ApproachStep,
  MissionValue,
} from "@prisma/client";

type FullSection = Section & {
  trustStats?: TrustStat[];
  whyCards?: WhyCard[];
  industries?: Industry[];
  serviceModules?: ServiceModule[];
  approachSteps?: ApproachStep[];
  missionValues?: MissionValue[];
};

interface SectionManagerProps {
  pageId: string;
  sections: FullSection[];
}

function ActionButton({
  onClick,
  disabled,
  title,
  children,
  danger,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-30",
        danger
          ? "text-red-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-[#0A1F78]"
      )}
    >
      {children}
    </button>
  );
}

export function SectionManager({ pageId, sections: initialSections }: SectionManagerProps) {
  const [sections, setSections] = useState(initialSections);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const visibleCount = sections.filter((s) => s.isVisible).length;
  const hiddenCount = sections.length - visibleCount;

  async function handleAdd(type: SectionType) {
    setAdding(true);
    const res = await createSection(pageId, type);
    setAdding(false);
    if (res.success && res.section) {
      setSections((s) => [...s, res.section as FullSection]);
      setExpanded(res.section.id);
      toast.success("Section added");
    } else {
      toast.error("Failed to add section");
    }
  }

  async function handleToggle(id: string, visible: boolean) {
    await toggleSectionVisibility(id, visible);
    setSections((s) =>
      s.map((sec) => (sec.id === id ? { ...sec, isVisible: visible } : sec))
    );
    toast.success(visible ? "Section enabled" : "Section hidden");
  }

  async function handleDuplicate(id: string) {
    const dup = await duplicateSection(id);
    setSections((s) => [...s, dup]);
    toast.success("Section duplicated");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this section?")) return;
    await deleteSection(id);
    setSections((s) => s.filter((sec) => sec.id !== id));
    if (expanded === id) setExpanded(null);
    toast.success("Section deleted");
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[newIndex]] = [
      reordered[newIndex],
      reordered[index],
    ];
    setSections(reordered);
    await reorderSections(
      pageId,
      reordered.map((s) => s.id)
    );
    toast.success("Section reordered");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3b82f6] text-white shadow-lg shadow-[#2563EB]/25">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#0A1F78]">
                Page sections
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Build your page by ordering, editing, and toggling sections
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <Eye className="h-3 w-3" />
                  {visibleCount} visible
                </span>
                {hiddenCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <EyeOff className="h-3 w-3" />
                    {hiddenCount} hidden
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 min-w-[160px] rounded-xl border border-slate-200/80 bg-white px-3 text-sm shadow-sm transition-colors focus:border-[#2563EB]/40 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
              defaultValue=""
              disabled={adding}
              onChange={(e) => {
                const type = e.target.value as SectionType;
                if (type) handleAdd(type);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                {adding ? "Adding…" : "Add section…"}
              </option>
              {(Object.keys(SECTION_LABELS) as SectionType[]).map((type) => (
                <option key={type} value={type}>
                  {SECTION_LABELS[type]}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={adding}
              onClick={() => handleAdd("CUSTOM")}
              className="h-10 rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md"
            >
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Custom
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F78]/5">
              <Layers className="h-6 w-6 text-[#2563EB]" />
            </div>
            <p className="font-medium text-slate-700">No sections yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add a section above to start building this page
            </p>
          </div>
        ) : (
          sections.map((section, index) => {
            const meta = SECTION_META[section.type];
            const Icon = getLucideIcon(meta.icon);
            const isOpen = expanded === section.id;

            return (
              <motion.div
                key={section.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={cn(
                  "group overflow-hidden rounded-2xl border bg-white transition-all duration-200",
                  isOpen
                    ? "border-[#2563EB]/30 shadow-md shadow-[#0A1F78]/5"
                    : "border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm",
                  !section.isVisible && "opacity-75"
                )}
              >
                <div className="flex">
                  <div
                    className={cn(
                      "w-1.5 shrink-0 bg-gradient-to-b",
                      meta.accent
                    )}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
                      <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-slate-300 sm:block" />

                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                          meta.accent
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(isOpen ? null : section.id)
                        }
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-semibold text-[#0A1F78]">
                            {section.title || SECTION_LABELS[section.type]}
                          </span>
                          <Badge
                            className={cn(
                              "border-0 text-[10px] font-medium",
                              meta.chip
                            )}
                          >
                            {SECTION_LABELS[section.type]}
                          </Badge>
                          {!section.isVisible && (
                            <Badge variant="outline" className="text-[10px]">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        {section.subtitle && (
                          <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                            {section.subtitle}
                          </p>
                        )}
                      </button>

                      <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1">
                        <div className="flex items-center gap-2 px-2">
                          <Switch
                            checked={section.isVisible}
                            onCheckedChange={(v) =>
                              handleToggle(section.id, v)
                            }
                          />
                          <span className="hidden text-xs text-slate-500 sm:inline">
                            {section.isVisible ? "On" : "Off"}
                          </span>
                        </div>
                        <div className="h-5 w-px bg-slate-200" />
                        <ActionButton
                          title="Move up"
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          title="Move down"
                          onClick={() => handleMove(index, "down")}
                          disabled={index === sections.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          title="Duplicate"
                          onClick={() => handleDuplicate(section.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </ActionButton>
                        <ActionButton
                          title={isOpen ? "Collapse" : "Expand editor"}
                          onClick={() =>
                            setExpanded(isOpen ? null : section.id)
                          }
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </ActionButton>
                        <ActionButton
                          title="Delete section"
                          danger
                          onClick={() => handleDelete(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </ActionButton>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <SectionEditor section={section} accent={meta.accent} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}
