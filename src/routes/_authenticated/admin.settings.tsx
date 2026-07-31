import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Field, Input, Panel, Textarea } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useAdminData, useCms } from "@/components/admin/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin;
});

function SettingsAdmin() {
  return null;
}
