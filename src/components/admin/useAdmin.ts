import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { adminQuery } from "@/lib/admin-queries";
import { deleteRow, saveRow, saveSetting } from "@/lib/admin.functions";

export function useAdminData() {
  return useSuspenseQuery(adminQuery).data;
}

/**
 * Local editor state that re-syncs whenever the CMS record changes on the
 * server (after a save or a refetch), so panels never show stale values.
 */
export function useSyncedState<T>(remote: T) {
  const [value, setValue] = useState<T>(remote);
  const snapshot = useRef(JSON.stringify(remote));
  useEffect(() => {
    const next = JSON.stringify(remote);
    if (next !== snapshot.current) {
      snapshot.current = next;
      setValue(remote);
    }
  }, [remote]);
  return [value, setValue] as const;
}

export function useCms() {
  const qc = useQueryClient();
  const save = useServerFn(saveRow);
  const remove = useServerFn(deleteRow);
  const setting = useServerFn(saveSetting);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-data"] });
    qc.invalidateQueries({ queryKey: ["site-data"] });
  };

  const saveMutation = useMutation({
    mutationFn: (vars: { table: string; values: Record<string, unknown> }) =>
      save({ data: vars as never }),
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { table: string; id: string }) => remove({ data: vars as never }),
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const settingMutation = useMutation({
    mutationFn: (vars: { key: string; value: Record<string, unknown> }) =>
      setting({ data: vars }),
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { saveMutation, deleteMutation, settingMutation };
}
