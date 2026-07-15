"use client";

import type { CSSProperties } from "react";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Bell, ChevronRight, Settings, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DirectionProvider, useDirection } from "@/components/ui/direction";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { useToasts } from "@/hooks/use-toasts";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

function DirectionReadout() {
  const direction = useDirection();

  return (
    <span aria-live="polite" className="bg-muted px-2 py-1 text-xs font-medium uppercase">
      {direction}
    </span>
  );
}

export function LayoutFeedbackDemos() {
  const t = useTranslations("ComponentDemo");
  const toasts = useToasts();
  const navigationPanelId = useId();
  const contentPanelId = useId();
  const [direction, setDirection] = useState<"ltr" | "rtl">("rtl");

  const scrollItems = [
    t("samples.options.optionOne"),
    t("samples.options.optionTwo"),
    t("samples.options.optionThree"),
    t("samples.labels.account"),
    t("samples.labels.notifications"),
    t("samples.labels.language"),
    t("samples.labels.role"),
    t("samples.labels.status")
  ];

  return (
    <DemoCategorySection category="layoutFeedback">
      <DemoFrame title="DirectionProvider" source="components/ui/direction.tsx">
        <DirectionProvider dir={direction}>
          <div className="space-y-3" dir={direction}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{t("samples.labels.language")}</p>
              <DirectionReadout />
            </div>
            <div className="bg-muted flex items-center justify-between border p-3">
              <span className="text-muted-foreground text-xs">
                {t("samples.content.shortDescription")}
              </span>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" />
            </div>
            <div className="flex gap-2">
              <Button
                aria-pressed={direction === "ltr"}
                data-qa="component-demo.layout.direction.ltr"
                onClick={() => setDirection("ltr")}
                size="sm"
                variant={direction === "ltr" ? "default" : "outline"}>
                LTR
              </Button>
              <Button
                aria-pressed={direction === "rtl"}
                data-qa="component-demo.layout.direction.rtl"
                onClick={() => setDirection("rtl")}
                size="sm"
                variant={direction === "rtl" ? "default" : "outline"}>
                RTL
              </Button>
            </div>
          </div>
        </DirectionProvider>
      </DemoFrame>

      <DemoFrame title="Resizable" source="components/ui/resizable.tsx">
        <ResizablePanelGroup
          aria-label={t("samples.content.title")}
          className="h-40 overflow-hidden border"
          orientation="horizontal">
          <ResizablePanel defaultSize="40%" id={navigationPanelId} minSize="25%">
            <div className="bg-muted flex h-full items-center justify-center p-3 text-center text-xs font-medium">
              {t("categories.navigation")}
            </div>
          </ResizablePanel>
          <ResizableHandle
            aria-label={t("samples.actions.edit")}
            data-qa="component-demo.layout.resizable.handle"
            withHandle
          />
          <ResizablePanel defaultSize="60%" id={contentPanelId} minSize="30%">
            <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-center text-xs">
              {t("samples.content.description")}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DemoFrame>

      <DemoFrame title="ScrollArea" source="components/ui/scroll-area.tsx">
        <ScrollArea
          aria-label={t("samples.content.title")}
          className="h-40 border"
          data-qa="component-demo.layout.scroll-area">
          <div className="divide-y p-1">
            {scrollItems.map((item, index) => (
              <div className="px-3 py-2.5 text-xs" key={`${item}-${index}`}>
                <span className="text-muted-foreground me-2 tabular-nums">{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DemoFrame>

      <DemoFrame previewClassName="p-0" title="Sidebar" source="components/ui/sidebar.tsx" wide>
        <SidebarProvider
          className="h-72 min-h-0 overflow-hidden border-0"
          data-qa="component-demo.layout.sidebar.provider"
          style={{ "--sidebar-width": "12rem" } as CSSProperties}>
          <Sidebar
            aria-label={t("categories.navigation")}
            className="w-(--sidebar-width) shrink-0 border-e"
            collapsible="none"
            role="navigation">
            <SidebarHeader>
              <p className="px-2 text-sm font-semibold">{t("samples.content.title")}</p>
              <SidebarInput
                aria-label={t("samples.labels.search")}
                data-qa="component-demo.layout.sidebar.search"
                placeholder={t("samples.actions.search")}
              />
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{t("samples.labels.account")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        data-qa="component-demo.layout.sidebar.account"
                        isActive
                        tooltip={t("samples.labels.account")}
                        type="button">
                        <UserRound aria-hidden="true" />
                        <span>{t("samples.labels.account")}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        data-qa="component-demo.layout.sidebar.notifications"
                        tooltip={t("samples.labels.notifications")}
                        type="button">
                        <Bell aria-hidden="true" />
                        <span>{t("samples.labels.notifications")}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>3</SidebarMenuBadge>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    data-qa="component-demo.layout.sidebar.settings"
                    tooltip={t("samples.actions.settings")}
                    type="button">
                    <Settings aria-hidden="true" />
                    <span>{t("samples.actions.settings")}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="bg-background flex min-w-0 flex-1 flex-col">
            <div className="border-b p-4">
              <p className="font-semibold">{t("samples.content.title")}</p>
            </div>
            <div className="text-muted-foreground flex flex-1 items-center justify-center p-6 text-center text-sm">
              {t("samples.content.description")}
            </div>
          </div>
        </SidebarProvider>
      </DemoFrame>

      <DemoFrame title="Sonner" source="components/ui/sonner.tsx">
        <div className="space-y-3">
          <Button
            data-qa="component-demo.layout.sonner.trigger"
            onClick={() =>
              toasts.success("save", undefined, {
                description: t("samples.content.description"),
                title: t("samples.states.success")
              })
            }>
            {t("samples.actions.continue")}
          </Button>
          <p className="text-muted-foreground text-xs">{t("samples.content.shortDescription")}</p>
        </div>
      </DemoFrame>
    </DemoCategorySection>
  );
}
