import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/cms-queries";
import { SiteChrome } from "@/components/site/SiteChrome";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reviews } from "@/components/site/Reviews";
import { ContactSection } from "@/components/site/ContactSection";
import { sectionCopy } from "@/lib/site-helpers";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/reviews")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: ({ loaderData }) => ({
    meta: buildMeta(loaderData?.settings, {
      suffix: "Reviews",
      description:
        "Ratings and first-hand notes from designers, founders and filmmakers shipping work with these prompts.",
    }),
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data } = useSuspenseQuery(siteQuery);
  const copy = sectionCopy(data, "reviews");
  const reviews = data.reviews.filter((r) => r.is_approved);

  return (
    <SiteChrome data={data}>
      <section className="shell pt-32 md:pt-40">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <div className="mt-9">
          <Reviews reviews={reviews} />
        </div>
      </section>
      <section className="shell pt-24 md:pt-32">
        <ContactSection settings={data.settings} />
      </section>
    </SiteChrome>
  );
}