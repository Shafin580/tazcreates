export type NavGroup = {
  title: string;
  items: NavItem;
};

export type NavItem = {
  title: string;
  href: string;
  icon?: unknown;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  items?: NavItem;
}[];

export type BreadcrumbEntry = {
  title: string;
  href?: string;
};

type MatchResult = {
  item: NavItem[number];
  parentTitle?: string;
  depth: number;
  hrefBase: string;
};

function stripQueryParams(href: string): string {
  return href.split("?")[0];
}

/**
 * Recursively searches NavGroups to find the best matching route for a given pathname.
 * "Best match" = longest href prefix that matches the pathname (most specific ancestor).
 */
function findBestMatch(groups: NavGroup[], pathname: string): MatchResult | null {
  let bestMatch: MatchResult | null = null;

  for (const group of groups) {
    for (const item of group.items) {
      const hrefBase = stripQueryParams(item.href);

      // Check top-level item (skip "#" placeholder hrefs used for collapsible groups)
      if (hrefBase !== "#" && hrefBase.length > 0) {
        if (pathname === hrefBase || pathname.startsWith(hrefBase + "/")) {
          if (!bestMatch || hrefBase.length > bestMatch.hrefBase.length) {
            bestMatch = { item, depth: 0, hrefBase };
          }
        }
      }

      // Check sub-items
      if (item.items) {
        for (const subItem of item.items) {
          const subHrefBase = stripQueryParams(subItem.href);
          if (subHrefBase !== "#" && subHrefBase.length > 0) {
            if (pathname === subHrefBase || pathname.startsWith(subHrefBase + "/")) {
              if (!bestMatch || subHrefBase.length > bestMatch.hrefBase.length) {
                bestMatch = {
                  item: subItem,
                  parentTitle: item.title,
                  depth: 1,
                  hrefBase: subHrefBase
                };
              }
            }
          }
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Derives breadcrumb entries and active page title from the sidebar route store data.
 *
 * @param pageRoutes - The NavGroup[] from useRouteLinkStore
 * @param pathname - The current pathname from next/navigation
 * @returns breadcrumbs array and the active title, or null if no match
 */
export function findActiveBreadcrumbs(
  pageRoutes: NavGroup[],
  pathname: string
): { breadcrumbs: BreadcrumbEntry[]; activeTitle: string } | null {
  if (pageRoutes.length === 0) return null;

  // Dashboard is always the first item in the first group
  const dashboardItem = pageRoutes[0]?.items?.[0];
  if (!dashboardItem) return null;

  const dashboardHrefBase = stripQueryParams(dashboardItem.href);

  // If we're on the dashboard itself
  if (pathname === dashboardHrefBase) {
    return {
      breadcrumbs: [{ title: dashboardItem.title }],
      activeTitle: dashboardItem.title
    };
  }

  const match = findBestMatch(pageRoutes, pathname);
  if (!match) return null;

  const breadcrumbs: BreadcrumbEntry[] = [{ title: dashboardItem.title, href: dashboardItem.href }];

  // If the matched item is a sub-item, the parent group title is non-navigable context
  // We skip it in breadcrumbs since parent groups have href="#" (not navigable)

  const isExactMatch = pathname === match.hrefBase;

  if (isExactMatch) {
    // Current page is the matched item itself
    breadcrumbs.push({ title: match.item.title });
  } else {
    // Current page is a sub-route of the matched item (e.g., /list/details/123)
    breadcrumbs.push({
      title: match.item.title,
      href: match.item.href
    });
  }

  return {
    breadcrumbs,
    activeTitle: match.item.title
  };
}
