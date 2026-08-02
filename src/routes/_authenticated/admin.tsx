import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Sparkles,
  FolderTree,
  Images,
  LayoutTemplate,
  Palette,
  Star,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { accessQuery, adminQuery } from "@/lib/admin-queries";
import { siteQuery } from "@/lib/cms-queries";
import { ThemeVars } from "@/components/site/ThemeVars";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  loader: async ({ context }) => {
    const access = await context.queryClient.ensureQueryData(accessQuery);
    if (!access.isAdmin) throw redirect({ to: "/access-denied" });
    context.queryClient.ensureQueryData(adminQuery);
    context.queryClient.ensureQueryData(siteQuery);
  },
  head: () => ({
    meta: [
      { title: "Content Studio" },
      {
        name: "description",
        content: "Manage prompts, categories, media, layout, theme and SEO.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Content Studio" },
      { property: "og:description", content: "The content management studio for this site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/prompts", label: "Prompts", icon: Sparkles },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/media", label: "Media", icon: Images },
  { to: "/admin/content", label: "Content", icon: LayoutTemplate },
  { to: "/admin/theme", label: "Theme", icon: Palette },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "SEO & settings", icon: Settings },
];

function AdminLayout() {
  const { data: site } = useSuspenseQuery(siteQuery);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      <ThemeVars settings={site.settings} />
      <div className="aurora" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8 lg:py-10">
        <aside className="glass h-fit rounded-[var(--glass-radius)] p-4 lg:sticky lg:top-8 lg:w-64 lg:shrink-0">
          <div className="px-2 pb-4">
            <p className="font-display text-base">{site.settings.site?.logo_text ?? "Studio"}</p>
            <p className="text-xs text-muted-foreground">Content studio</p>
          </div>
          <nav className="no-scrollbar flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((l) => {
              const active = l.exact ? path === l.to : path.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <l.icon className="size-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
            <a
              href="/"
              className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              <ExternalLink className="size-4" /> View site
            </a>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
