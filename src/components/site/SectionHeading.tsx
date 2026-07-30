import { motion } from "motion/react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:justify-between"
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <span className="glass-soft inline-block rounded-full px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </span>
        ) : null}
        {title ? (
          <h2 className="mt-4 text-[2rem] leading-tight md:text-[2.7rem]">{title}</h2>
        ) : null}
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </motion.div>
  );
}