"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Boxes } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQaId } from "@/hooks/use-qa-id";

import { demoCatalog, demoCategoryOrder, getDemoId } from "./catalog";
import { DemoProviders } from "./demo-providers";
import { CustomDemos } from "./sections/custom-demo";
import { DataDisplayDemos } from "./sections/data-display-demo";
import { FormDemos } from "./sections/forms-demo";
import { FoundationDemos } from "./sections/foundations-demo";
import { GlobalDemos } from "./sections/global-demo";
import { LayoutFeedbackDemos } from "./sections/layout-feedback-demo";
import { NavigationDemos } from "./sections/navigation-demo";
import { OverlayDemos } from "./sections/overlays-demo";
import { ThemeDemos } from "./sections/theme-demo";

function ComponentDemoContent() {
  const t = useTranslations("ComponentDemo");
  const search = useQaId("component-demo.catalog.search");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredCatalog = useMemo(
    () =>
      normalizedQuery
        ? demoCatalog.filter((entry) =>
            `${entry.name} ${entry.source}`.toLocaleLowerCase().includes(normalizedQuery)
          )
        : demoCatalog,
    [normalizedQuery]
  );

  return (
    <div className="bg-background text-foreground min-h-svh min-w-0 flex-1">
      <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex max-w-[100rem] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center">
            <Boxes aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground truncate text-xs font-medium tracking-wide uppercase">
              {t("page.eyebrow")}
            </p>
            <p className="truncate text-sm font-semibold">{t("page.title")}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[100rem] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("page.title")}</h1>
          <p className="text-muted-foreground text-base leading-7">{t("page.description")}</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-card space-y-3 border p-4 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor={search.id}>{t("page.searchLabel")}</Label>
                <Input
                  {...search}
                  autoComplete="off"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("page.searchPlaceholder")}
                  type="search"
                  value={query}
                />
              </div>
              <p aria-live="polite" className="text-muted-foreground text-xs">
                {t("page.showing", {
                  visible: filteredCatalog.length,
                  total: demoCatalog.length
                })}
              </p>
            </div>

            <nav aria-label={t("page.catalogNavigation")} className="bg-card border shadow-sm">
              <ScrollArea className="h-[min(60vh,38rem)]">
                <div className="space-y-4 p-3">
                  {filteredCatalog.length === 0 ? (
                    <p className="text-muted-foreground p-2 text-sm">{t("page.noResults")}</p>
                  ) : (
                    demoCategoryOrder.map((category) => {
                      const entries = filteredCatalog.filter(
                        (entry) => entry.category === category
                      );
                      if (entries.length === 0) return null;

                      return (
                        <div className="space-y-1" key={category}>
                          <a
                            className="text-foreground hover:bg-muted focus-visible:ring-ring block px-2 py-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:outline-none"
                            data-qa={`component-demo.catalog.category.${category}`}
                            href={`#category-${category}`}>
                            {t(`categories.${category}`)}
                          </a>
                          <ul className="space-y-0.5">
                            {entries.map((entry) => (
                              <li key={entry.source}>
                                <a
                                  className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring block truncate px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
                                  data-qa={`component-demo.catalog.link.${getDemoId(entry.source)}`}
                                  href={`#${getDemoId(entry.source)}`}
                                  title={entry.source}>
                                  {entry.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </nav>
          </aside>

          <div className="min-w-0 space-y-12">
            <FoundationDemos />
            <FormDemos />
            <NavigationDemos />
            <OverlayDemos />
            <DataDisplayDemos />
            <LayoutFeedbackDemos />
            <CustomDemos />
            <GlobalDemos />
            <ThemeDemos />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ComponentDemo() {
  return (
    <DemoProviders>
      <ComponentDemoContent />
    </DemoProviders>
  );
}
