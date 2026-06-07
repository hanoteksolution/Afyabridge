"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  saveSection,
  saveTrustStat, deleteTrustStat,
  saveWhyCard, deleteWhyCard,
  saveIndustry, deleteIndustry,
  saveServiceModule, deleteServiceModule,
  saveApproachStep, deleteApproachStep,
  saveMissionValue, deleteMissionValue,
} from "@/actions/cms";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { SectionContentFields } from "@/components/admin/section-content-fields";
import { industryIcon, parseBullets, parseIndustryBenefits } from "@/lib/section-content";
import type { Section, SectionType, TrustStat, WhyCard, Industry, ServiceModule, ApproachStep, MissionValue } from "@prisma/client";

type FullSection = Section & {
  trustStats?: TrustStat[];
  whyCards?: WhyCard[];
  industries?: Industry[];
  serviceModules?: ServiceModule[];
  approachSteps?: ApproachStep[];
  missionValues?: MissionValue[];
};

export function SectionEditor({ section: initial }: { section: FullSection }) {
  const [section, setSection] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function saveBase() {
    setSaving(true);
    const res = await saveSection(section.id, {
      title: section.title || undefined,
      subtitle: section.subtitle || undefined,
      content: section.content,
      image: section.image || undefined,
      icon: section.icon || undefined,
      buttonText: section.buttonText || undefined,
      buttonLink: section.buttonLink || undefined,
      buttonText2: section.buttonText2 || undefined,
      buttonLink2: section.buttonLink2 || undefined,
    });
    setSaving(false);
    if (res.success) toast.success("Section saved");
    else toast.error("Failed to save");
  }

  function setField<K extends keyof Section>(key: K, value: Section[K]) {
    setSection((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Section Title</Label>
          <Input value={section.title || ""} onChange={(e) => setField("title", e.target.value)} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label>Subtitle</Label>
          <Textarea value={section.subtitle || ""} onChange={(e) => setField("subtitle", e.target.value)} className="mt-1.5" rows={2} />
        </div>
        {(section.type === "CTA" || section.type === "HERO" || section.type === "PLATFORM_MODULES") && (
          <>
            <div>
              <Label>Primary Button Text</Label>
              <Input value={section.buttonText || ""} onChange={(e) => setField("buttonText", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Primary Button Link</Label>
              <Input value={section.buttonLink || ""} onChange={(e) => setField("buttonLink", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Secondary Button Text</Label>
              <Input value={section.buttonText2 || ""} onChange={(e) => setField("buttonText2", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Secondary Button Link</Label>
              <Input value={section.buttonLink2 || ""} onChange={(e) => setField("buttonLink2", e.target.value)} className="mt-1.5" />
            </div>
          </>
        )}
        {section.type === "HERO" && (
          <div className="sm:col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              Hero slides (headlines, images, badges) are managed in{" "}
              <Link href="/admin/slides" className="font-semibold underline inline-flex items-center gap-1">
                Hero Slider <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        )}
      </div>

      <ExternalContentBanner section={section} />
      <SectionContentFields section={section} onUpdate={setSection} />
      <NestedEditor section={section} onUpdate={setSection} />

      <Button onClick={saveBase} disabled={saving}>
        {saving ? "Saving..." : "Save Section"}
      </Button>
    </div>
  );
}

function ExternalContentBanner({ section }: { section: FullSection }) {
  const variant = (section.content as { variant?: string } | null)?.variant;
  const links: Partial<Record<SectionType, { href: string; label: string; hint: string }>> = {
    TESTIMONIALS: { href: "/admin/testimonials", label: "Testimonials", hint: "Add, edit, or remove client quotes shown in this section." },
    CASE_STUDIES: { href: "/admin/case-studies", label: "Case Studies", hint: "Manage success stories, images, and links displayed here." },
    BLOG: { href: "/admin/blogs", label: "Blog Posts", hint: "Publish articles — the latest posts appear in this section automatically." },
  };
  if (section.type === "CUSTOM" && variant === "FAQ") {
    links.CUSTOM = { href: "/admin/faq", label: "FAQ Items", hint: "Manage FAQ questions and answers displayed on this page." };
  }
  const link = links[section.type as SectionType];
  if (!link) return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-900">
        {link.hint}{" "}
        <Link href={link.href} className="font-semibold underline inline-flex items-center gap-1">
          Open {link.label} <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  );
}

function NestedEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  switch (section.type as SectionType) {
    case "TRUST_BAR":
      return <TrustStatsEditor section={section} onUpdate={onUpdate} />;
    case "WHY_AFYA":
      return <WhyCardsEditor section={section} onUpdate={onUpdate} />;
    case "WHO_WE_SERVE":
      return <IndustriesEditor section={section} onUpdate={onUpdate} />;
    case "PLATFORM_MODULES":
      return <ModulesEditor section={section} onUpdate={onUpdate} />;
    case "OUR_APPROACH":
      return <StepsEditor section={section} onUpdate={onUpdate} />;
    case "MISSION_VISION":
      return <MissionEditor section={section} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

function TrustStatsEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  const items = section.trustStats || [];
  return (
    <ItemList title="Trust Stats" onAdd={async () => {
      await saveTrustStat(section.id, undefined, { label: "New Stat", value: 0, suffix: "+" });
      onUpdate({ ...section, trustStats: [...items, { id: "tmp", sectionId: section.id, label: "New Stat", value: 0, suffix: "+", icon: null, order: items.length, createdAt: new Date(), updatedAt: new Date() }] });
      toast.success("Stat added — refresh to see ID");
    }}>
      {items.map((item) => (
        <div key={item.id} className="grid gap-2 sm:grid-cols-4 rounded-lg border bg-white p-3">
          <Input placeholder="Label" defaultValue={item.label} onBlur={(e) => saveTrustStat(section.id, item.id, { label: e.target.value, value: item.value, suffix: item.suffix || undefined, icon: item.icon || undefined })} />
          <Input type="number" placeholder="Value" defaultValue={item.value} onBlur={(e) => saveTrustStat(section.id, item.id, { label: item.label, value: parseInt(e.target.value) || 0, suffix: item.suffix || undefined, icon: item.icon || undefined })} />
          <Input placeholder="Suffix" defaultValue={item.suffix || ""} onBlur={(e) => saveTrustStat(section.id, item.id, { label: item.label, value: item.value, suffix: e.target.value, icon: item.icon || undefined })} />
          <Button variant="ghost" size="sm" className="text-red-500" onClick={async () => { await deleteTrustStat(item.id); onUpdate({ ...section, trustStats: items.filter((i) => i.id !== item.id) }); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
    </ItemList>
  );
}

function WhyCardsEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  const items = section.whyCards || [];
  return (
    <ItemList title="Why Cards" onAdd={async () => {
      await saveWhyCard(section.id, undefined, { title: "New Benefit", description: "" });
      toast.success("Card added");
    }}>
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border bg-white p-3 space-y-2">
          <Input placeholder="Title" defaultValue={item.title} onBlur={(e) => saveWhyCard(section.id, item.id, { title: e.target.value, description: item.description || "", icon: item.icon || undefined, image: item.image || undefined, metricValue: item.metricValue || undefined, metricLabel: item.metricLabel || undefined, bullets: (item.bullets as string[]) || undefined })} />
          <Textarea placeholder="Description" defaultValue={item.description || ""} rows={2} onBlur={(e) => saveWhyCard(section.id, item.id, { title: item.title, description: e.target.value, icon: item.icon || undefined, image: item.image || undefined, metricValue: item.metricValue || undefined, metricLabel: item.metricLabel || undefined, bullets: (item.bullets as string[]) || undefined })} />
          <Input placeholder="Icon (Lucide)" defaultValue={item.icon || ""} onBlur={(e) => saveWhyCard(section.id, item.id, { title: item.title, description: item.description || "", icon: e.target.value, image: item.image || undefined, metricValue: item.metricValue || undefined, metricLabel: item.metricLabel || undefined, bullets: (item.bullets as string[]) || undefined })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Metric value (e.g. -40%)" defaultValue={item.metricValue || ""} onBlur={(e) => saveWhyCard(section.id, item.id, { title: item.title, description: item.description || "", icon: item.icon || undefined, image: item.image || undefined, metricValue: e.target.value, metricLabel: item.metricLabel || undefined, bullets: (item.bullets as string[]) || undefined })} />
            <Input placeholder="Metric label" defaultValue={item.metricLabel || ""} onBlur={(e) => saveWhyCard(section.id, item.id, { title: item.title, description: item.description || "", icon: item.icon || undefined, image: item.image || undefined, metricValue: item.metricValue || undefined, metricLabel: e.target.value, bullets: (item.bullets as string[]) || undefined })} />
          </div>
          <Textarea placeholder="Bullet points (one per line)" defaultValue={((item.bullets as string[]) || []).join("\n")} rows={3} onBlur={(e) => saveWhyCard(section.id, item.id, { title: item.title, description: item.description || "", icon: item.icon || undefined, image: item.image || undefined, metricValue: item.metricValue || undefined, metricLabel: item.metricLabel || undefined, bullets: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          <ImageUploadField label="Card image" value={item.image || ""} onChange={(url) => { saveWhyCard(section.id, item.id, { title: item.title, description: item.description || "", icon: item.icon || undefined, image: url, metricValue: item.metricValue || undefined, metricLabel: item.metricLabel || undefined, bullets: (item.bullets as string[]) || undefined }); onUpdate({ ...section, whyCards: items.map((i) => i.id === item.id ? { ...i, image: url } : i) }); }} />
          <Button variant="ghost" size="sm" className="text-red-500" onClick={async () => { await deleteWhyCard(item.id); onUpdate({ ...section, whyCards: items.filter((i) => i.id !== item.id) }); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
      ))}
    </ItemList>
  );
}

function IndustriesEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  const items = section.industries || [];
  return (
    <ItemList title="Industries / Audiences" onAdd={async () => {
      await saveIndustry(section.id, undefined, { name: "New Audience", slug: "new-audience", description: "" });
      toast.success("Audience added");
    }}>
      {items.map((item) => {
        const parsed = parseIndustryBenefits(item.benefits);
        return (
        <div key={item.id} className="rounded-lg border bg-white p-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-3">
            <Input placeholder="Name" defaultValue={item.name} onBlur={(e) => saveIndustry(section.id, item.id, { name: e.target.value, slug: item.slug, description: item.description || "", image: item.image || undefined, icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l, ctaLink: item.ctaLink || undefined })} />
            <Input placeholder="Slug" defaultValue={item.slug} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: e.target.value, description: item.description || "", image: item.image || undefined, icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l, ctaLink: item.ctaLink || undefined })} />
            <Input placeholder="Icon (Lucide)" defaultValue={parsed.icon || ""} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", image: item.image || undefined, icon: e.target.value, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l, ctaLink: item.ctaLink || undefined })} />
          </div>
          <Textarea placeholder="Description" defaultValue={item.description || ""} rows={2} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: e.target.value, icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l })} />
          <Textarea placeholder="Benefits (one per line)" defaultValue={parsed.items.join("\n")} rows={3} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", icon: parsed.icon, benefits: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean), statValue: parsed.stat?.v, statLabel: parsed.stat?.l })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Stat value" defaultValue={parsed.stat?.v || ""} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", icon: parsed.icon, benefits: parsed.items, statValue: e.target.value, statLabel: parsed.stat?.l, ctaText: item.ctaText || undefined, ctaLink: item.ctaLink || undefined })} />
            <Input placeholder="Stat label" defaultValue={parsed.stat?.l || ""} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: e.target.value, ctaText: item.ctaText || undefined, ctaLink: item.ctaLink || undefined })} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="CTA button text" defaultValue={item.ctaText || ""} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l, ctaText: e.target.value, ctaLink: item.ctaLink || undefined })} />
            <Input placeholder="CTA link" defaultValue={item.ctaLink || ""} onBlur={(e) => saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l, ctaText: item.ctaText || undefined, ctaLink: e.target.value })} />
          </div>
          <ImageUploadField label="Image" value={item.image || ""} onChange={(url) => { saveIndustry(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", image: url, icon: parsed.icon, benefits: parsed.items, statValue: parsed.stat?.v, statLabel: parsed.stat?.l, ctaText: item.ctaText || undefined, ctaLink: item.ctaLink || undefined }); onUpdate({ ...section, industries: items.map((i) => i.id === item.id ? { ...i, image: url } : i) }); }} />
          <Button variant="ghost" size="sm" className="text-red-500" onClick={async () => { await deleteIndustry(item.id); onUpdate({ ...section, industries: items.filter((i) => i.id !== item.id) }); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
        );
      })}
    </ItemList>
  );
}

function ModulesEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  const items = section.serviceModules || [];
  return (
    <ItemList title="Platform Modules" onAdd={async () => {
      await saveServiceModule(section.id, undefined, { name: "New Module", slug: "new-module", description: "" });
      toast.success("Module added");
    }}>
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border bg-white p-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Name" defaultValue={item.name} onBlur={(e) => saveServiceModule(section.id, item.id, { name: e.target.value, slug: item.slug, description: item.description || "", icon: item.icon || undefined })} />
            <Input placeholder="Icon (Lucide name)" defaultValue={item.icon || ""} onBlur={(e) => saveServiceModule(section.id, item.id, { name: item.name, slug: item.slug, description: item.description || "", icon: e.target.value })} />
          </div>
          <Textarea placeholder="Description" defaultValue={item.description || ""} rows={2} onBlur={(e) => saveServiceModule(section.id, item.id, { name: item.name, slug: item.slug, description: e.target.value, icon: item.icon || undefined, benefits: parseBullets(item.benefits) })} />
          <Textarea
            placeholder="Benefits (one per line, shown on hover)"
            defaultValue={parseBullets(item.benefits).join("\n")}
            rows={3}
            onBlur={(e) =>
              saveServiceModule(section.id, item.id, {
                name: item.name,
                slug: item.slug,
                description: item.description || "",
                icon: item.icon || undefined,
                benefits: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
          <Button variant="ghost" size="sm" className="text-red-500" onClick={async () => { await deleteServiceModule(item.id); onUpdate({ ...section, serviceModules: items.filter((i) => i.id !== item.id) }); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
      ))}
    </ItemList>
  );
}

function StepsEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  const items = section.approachSteps || [];
  return (
    <ItemList title="Implementation Steps" onAdd={async () => {
      await saveApproachStep(section.id, undefined, { title: "New Step", description: "" });
      toast.success("Step added");
    }}>
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border bg-white p-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Title" defaultValue={item.title} onBlur={(e) => saveApproachStep(section.id, item.id, { title: e.target.value, description: item.description || "", icon: item.icon || undefined })} />
            <Input placeholder="Icon (Lucide)" defaultValue={item.icon || ""} onBlur={(e) => saveApproachStep(section.id, item.id, { title: item.title, description: item.description || "", icon: e.target.value })} />
          </div>
          <Textarea placeholder="Description" defaultValue={item.description || ""} rows={2} onBlur={(e) => saveApproachStep(section.id, item.id, { title: item.title, description: e.target.value, icon: item.icon || undefined })} />
          <Button variant="ghost" size="sm" className="text-red-500" onClick={async () => { await deleteApproachStep(item.id); onUpdate({ ...section, approachSteps: items.filter((i) => i.id !== item.id) }); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
      ))}
    </ItemList>
  );
}

function MissionEditor({ section, onUpdate }: { section: FullSection; onUpdate: (s: FullSection) => void }) {
  const items = section.missionValues || [];
  return (
    <ItemList title="Mission / Vision / Values" onAdd={async () => {
      await saveMissionValue(section.id, undefined, { type: "value", title: "New Value", content: "" });
      toast.success("Value added");
    }}>
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border bg-white p-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Type (mission/vision/value)" defaultValue={item.type} onBlur={(e) => saveMissionValue(section.id, item.id, { type: e.target.value, title: item.title, content: item.content || "" })} />
            <Input placeholder="Title" defaultValue={item.title} onBlur={(e) => saveMissionValue(section.id, item.id, { type: item.type, title: e.target.value, content: item.content || "" })} />
          </div>
          <Textarea placeholder="Content" defaultValue={item.content || ""} rows={2} onBlur={(e) => saveMissionValue(section.id, item.id, { type: item.type, title: item.title, content: e.target.value })} />
          <Button variant="ghost" size="sm" className="text-red-500" onClick={async () => { await deleteMissionValue(item.id); onUpdate({ ...section, missionValues: items.filter((i) => i.id !== item.id) }); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
      ))}
    </ItemList>
  );
}

function ItemList({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-[#0A1F78]">{title}</h5>
        <Button variant="outline" size="sm" onClick={onAdd}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
