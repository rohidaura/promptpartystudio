import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accessQuery } from "@/lib/admin-queries";
import { supabase } from "@/integrations/supabase/client";
import { Button, Panel } from "@/components/admin/ui";

export const Route = createFileRoute("/access-denied")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Access denied" },
      { name: "description", content: "This account does not have studio access." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Access denied" },
      { property: "og:description", content: "This account does not have studio access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccessDenied,
});

function AccessDenied() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({ ...accessQuery, retry: false });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-20">
      <div className="aurora" aria-hidden />
      <div className="w-full max-w-md">
        <Panel
          title="Access denied"
          description="This account isn’t on the studio admin list."
        >
          <p className="text-sm text-muted-foreground">
            {data?.email
              ? `Signed in as ${data.email}. Ask an existing administrator to add this email to the admin list, or sign in with an admin account.`
              : "Sign in with an administrator account to reach the studio."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={signOut}>
              Sign in with another account
            </Button>
            <a
              href="/"
              className="rounded-2xl px-4 py-2.5 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Back to site
            </a>
          </div>
        </Panel>
      </div>
    </main>
  );
}
