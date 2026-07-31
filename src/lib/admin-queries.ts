import { queryOptions } from "@tanstack/react-query";
import { getAdminData, getMyAccess } from "./admin.functions";

export type AdminData = Awaited<ReturnType<typeof getAdminData>>;

export const adminQuery = queryOptions({
  queryKey: ["admin-data"],
  queryFn: () => getAdminData(),
  staleTime: 5_000,
});

export const accessQuery = queryOptions({
  queryKey: ["my-access"],
  queryFn: () => getMyAccess(),
  staleTime: 60_000,
});
