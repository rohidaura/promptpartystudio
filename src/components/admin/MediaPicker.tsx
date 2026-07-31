import { useState } from "react";
import { Field, Input, Button } from "./ui";
import { cn } from "@/lib/utils";

type Asset = { id: string; name: string; url: string; kind: string };

export function MediaPicker({
  label,
  media,
  value,
  onChange,
}: {
  label: string;
  media: Asset[];
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} hint="Pick from the media library or paste any URL.">
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/media/…" />
        <Button variant="ghost" type="button" onClick={() => setOpen((o) => !o)}>
          Library
        </Button>
      </div>
      {value ? (
        <div className="mt-2 h-28 w-full overflow-hidden rounded-2xl border border-white/10">
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      {open ? (
        <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto pr-1">
          {media.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onChange(m.url);
                setOpen(false);
              }}
              className={cn(
                "overflow-hidden rounded-xl border transition",
                value === m.url ? "border-primary" : "border-white/10 hover:border-white/30",
              )}
              title={m.name}
            >
              <img src={m.url} alt={m.name} className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </Field>
  );
}
