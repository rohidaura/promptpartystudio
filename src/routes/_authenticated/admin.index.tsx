import { createFileRoute } from "@tanstack/react-router";
import { Panel, Stat } from "@/components/admin/ui";
import { useAdminData } from "@/components/admin/useAdmin";
import { compactNumber } from "@/lib/site-helpers";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const data = useAdminData();
  const views = data.prompts.reduce((n, p) => n + p.view_count, 0);
  const copies = data.prompts.reduce((n, p) => n + p.copy_count, 0);
  const top = [...data.prompts].sort((a, b) => b.view_count - a.view_count).slice(0, 6);
  const pending = data.reviews.filter((r) => !r.is_approved);

  return (
    <div className="space-y-6">
      <Panel title="Overview" description="Live numbers straight from your content database.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Prompts" value={data.prompts.length} />
          <Stat label="Categories" value={data.categories.length} />
          <Stat label="Total views" value={compactNumber(views)} />
          <Stat label="Total copies" value={compactNumber(copies)} />
          <Stat label="Published" value={data.prompts.filter((p) => p.is_published).length} />
          <Stat label="Featured" value={data.prompts.filter((p) => p.is_featured).length} />
          <Stat label="Media assets" value={data.media.length} />
          <Stat label="Reviews pending" value={pending.length} />
        </div>
      </Panel>

      <Panel title="Most viewed prompts">
        <ul className="divide-y divide-white/5">
          {top.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.ai_model ?? "—"}</p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">
                {compactNumber(p.view_count)} views · {compactNumber(p.copy_count)} copies
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
