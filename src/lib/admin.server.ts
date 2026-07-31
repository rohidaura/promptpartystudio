import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Db = SupabaseClient<Database>;

export const EDITABLE_TABLES = [
  "prompts",
  "categories",
  "reviews",
  "nav_items",
  "page_sections",
  "media",
] as const;

export type EditableTable = (typeof EDITABLE_TABLES)[number];

export async function assertAdmin(supabase: Db, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}
