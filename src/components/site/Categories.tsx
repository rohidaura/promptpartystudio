import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Category, SiteData } from "@/lib/cms-types";
import { Carousel } from "./Carousel";
import { promptsFor } from "@/lib/site-helpers";

export function Categories({
  data,
  onSelect,
}: {
  data: SiteData;
  onSelect: (category: Category) => void;
}) {
  return (
    <Carousel ariaLabel="Prompt categories">
      {data.categories.map((category, i) => (
        <motion.button
          key={category.id}
          type="button"
          onClick={() => onSelect(category)}
          whileHover={{ y: -6 }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 260, damping: 26, delay: i * 0.04 }}
          className="glass glass-sheen group relative w-[240px] shrink-0 snap-start overflow-hidden rounded-[var(--glass-radius)] text-left sm:w-[280px]"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {category.image_url ? (
              <img
                src={category.image_url}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              />
            ) : (
              <div className="h-full w-full" style={{ background: "var(--gradient-primary)" }} />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 35%, color-mix(in oklab, var(--background) 88%, transparent))",
              }}
            />
            <div className="absolute inset-x-4 bottom-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg">{category.name}</p>
                <span className="glass-strong grid size-9 shrink-0 place-items-center rounded-full">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {promptsFor(data, category.id).length} prompts
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </Carousel>
  );
}