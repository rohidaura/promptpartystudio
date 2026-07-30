import { motion } from "motion/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Prompt, SiteData } from "@/lib/cms-types";
import { PromptCard } from "./PromptCard";
import { categoryName } from "@/lib/site-helpers";

type SortKey = "trending" | "newest" | "rating";

export function PromptExplorer({
  data,
  copy,
  onOpen,
}: {
  data: SiteData;
  copy: Record<string, string>;
  onOpen: (prompt: Prompt) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [model, setModel] = useState<string | "all">("all");
  const [tier, setTier] = useState<"all" | "free" | "pro">("all");
  const [sort, setSort] = useState<SortKey>("trending");

  const models = useMemo(
    () => Array.from(new Set(data.prompts.map((p) => p.ai_model).filter(Boolean))) as string[],
    [data.prompts],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = data.prompts.filter((p) => {
      if (category !== "all" && p.category_id !== category) return false;
      if (model !== "all" && p.ai_model !== model) return false;
      if (tier === "free" && p.is_pro) return false;
      if (tier === "pro" && !p.is_pro) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "newest") return b.created_at.localeCompare(a.created_at);
      if (sort === "rating") return b.rating - a.rating;
      return b.view_count - a.view_count;
    });
  }, [data.prompts, query, category, model, tier, sort]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        className="glass glass-sheen rounded-[var(--glass-radius)] p-5 md:p-7"
      >
        <label className="glass-soft flex items-center gap-3 rounded-full px-5 py-3.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.search_placeholder ?? ""}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search prompts"
          />
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
            {results.length} results
          </span>
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            All categories
          </Chip>
          {data.categories.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="inline-flex items-center gap-2 pr-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <SlidersHorizontal className="size-3.5" /> Refine
          </span>
          <Chip active={tier === "all"} onClick={() => setTier("all")}>
            Any tier
          </Chip>
          <Chip active={tier === "free"} onClick={() => setTier("free")}>
            Free
          </Chip>
          <Chip active={tier === "pro"} onClick={() => setTier("pro")}>
            Pro
          </Chip>
          <span className="mx-1 h-5 w-px bg-border" />
          <Chip active={model === "all"} onClick={() => setModel("all")}>
            Any model
          </Chip>
          {models.map((m) => (
            <Chip key={m} active={model === m} onClick={() => setModel(m)}>
              {m}
            </Chip>
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          {(["trending", "newest", "rating"] as SortKey[]).map((s) => (
            <Chip key={s} active={sort === s} onClick={() => setSort(s)}>
              {s === "trending" ? "Most viewed" : s === "newest" ? "Newest" : "Top rated"}
            </Chip>
          ))}
        </div>
      </motion.div>

      {results.length ? (
        <div className="mt-8 grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              categoryLabel={categoryName(data, prompt.category_id)}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div className="glass mt-8 rounded-[var(--glass-radius)] p-12 text-center">
          <p className="font-display text-xl">Nothing matches yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword or clear a filter.
          </p>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full px-4 py-2 text-xs font-medium transition-all"
      style={
        active
          ? { background: "var(--gradient-primary)", color: "var(--primary-foreground)" }
          : { background: "oklch(1 0 0 / 7%)", color: "var(--muted-foreground)" }
      }
    >
      {children}
    </button>
  );
}