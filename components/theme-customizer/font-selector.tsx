"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useThemeConfig } from "../active-theme";
import { THEME_FONTS, type ThemeType } from "@/lib/themes";

export function FontSelector() {
  const { theme, setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <Label id={labelId}>{t("labels.font")}</Label>
      <Select
        value={theme.font}
        onValueChange={(value) => setTheme({ ...theme, font: value as ThemeType["font"] })}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="w-full"
          data-qa="theme-customizer.font.trigger">
          <SelectValue placeholder={t("placeholders.font")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem data-qa="theme-customizer.font.option.default" value="default">
            {t("options.default")}
          </SelectItem>
          {THEME_FONTS.map((item, key) => {
            return (
              <SelectItem
                data-qa={`theme-customizer.font.option.${item.value}`}
                key={key}
                value={item.value}>
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
