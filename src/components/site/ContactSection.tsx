import { motion } from "motion/react";
import { ArrowUpRight, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/cms-types";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  const contact = settings.contact ?? {};
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="glass glass-sheen relative overflow-hidden rounded-[var(--glass-radius)] p-9 text-center md:p-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-10 -top-24 h-52 rounded-full opacity-40 blur-[90px]"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-[2rem] leading-tight md:text-[2.8rem]">
          <span className="text-gradient">{contact.title}</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {contact.description}
        </p>
        {contact.cta_label ? (
          <a
            href={contact.cta_href ?? "#"}
            className="lift mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            {contact.cta_label}
            <ArrowUpRight className="size-4" />
          </a>
        ) : null}
        {settings.site?.contact_email ? (
          <a
            href={`mailto:${settings.site.contact_email}`}
            className="glass-soft ml-3 mt-8 inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm"
          >
            <Mail className="size-4" />
            {settings.site.contact_email}
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}