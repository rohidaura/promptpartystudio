import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button, Field, Input, Panel, Select, Textarea, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useAdminData, useCms } from "@/components/admin/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentAdmin,
});

function ContentAdmin() {
  const data = useAdminData();
  const { saveMutation, deleteMutation, settingMutation } = useCms();
  const [hero, setHero] = useState<Record<string, unknown>>(data.settings.hero ?? {});
  const setHeroField = (k: string, v: unknown) => setHero((h) => ({ ...h, [k]: v }));

  const move = (id: string, table: "page_sections" | "nav_items", order: number) =>
    saveMutation.mutate({ table, values: { id, sort_order: order } });

  return (
    <div className="space-y-6">
      <Panel title="Hero" description="Everything above the fold on the homepage.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Eyebrow">
            <Input value={String(hero.eyebrow ?? "")} onChange={(e) => setHeroField("eyebrow", e.target.value)} />
          </Field>
          <Field label="Title">
            <Input value={String(hero.title ?? "")} onChange={(e) => setHeroField("title", e.target.value)} />
          </Field>
          <Field label="Description" className="lg:col-span-2">
            <Textarea
              value={String(hero.description ?? "")}
              onChange={(e) => setHeroField("description", e.target.value)}
            />
          </Field>
          <Field label="Primary CTA label">
            <Input
              value={String(hero.primary_cta_label ?? "")}
              onChange={(e) => setHeroField("primary_cta_label", e.target.value)}
            />
          </Field>
          <Field label="Primary CTA href">
            <Input
              value={String(hero.primary_cta_href ?? "")}
              onChange={(e) => setHeroField("primary_cta_href", e.target.value)}
            />
          </Field>
          <Field label="Secondary CTA label">
            <Input
              value={String(hero.secondary_cta_label ?? "")}
              onChange={(e) => setHeroField("secondary_cta_label", e.target.value)}
            />
          </Field>
          <Field label="Secondary CTA href">
            <Input
              value={String(hero.secondary_cta_href ?? "")}
              onChange={(e) => setHeroField("secondary_cta_href", e.target.value)}
            />
          </Field>
          <MediaPicker
            label="Left panel media"
            media={data.media}
            value={String(hero.left_media_url ?? "")}
            onChange={(v) => setHeroField("left_media_url", v)}
          />
          <MediaPicker
            label="Right panel media"
            media={data.media}
            value={String(hero.right_media_url ?? "")}
            onChange={(v) => setHeroField("right_media_url", v)}
          />
          <Field label="Right caption">
            <Input
              value={String(hero.right_caption ?? "")}
              onChange={(e) => setHeroField("right_caption", e.target.value)}
            />
          </Field>
          <MediaPicker
            label="Ambient background"
            media={data.media}
            value={String(hero.background_url ?? "")}
            onChange={(v) => setHeroField("background_url", v)}
          />
        </div>
        <div className="mt-5">
          <Button
            disabled={settingMutation.isPending}
            onClick={() => settingMutation.mutate({ key: "hero", value: hero })}
          >
            Save hero
          </Button>
        </div>
      </Panel>

      <Panel
        title="Homepage builder"
        description="Reorder, rename, hide or edit every section block."
      >
        <ul className="space-y-3">
          {data.sections.map((s, i) => (
            <SectionRow
              key={s.id}
              section={s}
              onSave={(values) => saveMutation.mutate({ table: "page_sections", values })}
              onDelete={() => deleteMutation.mutate({ table: "page_sections", id: s.id })}
              onUp={i > 0 ? () => move(s.id, "page_sections", s.sort_order - 1) : undefined}
              onDown={
                i < data.sections.length - 1
                  ? () => move(s.id, "page_sections", s.sort_order + 1)
                  : undefined
              }
            />
          ))}
        </ul>
      </Panel>

      <NavEditor
        items={data.navItems}
        onSave={(values) => saveMutation.mutate({ table: "nav_items", values })}
        onDelete={(id) => deleteMutation.mutate({ table: "nav_items", id })}
      />
    </div>
  );
}

