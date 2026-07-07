export type OgImage = {
  path: string;
  width: number;
  height: number;
  alt: string;
};

export type SiteConfig = {
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  siteUrl: string;
  ogImage: OgImage;
  locale?: string;
  keywords?: string[];
};

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
};
