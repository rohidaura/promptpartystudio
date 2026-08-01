import type { SiteSettings } from "./cms-types";

/**
 * Builds route metadata from CMS settings so no brand string is hardcoded.
 * `suffix` is an optional page label appended to the CMS site name.
 */
export function buildMeta(
  settings: SiteSettings | undefined,
  opts: { title?: string; description?: string; suffix?: string; noindex?: boolean } = {},
) {
  const brand = settings?.site?.name ?? settings?.site?.logo_text ?? "Studio";
  const seo = settings?.seo ?? {};
  const title =
    opts.title ?? (opts.suffix ? `${opts.suffix} — ${brand}` : seo.default_title ?? brand);
  const description = opts.description ?? seo.default_description ?? settings?.site?.tagline ?? "";

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (opts.noindex) meta.push({ name: "robots", content: "noindex" });
  return meta;
}
