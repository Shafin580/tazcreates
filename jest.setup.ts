// Extends `expect` with DOM matchers (toBeInTheDocument, etc.).
import "@testing-library/jest-dom";
// Extends `expect` with `toHaveNoViolations` for jest-axe accessibility assertions.
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
