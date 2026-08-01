import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/cms-queries";
import { SiteChrome } from "@/components/site/SiteChrome";
import { LegalPage } from "@/components/site/LegalPage";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: ({ loaderData }) => ({
    meta: buildMeta(loaderData?.settings, {
      suffix: "Terms of Use",
      description: "The terms covering licensing, usage and redistribution of these prompts.",
    }),
  }),
  component: () => {
    const { data } = useSuspenseQuery(siteQuery);
    return (
      <SiteChrome data={data}>
        <LegalPage data={data} page="terms" />
      </SiteChrome>
    );
  },
});