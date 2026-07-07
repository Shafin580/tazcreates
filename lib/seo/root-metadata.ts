import type { Metadata, Viewport } from "next";
import type { SiteConfig } from "./types";

export function buildRootMetadata(config: SiteConfig): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? config.siteUrl;
  const locale = config.locale ?? "en_US";
  const ogImage = {
    url: config.ogImage.path,
    width: config.ogImage.width,
    height: config.ogImage.height,
    alt: config.ogImage.alt
  };

  return {
    metadataBase: new URL(siteUrl),
    title: { default: config.defaultTitle, template: config.titleTemplate },
    description: config.defaultDescription,
    applicationName: config.siteName,
    keywords: config.keywords,
    authors: [{ name: config.siteName }],
    creator: config.siteName,
    publisher: config.siteName,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      siteName: config.siteName,
      title: config.defaultTitle,
      description: config.defaultDescription,
      url: "/",
      locale,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title: config.defaultTitle,
      description: config.defaultDescription,
      images: [config.ogImage.path]
    },
    icons: { icon: "/favicon.ico" },
    robots: { index: true, follow: true }
  };
}

export const defaultViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  width: "device-width",
  initialScale: 1
};
