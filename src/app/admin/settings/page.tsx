import { getSettings } from "@/lib/cms";
import { AdminHeader } from "@/components/admin/header";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen">
      <AdminHeader title="Settings" />
      <div className="p-6 lg:p-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
