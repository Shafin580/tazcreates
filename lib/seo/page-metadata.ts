import type { Metadata } from "next";
import type { PageMeta, SiteConfig } from "./types";

export function buildPageMetadata(config: SiteConfig, page: PageMeta): Metadata {
  const path = page.canonical.startsWith("/") ? page.canonical : `/${page.canonical}`;
  const locale = config.locale ?? "en_US";
  const ogTitle = `${page.title} — ${config.siteName}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: config.siteName,
      title: ogTitle,
      description: page.description,
      url: path,
      locale,
      images: [
        {
          url: config.ogImage.path,
          width: config.ogImage.width,
          height: config.ogImage.height,
          alt: config.ogImage.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: page.description,
      // Full object, not a bare path — a bare string drops twitter:image:alt,
      // which is the card's only accessible description.
      images: [
        {
          url: config.ogImage.path,
          width: config.ogImage.width,
          height: config.ogImage.height,
          alt: config.ogImage.alt
        }
      ]
    },
    robots: { index: true, follow: true }
  };
}
