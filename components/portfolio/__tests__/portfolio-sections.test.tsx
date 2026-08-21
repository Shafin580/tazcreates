/**
 * Section-level contract tests.
 *
 * Each section is checked for: the data-qa hooks the interactive-element
 * convention requires, label/role association on anything clickable, real
 * (non-empty) alt text on every image, and zero axe violations.
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SITE } from "@/content/site";

// next/image renders a plain <img> here so alt/src assertions stay meaningful.
// Only real DOM attributes are forwarded — spreading Next-only props such as
// `fill` or `priority` makes React warn about unknown DOM attributes.
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, width, height, className, ...rest } = props;
    const dataAttrs = Object.fromEntries(
      Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))
    );
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : ""}
        alt={typeof alt === "string" ? alt : ""}
        width={width as number | undefined}
        height={height as number | undefined}
        className={className as string | undefined}
        {...dataAttrs}
      />
    );
  }
}));

// matchMedia / IntersectionObserver / ResizeObserver stubs live in jest.setup.ts.

import { HeroSection } from "../hero-section";
import { ServicesMarquee } from "../services-marquee";
import { GallerySection } from "../gallery-section";
import { PricingSection } from "../pricing-section";
import { ReviewsSection } from "../reviews-section";
import { CtaSection } from "../cta-section";
import { SiteFooter } from "../site-footer";

describe("HeroSection", () => {
  it("renders the artist name as the h1", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1, name: SITE.artist.name })).toBeInTheDocument();
  });

  it("exposes the CTA as a link to Instagram with a qa hook", () => {
    render(<HeroSection />);
    const cta = screen.getByRole("link", { name: new RegExp(SITE.cta.primary, "i") });
    expect(cta).toHaveAttribute("href", SITE.cta.href);
    expect(cta).toHaveAttribute("data-qa", "portfolio.hero.cta");
    expect(cta).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("has no axe violations", async () => {
    const { container } = render(<HeroSection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ServicesMarquee", () => {
  it("announces each service exactly once despite the duplicated track", () => {
    render(<ServicesMarquee />);
    // The second copy is aria-hidden, so accessible queries see one of each.
    for (const service of SITE.services) {
      expect(
        screen.getAllByText(service).filter((el) => !el.closest("[aria-hidden='true']"))
      ).toHaveLength(1);
    }
  });
});

describe("GallerySection", () => {
  it("renders every artwork as a labelled button with a qa hook and real alt text", () => {
    render(<GallerySection />);
    for (const item of SITE.gallery.items) {
      const button = screen.getByRole("button", {
        name: new RegExp(item.caption.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      });
      expect(button).toHaveAttribute("data-qa", `portfolio.gallery.card.${item.id}`);
      expect(button).toHaveAttribute("type", "button");
      expect(within(button).getByRole("img")).toHaveAccessibleName(item.alt);
    }
  });

  it("opens a labelled modal dialog when a portrait is clicked", async () => {
    const user = userEvent.setup();
    render(<GallerySection />);
    const first = SITE.gallery.items[0];

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: new RegExp(first.caption, "i") }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName(first.caption);
    // Exactly one close affordance is exposed; the backdrop is aria-hidden.
    expect(within(dialog).getByRole("button", { name: SITE.a11y.closeViewer })).toBeInTheDocument();
    expect(dialog.querySelector('[data-qa="portfolio.gallery.lightbox-backdrop"]')).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("disables Previous on the first portrait", async () => {
    const user = userEvent.setup();
    render(<GallerySection />);
    await user.click(
      screen.getByRole("button", { name: new RegExp(SITE.gallery.items[0].caption, "i") })
    );
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: SITE.a11y.prevPortrait })).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: SITE.a11y.nextPortrait })).toBeEnabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<GallerySection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("PricingSection", () => {
  it("renders every tier with its price", () => {
    render(<PricingSection />);
    for (const tier of SITE.pricing.tiers) {
      expect(screen.getByRole("heading", { name: tier.tier })).toBeInTheDocument();
      expect(screen.getByText(tier.price)).toBeInTheDocument();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<PricingSection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ReviewsSection", () => {
  it("pairs each quote with its author", () => {
    render(<ReviewsSection />);
    for (const review of SITE.reviews.items) {
      const quote = screen.getByText(review.quote);
      const figure = quote.closest("figure");
      expect(figure).not.toBeNull();
      expect(within(figure as HTMLElement).getByText(review.name)).toBeInTheDocument();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<ReviewsSection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CtaSection and SiteFooter", () => {
  it("points both contact routes at the real destinations", () => {
    render(<SiteFooter />);
    const instagram = screen.getByRole("link", { name: new RegExp(SITE.contact.instagramHandle) });
    expect(instagram).toHaveAttribute("href", SITE.contact.instagramUrl);
    expect(instagram).toHaveAttribute("data-qa", "portfolio.footer.instagram");

    const email = screen.getByRole("link", { name: new RegExp(SITE.contact.email) });
    expect(email).toHaveAttribute("href", `mailto:${SITE.contact.email}`);
    expect(email).toHaveAttribute("data-qa", "portfolio.footer.email");
  });

  it("has no axe violations", async () => {
    const cta = render(<CtaSection />);
    expect(await axe(cta.container)).toHaveNoViolations();
    const footer = render(<SiteFooter />);
    expect(await axe(footer.container)).toHaveNoViolations();
  });
});
