"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { SiteLogo } from "@/components/website/site-logo";
import { ADMIN_NAV_GROUPS } from "@/lib/admin-nav";

function brandInitials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminSidebar({
  siteName,
  siteLogo,
}: {
  siteName: string;
  siteLogo?: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex border-b border-slate-200 px-3",
          collapsed ? "h-[4.5rem] flex-col items-center justify-center gap-1 py-2" : "h-16 items-center justify-between"
        )}
      >
        <Link
          href="/admin/dashboard"
          className={cn("flex min-w-0 items-center", !collapsed && "flex-1")}
          title={siteName}
        >
          {collapsed ? (
            siteLogo ? (
              <Image
                src={siteLogo}
                alt={siteName}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0A1F78] to-[#2563EB]">
                <span className="text-xs font-bold text-white">{brandInitials(siteName)}</span>
              </div>
            )
          ) : (
            <div className="min-w-0 pr-2">
              <SiteLogo
                name={siteName}
                logoUrl={siteLogo}
                showTagline={false}
                className="max-w-[11rem]"
              />
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Site admin
              </span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("shrink-0 rounded-lg p-1.5 hover:bg-slate-100", collapsed && "p-1")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {ADMIN_NAV_GROUPS.map((group, groupIndex) => (
          <div
            key={group.label ?? `group-${groupIndex}`}
            className={cn(groupIndex > 0 && "mt-5 border-t border-slate-100 pt-4")}
          >
            {!collapsed && group.label && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#0A1F78]/10 text-[#0A1F78]"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      title={collapsed ? item.label : item.description}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
