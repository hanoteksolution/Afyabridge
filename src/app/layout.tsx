import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { getSettings } from "@/lib/cms";
import { parseSiteSettings, resolveSiteFavicon } from "@/lib/site-settings";

/** Refresh metadata (including favicon) soon after admin settings changes. */
export const revalidate = 60;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = parseSiteSettings(await getSettings());
  // Relative URLs so the favicon loads on IP and domain alike (avoid wrong metadataBase host).
  const favicon = resolveSiteFavicon(settings) || "/icon";
  const siteName = settings.site_name || SITE_CONFIG.name;
  const tagline = settings.site_tagline || SITE_CONFIG.tagline;

  return {
    title: {
      default: `${siteName} — ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description: SITE_CONFIG.description,
    metadataBase: new URL(SITE_CONFIG.url),
    icons: {
      icon: [{ url: favicon }, { url: "/favicon.ico" }],
      shortcut: [{ url: favicon }],
      apple: [{ url: favicon }],
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_CONFIG.url,
      siteName,
      title: `${siteName} — ${tagline}`,
      description: SITE_CONFIG.description,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
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
