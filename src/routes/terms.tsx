import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/cms-queries";
import { SiteChrome } from "@/components/site/SiteChrome";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: [
      { title: "Terms of Use — PromptVault" },
      {
        name: "description",
        content: "The terms that cover licensing, usage and redistribution of PromptVault prompts.",
      },
      { property: "og:title", content: "Terms of Use — PromptVault" },
      {
        property: "og:description",
        content: "Licensing and usage terms for prompts published on PromptVault.",
      },
    ],
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