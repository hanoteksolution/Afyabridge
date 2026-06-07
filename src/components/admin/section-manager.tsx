"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  GripVertical, Eye, EyeOff, Copy, Trash2, ChevronDown, ChevronUp, Plus,
} from "lucide-react";
import {
  toggleSectionVisibility,
  duplicateSection,
  deleteSection,
  reorderSections,
} from "@/actions/admin";
import { createSection } from "@/actions/cms";
import { toast } from "sonner";
import { SectionEditor } from "@/components/admin/section-editor";
import type { Section, SectionType, TrustStat, WhyCard, Industry, ServiceModule, ApproachStep, MissionValue } from "@prisma/client";

type FullSection = Section & {
  trustStats?: TrustStat[];
  whyCards?: WhyCard[];
  industries?: Industry[];
  serviceModules?: ServiceModule[];
  approachSteps?: ApproachStep[];
  missionValues?: MissionValue[];
};

const SECTION_LABELS: Record<SectionType, string> = {
  HERO: "Hero Section",
  TRUST_BAR: "Trust Bar",
  WHY_AFYA: "Why Afya Bridge",
  WHO_WE_SERVE: "Who We Serve",
  PLATFORM_MODULES: "Platform Modules",
  OUR_APPROACH: "Our Approach",
  MISSION_VISION: "Mission & Vision",
  TESTIMONIALS: "Testimonials",
  CASE_STUDIES: "Case Studies",
  BLOG: "Blog",
  CTA: "Call to Action",
  CONTACT: "Contact Form",
  CUSTOM: "Custom Section",
};

interface SectionManagerProps {
  pageId: string;
  sections: FullSection[];
}

export function SectionManager({ pageId, sections: initialSections }: SectionManagerProps) {
  const [sections, setSections] = useState(initialSections);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

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
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, isVisible: visible } : sec)));
    toast.success(visible ? "Section enabled" : "Section disabled");
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
    toast.success("Section deleted");
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setSections(reordered);
    await reorderSections(pageId, reordered.map((s) => s.id));
    toast.success("Section reordered");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0A1F78]">
          Page Sections ({sections.length})
        </h3>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            defaultValue=""
            disabled={adding}
            onChange={(e) => {
              const type = e.target.value as SectionType;
              if (type) handleAdd(type);
              e.target.value = "";
            }}
          >
            <option value="" disabled>Add section…</option>
            {(Object.keys(SECTION_LABELS) as SectionType[]).map((type) => (
              <option key={type} value={type}>{SECTION_LABELS[type]}</option>
            ))}
          </select>
          <Button size="sm" disabled={adding} onClick={() => handleAdd("CUSTOM")}>
            <Plus className="h-4 w-4 mr-1" /> Custom
          </Button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-slate-500">No sections yet. Add a section above or run the seed script.</p>
        </div>
      ) : (
        sections.map((section, index) => (
          <div
            key={section.id}
            className="rounded-xl border border-slate-200/80 bg-white overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0A1F78]">
                    {section.title || SECTION_LABELS[section.type]}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {SECTION_LABELS[section.type]}
                  </Badge>
                  {!section.isVisible && (
                    <Badge variant="outline" className="text-xs">Hidden</Badge>
                  )}
                </div>
                {section.subtitle && (
                  <p className="text-sm text-slate-500 mt-0.5">{section.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={section.isVisible}
                  onCheckedChange={(v) => handleToggle(section.id, v)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")} disabled={index === sections.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDuplicate(section.id)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setExpanded(expanded === section.id ? null : section.id)}>
                  {expanded === section.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(section.id)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {expanded === section.id && <SectionEditor section={section} />}
          </div>
        ))
      )}
    </div>
  );
}
