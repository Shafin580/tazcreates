---
name: seo-optimizer
description: On-page and technical SEO for this Next.js App Router site — metadata via buildPageMetadata, headings, URLs, images, JSON-LD schema, Core Web Vitals, internal linking, hreflang, and a pre-publish checklist. Use when writing page metadata, optimizing content for search, adding structured data, or auditing on-page SEO.
---

# SEO Optimizer

On-page and technical SEO, written against this repo's actual primitives.

**Boundary:** the `frontend` skill owns component conventions, theme tokens, and the
accessibility baseline; `ui-ux-quality` owns the numeric quality bar. This skill owns
only what search engines and answer engines read. For AI-citation specifically, read
`geo-fundamentals` — it covers the same site from the "get quoted" angle.

## 1. Metadata

Never hand-write a metadata block. Site-wide values live in `config/site.config.ts`;
pages compose from them.

```tsx
import type { Metadata } from "next";
import { LINKS } from "@/config/router.config";
import { SITE_CONFIG } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata(SITE_CONFIG, {
  title: "Component demo",
  description: "Every shipped primitive rendered on one page, with its props and states.",
  canonical: LINKS.COMPONENT_DEMO
});
```

`buildPageMetadata` derives `openGraph` and `twitter` from `SITE_CONFIG` and sets
`alternates.canonical` from `canonical`. The root layout supplies the title template via
`buildRootMetadata` — Next applies it to page titles automatically.

**Titles** — under ~60 characters *including* the `titleTemplate` suffix from
`config/site.config.ts`. Primary term near the front. Unique per page.

**Descriptions** — 150–160 characters. Written to earn a click, not to repeat the title.

**One sharp edge:** `buildPageMetadata` sets `robots: { index: true, follow: true }`
unconditionally ([lib/seo/page-metadata.ts](../../../lib/seo/page-metadata.ts)). Staging is
protected by `app/robots.ts` refusing all crawling, not by this flag. A page that must be
`noindex` on its own (thank-you pages, gated content) has to spread its own override:

```tsx
export const metadata: Metadata = {
  ...buildPageMetadata(SITE_CONFIG, { title, description, canonical }),
  robots: { index: false, follow: false }
};
```

## 2. Headings

Exactly one `<h1>` per page. No skipped levels. Headings carry meaning — users scan them
and AI engines use them as retrieval anchors.

```
h1  Component library
  h2  What is a faceted filter?
    h3  Building the facet counts
    h3  Wiring it to the URL
  h2  Choosing between a picker and a select
```

Question-shaped `h2`/`h3` match conversational queries and win snippets.

## 3. URLs and routes

Short, lowercase, hyphenated, descriptive. Every path is declared in `LINKS`
(`config/router.config.ts`) — never a hand-written string in a component.

Adding a route is **two** edits: `LINKS`, and a sitemap decision. `app/sitemap.ts` derives
from `LINKS`, so a new route appears automatically; keeping it *out* means adding it to
`SITEMAP_EXCLUDE`, which is a decision the `seo-analyzer` agent will respect rather than
report.

## 4. Images

```tsx
import Image from "next/image";

<Image
  src="/photos/studio.jpg"
  alt="Ceramic studio bench with three unfired bowls and a wire cutter"
  width={800}
  height={600}
  loading="lazy"
/>;
```

- Always `next/image`, never a raw `<img>`.
- `alt` describes content and purpose. Decorative images get `alt=""`. A filename is not alt text.
- `priority` on the LCP image **only** — putting it everywhere defeats it.
- Explicit dimensions, or `fill` with a sized parent, to prevent layout shift.
- The OG image referenced by `SITE_CONFIG.ogImage.path` must actually exist in `public/`, at the declared dimensions (1200×630 is the safe default).

## 5. Structured data

Builders live in `lib/seo/schemas.ts`; render through `JsonLd` from
`components/seo/json-ld.tsx`.

| Type | Where |
| --- | --- |
| `Organization` | mounted once, `app/layout.tsx` |
| `WebSite` | mounted once, same layout |
| `BreadcrumbList` | every interior page |
| `Article` | article / post / news pages |
| `FAQPage` | any page with a real question-and-answer block |
| `Product` | product detail pages |

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";

<JsonLd schema={[breadcrumbSchema(trail), faqSchema(items)]} />;
```

Must render **server-side** — keep `page.tsx` a server component. Extend
`lib/seo/schemas.ts` rather than inlining a schema object in a page; the `@id` anchors
(`/#organization`, `/#website`) only stay consistent if every schema comes from there.

Never fabricate values. Prices, ratings, review counts, author names, and dates in schema
are representations of fact; inventing them is a trust problem and can earn a manual action.

## 6. Core Web Vitals

| Metric | Target | Levers in this repo |
| --- | --- | --- |
| LCP | < 2.5s | `priority` on the hero image; avoid `dynamic()` above the fold |
| CLS | < 0.1 | sized images; reserve skeleton space matching the final layout |
| INP | < 200ms | keep client bundles small; `dynamic()` below-fold sections |

The `frontend` skill's dynamic-import and skeleton patterns are the implementation — follow
those rather than inventing a second approach.

## 7. Internal linking

Descriptive anchor text, never "click here" or "read more". Link related pages contextually.
This spreads authority and signals topical depth.

## 8. Locales, canonicals, and hreflang

Locales are declared once in `i18n/routing.ts` (`en`, `bn`, `fr`; default from
`NEXT_PUBLIC_DEFAULT_LOCALE`). Two rules follow:

- **Canonical is per-locale, never cross-locale.** The `en` page does not canonicalize to `bn` or the reverse — they are alternates, not duplicates.
- **hreflang is emitted only when routes actually live under `/<locale>`.** `app/` has no `[locale]` segment today, so `LOCALE_PREFIXED_ROUTES` in `config/router.config.ts` is `false` and the sitemap emits unprefixed URLs. Flip that flag in the same change that introduces `app/[locale]/` — locale URLs in a sitemap that 404 are worse than no alternates at all.

## 9. E-E-A-T

Credibility rests on specific, attributed, dated facts. Vague claims are worth nothing to
either ranking or AI citation. If a figure is not in the source material, ask — do not fill
the gap.

## Pre-publish checklist

- [ ] `buildPageMetadata()` used, with `canonical` set
- [ ] Title < 60 chars including the template suffix; description 150–160
- [ ] Single `<h1>`; no skipped heading levels
- [ ] OG image exists in `public/` at the dimensions declared in `SITE_CONFIG`
- [ ] All images via `next/image` with meaningful `alt`
- [ ] Breadcrumb schema present; page-type schema where applicable
- [ ] Route in `LINKS`; sitemap inclusion or `SITEMAP_EXCLUDE` is a deliberate call
- [ ] `public/llms.txt` updated if pages, services, or products changed
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build` clean

## Verification

```bash
pnpm typecheck && pnpm lint
pnpm build          # proves sitemap.xml and robots.txt still generate
pnpm start & curl -s localhost:3000/sitemap.xml
```

Rich Results Test and Search Console need a deployed URL — hand those back as manual steps.
