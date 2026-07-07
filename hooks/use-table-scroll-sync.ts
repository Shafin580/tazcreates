"use client";

import { RefObject, useEffect, useState } from "react";

export interface UseTableScrollSyncResult {
  proxyWidth: number;
  hasOverflow: boolean;
}

/**
 * Bidirectionally syncs a proxy horizontal scrollbar with a scroll container
 * and tracks whether the rendered table content overflows. The proxy bar sits
 * just above the pagination so users don't have to scroll to the bottom of the
 * table to reach the scrollbar.
 *
 * Pass the data slice that drives the rendered rows in `deps` so that row-count
 * changes trigger a re-measure.
 */
export function useTableScrollSync(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  proxyRef: RefObject<HTMLElement | null>,
  deps: unknown[] = []
): UseTableScrollSyncResult {
  const [proxyWidth, setProxyWidth] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const proxy = proxyRef.current;
    if (!container || !content || !proxy) return;

    let syncingFrom: "container" | "proxy" | null = null;
    const onContainerScroll = () => {
      if (syncingFrom === "proxy") {
        syncingFrom = null;
        return;
      }
      syncingFrom = "container";
      proxy.scrollLeft = container.scrollLeft;
    };
    const onProxyScroll = () => {
      if (syncingFrom === "container") {
        syncingFrom = null;
        return;
      }
      syncingFrom = "proxy";
      container.scrollLeft = proxy.scrollLeft;
    };
    container.addEventListener("scroll", onContainerScroll, { passive: true });
    proxy.addEventListener("scroll", onProxyScroll, { passive: true });

    const updateMeasure = () => {
      const contentWidth = content.scrollWidth;
      setHasOverflow(contentWidth - container.clientWidth > 1);
      setProxyWidth(contentWidth);
    };
    updateMeasure();
    const ro = new ResizeObserver(updateMeasure);
    ro.observe(container);
    ro.observe(content);

    return () => {
      container.removeEventListener("scroll", onContainerScroll);
      proxy.removeEventListener("scroll", onProxyScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { proxyWidth, hasOverflow };
}
