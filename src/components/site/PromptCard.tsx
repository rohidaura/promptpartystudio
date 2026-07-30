import { motion } from "motion/react";
import { Copy, Eye, Heart, Share2, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Prompt } from "@/lib/cms-types";
import { compactNumber } from "@/lib/site-helpers";
import { trackPromptMetric } from "@/lib/cms.functions";

export function PromptCard({
  prompt,
  categoryLabel,
  onOpen,
}: {
  prompt: Prompt;
  categoryLabel?: string | null;
  onOpen: (prompt: Prompt) => void;
}) {
  const [favorite, setFavorite] = useState(false);

  async function copyPrompt(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.prompt_text);
    toast.success("Prompt copied");
    void trackPromptMetric({ data: { promptId: prompt.id, metric: "copy" } });
  }

  async function share(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}/?prompt=${prompt.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: prompt.title, url });
        return;
      } catch {
        /* user dismissed */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="glass glass-sheen group flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-[var(--glass-radius)] sm:w-[340px]"
    >
      <button
        type="button"
        onClick={() => onOpen(prompt)}
        className="relative block aspect-[4/3] w-full overflow-hidden text-left"
      >
        {prompt.preview_image_url ? (
          <img
            src={prompt.preview_image_url}
            alt={prompt.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full" style={{ background: "var(--gradient-primary)" }} />
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="glass-strong rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em]">
            Before
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            After
          </span>
        </div>

        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
          style={
            prompt.is_pro
              ? { background: "var(--gradient-primary)", color: "var(--primary-foreground)" }
              : { background: "oklch(1 0 0 / 14%)" }
          }
        >
          {prompt.is_pro ? "Pro" : "Free"}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {categoryLabel ? (
            <span className="glass-soft rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              {categoryLabel}
            </span>
          ) : null}
          {prompt.ai_model ? (
            <span className="glass-soft rounded-full px-2.5 py-1 text-[0.65rem] text-muted-foreground">
              {prompt.ai_model}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-lg leading-snug">{prompt.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{prompt.description}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-3.5 fill-current" style={{ color: "var(--accent2)" }} />
            {prompt.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" />
            {compactNumber(prompt.view_count)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Copy className="size-3.5" />
            {compactNumber(prompt.copy_count)}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpen(prompt)}
            className="glass-strong glass-sheen lift inline-flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
          >
            <Sparkles className="size-4" />
            Prompt
          </button>
          <button
            type="button"
            aria-label="Copy prompt"
            onClick={copyPrompt}
            className="glass-soft grid size-11 place-items-center rounded-full transition-colors hover:text-primary"
          >
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Favorite"
            aria-pressed={favorite}
            onClick={(e) => {
              e.stopPropagation();
              setFavorite((v) => !v);
            }}
            className="glass-soft grid size-11 place-items-center rounded-full"
          >
            <Heart
              className="size-4"
              style={favorite ? { color: "var(--primary)", fill: "currentColor" } : undefined}
            />
          </button>
          <button
            type="button"
            aria-label="Share"
            onClick={share}
            className="glass-soft grid size-11 place-items-center rounded-full"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}