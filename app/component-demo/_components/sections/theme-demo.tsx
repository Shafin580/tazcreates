"use client";

import { useTranslations } from "next-intl";

import { useThemeConfig } from "@/components/active-theme";
import { ChartPresetSelector } from "@/components/theme-customizer/chart-preset-selector";
import { ColorModeSelector } from "@/components/theme-customizer/color-mode-selector";
import { ContentLayoutSelector } from "@/components/theme-customizer/content-layout-selector";
import { FontSelector } from "@/components/theme-customizer/font-selector";
import { ThemeCustomizerPanel } from "@/components/theme-customizer/panel";
import { PresetSelector } from "@/components/theme-customizer/preset-selector";
import { ThemeRadiusSelector } from "@/components/theme-customizer/radius-selector";
import { ResetThemeButton } from "@/components/theme-customizer/reset-theme";
import { ThemeScaleSelector } from "@/components/theme-customizer/scale-selector";
import { SidebarModeSelector } from "@/components/theme-customizer/sidebar-mode-selector";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

function ThemeValuePreview() {
  const { theme } = useThemeConfig();

  return (
    <pre className="bg-muted max-w-full overflow-x-auto border p-4 text-xs" dir="ltr">
      {JSON.stringify(theme, null, 2)}
    </pre>
  );
}

function BoundedSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="min-h-0 w-full bg-transparent" defaultOpen>
      {children}
    </SidebarProvider>
  );
}

function SidebarStatePreview() {
  const { state } = useSidebar();

  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className={
          state === "expanded" ? "bg-sidebar h-12 w-24 border" : "bg-sidebar h-12 w-10 border"
        }
      />
      <code aria-live="polite" className="text-muted-foreground text-xs">
        {state}
      </code>
    </div>
  );
}

export function ThemeDemos() {
  const t = useTranslations("ComponentDemo.samples");

  return (
    <DemoCategorySection category="theme">
      <DemoFrame
        source="components/theme-customizer/chart-preset-selector.tsx"
        title="ChartPresetSelector">
        <ChartPresetSelector />
      </DemoFrame>

      <DemoFrame
        source="components/theme-customizer/color-mode-selector.tsx"
        title="ColorModeSelector">
        <ColorModeSelector />
      </DemoFrame>

      <DemoFrame
        source="components/theme-customizer/content-layout-selector.tsx"
        title="ContentLayoutSelector">
        <ContentLayoutSelector />
        <p className="text-muted-foreground mt-3 text-xs lg:hidden">
          {t("content.shortDescription")}
        </p>
      </DemoFrame>

      <DemoFrame source="components/theme-customizer/font-selector.tsx" title="FontSelector">
        <FontSelector />
      </DemoFrame>

      <DemoFrame source="components/theme-customizer/panel.tsx" title="ThemeCustomizerPanel">
        <BoundedSidebarProvider>
          <div className="flex w-full items-start justify-between gap-4">
            <SidebarStatePreview />
            <ThemeCustomizerPanel />
          </div>
        </BoundedSidebarProvider>
      </DemoFrame>

      <DemoFrame source="components/theme-customizer/preset-selector.tsx" title="PresetSelector">
        <PresetSelector />
      </DemoFrame>

      <DemoFrame
        source="components/theme-customizer/radius-selector.tsx"
        title="ThemeRadiusSelector">
        <ThemeRadiusSelector />
      </DemoFrame>

      <DemoFrame source="components/theme-customizer/reset-theme.tsx" title="ResetThemeButton">
        <ResetThemeButton />
      </DemoFrame>

      <DemoFrame source="components/theme-customizer/scale-selector.tsx" title="ThemeScaleSelector">
        <ThemeScaleSelector />
      </DemoFrame>

      <DemoFrame
        source="components/theme-customizer/sidebar-mode-selector.tsx"
        title="SidebarModeSelector">
        <BoundedSidebarProvider>
          <div className="w-full space-y-4">
            <SidebarStatePreview />
            <SidebarModeSelector />
          </div>
        </BoundedSidebarProvider>
        <p className="text-muted-foreground mt-3 text-xs lg:hidden">
          {t("content.shortDescription")}
        </p>
      </DemoFrame>

      <DemoFrame source="components/active-theme.tsx" title="ActiveThemeProvider" wide>
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{t("content.themeLimitation")}</p>
          <ThemeValuePreview />
        </div>
      </DemoFrame>
    </DemoCategorySection>
  );
}
