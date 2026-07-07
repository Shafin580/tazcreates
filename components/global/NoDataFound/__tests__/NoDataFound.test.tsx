import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { NoDataFound } from "../index";
import { Button } from "../../../ui/button";

describe("NoDataFound", () => {
  it("renders the default title and description", () => {
    render(<NoDataFound />);
    expect(screen.getByText("No data found")).toBeInTheDocument();
    expect(
      screen.getByText("There's nothing to display at the moment.")
    ).toBeInTheDocument();
  });

  it("renders a custom title and description", () => {
    render(
      <NoDataFound
        title="No branches found"
        description="Add your first branch to get started."
      />
    );
    expect(screen.getByText("No branches found")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first branch to get started.")
    ).toBeInTheDocument();
  });

  it("renders an action button passed as children", () => {
    render(
      <NoDataFound title="Empty">
        <Button data-qa="test.empty.create">Create one</Button>
      </NoDataFound>
    );
    expect(
      screen.getByRole("button", { name: /create one/i })
    ).toBeInTheDocument();
  });

  it("uses the heading role for the title (h3)", () => {
    render(<NoDataFound title="Empty state" />);
    const heading = screen.getByRole("heading", { name: /empty state/i });
    expect(heading.tagName).toBe("H3");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <NoDataFound title="No branches" description="Try a different filter." />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe checks with an action button child", async () => {
    const { container } = render(
      <NoDataFound title="No data">
        <Button data-qa="test.empty.create">Create</Button>
      </NoDataFound>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
