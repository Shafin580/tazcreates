const nextJest = require("next/jest");

// next/jest wires Next's SWC transform (JSX/TS), CSS/asset mocks, and env — no
// babel config, so the app keeps SWC for dev/build. Must be CommonJS: an async
// default-exported config (ESM) does not apply the transform reliably.
const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"]
  },
  // Polyfills (TextEncoder/undici fetch/Response) — required for msw in jsdom.
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  testMatch: ["<rootDir>/**/__tests__/**/*.test.(ts|tsx)"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  // ESM-only deps that must be transformed (default is to skip node_modules).
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm/)?(radix-ui|@radix-ui|lucide-react|sonner|cmdk|framer-motion|lenis|next-intl|use-intl|headers-polyfill)(/|@))"
  ]
});
