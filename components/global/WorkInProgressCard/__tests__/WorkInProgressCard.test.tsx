import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { WorkInProgressCard } from "../index";

describe("WorkInProgressCard", () => {
  it("renders the default progress message", () => {
    render(<WorkInProgressCard />);
    expect(
      screen.getByText(/work in progress, please check back later/i)
    ).toBeInTheDocument();
  });

  it("renders a custom message when text.value is provided", () => {
    render(<WorkInProgressCard text={{ value: "Coming soon!" }} />);
    expect(screen.getByText(/coming soon!/i)).toBeInTheDocument();
  });

  it("exposes the card via role=status so screen readers can announce it", () => {
    render(<WorkInProgressCard text={{ value: "Coming soon!" }} />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/coming soon!/i);
  });

  it("hides the decorative SVG from assistive tech by default", () => {
    const { container } = render(<WorkInProgressCard />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("omits the SVG when image is explicitly null", () => {
    const { container } = render(<WorkInProgressCard image={null} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<WorkInProgressCard />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe accessibility checks without the illustration", async () => {
    const { container } = render(
      <WorkInProgressCard image={null} text={{ value: "Stay tuned." }} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
