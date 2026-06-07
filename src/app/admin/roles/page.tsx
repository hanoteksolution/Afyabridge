import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

export default async function RolesAdminPage() {
  const roles = await prisma.role.findMany({
    include: { _count: { select: { users: true } } },
  });

  return (
    <div>
      <AdminHeader title="Roles & Permissions" />
      <div className="p-6">
        <DataTable
          columns={[
            { key: "name", label: "Role" },
            { key: "slug", label: "Slug", render: (r) => <Badge variant="secondary">{r.slug}</Badge> },
            { key: "description", label: "Description" },
            { key: "users", label: "Users", render: (r) => r._count.users },
            {
              key: "permissions",
              label: "Permissions",
              render: (r) => {
                const perms = r.permissions as string[];
                return `${perms.length} permissions`;
              },
            },
          ]}
          data={roles}
        />
      </div>
    </div>
  );
}
