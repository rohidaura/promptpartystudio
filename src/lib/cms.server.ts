import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { getPublicSupabaseEnv } from "./supabase-public-env";

/**
 * Publishable-key server client for public, read-only CMS content.
 * Reads are constrained by the public SELECT policies (published prompts,
 * visible categories/sections/nav, approved reviews, settings).
 */
export function createPublicClient() {
  const { url, key } = getPublicSupabaseEnv();
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}