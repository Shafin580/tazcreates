import type { Metadata } from "next";
import { LINKS } from "@/config/router.config";
import { SITE_CONFIG } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { SITE } from "@/content/site";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema, productSchema, serviceSchema } from "@/lib/seo/schemas";

import { Grain } from "@/components/portfolio/primitives/grain";
import { ScrollProgress } from "@/components/portfolio/primitives/scroll-progress";
import { SiteHeader } from "@/components/portfolio/site-header";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ServicesMarquee } from "@/components/portfolio/services-marquee";
import { AboutSection } from "@/components/portfolio/about-section";
import { GallerySection } from "@/components/portfolio/gallery-section";
import { PricingSection } from "@/components/portfolio/pricing-section";
import { ProcessSection } from "@/components/portfolio/process-section";
import { FaqSection } from "@/components/portfolio/faq-section";
import { ReviewsSection } from "@/components/portfolio/reviews-section";
import { SupportSection } from "@/components/portfolio/support-section";
import { CommissionSection } from "@/components/portfolio/commission-section";
import { CtaSection } from "@/components/portfolio/cta-section";
import { SiteFooter } from "@/components/portfolio/site-footer";

/**
 * Static HTML, deliberately.
 *
 * Registering the next-intl plugin makes routes dynamic by default, because
 * `i18n/request.ts` reads `requestLocale`. This page has exactly one locale and all of
 * its copy is a compile-time constant from `content/site.ts`, so there is nothing to
 * resolve per request — and static output is what AI crawlers and search engines read
 * most reliably (`geo-fundamentals` §6: server-rendered HTML, no JS execution needed).
 */
export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata(SITE_CONFIG, {
  // Full title, not just the role: `title.template` from the root layout applies to
  // CHILD route segments, and this page shares the root segment, so the template never
  // fires here. Without this the tab reads a bare "Portrait Artist".
  title: SITE_CONFIG.defaultTitle,
  description: SITE.meta.description,
  canonical: LINKS.HOME
});

/**
 * Numeric price floor for each tier. `SITE.pricing.tiers[].price` is display copy
 * ("$35+"), and schema needs a number — parsed here rather than duplicating the figure,
 * so the page and the structured data can never disagree.
 */
function priceFloor(display: string): { amount: number; openEnded: boolean } {
  return { amount: Number(display.replace(/[^0-9.]/g, "")), openEnded: display.includes("+") };
}

export default function Home() {
  const tierSchemas = SITE.pricing.tiers.map((tier) => {
    const { amount } = priceFloor(tier.price);
    return productSchema({
      name: `${tier.tier} portrait commission`,
      description: `Hand-drawn ${tier.tier.toLowerCase()} portrait — ${tier.people.toLowerCase()}. ${SITE.pricing.note}`,
      path: `${LINKS.HOME}#pricing`,
      imagePath: tier.artwork,
      sku: `commission-${tier.id}`,
      price: { amount, currency: "CAD" }
    });
  });

  const service = serviceSchema({
    name: "Custom hand-drawn portrait commissions",
    description: SITE.meta.description,
    path: LINKS.HOME,
    areaServed: "Canada",
    currency: "CAD",
    offers: SITE.pricing.tiers.map((tier) => {
      const { amount, openEnded } = priceFloor(tier.price);
      return {
        name: `${tier.tier} portrait`,
        description: tier.people,
        priceFrom: amount,
        openEnded
      };
    })
  });

  return (
    <>
      <a
        href="#main"
        data-qa="portfolio.global.skip-link"
        className="bg-foreground text-background focus:ring-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:px-5 focus:py-3 focus:ring-2 focus:outline-none">
        {SITE.a11y.skipToContent}
      </a>

      {/* Page-level structured data, rendered server-side. FAQ is the highest-value
          entry for answer engines; Product and ProfessionalService carry the real,
          published CAD prices. */}
      <JsonLd schema={[service, faqSchema([...SITE.faq.items]), ...tierSchemas]} />

      <ScrollProgress />
      <Grain />
      <SiteHeader />

      <main id="main" className="flex flex-col pt-16">
        <HeroSection />
        <ServicesMarquee />
        <AboutSection />
        <GallerySection />
        <PricingSection />
        <ProcessSection />
        <FaqSection />
        <ReviewsSection />
        <SupportSection />
        <CommissionSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
