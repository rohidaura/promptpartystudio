import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { siteQuery } from "@/lib/cms-queries";
import type { Prompt } from "@/lib/cms-types";
import { SiteChrome } from "@/components/site/SiteChrome";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PromptCard } from "@/components/site/PromptCard";
import { PromptModal } from "@/components/site/PromptModal";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(siteQuery);
    const category = data.categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category, settings: data.settings };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: buildMeta(undefined, { suffix: "Category not found", noindex: true }) };
    }
    return {
      meta: buildMeta(loaderData.settings, {
        suffix: `${loaderData.category.name} prompts`,
        description:
          loaderData.category.description ??
          `Curated ${loaderData.category.name.toLowerCase()} prompts, tested and ready to paste.`,
      }),
    };
  },
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
});

function CategoryPage() {
  const { data } = useSuspenseQuery(siteQuery);
  const { category } = Route.useLoaderData();
  const [active, setActive] = useState<Prompt | null>(null);
  const prompts = data.prompts.filter((p) => p.category_id === category.id);

  return (
    <SiteChrome data={data}>
      <section className="shell pt-32 md:pt-40">
        <SectionHeading
          eyebrow="Category"
          title={category.name}
          description={category.description ?? undefined}
        />
        <div className="mt-10 grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              categoryLabel={category.name}
              onOpen={setActive}
            />
          ))}
        </div>
      </section>

      <PromptModal
        prompt={active}
        data={data}
        onClose={() => setActive(null)}
        onSelect={setActive}
      />
    </SiteChrome>
  );
}

function CategoryNotFound() {
  return (
    <section className="shell flex min-h-screen items-center justify-center">
      <div className="glass rounded-[var(--glass-radius)] p-12 text-center">
        <h1 className="text-2xl">This category doesn't exist</h1>
        <p className="mt-2 text-sm text-muted-foreground">Head back to the vault to keep browsing.</p>
      </div>
    </section>
  );
}