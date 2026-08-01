import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { siteQuery } from "@/lib/cms-queries";
import type { Category, Prompt } from "@/lib/cms-types";
import { ThemeVars } from "@/components/site/ThemeVars";
import { Backdrop } from "@/components/site/Backdrop";
import { FloatingNav } from "@/components/site/FloatingNav";
import { Hero } from "@/components/site/Hero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Carousel } from "@/components/site/Carousel";
import { PromptCard } from "@/components/site/PromptCard";
import { Categories } from "@/components/site/Categories";
import { PromptExplorer } from "@/components/site/PromptExplorer";
import { Reviews } from "@/components/site/Reviews";
import { ContactSection } from "@/components/site/ContactSection";
import { PromptModal } from "@/components/site/PromptModal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { categoryName, sectionCopy, sectionOf } from "@/lib/site-helpers";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: ({ loaderData }) => ({ meta: buildMeta(loaderData?.settings) }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(siteQuery);
  const [active, setActive] = useState<Prompt | null>(null);
  const [spotlight, setSpotlight] = useState<Category | null>(null);

  const header = data.navItems.filter((i) => i.location === "header" && i.is_visible);
  const featured = data.prompts.filter((p) => p.is_featured);
  const trending = data.prompts.filter((p) => p.is_trending);
  const reviews = data.reviews.filter((r) => r.is_approved);

  const featuredCopy = sectionCopy(data, "featured");
  const categoriesCopy = sectionCopy(data, "categories");
  const trendingCopy = sectionCopy(data, "trending");
  const browseCopy = sectionCopy(data, "browse");
  const reviewsCopy = sectionCopy(data, "reviews");

  return (
    <>
      <ThemeVars settings={data.settings} />
      <Backdrop imageUrl={data.settings.hero?.background_url} />
      <FloatingNav items={header} settings={data.settings} />

      <main>
        <Hero settings={data.settings} />

        {sectionOf(data, "featured") && featured.length ? (
          <section id="featured" className="shell pt-24 md:pt-32">
            <SectionHeading
              eyebrow={featuredCopy.eyebrow}
              title={featuredCopy.title}
              description={featuredCopy.description}
            />
            <div className="mt-9">
              <Carousel ariaLabel="Featured prompts">
                {featured.map((prompt) => (
                  <div key={prompt.id} className="snap-start">
                    <PromptCard
                      prompt={prompt}
                      categoryLabel={categoryName(data, prompt.category_id)}
                      onOpen={setActive}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </section>
        ) : null}

        {sectionOf(data, "categories") && data.categories.length ? (
          <section id="categories" className="shell pt-24 md:pt-32">
            <SectionHeading
              eyebrow={categoriesCopy.eyebrow}
              title={categoriesCopy.title}
              description={categoriesCopy.description}
              action={
                spotlight ? (
                  <button
                    type="button"
                    onClick={() => setSpotlight(null)}
                    className="glass-soft rounded-full px-4 py-2 text-xs"
                  >
                    Clear “{spotlight.name}”
                  </button>
                ) : null
              }
            />
            <div className="mt-9">
              <Categories data={data} onSelect={setSpotlight} />
            </div>

            {spotlight ? (
              <div className="mt-6 grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.prompts
                  .filter((p) => p.category_id === spotlight.id)
                  .map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      categoryLabel={spotlight.name}
                      onOpen={setActive}
                    />
                  ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {sectionOf(data, "trending") && trending.length ? (
          <section id="trending" className="shell pt-24 md:pt-32">
            <SectionHeading
              eyebrow={trendingCopy.eyebrow}
              title={trendingCopy.title}
              description={trendingCopy.description}
            />
            <div className="mt-9">
              <Carousel ariaLabel="Trending prompts">
                {trending.map((prompt) => (
                  <div key={prompt.id} className="snap-start">
                    <PromptCard
                      prompt={prompt}
                      categoryLabel={categoryName(data, prompt.category_id)}
                      onOpen={setActive}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </section>
        ) : null}

        {sectionOf(data, "browse") ? (
          <section id="browse" className="shell pt-24 md:pt-32">
            <SectionHeading
              eyebrow={browseCopy.eyebrow}
              title={browseCopy.title}
              description={browseCopy.description}
            />
            <div className="mt-9">
              <PromptExplorer data={data} copy={browseCopy} onOpen={setActive} />
            </div>
          </section>
        ) : null}

        {sectionOf(data, "reviews") && reviews.length ? (
          <section id="reviews" className="shell pt-24 md:pt-32">
            <SectionHeading
              eyebrow={reviewsCopy.eyebrow}
              title={reviewsCopy.title}
              description={reviewsCopy.description}
            />
            <div className="mt-9">
              <Reviews reviews={reviews} />
            </div>
          </section>
        ) : null}

        <section id="contact" className="shell pt-24 md:pt-32">
          <ContactSection settings={data.settings} />
        </section>
      </main>

      <SiteFooter items={data.navItems} settings={data.settings} />

      <PromptModal
        prompt={active}
        data={data}
        onClose={() => setActive(null)}
        onSelect={setActive}
      />
    </>
  );
}