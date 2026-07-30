import { motion } from "motion/react";
import type { SiteData } from "@/lib/cms-types";
import { pageSections } from "@/lib/site-helpers";

/** Renders any CMS-managed long-form page (privacy, terms, ...). */
export function LegalPage({ data, page }: { data: SiteData; page: string }) {
  const sections = pageSections(data, page);
  const intro = (sections[0]?.content ?? {}) as Record<string, string>;

  return (
    <section className="shell pb-8 pt-32 md:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 210, damping: 26 }}
        className="glass glass-sheen mx-auto max-w-3xl rounded-[var(--glass-radius)] p-8 md:p-14"
      >
        <h1 className="text-[2.2rem] leading-tight md:text-[3rem]">
          <span className="text-gradient">{intro.title}</span>
        </h1>
        {intro.description ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {intro.description}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-8">
          {sections.slice(1).map((section) => {
            const c = section.content as Record<string, string>;
            return (
              <article key={section.id}>
                <h2 className="text-xl md:text-2xl">{c.title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}