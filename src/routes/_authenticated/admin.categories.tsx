import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Input, Panel, Textarea, Toggle } from "@/components/admin/ui";
import { useAdminData, useCms } from "@/components/admin/useAdmin";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { slugify } from "@/lib/admin-helpers";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoriesAdmin,
});

type Draft = Record<string, unknown>;

const blank: Draft = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  image_url: "",
  sort_order: 0,
  is_visible: true,
};

function CategoriesAdmin() {
  const data = useAdminData();
  const { saveMutation, deleteMutation } = useCms();
  const [draft, setDraft] = useState<Draft | null>(null);
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...(d ?? {}), [k]: v }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Panel
        title="Categories"
        description="Order, visibility and cover art for every collection."
        action={
          <Button onClick={() => setDraft({ ...blank, sort_order: data.categories.length })}>
            <Plus className="size-4" /> New
          </Button>
        }
      >
        <ul className="divide-y divide-white/5">
          {data.categories.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              <div className="glass-soft size-11 shrink-0 overflow-hidden rounded-2xl">
                {c.image_url ? (
                  <img src={c.image_url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...c })}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /{c.slug} · {c.is_visible ? "visible" : "hidden"}
                </p>
              </button>
              <Button
                variant="danger"
                onClick={() => deleteMutation.mutate({ table: "categories", id: c.id })}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </Panel>

      {draft ? (
        <Panel title={draft.id ? "Edit category" : "New category"}>
          <div className="space-y-4">
            <Field label="Name">
              <Input
                value={String(draft.name ?? "")}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!draft.id) set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Slug">
              <Input value={String(draft.slug ?? "")} onChange={(e) => set("slug", e.target.value)} />
            </Field>
            <Field label="Description">
              <Textarea
                value={String(draft.description ?? "")}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <Field label="Icon (lucide name)">
              <Input value={String(draft.icon ?? "")} onChange={(e) => set("icon", e.target.value)} />
            </Field>
            <MediaPicker
              label="Cover image"
              media={data.media}
              value={String(draft.image_url ?? "")}
              onChange={(v) => set("image_url", v)}
            />
            <Field label="Sort order">
              <Input
                type="number"
                value={Number(draft.sort_order ?? 0)}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
            </Field>
            <Toggle
              label="Visible on site"
              checked={Boolean(draft.is_visible)}
              onChange={(v) => set("is_visible", v)}
            />
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() =>
                  saveMutation.mutate(
                    { table: "categories", values: draft },
                    { onSuccess: () => setDraft(null) },
                  )
                }
                disabled={saveMutation.isPending}
              >
                Save category
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
