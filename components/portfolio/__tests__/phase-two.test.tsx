/**
 * Contract tests for the phase-two additions: navigation, FAQ, support, and the
 * commission form.
 */
import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SITE } from "@/content/site";
import { commissionSchema, commissionFormSchema } from "@/lib/commission-schema";

// `next-intl` ships ESM that jest will not transform here; the repo's established
// pattern is to mock it and
// read the real messages file, so the shared `CustomSelect` still gets true strings.
jest.mock("next-intl", () => {
  const actualReact = jest.requireActual("react") as typeof React;
  const messages = jest.requireActual("../../../messages/en.json") as Record<string, unknown>;
  const readMessage = (path: string) =>
    path.split(".").reduce<unknown>((value, segment) => {
      if (!value || typeof value !== "object") return undefined;
      return (value as Record<string, unknown>)[segment];
    }, messages);

  return {
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
      actualReact.createElement(actualReact.Fragment, null, children),
    useTranslations: (namespace: string) => (key: string) => {
      const message = readMessage(`${namespace}.${key}`);
      return typeof message === "string" ? message : `${namespace}.${key}`;
    }
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, width, height, className } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : ""}
        alt={typeof alt === "string" ? alt : ""}
        width={width as number | undefined}
        height={height as number | undefined}
        className={className as string | undefined}
      />
    );
  }
}));

// The Turnstile widget talks to Cloudflare; stub it so the form can be exercised.
jest.mock("@marsidev/react-turnstile", () => ({
  Turnstile: () => <div data-testid="turnstile" />
}));

import { SiteHeader } from "../site-header";
import { FaqSection } from "../faq-section";
import { ProcessSection } from "../process-section";
import { SupportSection } from "../support-section";
import { CommissionForm } from "../commission-form";
import { MotionToggle } from "../motion-toggle";
import { MotionPreferenceProvider } from "../motion-preference";

const wrap = (ui: React.ReactElement) =>
  render(<MotionPreferenceProvider>{ui}</MotionPreferenceProvider>);

describe("SiteHeader", () => {
  it("renders a link for every nav section", () => {
    wrap(<SiteHeader />);
    for (const link of SITE.nav.links) {
      const anchors = screen.getAllByRole("link", { name: link.label });
      expect(anchors.length).toBeGreaterThan(0);
      expect(anchors[0]).toHaveAttribute("href", link.href);
    }
  });

  it("exposes the commission CTA and a labelled mobile menu trigger", () => {
    wrap(<SiteHeader />);
    const ctas = screen.getAllByRole("link", { name: SITE.nav.cta });
    expect(ctas.length).toBeGreaterThan(0);
    expect(ctas[0]).toHaveAttribute("href", "#commission");
    expect(screen.getByRole("button", { name: SITE.a11y.openMenu })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = wrap(<SiteHeader />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MotionToggle", () => {
  it("is a switch that reports and flips its state", async () => {
    const user = userEvent.setup();
    wrap(<MotionToggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("data-qa", "portfolio.global.motion-toggle");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).toHaveAttribute("data-motion", "reduced");
    await user.click(toggle);
    expect(document.documentElement).not.toHaveAttribute("data-motion");
  });
});

describe("FaqSection", () => {
  it("renders every question as a heading, which is what answer engines match on", () => {
    wrap(<FaqSection />);
    for (const item of SITE.faq.items) {
      expect(screen.getByRole("heading", { name: item.question })).toBeInTheDocument();
    }
  });

  it("has no axe violations", async () => {
    const { container } = wrap(<FaqSection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ProcessSection", () => {
  it("renders the four steps in order", () => {
    wrap(<ProcessSection />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(SITE.process.steps.length);
    SITE.process.steps.forEach((step, i) => {
      expect(within(items[i]).getByRole("heading", { name: step.title })).toBeInTheDocument();
    });
  });
});

describe("SupportSection", () => {
  it("links to the artist's Buy Me a Coffee page", () => {
    wrap(<SupportSection />);
    const link = screen.getByRole("link", { name: new RegExp(SITE.support.cta, "i") });
    expect(link).toHaveAttribute("href", `https://buymeacoffee.com/${SITE.support.username}`);
    expect(link).toHaveAttribute("data-qa", "portfolio.support.cta");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("never ships the placeholder handle in the URL", () => {
    // The section is designed to render WITHOUT a link while the handle is unset; this
    // guards the opposite direction — that a placeholder never reaches a live href.
    wrap(<SupportSection />);
    const link = screen.queryByRole("link", { name: new RegExp(SITE.support.cta, "i") });
    expect(link?.getAttribute("href")).not.toContain("__TODO__");
  });

  it("has no axe violations", async () => {
    const { container } = wrap(<SupportSection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CommissionForm", () => {
  it("labels every visible control and carries qa hooks", () => {
    wrap(<CommissionForm />);
    const f = SITE.commission.fields;
    expect(screen.getByLabelText(f.name)).toBeInTheDocument();
    expect(screen.getByLabelText(f.email)).toBeInTheDocument();
    expect(screen.getByLabelText(f.description)).toBeInTheDocument();
    expect(screen.getByLabelText(f.consent)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: f.submit })).toHaveAttribute(
      "data-qa",
      "portfolio.commission.submit"
    );
  });

  it("keeps the honeypot out of the accessibility tree", () => {
    const { container } = wrap(<CommissionForm />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
  });

  it("has no axe violations", async () => {
    const { container } = wrap(<CommissionForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("commission schema", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    portraitType: "duo" as const,
    people: 2,
    description: "A portrait of the two of us from our graduation photo.",
    consent: true as const,
    turnstileToken: "token"
  };

  it("accepts a complete request", () => {
    expect(commissionSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad email, a missing consent, and a too-short description", () => {
    expect(commissionSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(commissionSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(commissionSchema.safeParse({ ...valid, description: "short" }).success).toBe(false);
  });

  it("accepts a filled honeypot at the schema layer so the route can drop it silently", () => {
    // Rejecting here would answer 400 and tell a bot which field caught it. The route
    // handler checks `company` after parsing and returns 200 without sending.
    expect(commissionSchema.safeParse({ ...valid, company: "spam corp" }).success).toBe(true);
  });

  it("requires a turnstile token server-side but not in the client form shape", () => {
    const withoutToken = { ...valid, turnstileToken: undefined };
    delete (withoutToken as { turnstileToken?: string }).turnstileToken;
    expect(commissionSchema.safeParse(withoutToken).success).toBe(false);
    expect(commissionFormSchema.safeParse(withoutToken).success).toBe(true);
  });
});
