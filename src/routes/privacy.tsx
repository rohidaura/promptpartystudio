import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/cms-queries";
import { SiteChrome } from "@/components/site/SiteChrome";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: [
      { title: "Privacy Policy — PromptVault" },
      {
        name: "description",
        content: "How PromptVault collects, stores and protects the data behind the prompt vault.",
      },
      { property: "og:title", content: "Privacy Policy — PromptVault" },
      {
        property: "og:description",
        content: "How PromptVault collects, stores and protects your data.",
      },
    ],
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