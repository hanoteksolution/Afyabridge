"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  AdminFormPanel,
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import { saveSettings } from "@/actions/cms";
import { parseSiteSettings, type SiteSettings } from "@/lib/site-settings";
import { toast } from "sonner";
import {
  Sparkles,
  ImageIcon,
  Palette,
  PanelTop,
  Mail,
  LayoutGrid,
  Globe,
  Loader2,
  Save,
  ExternalLink,
  Layers,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FieldDef = {
  key: keyof SiteSettings;
  label: string;
  group: string;
  textarea?: boolean;
  type?: string;
  hint?: string;
  colSpan?: 1 | 2;
};

const FIELDS: FieldDef[] = [
  { key: "site_name", label: "Company name", group: "branding" },
  { key: "site_tagline", label: "Tagline / positioning", group: "branding", textarea: true, colSpan: 2 },
  { key: "color_primary", label: "Primary", group: "theme", type: "color" },
  { key: "color_secondary", label: "Secondary", group: "theme", type: "color" },
  { key: "color_accent", label: "Accent", group: "theme", type: "color" },
  { key: "color_hero_bg", label: "Hero background", group: "theme", type: "color" },
  { key: "contact_email", label: "Contact email", group: "contact" },
  { key: "phone_ke", label: "Kenya phone", group: "contact" },
  { key: "phone_tz", label: "Tanzania phone", group: "contact" },
  { key: "address", label: "Address", group: "contact", colSpan: 2 },
  { key: "region", label: "Region", group: "contact" },
  { key: "contact_response_title", label: "Response card title", group: "contact" },
  { key: "contact_response_subtitle", label: "Response card subtitle", group: "contact" },
  { key: "contact_security_title", label: "Security card title", group: "contact" },
  { key: "contact_security_subtitle", label: "Security card subtitle", group: "contact" },
  { key: "watch_demo_text", label: "Watch demo label", group: "header" },
  { key: "watch_demo_link", label: "Watch demo link", group: "header" },
  { key: "request_demo_text", label: "Request demo label", group: "header" },
  { key: "request_demo_link", label: "Request demo link", group: "header" },
  { key: "footer_newsletter_title", label: "Newsletter heading", group: "footer" },
  { key: "footer_newsletter_subtitle", label: "Newsletter subtitle", group: "footer", textarea: true, colSpan: 2 },
  {
    key: "footer_trust_badges",
    label: "Trust badges (JSON)",
    group: "footer",
    textarea: true,
    colSpan: 2,
    hint: '[{"icon":"ShieldCheck","label":"Healthcare-grade data protection"}]',
  },
  { key: "copyright_text", label: "Copyright override", group: "footer", colSpan: 2 },
  { key: "privacy_link", label: "Privacy policy URL", group: "footer" },
  { key: "terms_link", label: "Terms of service URL", group: "footer" },
  { key: "social_linkedin", label: "LinkedIn", group: "social" },
  { key: "social_twitter", label: "Twitter / X", group: "social" },
  { key: "social_facebook", label: "Facebook", group: "social" },
  { key: "social_youtube", label: "YouTube", group: "social" },
];

const GROUPS = [
  {
    id: "branding",
    title: "Branding & identity",
    description: "Company name and positioning shown across the site.",
    icon: Sparkles,
    tone: "indigo" as const,
  },
  {
    id: "theme",
    title: "Brand colors",
    description: "Site-wide CSS variables — components update automatically.",
    icon: Palette,
    tone: "violet" as const,
  },
  {
    id: "header",
    title: "Header buttons",
    description: "CTA labels and links in the site header.",
    icon: PanelTop,
    tone: "blue" as const,
  },
  {
    id: "contact",
    title: "Contact information",
    description: "Emails, phones, address, and contact page cards.",
    icon: Mail,
    tone: "emerald" as const,
  },
  {
    id: "footer",
    title: "Footer & newsletter",
    description: "Newsletter copy, trust badges, and legal links.",
    icon: LayoutGrid,
    tone: "indigo" as const,
  },
  {
    id: "social",
    title: "Social media",
    description: "Profile URLs linked from the footer.",
    icon: Globe,
    tone: "blue" as const,
  },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-slate-700">{label}</Label>
      <div className="mt-1.5 flex items-center gap-3">
        <div
          className="h-11 w-11 shrink-0 rounded-xl border border-slate-200/80 shadow-inner"
          style={{ backgroundColor: value || "#e2e8f0" }}
        />
        <Input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer rounded-xl border-slate-200/80 p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(adminFieldClass, "mt-0 flex-1 font-mono text-sm")}
          placeholder="#0A1F78"
        />
      </div>
    </div>
  );
}

