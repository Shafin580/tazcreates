import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

import { ComponentDemo } from "../_components/component-demo";

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
    useTranslations:
      (namespace: string) => (key: string, values?: Record<string, number | string>) => {
        const message = readMessage(`${namespace}.${key}`);
        if (typeof message !== "string") return `${namespace}.${key}`;
        return message.replace(/\{(\w+)\}/g, (token, name: string) =>
          values?.[name] === undefined ? token : String(values[name])
        );
      }
  };
});

jest.mock("next-themes", () => {
  const actualReact = jest.requireActual("react") as typeof React;
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) =>
      actualReact.createElement(actualReact.Fragment, null, children),
    useTheme: () => ({ theme: "light", setTheme: jest.fn() })
  };
});

jest.mock("@/components/active-theme", () => {
  const actualReact = jest.requireActual("react") as typeof React;
  return {
    ActiveThemeProvider: ({ children }: { children: React.ReactNode }) =>
      actualReact.createElement(actualReact.Fragment, null, children)
  };
});

jest.mock("@/components/ui/sonner", () => ({ Toaster: () => null }));

jest.mock("@/components/ui/tooltip", () => {
  const actualReact = jest.requireActual("react") as typeof React;
  return {
    TooltipProvider: ({ children }: { children: React.ReactNode }) =>
      actualReact.createElement(actualReact.Fragment, null, children)
  };
});

jest.mock("@/components/ui/scroll-area", () => {
  const actualReact = jest.requireActual("react") as typeof React;
  return {
    ScrollArea: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      actualReact.createElement("div", props, children)
  };
});

jest.mock("../_components/sections/foundations-demo", () => ({
  FoundationDemos: () => (
    <section>
      <h2>Foundations</h2>
    </section>
  )
}));
jest.mock("../_components/sections/forms-demo", () => ({
  FormDemos: () => (
    <section>
      <h2>Forms</h2>
    </section>
  )
}));
jest.mock("../_components/sections/navigation-demo", () => ({
  NavigationDemos: () => (
    <section>
      <h2>Navigation</h2>
    </section>
  )
}));
jest.mock("../_components/sections/overlays-demo", () => ({
  OverlayDemos: () => (
    <section>
      <h2>Overlays</h2>
    </section>
  )
}));
jest.mock("../_components/sections/data-display-demo", () => ({
  DataDisplayDemos: () => (
    <section>
      <h2>Data display</h2>
    </section>
  )
}));
jest.mock("../_components/sections/layout-feedback-demo", () => ({
  LayoutFeedbackDemos: () => (
    <section>
      <h2>Layout</h2>
    </section>
  )
}));
jest.mock("../_components/sections/custom-demo", () => ({
  CustomDemos: () => (
    <section>
      <h2>Custom</h2>
    </section>
  )
}));
jest.mock("../_components/sections/global-demo", () => ({
  GlobalDemos: () => (
    <section>
      <h2>Global</h2>
    </section>
  )
}));
jest.mock("../_components/sections/theme-demo", () => ({
  ThemeDemos: () => (
    <section>
      <h2>Theme</h2>
    </section>
  )
}));

describe("ComponentDemo", () => {
  it("renders the catalog shell with semantic page structure", () => {
    const { container } = render(<ComponentDemo />);

    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelectorAll("h2")).toHaveLength(9);
    expect(screen.getByRole("heading", { level: 1, name: "Component demo" })).toBeInTheDocument();

    const search = screen.getByRole("searchbox", { name: "Search components" });
    expect(search).toHaveAttribute("data-qa", "component-demo.catalog.search");
    expect(screen.getByText("Showing 105 of 105 components")).toBeInTheDocument();
  });

  it("filters catalog navigation by component name and source path", async () => {
    const user = userEvent.setup();
    render(<ComponentDemo />);

    await user.type(screen.getByRole("searchbox", { name: "Search components" }), "CustomSelect");

    const catalog = screen.getByRole("navigation", { name: "Component catalog" });
    const customSelectLink = within(catalog).getByRole("link", { name: "CustomSelect" });
    expect(customSelectLink).toHaveAttribute("href", "#demo-ui-custom-customselect");
    expect(customSelectLink).toHaveAttribute(
      "data-qa",
      "component-demo.catalog.link.demo-ui-custom-customselect"
    );
    expect(within(catalog).queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 105 components")).toBeInTheDocument();
  });

  it("passes an accessibility smoke check", async () => {
    const { container } = render(<ComponentDemo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
