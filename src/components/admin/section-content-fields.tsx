"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Plus, Trash2 } from "lucide-react";
import type { Prisma, Section, SectionType } from "@prisma/client";
import {
  parseContent,
  type HeroContent,
  type WhyPillarContent,
  type WhoServeContent,
  type TrustBadge,
  type ConsultingService,
  type HeroFeature,
  type CtaContent,
  type ContactContent,
  type SectionMeta,
} from "@/lib/section-content";

type SectionWithContent = Section;

function updateContent<T extends Record<string, unknown>>(
  section: SectionWithContent,
  onUpdate: (s: SectionWithContent) => void,
  patch: Partial<T>
) {
  const current = parseContent<T>(section.content);
  onUpdate({ ...section, content: { ...current, ...patch } as Prisma.JsonValue });
}

function FeaturesList({
  label,
  features,
  onChange,
}: {
  label: string;
  features: string[];
  onChange: (features: string[]) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5 space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={f}
              onChange={(e) => {
                const next = [...features];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => onChange(features.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...features, ""])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add item
        </Button>
      </div>
    </div>
  );
}

function EyebrowField({
  section,
  onUpdate,
  placeholder = "Section eyebrow (small label above title)",
}: {
  section: SectionWithContent;
  onUpdate: (s: SectionWithContent) => void;
  placeholder?: string;
}) {
  const c = parseContent<SectionMeta>(section.content);
  return (
    <Input
      placeholder={placeholder}
      value={c.eyebrow || ""}
      onChange={(e) => updateContent<SectionMeta>(section, onUpdate, { eyebrow: e.target.value })}
    />
  );
}

function HeroFeaturesEditor({
  features,
  onChange,
}: {
  features: HeroFeature[];
  onChange: (features: HeroFeature[]) => void;
}) {
  return (
    <div className="space-y-2">
      {features.map((f, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Icon (Lucide name)"
            value={f.icon}
            onChange={(e) => {
              const next = [...features];
              next[i] = { ...f, icon: e.target.value };
              onChange(next);
            }}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Label"
              value={f.label}
              onChange={(e) => {
                const next = [...features];
                next[i] = { ...f, label: e.target.value };
                onChange(next);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 shrink-0"
              onClick={() => onChange(features.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...features, { icon: "Shield", label: "New feature" }])}
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> Add feature chip
      </Button>
    </div>
  );
}

function ConsultingServicesFields({
  section,
  onUpdate,
}: {
  section: SectionWithContent;
  onUpdate: (s: SectionWithContent) => void;
}) {
  const c = parseContent<WhoServeContent>(section.content);
  const services = c.consultingServices || [];
  return (
    <div className="space-y-4">
      <Input
        placeholder="Consulting eyebrow"
        value={c.consultingEyebrow || ""}
        onChange={(e) => updateContent<WhoServeContent>(section, onUpdate, { consultingEyebrow: e.target.value })}
      />
      <Input
        placeholder="Consulting title"
        value={c.consultingTitle || ""}
        onChange={(e) => updateContent<WhoServeContent>(section, onUpdate, { consultingTitle: e.target.value })}
      />
      <Textarea
        placeholder="Consulting subtitle"
        value={c.consultingSubtitle || ""}
        rows={2}
        onChange={(e) => updateContent<WhoServeContent>(section, onUpdate, { consultingSubtitle: e.target.value })}
      />
      {services.map((s, i) => (
        <div key={i} className="grid gap-2 rounded border p-3 sm:grid-cols-3">
          <Input
            placeholder="Title"
            value={s.title}
            onChange={(e) => {
              const next = [...services];
              next[i] = { ...s, title: e.target.value };
              updateContent<WhoServeContent>(section, onUpdate, { consultingServices: next });
            }}
          />
          <Input
            placeholder="Icon (Lucide)"
            value={s.icon}
            onChange={(e) => {
              const next = [...services];
              next[i] = { ...s, icon: e.target.value };
              updateContent<WhoServeContent>(section, onUpdate, { consultingServices: next });
            }}
          />
          <Input
            placeholder="Description"
            value={s.description}
            onChange={(e) => {
              const next = [...services];
              next[i] = { ...s, description: e.target.value };
              updateContent<WhoServeContent>(section, onUpdate, { consultingServices: next });
            }}
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          updateContent<WhoServeContent>(section, onUpdate, {
            consultingServices: [...services, { title: "New Service", description: "", icon: "Settings" }],
          })
        }
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> Add consulting service
      </Button>
    </div>
  );
}

const EYEBROW_SECTIONS: SectionType[] = [
  "TRUST_BAR",
  "WHO_WE_SERVE",
  "PLATFORM_MODULES",
  "OUR_APPROACH",
  "MISSION_VISION",
  "TESTIMONIALS",
  "CASE_STUDIES",
  "BLOG",
];

export function SectionContentFields({
  section,
  onUpdate,
}: {
  section: SectionWithContent;
  onUpdate: (s: SectionWithContent) => void;
}) {
  switch (section.type as SectionType) {
    case "HERO": {
      const c = parseContent<HeroContent>(section.content);
      return (
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h5 className="text-sm font-semibold text-[#00153D]">Hero Extras</h5>
          <EyebrowField section={section} onUpdate={onUpdate} />
          <div>
            <Label>Feature chips (below CTAs)</Label>
            <div className="mt-1.5">
              <HeroFeaturesEditor
                features={c.features || []}
                onChange={(features) => updateContent<HeroContent>(section, onUpdate, { features })}
              />
            </div>
          </div>
          <Input
            placeholder="Floating card title"
            value={c.floatingCardTitle || ""}
            onChange={(e) => updateContent<HeroContent>(section, onUpdate, { floatingCardTitle: e.target.value })}
          />
          <Textarea
            placeholder="Floating card description"
            value={c.floatingCardDescription || ""}
            rows={2}
            onChange={(e) => updateContent<HeroContent>(section, onUpdate, { floatingCardDescription: e.target.value })}
          />
        </div>
      );
    }

    case "WHY_AFYA": {
      const c = parseContent<WhyPillarContent>(section.content);
      return (
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h5 className="text-sm font-semibold text-[#00153D]">Two Pillars Content</h5>
          <Input
            placeholder="Section eyebrow"
            value={c.eyebrow || ""}
            onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { eyebrow: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase text-[#2563EB]">Product pillar</p>
              <Input placeholder="Product title" value={c.productTitle || ""} onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { productTitle: e.target.value })} />
              <Textarea placeholder="Product description" value={c.productDescription || ""} rows={2} onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { productDescription: e.target.value })} />
              <FeaturesList label="Product features" features={c.productFeatures || []} onChange={(productFeatures) => updateContent<WhyPillarContent>(section, onUpdate, { productFeatures })} />
              <ImageUploadField label="Product image" value={c.productImage || ""} onChange={(url) => updateContent<WhyPillarContent>(section, onUpdate, { productImage: url })} />
              <Input placeholder="Product link" value={c.productLink || ""} onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { productLink: e.target.value })} />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase text-emerald-600">Consulting pillar</p>
              <Input placeholder="Consulting title" value={c.consultingTitle || ""} onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { consultingTitle: e.target.value })} />
              <Textarea placeholder="Consulting description" value={c.consultingDescription || ""} rows={2} onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { consultingDescription: e.target.value })} />
              <FeaturesList label="Consulting features" features={c.consultingFeatures || []} onChange={(consultingFeatures) => updateContent<WhyPillarContent>(section, onUpdate, { consultingFeatures })} />
              <ImageUploadField label="Consulting image" value={c.consultingImage || ""} onChange={(url) => updateContent<WhyPillarContent>(section, onUpdate, { consultingImage: url })} />
              <Input placeholder="Consulting link" value={c.consultingLink || ""} onChange={(e) => updateContent<WhyPillarContent>(section, onUpdate, { consultingLink: e.target.value })} />
            </div>
          </div>
        </div>
      );
    }

    case "WHO_WE_SERVE":
      return (
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <h5 className="text-sm font-semibold text-[#00153D]">Who We Serve</h5>
          <EyebrowField section={section} onUpdate={onUpdate} />
          <p className="text-sm text-slate-500">
            Edit hospitals, clinics, images, benefits, and CTAs in <strong>Industries / Audiences</strong> below,
            then click <strong>Save Section</strong>.
          </p>
        </div>
      );

    case "CUSTOM": {
      const c = parseContent<WhoServeContent & { variant?: string; description?: string; eyebrow?: string }>(
        section.content
      );
      return (
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <h5 className="text-sm font-semibold text-[#00153D]">Custom Section Variant</h5>
          <div>
            <Label>Variant</Label>
            <select
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={c.variant || "PAGE_HEADER"}
              onChange={(e) => updateContent(section, onUpdate, { variant: e.target.value })}
            >
              <option value="PAGE_HEADER">Page Header (inner page hero)</option>
              <option value="CONSULTING">Consulting Services (homepage block)</option>
              <option value="CONTENT">Page Content (privacy, terms, text pages)</option>
              <option value="FAQ">FAQ List (full page)</option>
            </select>
          </div>
          {c.variant === "FAQ" ? (
            <p className="text-sm text-slate-500">
              FAQ questions are managed in Admin → FAQ. This section displays all published FAQ items.
            </p>
          ) : c.variant === "CONSULTING" ? (
            <ConsultingServicesFields section={section} onUpdate={onUpdate} />
          ) : c.variant === "CONTENT" ? (
            <Textarea
              placeholder="Page body (HTML allowed — paragraphs, headings, lists)"
              value={(c as { body?: string }).body || ""}
              rows={12}
              onChange={(e) => updateContent(section, onUpdate, { body: e.target.value })}
            />
          ) : (
            <>
              <Input
                placeholder="Eyebrow (shown above title)"
                value={c.eyebrow || section.subtitle || ""}
                onChange={(e) => {
                  updateContent(section, onUpdate, { eyebrow: e.target.value });
                  onUpdate({ ...section, subtitle: e.target.value, content: { ...c, eyebrow: e.target.value } as Prisma.JsonValue });
                }}
              />
              <Textarea
                placeholder="Description (shown below title)"
                value={c.description || ""}
                rows={2}
                onChange={(e) => updateContent(section, onUpdate, { description: e.target.value })}
              />
            </>
          )}
        </div>
      );
    }

    case "CTA": {
      const c = parseContent<CtaContent>(section.content);
      return (
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <h5 className="text-sm font-semibold text-[#00153D]">CTA Badge</h5>
          <EyebrowField section={section} onUpdate={onUpdate} />
          <Input
            placeholder="Badge text (e.g. No credit card required)"
            value={c.badge || ""}
            onChange={(e) => updateContent<CtaContent>(section, onUpdate, { badge: e.target.value })}
          />
          <p className="text-xs text-slate-500">
            Primary/secondary buttons use the section button fields above. Set secondary link in Button Text 2 / Link 2.
          </p>
        </div>
      );
    }

    case "CONTACT": {
      const c = parseContent<ContactContent>(section.content);
      return (
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <h5 className="text-sm font-semibold text-[#00153D]">Contact Panel Labels</h5>
          <EyebrowField section={section} onUpdate={onUpdate} placeholder="Eyebrow (e.g. Contact)" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="Email label" value={c.emailLabel || ""} onChange={(e) => updateContent<ContactContent>(section, onUpdate, { emailLabel: e.target.value })} />
            <Input placeholder="Phone label" value={c.phoneLabel || ""} onChange={(e) => updateContent<ContactContent>(section, onUpdate, { phoneLabel: e.target.value })} />
            <Input placeholder="Address label" value={c.addressLabel || ""} onChange={(e) => updateContent<ContactContent>(section, onUpdate, { addressLabel: e.target.value })} />
          </div>
          <p className="text-xs text-slate-500">
            Email, phone, and address values come from Admin → Settings → Contact Information.
          </p>
        </div>
      );
    }

    default:
      if (EYEBROW_SECTIONS.includes(section.type as SectionType)) {
        return (
          <div className="rounded-lg border bg-white p-4">
            <h5 className="mb-2 text-sm font-semibold text-[#00153D]">Section Eyebrow</h5>
            <EyebrowField section={section} onUpdate={onUpdate} />
          </div>
        );
      }
      return null;
  }
}
