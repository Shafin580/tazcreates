"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useThemeConfig } from "../active-theme";
import type { ThemeType } from "@/lib/themes";

export function ContentLayoutSelector() {
  const { theme, setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="hidden flex-col gap-4 lg:flex">
      <Label id={labelId}>{t("labels.contentLayout")}</Label>
      <ToggleGroup
        aria-labelledby={labelId}
        value={theme.contentLayout}
        type="single"
        onValueChange={(value) => {
          if (value) {
            setTheme({ ...theme, contentLayout: value as ThemeType["contentLayout"] });
          }
        }}
        className="*:border-input w-full gap-4 *:rounded-md *:border">
        <ToggleGroupItem
          data-qa="theme-customizer.content-layout.full"
          variant="outline"
          value="full">
          {t("options.full")}
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="centered"
          data-qa="theme-customizer.content-layout.centered"
          className="data-[variant=outline]:border-l-1">
          {t("options.centered")}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
