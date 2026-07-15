"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

export function NavigationDemos() {
  const t = useTranslations("ComponentDemo");
  const [accordionValue, setAccordionValue] = useState("details");
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [menubarValue, setMenubarValue] = useState("");
  const [menuNotifications, setMenuNotifications] = useState(true);
  const [navigationValue, setNavigationValue] = useState("");
  const [page, setPage] = useState(2);
  const [tab, setTab] = useState("account");

  const slides = [
    t("samples.options.optionOne"),
    t("samples.options.optionTwo"),
    t("samples.options.optionThree")
  ];

  return (
    <DemoCategorySection category="navigation">
      <DemoFrame title="Accordion" source="components/ui/accordion.tsx">
        <Accordion
          collapsible
          onValueChange={setAccordionValue}
          type="single"
          value={accordionValue}>
          <AccordionItem value="details">
            <AccordionTrigger data-qa="component-demo.navigation.accordion.details">
              {t("samples.content.title")}
            </AccordionTrigger>
            <AccordionContent>{t("samples.content.description")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="status">
            <AccordionTrigger data-qa="component-demo.navigation.accordion.status">
              {t("samples.labels.status")}
            </AccordionTrigger>
            <AccordionContent>{t("samples.content.shortDescription")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoFrame>

      <DemoFrame title="Breadcrumb" source="components/ui/breadcrumb.tsx">
        <Breadcrumb aria-label={t("samples.content.title")}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                data-qa="component-demo.navigation.breadcrumb.category"
                href="#category-navigation">
                {t("categories.navigation")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("samples.content.title")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoFrame>

      <DemoFrame
        previewClassName="flex items-center justify-center px-12"
        title="Carousel"
        source="components/ui/carousel.tsx">
        <Carousel className="w-full max-w-sm" opts={{ loop: true }}>
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={slide}>
                <div
                  aria-label={`${slide} ${index + 1}`}
                  className="bg-muted text-muted-foreground flex h-28 items-center justify-center border text-sm font-medium">
                  {slide}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            aria-label={t("samples.actions.previous")}
            className="-start-10"
            data-qa="component-demo.navigation.carousel.previous"
          />
          <CarouselNext
            aria-label={t("samples.actions.next")}
            className="-end-10"
            data-qa="component-demo.navigation.carousel.next"
          />
        </Carousel>
      </DemoFrame>

      <DemoFrame title="Collapsible" source="components/ui/collapsible.tsx">
        <Collapsible className="space-y-3" onOpenChange={setCollapsibleOpen} open={collapsibleOpen}>
          <CollapsibleTrigger asChild>
            <Button
              aria-expanded={collapsibleOpen}
              data-qa="component-demo.navigation.collapsible.trigger"
              variant="outline">
              {collapsibleOpen ? t("samples.actions.close") : t("samples.actions.open")}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-muted text-muted-foreground border p-3 text-xs leading-5">
              {t("samples.content.description")}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </DemoFrame>

      <DemoFrame title="Menubar" source="components/ui/menubar.tsx">
        <Menubar onValueChange={setMenubarValue} value={menubarValue}>
          <MenubarMenu value="account">
            <MenubarTrigger data-qa="component-demo.navigation.menubar.account">
              {t("samples.labels.account")}
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem data-qa="component-demo.navigation.menubar.edit">
                {t("samples.actions.edit")}
              </MenubarItem>
              <MenubarItem data-qa="component-demo.navigation.menubar.share">
                {t("samples.actions.share")}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="settings">
            <MenubarTrigger data-qa="component-demo.navigation.menubar.settings">
              {t("samples.actions.settings")}
            </MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem
                checked={menuNotifications}
                data-qa="component-demo.navigation.menubar.notifications"
                onCheckedChange={(checked) => setMenuNotifications(checked === true)}>
                {t("samples.labels.notifications")}
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem data-qa="component-demo.navigation.menubar.delete" variant="destructive">
                {t("samples.actions.delete")}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </DemoFrame>

      <DemoFrame title="NavigationMenu" source="components/ui/navigation-menu.tsx">
        <NavigationMenu onValueChange={setNavigationValue} value={navigationValue} viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem value="settings">
              <NavigationMenuTrigger data-qa="component-demo.navigation.navigation-menu.trigger">
                {t("samples.actions.settings")}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-64">
                <NavigationMenuLink
                  className="flex-col items-start"
                  data-qa="component-demo.navigation.navigation-menu.account"
                  href="#demo-ui-tabs">
                  <span className="font-medium">{t("samples.labels.account")}</span>
                  <span className="text-muted-foreground">
                    {t("samples.content.shortDescription")}
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="flex-col items-start"
                  data-qa="component-demo.navigation.navigation-menu.notifications"
                  href="#demo-ui-pagination">
                  <span className="font-medium">{t("samples.labels.notifications")}</span>
                  <span className="text-muted-foreground">{t("samples.content.description")}</span>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                data-qa="component-demo.navigation.navigation-menu.overlays"
                href="#category-overlays">
                {t("categories.overlays")}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuIndicator />
          </NavigationMenuList>
        </NavigationMenu>
      </DemoFrame>

      <DemoFrame title="Pagination" source="components/ui/pagination.tsx">
        <Pagination aria-label={t("samples.labels.progress")}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-label={t("samples.actions.previous")}
                data-qa="component-demo.navigation.pagination.previous"
                href="#demo-ui-pagination"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.max(1, current - 1));
                }}
                text={t("samples.actions.previous")}
              />
            </PaginationItem>
            {[1, 2, 3].map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  aria-label={`${pageNumber}`}
                  data-qa={`component-demo.navigation.pagination.page-${pageNumber}`}
                  href="#demo-ui-pagination"
                  isActive={page === pageNumber}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(pageNumber);
                  }}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="hidden sm:list-item">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                aria-label={t("samples.actions.next")}
                data-qa="component-demo.navigation.pagination.next"
                href="#demo-ui-pagination"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.min(3, current + 1));
                }}
                text={t("samples.actions.next")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </DemoFrame>

      <DemoFrame title="Tabs" source="components/ui/tabs.tsx">
        <Tabs onValueChange={setTab} value={tab}>
          <TabsList aria-label={t("samples.actions.select")} variant="line">
            <TabsTrigger data-qa="component-demo.navigation.tabs.account" value="account">
              {t("samples.labels.account")}
            </TabsTrigger>
            <TabsTrigger
              data-qa="component-demo.navigation.tabs.notifications"
              value="notifications">
              {t("samples.labels.notifications")}
            </TabsTrigger>
          </TabsList>
          <TabsContent className="bg-muted border p-3" value="account">
            {t("samples.content.description")}
          </TabsContent>
          <TabsContent className="bg-muted border p-3" value="notifications">
            {t("samples.content.shortDescription")}
          </TabsContent>
        </Tabs>
      </DemoFrame>
    </DemoCategorySection>
  );
}
