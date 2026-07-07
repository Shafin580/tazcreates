import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { BackNavigation } from "../BackNavigation";

// next/link rendered as a plain anchor for jsdom — keeps the test focused on
// the component's structure rather than the framework.
jest.mock("next/link", () => {
  const actualReact = jest.requireActual("react") as typeof import("react");
  return {
    __esModule: true,
    default: ({
      href,
      children,
      ...rest
    }: {
      href: string;
      children: React.ReactNode;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      actualReact.createElement("a", { href, ...rest }, children),
  };
});

describe("BackNavigation", () => {
  it("renders a single interactive link with aria-label when routes is non-empty", () => {
    render(<BackNavigation routes={["/dashboard/employees"]} />);
    const link = screen.getByRole("link", { name: /go back/i });
    expect(link).toHaveAttribute("href", "/dashboard/employees");
  });

  it("does not nest a link inside a button (avoids nested-interactive violation)", () => {
    const { container } = render(
      <BackNavigation routes={["/dashboard/employees"]} />
    );
    // No <button> in the tree when routes exist — Button's `asChild` Slot merges
    // styling into the <a>, leaving just one interactive element.
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("a")).not.toBeNull();
  });

  it("falls back to a disabled button with aria-label when routes is empty", () => {
    render(<BackNavigation routes={[]} />);
    const btn = screen.getByRole("button", { name: /go back/i });
    expect(btn).toBeDisabled();
  });

  it("passes axe accessibility checks when active", async () => {
    const { container } = render(<BackNavigation routes={["/dashboard"]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe accessibility checks when disabled", async () => {
    const { container } = render(<BackNavigation routes={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
