import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/studio/dashboard")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/admin", replace: true });
  },
  component: () => null,
});
