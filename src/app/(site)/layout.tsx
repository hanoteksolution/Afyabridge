export const dynamic = "force-dynamic";

import { Toaster } from "sonner";
import { Header } from "@/components/website/header";
import { Footer } from "@/components/website/footer";
import { ThemeVariables } from "@/components/website/theme-variables";
import { getMenuBySlug, getSettings } from "@/lib/cms";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const headerMenu = await getMenuBySlug("header");
  const footerMenu = await getMenuBySlug("footer");
  const settings = await getSettings();

  const headerItems = headerMenu?.items.map((item) => ({
    label: item.label,
    href: item.url,
    children:
      item.children && item.children.length > 0
        ? item.children.map((c) => ({
            label: c.label,
            href: c.url,
            desc: "",
          }))
        : undefined,
  }));

  const footerItems = footerMenu?.items.reduce(
    (acc, parent) => {
      const links =
        parent.children && parent.children.length > 0
          ? parent.children.map((child) => ({ label: child.label, href: child.url }))
          : [{ label: parent.label, href: parent.url }];
      acc[parent.label] = links;
      return acc;
    },
    {} as Record<string, { label: string; href: string }[]>
  );

  return (
    <>
      <ThemeVariables settings={settings} />
      <Header menuItems={headerItems} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer footerNav={footerItems} settings={settings} />
      <Toaster position="top-right" richColors />
    </>
  );
}
