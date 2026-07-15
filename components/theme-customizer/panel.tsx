import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  PresetSelector,
  SidebarModeSelector,
  ThemeScaleSelector,
  ColorModeSelector,
  ContentLayoutSelector,
  ThemeRadiusSelector,
  FontSelector,
  ResetThemeButton,
  ChartPresetSelector
} from "../theme-customizer/index";

export function ThemeCustomizerPanel() {
  const t = useTranslations("ThemeCustomizer");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button data-qa="global.theme-customizer.trigger" size="icon" variant="outline">
            <Settings aria-hidden="true" />
            <span className="sr-only">{t("actions.open")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-4 shadow-xl" align="end">
          <div className="grid space-y-4">
            <PresetSelector />
            <ChartPresetSelector />
            <ThemeScaleSelector />
            <ThemeRadiusSelector />
            <FontSelector />
            <ColorModeSelector />
            <ContentLayoutSelector />
            <SidebarModeSelector />
          </div>
          <ResetThemeButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
