export const dynamic = "force-dynamic";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        enableColorScheme={false}
        disableTransitionOnChange
      >
        <AdminShell>{children}</AdminShell>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}
