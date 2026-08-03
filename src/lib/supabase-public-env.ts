/**
 * Resolves the publishable Supabase config for server-side rendering.
 *
 * On Cloudflare Workers/Pages, unprefixed env vars only exist when they are
 * configured as Worker variables. The VITE_* values are inlined at build time,
 * so they act as a safe fallback (publishable keys are public by design).
 *
 * Last resort: literal defaults. `.env` is not part of the GitHub sync, so an
 * external build (Cloudflare Pages) inlines `undefined` for the VITE_* values
 * and every public CMS read would fail, rendering an empty page. These two
 * values are public by design (they are already shipped in the client bundle).
 */
const FALLBACK_URL = "https://awfoszaznlvvltkaycrt.supabase.co";
const FALLBACK_KEY = "sb_publishable_R-q51JrPOA7ABK4tf5NCHw_TfERXbJs";

export function getPublicSupabaseEnv(): { url: string; key: string } {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL ||
    FALLBACK_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    FALLBACK_KEY;

  if (!url || !key) {
    const missing = [!url && "SUPABASE_URL", !key && "SUPABASE_PUBLISHABLE_KEY"]
      .filter(Boolean)
      .join(", ");
    throw new Error(
      `Missing backend configuration at runtime: ${missing}. Set these (and their VITE_ equivalents) in the hosting environment.`,
    );
  }

  return { url, key };
}