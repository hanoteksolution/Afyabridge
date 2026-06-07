import { getSettings } from "@/lib/cms";
import { AdminHeader } from "@/components/admin/header";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsAdminPage() {
  const settings = await getSettings();
  return (
    <div>
      <AdminHeader title="Settings" />
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-2">
          Manage your company logo, contact details, header buttons, footer links, and social profiles.
          Changes apply site-wide to the public website header and footer.
        </p>
        <p className="text-sm text-slate-400 mb-6">
          For page content and sections, use <strong className="text-slate-600">Pages</strong>.
          For navigation menus, use <strong className="text-slate-600">Menus</strong>.
        </p>
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
