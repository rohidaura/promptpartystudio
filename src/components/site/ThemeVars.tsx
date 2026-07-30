import type { SiteSettings } from "@/lib/cms-types";

/**
 * Maps the CMS theme record onto the design-system custom properties.
 * Nothing visual is hardcoded in components — this is the single bridge.
 */
export function ThemeVars({ settings }: { settings: SiteSettings }) {
  const t = settings.theme ?? {};
  const decls: string[] = [];
  const push = (name: string, value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === "") return;
    decls.push(`${name}:${value}`);
  };

  push("--primary", t.primary);
  push("--accent2", t.accent);
  push("--background", t.background);
  push("--foreground", t.foreground);
  push("--glass-alpha", t.glass_opacity);
  push("--glass-blur", t.glass_blur ? `${t.glass_blur}px` : undefined);
  push("--glass-stroke-alpha", t.glass_border_opacity);
  push("--glass-radius", t.radius ? `${t.radius}px` : undefined);
  push("--container-width", t.container_width ? `${t.container_width}px` : undefined);
  push("--motion-scale", t.animation_speed);
  push("--shadow-strength", t.shadow_strength);
  if (t.font_display) push("--font-display-family", `"${t.font_display}", sans-serif`);
  if (t.font_body) push("--font-body-family", `"${t.font_body}", sans-serif`);

  const css = `:root{${decls.join(";")}}${settings.seo?.custom_css ?? ""}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}