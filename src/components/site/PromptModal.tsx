import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Sparkles, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Prompt, SiteData } from "@/lib/cms-types";
import { categoryName, compactNumber, relatedPrompts } from "@/lib/site-helpers";
import { trackPromptMetric } from "@/lib/cms.functions";

export function PromptModal({
  prompt,
  data,
  onClose,
  onSelect,
}: {
  prompt: Prompt | null;
  data: SiteData;
  onClose: () => void;
  onSelect: (prompt: Prompt) => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    setCopied(false);
    void trackPromptMetric({ data: { promptId: prompt.id, metric: "view" } });
  }, [prompt]);

  useEffect(() => {
    if (!prompt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [prompt, onClose]);

  async function copy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    toast.success("Prompt copied");
    void trackPromptMetric({ data: { promptId: prompt.id, metric: "copy" } });
  }

  return (
    <AnimatePresence>
      {prompt ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
          style={{
            background: "color-mix(in oklab, var(--background) 55%, transparent)",
            backdropFilter: "blur(28px)",
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={prompt.title}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong glass-sheen my-auto w-full max-w-4xl overflow-hidden rounded-t-[var(--glass-radius)] sm:rounded-[var(--glass-radius)]"
          >
            <div className="relative">
              {prompt.video_url ? (
                <video
                  src={prompt.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-[240px] w-full object-cover md:h-[320px]"
                />
              ) : prompt.preview_image_url ? (
                <img
                  src={prompt.preview_image_url}
                  alt={prompt.title}
                  className="h-[240px] w-full object-cover md:h-[320px]"
                />
              ) : (
                <div
                  className="h-[200px] w-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              )}
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="glass-strong absolute right-4 top-4 grid size-10 place-items-center rounded-full"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[62vh] overflow-y-auto p-6 md:p-9">
              <div className="flex flex-wrap items-center gap-2">
                {categoryName(data, prompt.category_id) ? (
                  <span className="glass-soft rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {categoryName(data, prompt.category_id)}
                  </span>
                ) : null}
                {prompt.ai_model ? (
                  <span className="glass-soft rounded-full px-3 py-1 text-[0.68rem] text-muted-foreground">
                    {prompt.ai_model}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-current" style={{ color: "var(--accent2)" }} />
                  {prompt.rating.toFixed(1)} · {compactNumber(prompt.view_count)} views
                </span>
              </div>

              <h2 className="mt-4 text-[1.8rem] leading-tight md:text-[2.3rem]">{prompt.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {prompt.description}
              </p>

              {prompt.before_image_url || prompt.after_image_url ? (
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Before", url: prompt.before_image_url },
                    { label: "After", url: prompt.after_image_url },
                  ]
                    .filter((x) => x.url)
                    .map((x) => (
                      <figure key={x.label} className="glass overflow-hidden rounded-3xl">
                        <img
                          src={x.url!}
                          alt={`${prompt.title} — ${x.label}`}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <figcaption className="px-4 py-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {x.label}
                        </figcaption>
                      </figure>
                    ))}
                </div>
              ) : null}

              <div className="glass mt-7 rounded-3xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    The prompt
                  </p>
                  <button
                    type="button"
                    onClick={copy}
                    className="lift inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-4 whitespace-pre-wrap break-words font-body text-sm leading-relaxed text-foreground/90">
                  {prompt.prompt_text}
                </pre>
              </div>

              {prompt.tags.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="glass-soft rounded-full px-3 py-1 text-xs text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {relatedPrompts(data, prompt).length ? (
                <div className="mt-9">
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <Sparkles className="size-3.5" /> More like this
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {relatedPrompts(data, prompt).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelect(p)}
                        className="glass lift overflow-hidden rounded-2xl text-left"
                      >
                        {p.preview_image_url ? (
                          <img
                            src={p.preview_image_url}
                            alt={p.title}
                            loading="lazy"
                            className="aspect-[16/10] w-full object-cover"
                          />
                        ) : null}
                        <span className="block px-4 py-3 text-sm">{p.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}