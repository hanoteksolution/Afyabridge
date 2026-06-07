import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { MenuEditor } from "@/components/admin/menu-editor";

export default async function MenusAdminPage() {
  const menus = await prisma.menu.findMany({
    include: {
      items: {
        where: { parentId: null },
        orderBy: { order: "asc" },
        include: { children: { orderBy: { order: "asc" } } },
      },
    },
  });

  return (
    <div>
      <AdminHeader title="Menu Builder" />
      <div className="p-6 space-y-10">
        {menus.map((menu) => (
          <div key={menu.id}>
            <h3 className="text-lg font-semibold text-[#0A1F78] mb-4 capitalize">{menu.name} ({menu.location})</h3>
            <MenuEditor menuId={menu.id} items={menu.items} />
          </div>
        ))}
      </div>
    </div>
  );
}
