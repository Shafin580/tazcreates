"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { BanIcon } from "lucide-react";
import { useThemeConfig } from "../active-theme";
import type { ThemeType } from "@/lib/themes";

export function ThemeScaleSelector() {
  const { theme, setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <Label id={labelId}>{t("labels.scale")}</Label>
      <div>
        <ToggleGroup
          aria-labelledby={labelId}
          value={theme.scale}
          type="single"
          onValueChange={(value) => {
            if (value) setTheme({ ...theme, scale: value as ThemeType["scale"] });
          }}
          className="*:border-input w-full gap-3 *:rounded-md *:border">
          <ToggleGroupItem
            aria-label={t("options.none")}
            data-qa="theme-customizer.scale.none"
            variant="outline"
            value="none">
            <BanIcon aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem
            variant="outline"
            value="sm"
            data-qa="theme-customizer.scale.sm"
            className="text-xs data-[variant=outline]:border-l-1">
            XS
          </ToggleGroupItem>
          <ToggleGroupItem
            variant="outline"
            value="lg"
            data-qa="theme-customizer.scale.lg"
            className="text-xs data-[variant=outline]:border-l-1">
            LG
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
