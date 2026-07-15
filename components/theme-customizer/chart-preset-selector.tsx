"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { CHART_THEMES, type ThemeType } from "@/lib/themes";
import { useThemeConfig } from "../active-theme";

export function ChartPresetSelector() {
  const { theme, setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <Label id={labelId}>{t("labels.chartPreset")}</Label>
      <Select
        value={theme.chartPreset}
        onValueChange={(value) =>
          setTheme({ ...theme, chartPreset: value as ThemeType["chartPreset"] })
        }>
        <SelectTrigger
          aria-labelledby={labelId}
          className="w-full"
          data-qa="theme-customizer.chart-preset.trigger">
          <SelectValue placeholder={t("placeholders.theme")} />
        </SelectTrigger>
        <SelectContent align="end">
          {CHART_THEMES.map((theme) => (
            <SelectItem
              data-qa={`theme-customizer.chart-preset.option.${theme.value}`}
              key={theme.name}
              value={theme.value}>
              <div className="flex shrink-0 gap-1">
                {theme.colors.map((color, key) => (
                  <span
                    key={key}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}></span>
                ))}
              </div>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
