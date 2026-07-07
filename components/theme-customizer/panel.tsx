import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  PresetSelector,
  SidebarModeSelector,
  ThemeScaleSelector,
  ColorModeSelector,
  ContentLayoutSelector,
  ThemeRadiusSelector,
  FontSelector,
  ResetThemeButton,
  ChartPresetSelector,
} from "../theme-customizer/index";

export function ThemeCustomizerPanel() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button size="icon" variant="outline">
              <Settings />
              <span className="sr-only">Open theme customizer</span>
            </Button>
          </div>
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
