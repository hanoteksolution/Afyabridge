import { parseSiteSettings, themeToCssVars } from "@/lib/site-settings";

export function ThemeVariables({ settings = {} }: { settings?: Record<string, unknown> }) {
  const site = parseSiteSettings(settings);
  const vars = themeToCssVars(site);
  const css = `:root{${Object.entries(vars)
    .map(([key, value]) => `${key}:${value}`)
    .join(";")}}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
