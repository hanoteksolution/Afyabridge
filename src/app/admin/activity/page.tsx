import { AdminHeader } from "@/components/admin/header";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { withDbRetry } from "@/lib/prisma";

export default async function ActivityAdminPage() {
  const logs = await withDbRetry((prisma) =>
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: true },
    })
  );

  const updateCount = logs.filter((l) => l.action === "UPDATE").length;
  const createCount = logs.filter((l) => l.action === "CREATE").length;
  const deleteCount = logs.filter((l) => l.action === "DELETE").length;

  return (
    <div>
      <AdminHeader title="Activity Logs" />
      <div className="space-y-6 p-6 lg:p-8">
        <AdminStatsRow
          stats={[
            { title: "Recent events", value: logs.length, icon: "Activity", variant: "indigo" },
            { title: "Updates", value: updateCount, icon: "FileText", variant: "blue" },
            { title: "Creates", value: createCount, icon: "Plus", variant: "emerald" },
            { title: "Deletes", value: deleteCount, icon: "Clock", variant: "amber" },
          ]}
        />
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
