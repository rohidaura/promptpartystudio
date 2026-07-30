import type { Prompt, SiteData } from "./cms-types";

export function sectionOf(data: SiteData, key: string, page = "home") {
  return data.sections.find(
    (s) => s.page_slug === page && s.section_key === key && s.is_visible,
  );
}

export function sectionCopy(data: SiteData, key: string, page = "home") {
  const content = (sectionOf(data, key, page)?.content ?? {}) as Record<string, string>;
  return content;
}

export function pageSections(data: SiteData, page: string) {
  return data.sections.filter((s) => s.page_slug === page && s.is_visible);
}

export function categoryName(data: SiteData, id: string | null) {
  if (!id) return null;
  return data.categories.find((c) => c.id === id)?.name ?? null;
}

export function categorySlug(data: SiteData, id: string | null) {
  if (!id) return null;
  return data.categories.find((c) => c.id === id)?.slug ?? null;
}

export function promptsFor(data: SiteData, categoryId: string) {
  return data.prompts.filter((p) => p.category_id === categoryId);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function relatedPrompts(data: SiteData, prompt: Prompt, limit = 3) {
  return data.prompts
    .filter((p) => p.id !== prompt.id && p.category_id === prompt.category_id)
    .slice(0, limit);
}