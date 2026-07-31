import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, Field, Input, Panel, Select } from "@/components/admin/ui";
import { useAdminData, useCms } from "@/components/admin/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

function MediaAdmin() {
  const data = useAdminData();
  const { saveMutation, deleteMutation } = useCms();
  const [form, setForm] = useState({ name: "", url: "", kind: "image", folder: "general", alt_text: "" });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Panel title="Media library" description="Every asset available to the whole CMS.">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.media.map((m) => (
            <figure key={m.id} className="glass-soft overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden">
                {m.kind === "video" ? (
                  <video src={m.url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={m.url} alt={m.alt_text ?? m.name} className="h-full w-full object-cover" />
                )}
              </div>
              <figcaption className="flex items-center justify-between gap-2 p-2.5">
                <span className="truncate text-xs">{m.name}</span>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate({ table: "media", id: m.id })}
                  className="text-muted-foreground transition hover:text-destructive"
                  aria-label={`Delete ${m.name}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </Panel>

      <Panel title="Register asset" description="Add an image or video by URL.">
        <div className="space-y-4">
          <Field label="Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="URL">
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </Field>
          <Field label="Kind">
            <Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </Select>
          </Field>
          <Field label="Folder">
            <Input value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })} />
          </Field>
          <Field label="Alt text">
            <Input
              value={form.alt_text}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
            />
          </Field>
          <Button
            disabled={!form.url || !form.name || saveMutation.isPending}
            onClick={() =>
              saveMutation.mutate(
                { table: "media", values: form },
                {
                  onSuccess: () =>
                    setForm({ name: "", url: "", kind: "image", folder: "general", alt_text: "" }),
                },
              )
            }
          >
            Add to library
          </Button>
        </div>
      </Panel>
    </div>
  );
}
