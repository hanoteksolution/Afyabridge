export const dynamic = "force-dynamic";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSettings } from "@/lib/cms";
import { parseSiteSettings } from "@/lib/site-settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = parseSiteSettings(await getSettings());

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
        <AdminShell
          siteName={settings.site_name}
          siteLogo={settings.site_logo || undefined}
        >
          {children}
        </AdminShell>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}
