import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/cms-types";

const spring = { type: "spring" as const, stiffness: 220, damping: 28 };

function Panel({
  kind,
  url,
  children,
}: {
  kind?: string | null;
  url?: string | null;
  children?: React.ReactNode;
}) {
  if (kind === "video" && url) {
    return (
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  if (kind === "image" && url) {
    return (
      <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
    );
  }
  return <>{children}</>;
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const hero = settings.hero ?? {};

  return (
    <section className="shell pt-28 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ ...spring, delay: 0.05 }}
        className="glass glass-sheen overflow-hidden rounded-[var(--glass-radius)]"
      >
        <div className="grid md:grid-cols-2 md:divide-x md:divide-border">
          {/* Left column — editorial copy */}
          <div className="relative flex min-h-[62vh] flex-col justify-center p-8 md:min-h-[76vh] md:p-14">
            <Panel kind={hero.left_media_kind} url={hero.left_media_url} />
            <div className="relative">
              {hero.eyebrow ? (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.15 }}
                  className="glass-soft inline-block rounded-full px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {hero.eyebrow}
                </motion.span>
              ) : null}

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.22 }}
                className="mt-6 whitespace-pre-line text-[2.6rem] leading-[1.02] md:text-[4.1rem]"
              >
                <span className="text-gradient">{hero.title}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.3 }}
                className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-[1.05rem]"
              >
                {hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.38 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                {hero.primary_cta_label ? (
                  <a
                    href={hero.primary_cta_href ?? "#"}
                    className="lift inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {hero.primary_cta_label}
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
                {hero.secondary_cta_label ? (
                  <Link
                    to={hero.secondary_cta_href ?? "/"}
                    className="glass-soft lift inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
                  >
                    {hero.secondary_cta_label}
                  </Link>
                ) : null}
              </motion.div>
            </div>
          </div>

          {/* Right column — independent media surface */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.18 }}
            className="relative min-h-[42vh] overflow-hidden md:min-h-[76vh]"
          >
            <Panel kind={hero.right_media_kind} url={hero.right_media_url}>
              <div
                className="absolute inset-0"
                style={{ background: "var(--gradient-primary)", opacity: 0.35 }}
              />
            </Panel>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(200deg, transparent 30%, color-mix(in oklab, var(--background) 80%, transparent))",
              }}
            />
            {hero.right_caption ? (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-strong glass-sheen rounded-2xl px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Now trending
                  </p>
                  <p className="mt-1 font-display text-lg">{hero.right_caption}</p>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}