import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { getSettings } from "@/lib/cms";
import { parseSiteSettings, resolveSiteFavicon } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = parseSiteSettings(await getSettings());
  const favicon = resolveSiteFavicon(settings);

  return {
    title: {
      default: `${settings.site_name || SITE_CONFIG.name} — ${settings.site_tagline || SITE_CONFIG.tagline}`,
      template: `%s | ${settings.site_name || SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    metadataBase: new URL(SITE_CONFIG.url),
    ...(favicon
      ? {
          icons: {
            icon: [{ url: favicon }],
            shortcut: [{ url: favicon }],
            apple: [{ url: favicon }],
          },
        }
      : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_CONFIG.url,
      siteName: settings.site_name || SITE_CONFIG.name,
      title: `${settings.site_name || SITE_CONFIG.name} — ${settings.site_tagline || SITE_CONFIG.tagline}`,
      description: SITE_CONFIG.description,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.site_name || SITE_CONFIG.name,
      description: SITE_CONFIG.description,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
