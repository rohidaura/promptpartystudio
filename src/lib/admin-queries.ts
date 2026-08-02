import { queryOptions } from "@tanstack/react-query";
import { getAdminData, getMyAccess } from "./admin.functions";
import type {
  Category,
  MediaItem,
  NavItem,
  PageSection,
  Prompt,
  Review,
} from "./cms-types";

export type AdminData = {
  settings: Record<string, Record<string, unknown>>;
  categories: Category[];
  prompts: Prompt[];
  reviews: Review[];
  navItems: NavItem[];
  sections: PageSection[];
  media: MediaItem[];
  events: { event_type: string; created_at: string }[];
};

export const adminQuery = queryOptions({
  queryKey: ["admin-data"],
  queryFn: () => getAdminData() as unknown as Promise<AdminData>,
  staleTime: 5_000,
});

export type StudioAccess = {
  userId: string;
  email: string | null;
  isAdmin: boolean;
  reason: string;
};

export const accessQuery = queryOptions({
  queryKey: ["my-access"],
  queryFn: () => getMyAccess() as unknown as Promise<StudioAccess>,
  staleTime: 60_000,
});
