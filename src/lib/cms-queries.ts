import { queryOptions } from "@tanstack/react-query";
import { getSiteData } from "./cms.functions";
import type { SiteData } from "./cms-types";

export const siteQuery = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData() as unknown as Promise<SiteData>,
  staleTime: 30_000,
});