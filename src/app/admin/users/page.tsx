import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import {
  UsersAdminView,
  type UserRow,
  type RoleOption,
} from "@/components/admin/users-admin-view";
import { auth } from "@/lib/auth";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const [users, roles] = await withDbRetry((prisma) =>
    Promise.all([
      prisma.user.findMany({
        include: { role: { select: { id: true, name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.role.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
    ])
  );

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    roleId: u.roleId,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));

  const roleOptions: RoleOption[] = roles;

  return (
    <div className="min-h-screen">
      <AdminHeader title="Users" />
      <div className="p-6 lg:p-8">
        <UsersAdminView
          users={rows}
          roles={roleOptions}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
