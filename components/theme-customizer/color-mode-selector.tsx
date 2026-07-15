"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useTheme } from "next-themes";

export function ColorModeSelector() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <Label id={labelId}>{t("labels.colorMode")}</Label>
      <ToggleGroup
        aria-labelledby={labelId}
        value={resolvedTheme}
        type="single"
        onValueChange={(value) => {
          if (value) setTheme(value);
        }}
        className="*:border-input w-full gap-4 *:rounded-md *:border">
        <ToggleGroupItem
          data-qa="theme-customizer.color-mode.light"
          variant="outline"
          value="light">
          {t("options.light")}
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="dark"
          data-qa="theme-customizer.color-mode.dark"
          className="data-[variant=outline]:border-l-1">
          {t("options.dark")}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
