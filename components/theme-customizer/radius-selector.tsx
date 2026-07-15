"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { BanIcon } from "lucide-react";
import { useThemeConfig } from "../active-theme";
import type { ThemeType } from "@/lib/themes";

export function ThemeRadiusSelector() {
  const { theme, setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");
  const labelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <Label id={labelId}>{t("labels.radius")}</Label>
      <ToggleGroup
        aria-labelledby={labelId}
        value={theme.radius}
        type="single"
        onValueChange={(value) => {
          if (value) setTheme({ ...theme, radius: value as ThemeType["radius"] });
        }}
        className="*:border-input w-full gap-3 *:rounded-md *:border">
        <ToggleGroupItem
          aria-label={t("options.none")}
          data-qa="theme-customizer.radius.none"
          variant="outline"
          value="none">
          <BanIcon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="sm"
          data-qa="theme-customizer.radius.sm"
          className="text-xs data-[variant=outline]:border-l-1">
          SM
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="md"
          data-qa="theme-customizer.radius.md"
          className="text-xs data-[variant=outline]:border-l-1">
          MD
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="lg"
          data-qa="theme-customizer.radius.lg"
          className="text-xs data-[variant=outline]:border-l-1">
          LG
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="xl"
          data-qa="theme-customizer.radius.xl"
          className="text-xs data-[variant=outline]:border-l-1">
          XL
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
