// Extends `expect` with DOM matchers (toBeInTheDocument, etc.).
import "@testing-library/jest-dom";
// Extends `expect` with `toHaveNoViolations` for jest-axe accessibility assertions.
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom implements none of the observer/layout APIs below. Any component using
// framer-motion's `whileInView` or `useScroll`, or the `useIsMobile` hook,
// throws on render without them (`IntersectionObserver is not defined`), so they
// are stubbed globally rather than re-declared in each suite.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockObserver
});
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockObserver
});

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    })
  });
}

window.scrollTo = jest.fn();
