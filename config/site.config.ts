import { SITE } from "@/content/site";
import type { SiteConfig } from "@/lib/seo/types";

/**
 * Single source of truth for site-wide SEO metadata.
 *
 * Values are derived from `content/site.ts` rather than duplicated — the artist's
 * name, description and keywords have exactly one home. Consumed by
 * `buildRootMetadata()` (app/layout.tsx), `buildPageMetadata()` (any page),
 * `app/sitemap.ts`, `app/robots.ts`, and the JSON-LD builders in `lib/seo/schemas.ts`.
 *
 * `siteUrl` is the build-time fallback; `NEXT_PUBLIC_SITE_URL` overrides it at runtime
 * so preview deployments emit their own canonical host.
 */
/**
 * The social card is generated (1200x630) rather than
 * reusing a gallery piece — those are 600x800 portraits, and social platforms lay out
 * a 1.91:1 landscape card, so a portrait crop gets letterboxed or cropped through the
 * face. `scripts/generate-og.tsx` renders it at build time to `public/og.png`, so the
 * PNG ships as a static asset instead of inside the Worker bundle.
 */
const OG_IMAGE = {
  path: "/og.png",
  width: 1200,
  height: 630,
  alt: `${SITE.artist.name} — ${SITE.artist.role}. ${SITE.artist.tagline}.`
};

export const SITE_CONFIG: SiteConfig = {
  siteName: SITE.artist.name,
  defaultTitle: `${SITE.artist.name} — ${SITE.artist.role}`,
  titleTemplate: `%s — ${SITE.artist.name}`,
  defaultDescription: SITE.meta.description,
  siteUrl: "https://tazcreates.site",
  ogImage: OG_IMAGE,
  locale: "en_CA",
  keywords: [...SITE.meta.keywords]
};

/**
 * Organization identity for `organizationSchema()`. Kept separate from SITE_CONFIG
 * because Next's `Metadata` type has no place for it.
 */
export const ORGANIZATION = {
  legalName: SITE.artist.name,
  logoPath: SITE.artist.avatar.src,
  sameAs: [SITE.contact.instagramUrl],
  contact: {
    email: SITE.contact.email,
    areaServed: "Canada"
  }
};

/**
 * Canonical origin, trailing slash stripped. `NEXT_PUBLIC_SITE_URL` wins so preview
 * deployments emit their own host; `SITE_CONFIG.siteUrl` is the build-time fallback.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.siteUrl).replace(
  /\/+$/,
  ""
);
