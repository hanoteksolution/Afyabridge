import { AdminHeader } from "@/components/admin/header";
import { ApiAdminView } from "@/components/admin/api-admin-view";

export default function AdminApiPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="API Endpoints" />
      <div className="p-6 lg:p-8">
        <ApiAdminView />
      </div>
    </div>
  );
}
