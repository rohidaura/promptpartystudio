import type { SiteData } from "@/lib/cms-types";
import { ThemeVars } from "./ThemeVars";
import { Backdrop } from "./Backdrop";
import { FloatingNav } from "./FloatingNav";
import { SiteFooter } from "./SiteFooter";

/** Shared shell: CMS theme tokens, ambient lighting, floating nav, footer. */
export function SiteChrome({
  data,
  children,
}: {
  data: SiteData;
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeVars settings={data.settings} />
      <Backdrop imageUrl={data.settings.hero?.background_url} />
      <FloatingNav
        items={data.navItems.filter((i) => i.location === "header" && i.is_visible)}
        settings={data.settings}
      />
      <main>{children}</main>
      <SiteFooter items={data.navItems} settings={data.settings} />
    </>
  );
}