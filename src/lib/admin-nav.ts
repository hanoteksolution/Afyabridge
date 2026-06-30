import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Menu,
  MessageSquare,
  BookOpen,
  Settings,
  Users,
  HelpCircle,
  Star,
  GalleryHorizontal,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export type AdminNavGroup = {
  label?: string;
  items: AdminNavItem[];
};

/**
 * WordPress-style CMS navigation — content first, no enterprise/hospital modules.
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        href: "/admin/blogs",
        label: "Posts",
        icon: BookOpen,
        description: "Blog articles and news",
      },
      {
        href: "/admin/pages",
        label: "Pages",
        icon: FileText,
        description: "Static pages like About, Contact",
      },
      {
        href: "/admin/media",
        label: "Media",
        icon: ImageIcon,
        description: "Images and uploads",
      },
    ],
  },
  {
    label: "Appearance",
    items: [
      {
        href: "/admin/menus",
        label: "Menus",
        icon: Menu,
        description: "Header and footer links",
      },
      {
        href: "/admin/slides",
        label: "Home slider",
        icon: GalleryHorizontal,
        description: "Homepage hero banner slides",
      },
    ],
  },
  {
    label: "Site content",
    items: [
      {
        href: "/admin/faq",
        label: "FAQ",
        icon: HelpCircle,
      },
      {
        href: "/admin/testimonials",
        label: "Testimonials",
        icon: Star,
      },
    ],
  },
  {
    label: "Inbox",
    items: [
      {
        href: "/admin/contacts",
        label: "Messages",
        icon: MessageSquare,
        description: "Contact form submissions",
      },
    ],
  },
  {
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: Users,
      },
      {
        href: "/admin/settings",
        label: "Settings",
        icon: Settings,
        description: "Site name, logo, contact info",
      },
    ],
  },
];

/** Hidden from main menu — still available by URL for admins who need them. */
export const ADMIN_ADVANCED_PATHS = [
  "/admin/seo",
  "/admin/case-studies",
  "/admin/roles",
  "/admin/activity",
  "/admin/api",
];
