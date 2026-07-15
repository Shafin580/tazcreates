"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { getDemoId, type DemoCategory } from "./catalog";

export function DemoCategorySection({
  category,
  children,
  className
}: {
  category: DemoCategory;
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("ComponentDemo");
  const headingId = `category-${category}`;

  return (
    <section
      aria-labelledby={`${headingId}-title`}
      className="scroll-mt-24 space-y-4"
      id={headingId}>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight" id={`${headingId}-title`}>
          {t(`categories.${category}`)}
        </h2>
        <p className="text-muted-foreground text-sm">{t("samples.content.sectionDescription")}</p>
      </div>
      <div className={cn("grid gap-4 xl:grid-cols-2", className)}>{children}</div>
    </section>
  );
}

export function DemoFrame({
  title,
  source,
  children,
  className,
  previewClassName,
  wide = false
}: {
  title: string;
  source: `components/${string}.tsx`;
  children: ReactNode;
  className?: string;
  previewClassName?: string;
  wide?: boolean;
}) {
  const t = useTranslations("ComponentDemo");

  return (
    <article
      className={cn(
        "bg-card scroll-mt-24 overflow-hidden border shadow-sm",
        wide && "xl:col-span-2",
        className
      )}
      data-demo-source={source}
      id={getDemoId(source)}>
      <header className="border-b px-4 py-3 sm:px-5">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mt-1 min-w-0 text-xs">
          <span className="sr-only">{t("page.source")}: </span>
          <code className="break-all" dir="ltr">
            {source}
          </code>
        </p>
      </header>
      <div className={cn("min-h-32 p-4 sm:p-5", previewClassName)}>{children}</div>
    </article>
  );
}
