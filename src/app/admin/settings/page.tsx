import { getSettings } from "@/lib/cms";
import { AdminHeader } from "@/components/admin/header";
import { SettingsForm } from "@/components/admin/settings-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ADVANCED_LINKS = [
  { href: "/admin/seo", label: "SEO manager" },
  { href: "/admin/case-studies", label: "Case studies" },
  { href: "/admin/roles", label: "Roles & permissions" },
  { href: "/admin/activity", label: "Activity log" },
  { href: "/admin/api", label: "API endpoints" },
];

export default async function SettingsAdminPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen">
      <AdminHeader title="Settings" />
      <div className="space-y-8 p-6 lg:p-8">
        <SettingsForm settings={settings} />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5">
          <p className="text-sm font-medium text-slate-700">Advanced tools</p>
          <p className="mt-1 text-xs text-slate-500">
            Optional — most sites only need the main menu. These stay available by direct link.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ADVANCED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-[#0A1F78]/30 hover:text-[#0A1F78]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
