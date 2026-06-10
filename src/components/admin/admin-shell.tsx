"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export function AdminShell({
  children,
  siteName,
  siteLogo,
}: {
  children: React.ReactNode;
  siteName: string;
  siteLogo?: string;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#eef2ff_0%,_#f8fafc_45%,_#f8fafc_100%)]">
      <AdminSidebar siteName={siteName} siteLogo={siteLogo} />
      <div className="pl-64 transition-all duration-300">{children}</div>
    </div>
  );
}
