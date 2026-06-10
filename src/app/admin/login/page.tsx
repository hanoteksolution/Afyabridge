import { LoginView } from "@/components/admin/login-view";
import { getSettings } from "@/lib/cms";
import { parseSiteSettings } from "@/lib/site-settings";

export default async function AdminLoginPage() {
  const settings = parseSiteSettings(await getSettings());

  return (
    <LoginView
      siteName={settings.site_name}
      siteTagline={settings.site_tagline}
      siteLogo={settings.site_logo_dark || settings.site_logo || undefined}
    />
  );
}
