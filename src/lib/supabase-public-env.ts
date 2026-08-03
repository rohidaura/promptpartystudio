/**
 * Resolves the publishable Supabase config for server-side rendering.
 *
 * On Cloudflare Workers/Pages, unprefixed env vars only exist when they are
 * configured as Worker variables. The VITE_* values are inlined at build time,
 * so they act as a safe fallback (publishable keys are public by design).
 */
export function getPublicSupabaseEnv(): { url: string; key: string } {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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