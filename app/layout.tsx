import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/portfolio/smooth-scroll";
import { MotionPreferenceProvider } from "@/components/portfolio/motion-preference";
import { BloomScrollProvider } from "@/components/portfolio/primitives/bloom";
import { ScrollVelocityProvider } from "@/components/portfolio/primitives/scroll-velocity";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/config/site.config";
import { buildRootMetadata, defaultViewport } from "@/lib/seo/root-metadata";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schemas";

// Display. SOFT + WONK are Fraunces' optical axes — they are what give the
// headings an inked, hand-set feel rather than a stock-serif one.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap"
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap"
});

// Handwritten accent — captions, margin notes, the signature.
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap"
});

// Site-wide metadata comes from config/site.config.ts, which derives its values from
// content/site.ts — never hand-write it here. Pages add their own via buildPageMetadata().
export const metadata: Metadata = buildRootMetadata(SITE_CONFIG);

export const viewport: Viewport = defaultViewport;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", fraunces.variable, manrope.variable, caveat.variable)}>
      <body className="bg-background text-foreground flex min-h-full flex-col overflow-x-hidden">
        {/* Entity-establishing schema, mounted once for the whole site. Page-level
            schema (Breadcrumb, FAQ, Product, Service) belongs in the page itself. */}
        <JsonLd schema={[organizationSchema(), webSiteSchema()]} />

        {/* MotionPreference is the outermost client provider: SmoothScroll reads it to
            decide whether to mount Lenis at all, and BloomScrollProvider opens the single
            scroll listener that every Bloom subscribes to. */}
        {/* The shipped `CustomSelect` primitive calls `useTranslations("Common")`, so
            it needs next-intl context even though this site's own copy lives in
            `content/site.ts` and is English-only. Only the `Common` namespace is passed
            down — the rest of `messages/en.json` is for the component demo and would be
            dead weight in the client bundle. Wire the full `[locale]` segment here if
            the site ever ships a second language. */}
        <NextIntlClientProvider locale="en" messages={{ Common: enMessages.Common }}>
          <MotionPreferenceProvider>
            <SmoothScroll>
              <BloomScrollProvider>
                <ScrollVelocityProvider>{children}</ScrollVelocityProvider>
              </BloomScrollProvider>
            </SmoothScroll>
          </MotionPreferenceProvider>
        </NextIntlClientProvider>

        <Toaster />
      </body>
    </html>
  );
}
