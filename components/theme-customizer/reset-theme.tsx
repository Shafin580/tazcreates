"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { DEFAULT_THEME } from "@/lib/themes";
import { useThemeConfig } from "../active-theme";

export function ResetThemeButton() {
  const { setTheme } = useThemeConfig();
  const t = useTranslations("ThemeCustomizer");

  const resetThemeHandle = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <Button
      data-qa="theme-customizer.reset"
      variant="destructive"
      className="mt-4 w-full"
      onClick={resetThemeHandle}>
      {t("actions.reset")}
    </Button>
  );
}
