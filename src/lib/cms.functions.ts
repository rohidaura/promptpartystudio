import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Public site payload: everything the frontend renders, straight from the CMS. */
export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const empty = {
    settings: {
      site: {} as Record<string, never>,
      hero: {} as Record<string, never>,
      theme: {} as Record<string, never>,
      contact: {} as Record<string, never>,
      seo: {} as Record<string, never>,
    },
    categories: [] as Awaited<ReturnType<typeof loadSiteData>>["categories"],
    prompts: [] as Awaited<ReturnType<typeof loadSiteData>>["prompts"],
    reviews: [] as Awaited<ReturnType<typeof loadSiteData>>["reviews"],
    navItems: [] as Awaited<ReturnType<typeof loadSiteData>>["navItems"],
    sections: [] as Awaited<ReturnType<typeof loadSiteData>>["sections"],
  };

  try {
    return await loadSiteData();
  } catch (error) {
    // Never take the whole page down because content could not be read.
    console.error("[cms] getSiteData failed", error);
    return empty;
  }
});

async function loadSiteData() {
  const { createPublicClient } = await import("./cms.server");
  const db = createPublicClient();

  const [settings, categories, prompts, reviews, navItems, sections] = await Promise.all([
    db.from("site_settings").select("key, value"),
    db.from("categories").select("*").order("sort_order", { ascending: true }),
    db
      .from("prompts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    db
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true }),
    db.from("nav_items").select("*").order("sort_order", { ascending: true }),
    db.from("page_sections").select("*").order("sort_order", { ascending: true }),
  ]);

  const settingsMap: Record<string, unknown> = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;

  return {
    settings: {
      site: (settingsMap.site ?? {}) as Record<string, never>,
      hero: (settingsMap.hero ?? {}) as Record<string, never>,
      theme: (settingsMap.theme ?? {}) as Record<string, never>,
      contact: (settingsMap.contact ?? {}) as Record<string, never>,
      seo: (settingsMap.seo ?? {}) as Record<string, never>,
    },
    categories: categories.data ?? [],
    prompts: prompts.data ?? [],
    reviews: reviews.data ?? [],
    navItems: navItems.data ?? [],
    sections: sections.data ?? [],
  };
}

/** Records a view or copy for a prompt and bumps its counter. */
export const trackPromptMetric = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ promptId: z.string().uuid(), metric: z.enum(["view", "copy"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./cms.server");
    const db = createPublicClient();
    await db.rpc("increment_prompt_metric", {
      _prompt_id: data.promptId,
      _metric: data.metric,
    });
    return { ok: true };
  });