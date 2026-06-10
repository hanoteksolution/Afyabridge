import { AdminHeader } from "@/components/admin/header";
import {
  MenusAdminView,
  type MenuRow,
} from "@/components/admin/menus-admin-view";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MenusAdminPage() {
  const menus = await withDbRetry((prisma) =>
    prisma.menu.findMany({
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: "asc" },
          include: {
            children: { orderBy: { order: "asc" } },
          },
        },
      },
      orderBy: { name: "asc" },
    })
  );

  const rows: MenuRow[] = menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    location: menu.location,
    items: menu.items.map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
      order: item.order,
      isVisible: item.isVisible,
      children: item.children.map((child) => ({
        id: child.id,
        label: child.label,
        url: child.url,
        order: child.order,
        isVisible: child.isVisible,
      })),
    })),
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Menu Builder" />
      <div className="p-6 lg:p-8">
        <MenusAdminView menus={rows} />
      </div>
    </div>
  );
}
