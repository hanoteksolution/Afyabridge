import { AdminHeader } from "@/components/admin/header";
import { PageForm } from "@/components/admin/page-form";

export default function NewPageAdmin() {
  return (
    <div>
      <AdminHeader title="New Page" />
      <div className="p-6">
        <PageForm />
      </div>
    </div>
  );
}
