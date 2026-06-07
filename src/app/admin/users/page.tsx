import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminHeader title="Users" />
      <div className="p-6">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role", render: (u) => <Badge variant="secondary">{u.role.name}</Badge> },
            {
              key: "isActive",
              label: "Status",
              render: (u) => <Badge variant={u.isActive ? "success" : "outline"}>{u.isActive ? "Active" : "Inactive"}</Badge>,
            },
            {
              key: "createdAt",
              label: "Joined",
              render: (u) => format(new Date(u.createdAt), "MMM d, yyyy"),
            },
          ]}
          data={users}
        />
      </div>
    </div>
  );
}
