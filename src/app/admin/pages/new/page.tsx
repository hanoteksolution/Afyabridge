import { AdminHeader } from "@/components/admin/header";
import { PageForm } from "@/components/admin/page-form";
import { PageEditorHero } from "@/components/admin/page-editor-hero";

export default function NewPageAdmin() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="New Page" />
      <div className="space-y-6 p-6 lg:p-8">
        <PageEditorHero mode="new" title="New page" />
        <div className="max-w-2xl">
          <PageForm />
        </div>
      </div>
    </div>
  );
}
