import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Input, Panel, Textarea, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useAdminData, useCms } from "@/components/admin/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: ReviewsAdmin,
});

type Draft = Record<string, unknown>;

const blank: Draft = {
  author_name: "",
  author_role: "",
  avatar_url: "",
  rating: 5,
  body: "",
  is_approved: true,
  is_featured: false,
  sort_order: 0,
};

function ReviewsAdmin() {
  const data = useAdminData();
  const { saveMutation, deleteMutation } = useCms();
  const [draft, setDraft] = useState<Draft | null>(null);
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...(d ?? {}), [k]: v }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
      <Panel
        title="Reviews"
        description="Approve, feature or remove customer testimonials."
        action={
          <Button onClick={() => setDraft({ ...blank, sort_order: data.reviews.length })}>
            <Plus className="size-4" /> New
          </Button>
        }
      >
        <ul className="divide-y divide-white/5">
          {data.reviews.map((r) => (
            <li key={r.id} className="flex items-start gap-3 py-3">
              <button type="button" onClick={() => setDraft({ ...r })} className="min-w-0 flex-1 text-left">
                <p className="text-sm">
                  {r.author_name} · {"★".repeat(r.rating)}
                </p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{r.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.is_approved ? "approved" : "pending"}
                  {r.is_featured ? " · featured" : ""}
                </p>
              </button>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  onClick={() =>
                    saveMutation.mutate({
                      table: "reviews",
                      values: { id: r.id, is_approved: !r.is_approved },
                    })
                  }
                >
                  {r.is_approved ? "Unapprove" : "Approve"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteMutation.mutate({ table: "reviews", id: r.id })}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {draft ? (
        <Panel title={draft.id ? "Edit review" : "New review"}>
          <div className="space-y-4">
            <Field label="Author name">
              <Input
                value={String(draft.author_name ?? "")}
                onChange={(e) => set("author_name", e.target.value)}
              />
            </Field>
            <Field label="Author role">
              <Input
                value={String(draft.author_role ?? "")}
                onChange={(e) => set("author_role", e.target.value)}
              />
            </Field>
            <MediaPicker
              label="Avatar"
              media={data.media}
              value={String(draft.avatar_url ?? "")}
              onChange={(v) => set("avatar_url", v)}
            />
            <Field label="Rating (1-5)">
              <Input
                type="number"
                min={1}
                max={5}
                value={Number(draft.rating ?? 5)}
                onChange={(e) => set("rating", Number(e.target.value))}
              />
            </Field>
            <Field label="Body">
              <Textarea value={String(draft.body ?? "")} onChange={(e) => set("body", e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Toggle
                label="Approved"
                checked={Boolean(draft.is_approved)}
                onChange={(v) => set("is_approved", v)}
              />
              <Toggle
                label="Featured"
                checked={Boolean(draft.is_featured)}
                onChange={(v) => set("is_featured", v)}
              />
            </div>
            <Field label="Sort order">
              <Input
                type="number"
                value={Number(draft.sort_order ?? 0)}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
            </Field>
            <div className="flex gap-2 pt-2">
              <Button
                disabled={saveMutation.isPending}
                onClick={() =>
                  saveMutation.mutate(
                    { table: "reviews", values: draft },
                    { onSuccess: () => setDraft(null) },
                  )
                }
              >
                Save review
              </Button>
              <Button variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
