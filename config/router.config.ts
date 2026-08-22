/**
 * All internal route paths. Never hand-write a path string in a component —
 * import from here so a route rename is one edit and the sitemap stays honest.
 */
export const LINKS = {
  HOME: "/"
} as const;

export type AppLink = (typeof LINKS)[keyof typeof LINKS];

/**
 * Routes deliberately kept out of the sitemap: dynamic detail pages, auth-gated
 * areas, and anything reachable only via query params. Listing a route here is a
 * decision — `seo-analyzer` will not report it as missing.
 */
export const SITEMAP_EXCLUDE: AppLink[] = [];

/**
 * Whether routes are served under a `/<locale>` segment (next-intl's prefixed
 * routing). Today `app/` has no `[locale]` segment, so this is false and the
 * sitemap emits unprefixed URLs with no hreflang alternates. Flip it to true in
 * the same change that introduces `app/[locale]/` — emitting locale URLs before
 * they resolve puts 404s in the sitemap.
 */
export const LOCALE_PREFIXED_ROUTES = false;
