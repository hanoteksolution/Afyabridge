"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { saveSettings } from "@/actions/cms";
import { parseSiteSettings, type SiteSettings } from "@/lib/site-settings";
import { toast } from "sonner";

type FieldDef = {
  key: keyof SiteSettings;
  label: string;
  group: string;
  textarea?: boolean;
  type?: string;
  hint?: string;
};

const FIELDS: FieldDef[] = [
  { key: "site_name", label: "Company Name", group: "branding" },
  { key: "site_tagline", label: "Tagline / Positioning", group: "branding", textarea: true },
  { key: "color_primary", label: "Primary Color", group: "theme", type: "color" },
  { key: "color_secondary", label: "Secondary Color", group: "theme", type: "color" },
  { key: "color_accent", label: "Accent Color", group: "theme", type: "color" },
  { key: "color_hero_bg", label: "Hero Background", group: "theme", type: "color" },
  { key: "contact_email", label: "Contact Email", group: "contact" },
  { key: "phone_ke", label: "Kenya Phone", group: "contact" },
  { key: "phone_tz", label: "Tanzania Phone", group: "contact" },
  { key: "address", label: "Address", group: "contact" },
  { key: "region", label: "Region", group: "contact" },
  { key: "contact_response_title", label: "Contact Card: Response Title", group: "contact" },
  { key: "contact_response_subtitle", label: "Contact Card: Response Subtitle", group: "contact" },
  { key: "contact_security_title", label: "Contact Card: Security Title", group: "contact" },
  { key: "contact_security_subtitle", label: "Contact Card: Security Subtitle", group: "contact" },
  { key: "watch_demo_text", label: "Header: Watch Demo Text", group: "header" },
  { key: "watch_demo_link", label: "Header: Watch Demo Link", group: "header" },
  { key: "request_demo_text", label: "Header: Request Demo Text", group: "header" },
  { key: "request_demo_link", label: "Header: Request Demo Link", group: "header" },
  { key: "footer_newsletter_title", label: "Newsletter Heading", group: "footer" },
  { key: "footer_newsletter_subtitle", label: "Newsletter Subtitle", group: "footer", textarea: true },
  {
    key: "footer_trust_badges",
    label: "Trust Badges (JSON)",
    group: "footer",
    textarea: true,
    hint: '[{"icon":"ShieldCheck","label":"Healthcare-grade data protection"}]',
  },
  { key: "copyright_text", label: "Footer Copyright (optional override)", group: "footer" },
  { key: "privacy_link", label: "Privacy Policy Link", group: "footer" },
  { key: "terms_link", label: "Terms of Service Link", group: "footer" },
  { key: "social_linkedin", label: "LinkedIn URL", group: "social" },
  { key: "social_twitter", label: "Twitter / X URL", group: "social" },
  { key: "social_facebook", label: "Facebook URL", group: "social" },
  { key: "social_youtube", label: "YouTube URL", group: "social" },
];

const GROUPS = [
  { id: "branding", title: "Branding & Logo" },
  { id: "theme", title: "Brand Colors" },
  { id: "header", title: "Header Buttons" },
  { id: "contact", title: "Contact Information" },
  { id: "footer", title: "Footer & Newsletter" },
  { id: "social", title: "Social Media Links" },
];

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
    <div className="space-y-8 max-w-3xl">
      <div className="rounded-xl border bg-white p-6 space-y-5">
        <h3 className="font-semibold text-[#00153D]">Company Logo</h3>
        <p className="text-sm text-slate-500">
          Upload your logo for the header and footer. Use the dark variant for the navy hero background if needed.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
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
        </div>
      </div>

      {GROUPS.map((group) => (
        <div key={group.id} className="rounded-xl border bg-white p-6 space-y-4">
          <h3 className="font-semibold text-[#00153D]">{group.title}</h3>
          {group.id === "theme" && (
            <p className="text-sm text-slate-500">
              Colors apply site-wide via CSS variables. Components using brand tokens will update automatically.
            </p>
          )}
          {FIELDS.filter((f) => f.group === group.id).map((field) => (
            <div key={field.key}>
              <Label>{field.label}</Label>
              {field.textarea ? (
                <Textarea
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="mt-1.5 font-mono text-xs"
                  rows={field.key === "footer_trust_badges" ? 4 : 2}
                />
              ) : (
                <Input
                  type={field.type || "text"}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="mt-1.5"
                />
              )}
              {field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
            </div>
          ))}
        </div>
      ))}

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
