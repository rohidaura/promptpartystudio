import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/cms-queries";
import { SiteChrome } from "@/components/site/SiteChrome";
import { LegalPage } from "@/components/site/LegalPage";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: ({ loaderData }) => ({
    meta: buildMeta(loaderData?.settings, {
      suffix: "Privacy Policy",
      description: "How we collect, store and protect the data behind this prompt library.",
    }),
  }),
  component: () => {
    const { data } = useSuspenseQuery(siteQuery);
    return (
      <SiteChrome data={data}>
        <LegalPage data={data} page="privacy" />
      </SiteChrome>
    );
  },
});