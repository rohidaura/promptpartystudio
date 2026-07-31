import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Input, Panel, Select, Textarea, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useAdminData, useCms } from "@/components/admin/useAdmin";
import { parseTags, slugify } from "@/lib/admin-helpers";

export const Route = createFileRoute("/_authenticated/admin/prompts")({
  component: PromptsAdmin,
});

type Draft = Record<string, unknown>;

const blank: Draft = {
  title: "",
  slug: "",
  description: "",
  prompt_text: "",
  category_id: null,
  ai_model: "",
  tags: [],
  preview_image_url: "",
  before_image_url: "",
  after_image_url: "",
  video_url: "",
  is_featured: false,
  is_trending: false,
  is_pro: false,
  is_published: true,
  sort_order: 0,
  seo_title: "",
  seo_description: "",
};

function PromptsAdmin() {
  const data = useAdminData();
  const { saveMutation, deleteMutation } = useCms();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [q, setQ] = useState("");
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...(d ?? {}), [k]: v }));

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data.prompts;
    return data.prompts.filter((p) =>
      [p.title, p.description, p.ai_model, p.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [data.prompts, q]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
      <Panel
        title="Prompts"
        description={`${data.prompts.length} prompts in the library.`}
        action={
          <Button onClick={() => setDraft({ ...blank, sort_order: data.prompts.length })}>
            <Plus className="size-4" /> New
          </Button>
        }
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search prompts…"
          className="mb-4"
        />
        <ul className="divide-y divide-white/5">
          {list.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <div className="glass-soft size-11 shrink-0 overflow-hidden rounded-2xl">
                {p.preview_image_url ? (
                  <img src={p.preview_image_url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...p })}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.is_published ? "published" : "draft"}
                  {p.is_featured ? " · featured" : ""}
                  {p.is_pro ? " · pro" : ""} · {p.view_count} views
                </p>
              </button>
              <Button
                variant="danger"
                onClick={() => deleteMutation.mutate({ table: "prompts", id: p.id })}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </Panel>

      {draft ? (
        <Panel title={draft.id ? "Edit prompt" : "New prompt"}>
          <div className="space-y-4">
            <Field label="Title">
              <Input
                value={String(draft.title ?? "")}
                onChange={(e) => {
                  set("title", e.target.value);
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
            <Field label="Prompt text">
              <Textarea
                className="min-h-48 font-mono text-xs"
                value={String(draft.prompt_text ?? "")}
                onChange={(e) => set("prompt_text", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <Select
                  value={String(draft.category_id ?? "")}
                  onChange={(e) => set("category_id", e.target.value || null)}
                >
                  <option value="">Uncategorised</option>
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="AI model">
                <Input
                  value={String(draft.ai_model ?? "")}
                  onChange={(e) => set("ai_model", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Tags" hint="Comma separated">
              <Input
                value={(draft.tags as string[] | undefined)?.join(", ") ?? ""}
                onChange={(e) => set("tags", parseTags(e.target.value))}
              />
            </Field>
            <MediaPicker
              label="Preview image"
              media={data.media}
              value={String(draft.preview_image_url ?? "")}
              onChange={(v) => set("preview_image_url", v)}
            />
            <MediaPicker
              label="Before image"
              media={data.media}
              value={String(draft.before_image_url ?? "")}
              onChange={(v) => set("before_image_url", v)}
            />
            <MediaPicker
              label="After image"
              media={data.media}
              value={String(draft.after_image_url ?? "")}
              onChange={(v) => set("after_image_url", v)}
            />
            <Field label="Video URL">
              <Input
                value={String(draft.video_url ?? "")}
                onChange={(e) => set("video_url", e.target.value)}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Toggle
                label="Published"
                checked={Boolean(draft.is_published)}
                onChange={(v) => set("is_published", v)}
              />
              <Toggle
                label="Featured"
                checked={Boolean(draft.is_featured)}
                onChange={(v) => set("is_featured", v)}
              />
              <Toggle
                label="Trending"
                checked={Boolean(draft.is_trending)}
                onChange={(v) => set("is_trending", v)}
              />
              <Toggle label="Pro" checked={Boolean(draft.is_pro)} onChange={(v) => set("is_pro", v)} />
            </div>
            <Field label="Sort order">
              <Input
                type="number"
                value={Number(draft.sort_order ?? 0)}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
            </Field>
            <Field label="SEO title">
              <Input
                value={String(draft.seo_title ?? "")}
                onChange={(e) => set("seo_title", e.target.value)}
              />
            </Field>
            <Field label="SEO description">
              <Textarea
                value={String(draft.seo_description ?? "")}
                onChange={(e) => set("seo_description", e.target.value)}
              />
            </Field>
            <div className="flex gap-2 pt-2">
              <Button
                disabled={saveMutation.isPending}
                onClick={() =>
                  saveMutation.mutate(
                    { table: "prompts", values: draft },
                    { onSuccess: () => setDraft(null) },
                  )
                }
              >
                Save prompt
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
