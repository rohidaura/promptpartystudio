import { createFileRoute } from "@tanstack/react-router";
import { Button, Field, Input, Panel, Textarea } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useAdminData, useCms, useSyncedState } from "@/components/admin/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const data = useAdminData();
  const { settingMutation } = useCms();
  const [site, setSite] = useSyncedState<Record<string, unknown>>(data.settings.site ?? {});
  const [seo, setSeo] = useSyncedState<Record<string, unknown>>(data.settings.seo ?? {});
  const [contact, setContact] = useSyncedState<Record<string, unknown>>(data.settings.contact ?? {});

  return (
    <div className="space-y-6">
      <Panel
        title="Brand"
        description="Identity used across nav, footer and metadata."
        action={
          <Button
            disabled={settingMutation.isPending}
            onClick={() => settingMutation.mutate({ key: "site", value: site })}
          >
            Save brand
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ["name", "Site name"],
            ["logo_text", "Logo text"],
            ["tagline", "Tagline"],
            ["instagram_url", "Instagram URL"],
            ["contact_email", "Contact email"],
            ["copyright", "Copyright line"],
          ].map(([k, label]) => (
            <Field key={k} label={label}>
              <Input
                value={String(site[k] ?? "")}
                onChange={(e) => setSite({ ...site, [k]: e.target.value })}
              />
            </Field>
          ))}
          <MediaPicker
            label="Logo mark"
            media={data.media}
            value={String(site.logo_mark_url ?? "")}
            onChange={(v) => setSite({ ...site, logo_mark_url: v })}
          />
        </div>
      </Panel>

      <Panel
        title="Contact block"
        description="Copy for the contact section on the homepage."
        action={
          <Button
            disabled={settingMutation.isPending}
            onClick={() => settingMutation.mutate({ key: "contact", value: contact })}
          >
            Save contact
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Title">
            <Input
              value={String(contact.title ?? "")}
              onChange={(e) => setContact({ ...contact, title: e.target.value })}
            />
          </Field>
          <Field label="CTA label">
            <Input
              value={String(contact.cta_label ?? "")}
              onChange={(e) => setContact({ ...contact, cta_label: e.target.value })}
            />
          </Field>
          <Field label="CTA href">
            <Input
              value={String(contact.cta_href ?? "")}
              onChange={(e) => setContact({ ...contact, cta_href: e.target.value })}
            />
          </Field>
          <Field label="Description" className="lg:col-span-2">
            <Textarea
              value={String(contact.description ?? "")}
              onChange={(e) => setContact({ ...contact, description: e.target.value })}
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="SEO & code"
        description="Metadata defaults, analytics and custom CSS."
        action={
          <Button
            disabled={settingMutation.isPending}
            onClick={() => settingMutation.mutate({ key: "seo", value: seo })}
          >
            Save SEO
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Default title">
            <Input
              value={String(seo.default_title ?? "")}
              onChange={(e) => setSeo({ ...seo, default_title: e.target.value })}
            />
          </Field>
          <Field label="Google Analytics ID">
            <Input
              value={String(seo.ga_id ?? "")}
              onChange={(e) => setSeo({ ...seo, ga_id: e.target.value })}
            />
          </Field>
          <Field label="Default description" className="lg:col-span-2">
            <Textarea
              value={String(seo.default_description ?? "")}
              onChange={(e) => setSeo({ ...seo, default_description: e.target.value })}
            />
          </Field>
          <MediaPicker
            label="Open Graph image"
            media={data.media}
            value={String(seo.og_image ?? "")}
            onChange={(v) => setSeo({ ...seo, og_image: v })}
          />
          <Field label="Favicon URL">
            <Input
              value={String(seo.favicon ?? "")}
              onChange={(e) => setSeo({ ...seo, favicon: e.target.value })}
            />
          </Field>
          <Field label="Custom CSS" className="lg:col-span-2">
            <Textarea
              className="min-h-40 font-mono text-xs"
              value={String(seo.custom_css ?? "")}
              onChange={(e) => setSeo({ ...seo, custom_css: e.target.value })}
            />
          </Field>
        </div>
      </Panel>
    </div>
  );
}