function SectionRow({
  section,
  onSave,
  onDelete,
  onUp,
  onDown,
}: {
  section: { id: string; label: string; section_key: string; page_slug: string; is_visible: boolean; sort_order: number; content: Record<string, unknown> };
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
  onUp?: () => void;
  onDown?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [json, setJson] = useState(JSON.stringify(section.content ?? {}, null, 2));
  const [label, setLabel] = useState(section.label);
  const [error, setError] = useState<string | null>(null);

  return (
    <li className="glass-soft rounded-2xl p-3">
      <div className="flex items-center gap-2">
        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpen(!open)}>
          <p className="truncate text-sm">{section.label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {section.page_slug} · {section.section_key} · {section.is_visible ? "visible" : "hidden"}
          </p>
        </button>
        <Toggle
          label={section.is_visible ? "On" : "Off"}
          checked={section.is_visible}
          onChange={(v) => onSave({ id: section.id, is_visible: v })}
        />
        {onUp && (
          <Button variant="ghost" onClick={onUp} aria-label="Move up">
            <ArrowUp className="size-4" />
          </Button>
        )}
        {onDown && (
          <Button variant="ghost" onClick={onDown} aria-label="Move down">
            <ArrowDown className="size-4" />
          </Button>
        )}
        <Button variant="danger" onClick={onDelete} aria-label="Delete section">
          <Trash2 className="size-4" />
        </Button>
      </div>
      {open ? (
        <div className="mt-3 space-y-3">
          <Field label="Label">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
          <Field label="Content (JSON)" hint={error ?? "Headings, copy and options for this block."}>
            <Textarea
              className="min-h-40 font-mono text-xs"
              value={json}
              onChange={(e) => setJson(e.target.value)}
            />
          </Field>
          <Button
            onClick={() => {
              try {
                const parsed = JSON.parse(json);
                setError(null);
                onSave({ id: section.id, label, content: parsed });
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            Save section
          </Button>
        </div>
      ) : null}
    </li>
  );
}

function NavEditor({
  items,
  onSave,
  onDelete,
}: {
  items: { id: string; label: string; href: string; location: string; sort_order: number; is_visible: boolean }[];
  onSave: (values: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState({ label: "", href: "", location: "header", sort_order: 0 });

  return (
    <Panel title="Navigation & footer" description="Links shown in the floating nav and footer.">
      <ul className="mb-5 space-y-2">
        {items.map((n) => (
          <li key={n.id} className="glass-soft flex flex-wrap items-center gap-2 rounded-2xl p-2.5">
            <Input
              className="max-w-40"
              defaultValue={n.label}
              onBlur={(e) => e.target.value !== n.label && onSave({ id: n.id, label: e.target.value })}
            />
            <Input
              className="max-w-52"
              defaultValue={n.href}
              onBlur={(e) => e.target.value !== n.href && onSave({ id: n.id, href: e.target.value })}
            />
            <Select
              className="max-w-32"
              defaultValue={n.location}
              onChange={(e) => onSave({ id: n.id, location: e.target.value })}
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
              <option value="legal">Legal</option>
            </Select>
            <Input
              type="number"
              className="max-w-20"
              defaultValue={n.sort_order}
              onBlur={(e) => onSave({ id: n.id, sort_order: Number(e.target.value) })}
            />
            <Toggle
              label={n.is_visible ? "Visible" : "Hidden"}
              checked={n.is_visible}
              onChange={(v) => onSave({ id: n.id, is_visible: v })}
            />
            <Button variant="danger" onClick={() => onDelete(n.id)} aria-label="Delete link">
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Label">
          <Input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
        </Field>
        <Field label="Href">
          <Input value={draft.href} onChange={(e) => setDraft({ ...draft, href: e.target.value })} />
        </Field>
        <Field label="Location">
          <Select
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          >
            <option value="header">Header</option>
            <option value="footer">Footer</option>
            <option value="legal">Legal</option>
          </Select>
        </Field>
        <Button
          disabled={!draft.label || !draft.href}
          onClick={() => {
            onSave({ ...draft, sort_order: items.length });
            setDraft({ label: "", href: "", location: "header", sort_order: 0 });
          }}
        >
          <Plus className="size-4" /> Add link
        </Button>
      </div>
    </Panel>
  );
}
