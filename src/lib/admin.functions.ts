import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const tableSchema = z.enum([
  "prompts",
  "categories",
  "reviews",
  "nav_items",
  "page_sections",
  "media",
]);

/** Everything the admin CMS renders, unfiltered by public visibility policies. */
export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("./admin.server");
    const db = context.supabase;
    await assertAdmin(db, context.userId);

    const [settings, categories, prompts, reviews, navItems, sections, media, events] =
      await Promise.all([
        db.from("site_settings").select("key, value"),
        db.from("categories").select("*").order("sort_order"),
        db.from("prompts").select("*").order("sort_order").order("created_at", { ascending: false }),
        db.from("reviews").select("*").order("sort_order"),
        db.from("nav_items").select("*").order("sort_order"),
        db.from("page_sections").select("*").order("sort_order"),
        db.from("media").select("*").order("created_at", { ascending: false }),
        db.from("prompt_events").select("event_type, created_at").limit(2000),
      ]);

    const settingsMap: Record<string, unknown> = {};
    for (const row of settings.data ?? []) settingsMap[row.key] = row.value;

    return {
      settings: settingsMap as Record<string, Record<string, string>>,
      categories: categories.data ?? [],
      prompts: prompts.data ?? [],
      reviews: reviews.data ?? [],
      navItems: navItems.data ?? [],
      sections: sections.data ?? [],
      media: media.data ?? [],
      events: events.data ?? [],
    };
  });

/** Insert or update a single row in a CMS-managed table. */
export const saveRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ table: tableSchema, values: z.record(z.string(), z.unknown()) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    const db = context.supabase;
    await assertAdmin(db, context.userId);

    const values = { ...data.values } as Record<string, unknown>;
    const id = values.id;
    delete values.created_at;

    if (id) {
      delete values.id;
      const { error } = await db.from(data.table).update(values as never).eq("id", id as string);
      if (error) throw new Error(error.message);
      return { id: id as string };
    }
    delete values.id;
    const { data: row, error } = await db
      .from(data.table)
      .insert(values as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (row as { id: string }).id };
  });

/** Delete a row from a CMS-managed table. */
export const deleteRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ table: tableSchema, id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    const db = context.supabase;
    await assertAdmin(db, context.userId);
    const { error } = await db.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Upsert one JSON blob in site_settings (hero, theme, seo, site, contact...). */
export const saveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ key: z.string().min(1), value: z.record(z.string(), z.unknown()) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./admin.server");
    const db = context.supabase;
    await assertAdmin(db, context.userId);
    const { error } = await db
      .from("site_settings")
      .upsert({ key: data.key, value: data.value as never, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Resolves studio access for the signed-in user. Grants the admin role when the
 * account's email is on the admins allowlist, or bootstraps the very first
 * account when no admin exists yet.
 */
export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string }).email ?? null;
    const { data, error } = await context.supabase.rpc("claim_admin_access");
    const result = (data ?? {}) as { isAdmin?: boolean; reason?: string };

    if (import.meta.env.DEV) {
      console.log("[studio-access]", {
        userId: context.userId,
        email,
        isAdmin: Boolean(result.isAdmin),
        reason: result.reason ?? null,
        error: error?.message ?? null,
      });
    }

    if (error) throw new Error(error.message);

    return {
      userId: context.userId,
      email,
      isAdmin: Boolean(result.isAdmin),
      reason: result.reason ?? "unknown",
    };
  });
