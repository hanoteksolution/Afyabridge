import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ActivityAdminPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div>
      <AdminHeader title="Activity Logs" />
      <div className="p-6">
        <DataTable
          columns={[
            {
              key: "action",
              label: "Action",
              render: (l) => <Badge variant="secondary">{l.action}</Badge>,
            },
            { key: "entity", label: "Entity" },
            { key: "entityId", label: "Entity ID", render: (l) => l.entityId?.slice(0, 8) || "—" },
            { key: "user", label: "User", render: (l) => l.user?.name || "System" },
            {
              key: "createdAt",
              label: "Timestamp",
              render: (l) => format(new Date(l.createdAt), "MMM d, yyyy HH:mm:ss"),
            },
          ]}
          data={logs}
          emptyMessage="No activity logged yet"
        />
      </div>
    </div>
  );
}
