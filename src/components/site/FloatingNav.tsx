import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavItem, SiteSettings } from "@/lib/cms-types";

export function FloatingNav({
  items,
  settings,
}: {
  items: NavItem[];
  settings: SiteSettings;
}) {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 160], [1, 0.94]);
  const y = useTransform(scrollY, [0, 160], [0, -4]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const logo = settings.site?.logo_text ?? settings.site?.name ?? "";

  return (
    <>
      <motion.header
        style={{ scale, y }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav className="glass glass-sheen flex w-full max-w-fit items-center gap-1 rounded-full py-2 pl-4 pr-2 md:gap-2">
          <Link
            to="/"
            className="mr-1 font-display text-sm font-bold tracking-[0.22em] text-foreground md:text-[0.9rem]"
          >
            {logo}
          </Link>

          <div className="hidden items-center md:flex">
            {items.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>

          <a
            href={settings.site?.instagram_url ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-1 hidden rounded-full px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:block"
            style={{ background: "var(--gradient-primary)" }}
          >
            Say hello
          </a>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="glass-soft grid size-10 place-items-center rounded-full text-foreground md:hidden"
          >
            <Menu className="size-[18px]" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass-strong fixed inset-0 z-[60] flex flex-col p-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold tracking-[0.22em]">{logo}</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="glass-soft grid size-10 place-items-center rounded-full"
              >
                <X className="size-[18px]" />
              </button>
            </div>

            <div className="mt-12 flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="glass block rounded-3xl px-6 py-5 font-display text-2xl"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <a
              href={settings.site?.instagram_url ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-auto rounded-full px-6 py-4 text-center font-medium text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Say hello
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function NavLink({ item }: { item: NavItem }) {
  return (
    <Link
      to={item.href}
      className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
      activeOptions={{ exact: item.href === "/" }}
      activeProps={{ className: "text-foreground" }}
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="nav-active"
              className="glass-soft absolute inset-0 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          ) : null}
          <span className="relative">{item.label}</span>
        </>
      )}
    </Link>
  );
}