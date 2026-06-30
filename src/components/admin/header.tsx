"use client";

import { useSession } from "next-auth/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminHeader({ title }: { title: string }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6">
      <h1 className="text-xl font-semibold text-[#0A1F78]">{title}</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/" target="_blank">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            View site
          </Link>
        </Button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-xs font-bold text-white">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">{session?.user?.name || "Admin"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
