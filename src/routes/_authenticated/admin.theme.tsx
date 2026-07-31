import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Field, Input, Panel } from "@/components/admin/ui";
import { useAdminData, useCms } from "@/components/admin/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/theme")({
  component: ThemeAdmin,
});

const numbers: { key: string; label: string; min: number; max: number; step: number }[] = [
  { key: "glass_opacity", label: "Glass opacity", min: 0, max: 1, step: 0.01 },
  { key: "glass_blur", label: "Glass blur (px)", min: 0, max: 120, step: 1 },
  { key: "glass_border_opacity", label: "Border opacity", min: 0, max: 1, step: 0.01 },
  { key: "radius", label: "Corner radius (px)", min: 0, max: 60, step: 1 },
  { key: "container_width", label: "Container width (px)", min: 900, max: 1800, step: 10 },
  { key: "animation_speed", label: "Motion scale", min: 0.2, max: 2, step: 0.05 },
  { key: "shadow_strength", label: "Shadow strength", min: 0, max: 2, step: 0.05 },
];

const colors = [
  { key: "primary", label: "Primary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
];

function ThemeAdmin() {
  const data = useAdminData();
  const { settingMutation } = useCms();
  const [theme, setTheme] = useState<Record<string, unknown>>(data.settings.theme ?? {});
  const set = (k: string, v: unknown) => setTheme((t) => ({ ...t, [k]: v }));

  return (
    <Panel
      title="Theme customizer"
      description="Design tokens applied live across the entire site."
      action={
        <Button
          disabled={settingMutation.isPending}
          onClick={() => settingMutation.mutate({ key: "theme", value: theme })}
        >
          Save theme
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {colors.map((c) => (
          <Field key={c.key} label={c.label} hint="Any CSS colour, e.g. oklch(0.7 0.18 285)">
            <div className="flex items-center gap-3">
              <span
                className="size-9 shrink-0 rounded-xl border border-white/10"
                style={{ background: String(theme[c.key] ?? "transparent") }}
              />
              <Input value={String(theme[c.key] ?? "")} onChange={(e) => set(c.key, e.target.value)} />
            </div>
          </Field>
        ))}
        <Field label="Display font">
          <Input value={String(theme.font_display ?? "")} onChange={(e) => set("font_display", e.target.value)} />
        </Field>
        <Field label="Body font">
          <Input value={String(theme.font_body ?? "")} onChange={(e) => set("font_body", e.target.value)} />
        </Field>
        {numbers.map((n) => (
          <Field key={n.key} label={`${n.label} — ${theme[n.key] ?? "—"}`}>
            <input
              type="range"
              min={n.min}
              max={n.max}
              step={n.step}
              value={Number(theme[n.key] ?? n.min)}
              onChange={(e) => set(n.key, Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </Field>
        ))}
      </div>
    </Panel>
  );
}
