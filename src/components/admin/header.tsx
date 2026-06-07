"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminHeader({ title }: { title: string }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6">
      <h1 className="text-xl font-semibold text-[#0A1F78]">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search..." className="w-64 pl-9" />
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <button className="relative rounded-lg p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-xs font-bold text-white">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">{session?.user?.name || "Admin"}</div>
            <div className="text-xs text-slate-500">{session?.user?.role || "Administrator"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
