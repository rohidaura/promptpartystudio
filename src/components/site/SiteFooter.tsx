import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import type { NavItem, SiteSettings } from "@/lib/cms-types";

export function SiteFooter({
  items,
  settings,
}: {
  items: NavItem[];
  settings: SiteSettings;
}) {
  const site = settings.site ?? {};
  return (
    <footer className="shell pb-10 pt-24">
      <div className="glass glass-sheen rounded-[var(--glass-radius)] p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg font-bold tracking-[0.22em]">
              {site.logo_text ?? site.name}
            </span>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{site.tagline}</p>
            <a
              href={site.instagram_url ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-soft mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            >
              <Instagram className="size-4" />
              Instagram
            </a>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
            {items
              .filter((i) => i.location === "footer")
              .map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <nav aria-label="Categories" className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Library</p>
            {items
              .filter((i) => i.location === "header" && i.href !== "/")
              .map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{site.copyright}</p>
          {site.contact_email ? <p>{site.contact_email}</p> : null}
        </div>
      </div>
    </footer>
  );
}