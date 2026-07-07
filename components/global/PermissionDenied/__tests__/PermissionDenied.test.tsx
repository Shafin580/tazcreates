import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { PermissionDenied } from "../index";

describe("PermissionDenied", () => {
  it("renders the default title and description", () => {
    render(<PermissionDenied />);
    expect(
      screen.getByRole("heading", { name: /access denied/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you don't have permission to view this content/i)
    ).toBeInTheDocument();
  });

  it("renders a custom title and description", () => {
    render(
      <PermissionDenied
        title="No access to payroll"
        description="Only admins can view this section."
      />
    );
    expect(
      screen.getByRole("heading", { name: /no access to payroll/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/only admins can view this section/i)
    ).toBeInTheDocument();
  });

  it("does not render a back link by default", () => {
    render(<PermissionDenied />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a back link when showBackButton is true", () => {
    render(
      <PermissionDenied
        showBackButton
        backHref="/dashboard"
        backText="Return to dashboard"
      />
    );
    const link = screen.getByRole("link", { name: /return to dashboard/i });
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("uses the default back text and href when showBackButton is true with no overrides", () => {
    render(<PermissionDenied showBackButton />);
    const link = screen.getByRole("link", { name: /go back/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<PermissionDenied />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe accessibility checks with the back button shown", async () => {
    const { container } = render(
      <PermissionDenied showBackButton backHref="/home" backText="Go home" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