function FieldGrid({
  fields,
  form,
  setForm,
}: {
  fields: FieldDef[];
  form: SiteSettings;
  setForm: (f: SiteSettings) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.key}
          className={field.colSpan === 2 ? "sm:col-span-2" : undefined}
        >
          {field.type === "color" ? (
            <ColorField
              label={field.label}
              value={form[field.key]}
              onChange={(v) => setForm({ ...form, [field.key]: v })}
            />
          ) : (
            <>
              <Label className="text-slate-700">{field.label}</Label>
              {field.textarea ? (
                <Textarea
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className={cn(
                    adminTextareaClass,
                    field.key === "footer_trust_badges" && "font-mono text-xs"
                  )}
                  rows={field.key === "footer_trust_badges" ? 4 : 2}
                />
              ) : (
                <Input
                  type={field.type || "text"}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className={adminFieldClass}
                />
              )}
              {field.hint && (
                <p className="mt-1.5 text-xs text-slate-400">{field.hint}</p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: Record<string, unknown> }) {
  const parsed = parseSiteSettings(settings);
  const [form, setForm] = useState<SiteSettings>(parsed);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await saveSettings(form);
    setSaving(false);
    if (res.success) toast.success("Settings saved — changes are live on the website");
    else toast.error("Failed to save settings");
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Global configuration
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Site settings
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Logo, branding, contact details, header CTAs, footer content, and
              social profiles — applied site-wide on the public website.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/" target="_blank">
                <ExternalLink className="h-4 w-4" />
                Preview site
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-11 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
            >
              <Link href="/admin/pages">
                <Layers className="h-4 w-4" />
                Pages
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-11 rounded-xl bg-white/90 text-[#0A1F78] shadow-md hover:bg-white"
            >
              <Link href="/admin/menus">
                <Menu className="h-4 w-4" />
                Menus
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <AdminFormPanel
        title="Company logo"
        description="Upload logos for the header, footer, and browser tab. Use the dark variant on navy hero backgrounds. Square PNGs work best for the favicon."
        icon={ImageIcon}
        iconTone="blue"
        delay={0.04}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <ImageUploadField
            label="Logo (light background)"
            value={form.site_logo}
            onChange={(url) => setForm({ ...form, site_logo: url })}
          />
          <ImageUploadField
            label="Logo (dark / hero background)"
            value={form.site_logo_dark}
            onChange={(url) => setForm({ ...form, site_logo_dark: url })}
          />
          <ImageUploadField
            label="Favicon (browser tab icon)"
            value={form.site_favicon}
            onChange={(url) => setForm({ ...form, site_favicon: url })}
          />
        </div>
      </AdminFormPanel>

      {GROUPS.map((group, index) => (
        <AdminFormPanel
          key={group.id}
          title={group.title}
          description={group.description}
          icon={group.icon}
          iconTone={group.tone}
          delay={0.06 + index * 0.04}
        >
          <FieldGrid
            fields={FIELDS.filter((f) => f.group === group.id)}
            form={form}
            setForm={setForm}
          />
        </AdminFormPanel>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2563EB]/20 bg-white/95 px-6 py-4 shadow-lg shadow-[#0A1F78]/10 backdrop-blur-sm"
      >
        <div>
          <p className="text-sm font-medium text-[#0A1F78]">Ready to publish changes?</p>
          <p className="text-xs text-slate-500">
            Updates apply immediately to the live site header, footer, and theme.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="h-11 rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save all settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
