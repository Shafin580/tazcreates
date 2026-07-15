"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useThemeConfig } from "../active-theme";
import { DEFAULT_THEME, THEMES, type ThemeType } from "@/lib/themes";

export function PresetSelector() {
  const { theme, setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  const handlePreset = (value: string) => {
    setTheme({ ...theme, ...DEFAULT_THEME, preset: value as ThemeType["preset"] });
  };

  return (
    <div className="flex flex-col gap-4">
      <Label id={labelId}>{t("labels.preset")}</Label>
      <Select value={theme.preset} onValueChange={(value) => handlePreset(value)}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="w-full"
          data-qa="theme-customizer.preset.trigger">
          <SelectValue placeholder={t("placeholders.theme")} />
        </SelectTrigger>
        <SelectContent align="end">
          {THEMES.map((theme) => (
            <SelectItem
              data-qa={`theme-customizer.preset.option.${theme.value}`}
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
