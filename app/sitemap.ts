import type { MetadataRoute } from "next";
import { LINKS, LOCALE_PREFIXED_ROUTES, SITEMAP_EXCLUDE } from "@/config/router.config";
import { SITE_URL } from "@/config/site.config";
import { routing } from "@/i18n/routing";
import { SHOULD_INDEX } from "./robots";

function absolute(path: string, locale?: string): string {
  const suffix = path === "/" ? "" : path;
  return locale ? `${SITE_URL}/${locale}${suffix}` : `${SITE_URL}${suffix || "/"}`;
}

/**
 * Derived from `LINKS` so a route cannot exist without a sitemap decision: it is
 * either listed here or deliberately in `SITEMAP_EXCLUDE`.
 *
 * hreflang alternates are emitted only when routes actually live under a `/<locale>`
 * segment — see `LOCALE_PREFIXED_ROUTES`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SHOULD_INDEX) return [];

  const lastModified = new Date();
  const routes = Object.values(LINKS).filter((path) => !SITEMAP_EXCLUDE.includes(path));

  return routes.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: absolute(path, LOCALE_PREFIXED_ROUTES ? routing.defaultLocale : undefined),
      lastModified,
      changeFrequency: path === LINKS.HOME ? "weekly" : "monthly",
      priority: path === LINKS.HOME ? 1 : 0.7
    };

    if (LOCALE_PREFIXED_ROUTES) {
      entry.alternates = {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absolute(path, l)]))
      };
    }

    return entry;
  });
}
