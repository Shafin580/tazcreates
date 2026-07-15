"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useSidebar } from "../ui/sidebar";

export function SidebarModeSelector() {
  const { state, setOpen } = useSidebar();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="hidden flex-col gap-4 lg:flex">
      <Label id={labelId}>{t("labels.sidebarMode")}</Label>
      <ToggleGroup
        aria-labelledby={labelId}
        value={state === "expanded" ? "full" : "centered"}
        type="single"
        onValueChange={(value) => {
          if (value) setOpen(value === "full");
        }}
        className="*:border-input w-full gap-4 *:rounded-md *:border">
        <ToggleGroupItem
          data-qa="theme-customizer.sidebar-mode.full"
          variant="outline"
          value="full">
          {t("options.default")}
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="centered"
          data-qa="theme-customizer.sidebar-mode.icon"
          className="data-[variant=outline]:border-l-1">
          {t("options.icon")}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
