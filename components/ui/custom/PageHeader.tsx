"use client";

import * as React from "react";
import { useEffect, useState, Fragment } from "react";
import { Info } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { IconTooltipButton } from "./IconTooltipButton";
import { cn } from "@/lib/utils";
import type { BreadcrumbEntry } from "@/utils/breadcrumb-utils";

export type PageHeaderProps = {
  /** Page title. Falls back to auto-detected title from sidebar route store. */
  title?: string;
  /** Secondary description below the title. */
  subtitle?: string;
  /** Whether to render the breadcrumb trail. Default: true. */
  showBreadcrumb?: boolean;
  /** Breadcrumb data to render. Typically auto-provided by the per-app wrapper. */
  breadcrumbs?: BreadcrumbEntry[];
  /** Whether breadcrumb data is still loading (shows skeleton). */
  isLoading?: boolean;
  /**
   * Documentation link or custom tooltip content.
   * - string: renders a standard Info tooltip with a "Learn more" link.
   * - ReactNode: renders custom tooltip content inside the Info button.
   */
  docLink?: string | React.ReactNode;
  /** Scroll Y threshold for showing a bottom border on the header. */
  scrollY?: number;
  /** Action buttons or controls rendered on the right side of the header. */
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  showBreadcrumb = true,
  breadcrumbs,
  isLoading = false,
  docLink,
  scrollY,
  children
}: PageHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (scrollY != null) {
      const handleScroll = () => setIsScrolled(window.scrollY > scrollY);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [scrollY]);

  // Build doc tooltip content
  const docTooltipContent = React.useMemo(() => {
    if (!docLink) return null;
    if (typeof docLink === "string") {
      return (
        <div className="text-xs">
          <Link href={docLink} target="_blank" className="hover:text-secondary">
            Learn more
          </Link>
        </div>
      );
    }
    return docLink;
  }, [docLink]);

  return (
    <>
      {/* Breadcrumb row */}
      {showBreadcrumb && (
        <div className="mb-2">
          {isLoading ? (
            <div
              className="flex items-center gap-2"
              role="status"
              aria-busy="true"
              aria-label="Loading breadcrumb">
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
              <div className="bg-muted size-3 animate-pulse rounded" />
              <div className="bg-muted h-4 w-28 animate-pulse rounded" />
            </div>
          ) : breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <Fragment key={`${item.title}-${index}`}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {isLast || !item.href ? (
                          <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={item.href}>{item.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          ) : null}
        </div>
      )}

      {/* Page header row — only render if there's something to show */}
      {(title || subtitle || children || docTooltipContent || (isLoading && title !== "")) && (
        <div className={cn("page-header", isScrolled && "border-b")}>
          <div className="flex items-center gap-2">
            {(title || subtitle || isLoading) && (
              <div>
                {isLoading && !title ? (
                  <div className="bg-muted h-8 w-48 animate-pulse rounded" />
                ) : title ? (
                  <h1 className="text-2xl font-bold">{title}</h1>
                ) : null}
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
              </div>
            )}
            {docTooltipContent && (
              <IconTooltipButton
                icon={<Info />}
                className="hover:bg-input/30 border-0 shadow-none"
                tooltip={docTooltipContent}
                iconSize="sm"
                side="right"
              />
            )}
          </div>
          {children}
        </div>
      )}
    </>
  );
}
