import { ORGANIZATION, SITE_CONFIG, SITE_URL } from "@/config/site.config";

export type JsonLdSchema = Record<string, unknown>;

/**
 * Stable `@id` anchors. Every schema that refers to the site or the organization
 * points at these rather than re-declaring the entity, so search and answer engines
 * resolve one node instead of several near-duplicates.
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

function absolute(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema(): JsonLdSchema {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_CONFIG.siteName,
    legalName: ORGANIZATION.legalName,
    url: SITE_URL,
    logo: absolute(ORGANIZATION.logoPath),
    description: SITE_CONFIG.defaultDescription,
    ...(ORGANIZATION.sameAs.length > 0 && { sameAs: ORGANIZATION.sameAs }),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: ORGANIZATION.contact.email,
      areaServed: ORGANIZATION.contact.areaServed
    }
  };
}

export function webSiteSchema(): JsonLdSchema {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: SITE_CONFIG.siteName,
    description: SITE_CONFIG.defaultDescription,
    inLanguage: (SITE_CONFIG.locale ?? "en_US").replace("_", "-"),
    publisher: { "@id": ORG_ID }
  };
}

export type BreadcrumbStep = { name: string; path: string };

export function breadcrumbSchema(trail: BreadcrumbStep[]): JsonLdSchema {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absolute(step.path)
    }))
  };
}

export type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  /** ISO 8601. Undated content is the single most common reason an answer engine skips a source. */
  datePublished: string;
  dateModified?: string;
  imagePath?: string;
  authorName?: string;
};

export function articleSchema(input: ArticleInput): JsonLdSchema {
  return {
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absolute(input.path) },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.imagePath && { image: absolute(input.imagePath) }),
    author: { "@type": "Person", name: input.authorName ?? SITE_CONFIG.siteName },
    publisher: { "@id": ORG_ID }
  };
}

export type FaqItem = { question: string; answer: string };

export function faqSchema(items: FaqItem[]): JsonLdSchema {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

export type ProductInput = {
  name: string;
  description: string;
  path: string;
  imagePath?: string;
  sku?: string;
  price?: {
    amount: number;
    currency: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
  };
};

export function productSchema(input: ProductInput): JsonLdSchema {
  return {
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    ...(input.imagePath && { image: absolute(input.imagePath) }),
    ...(input.sku && { sku: input.sku }),
    brand: { "@id": ORG_ID },
    ...(input.price && {
      offers: {
        "@type": "Offer",
        price: input.price.amount,
        priceCurrency: input.price.currency,
        availability: `https://schema.org/${input.price.availability ?? "InStock"}`,
        url: absolute(input.path)
      }
    })
  };
}

export type ServiceOffer = {
  name: string;
  description: string;
  /** Numeric floor of the tier. "$35+" is a floor, so it is emitted as a price range. */
  priceFrom: number;
  /** Set when the tier has no upper bound ("$35+"), so the offer is a range not a point. */
  openEnded?: boolean;
};

export type ServiceInput = {
  name: string;
  description: string;
  path: string;
  areaServed: string;
  currency: string;
  offers: ServiceOffer[];
};

/**
 * `ProfessionalService` for the commission business itself.
 *
 * Distinct from the per-tier `productSchema` calls: those describe what you can buy,
 * this describes who is selling and where they work. Answer engines use the
 * `areaServed` + `provider` pair to answer "who does X near me" questions, which is
 * the shape most commission queries actually take.
 *
 * Prices are facts, not decoration — every number here traces to `SITE.pricing.tiers`,
 * which was transcribed from the artist's own published pricing. Do not add
 * `aggregateRating` or `review` here from the testimonials: those are real quotes but
 * carry no star ratings, and inventing the numeric rating that schema wants is exactly
 * the fabrication that earns a manual action.
 */
export function serviceSchema(input: ServiceInput): JsonLdSchema {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: input.areaServed },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: input.name,
      itemListElement: input.offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: offer.name, description: offer.description },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: input.currency,
          ...(offer.openEnded ? { minPrice: offer.priceFrom } : { price: offer.priceFrom })
        }
      }))
    }
  };
}
