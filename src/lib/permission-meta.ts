import { ADMIN_PERMISSIONS, type Permission } from "@/lib/constants";

export const PERMISSION_MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  pages: "Pages",
  sections: "Sections",
  media: "Media library",
  seo: "SEO",
  menus: "Menus",
  settings: "Settings",
  users: "Users",
  roles: "Roles",
  blogs: "Blog",
  testimonials: "Testimonials",
  "case-studies": "Case studies",
  contacts: "Leads & contacts",
  activity: "Activity logs",
};

export const PERMISSION_ACTION_LABELS: Record<string, string> = {
  read: "View",
  write: "Manage",
};

export function groupPermissions(): { module: string; label: string; permissions: Permission[] }[] {
  const map = new Map<string, Permission[]>();

  for (const permission of ADMIN_PERMISSIONS) {
    const [module] = permission.split(":");
    if (!map.has(module)) map.set(module, []);
    map.get(module)!.push(permission);
  }

  return Array.from(map.entries()).map(([module, permissions]) => ({
    module,
    label: PERMISSION_MODULE_LABELS[module] || module,
    permissions,
  }));
}

export function permissionLabel(permission: Permission): string {
  const [module, action] = permission.split(":");
  const moduleLabel = PERMISSION_MODULE_LABELS[module] || module;
  const actionLabel = PERMISSION_ACTION_LABELS[action] || action;
  return `${actionLabel} ${moduleLabel.toLowerCase()}`;
}
