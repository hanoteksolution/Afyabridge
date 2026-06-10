import { AdminHeader } from "@/components/admin/header";
import {
  RolesAdminView,
  type RoleRow,
} from "@/components/admin/roles-admin-view";
import { withDbRetry } from "@/lib/prisma";
import type { Permission } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function RolesAdminPage() {
  const roles = await withDbRetry((prisma) =>
    prisma.role.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: "asc" },
    })
  );

  const rows: RoleRow[] = roles.map((role) => ({
    id: role.id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    permissions: (role.permissions as Permission[]) || [],
    userCount: role._count.users,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Roles & Permissions" />
      <div className="p-6 lg:p-8">
        <RolesAdminView roles={rows} />
      </div>
    </div>
  );
}
