import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import i18nextPlugin from "eslint-plugin-i18next";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Disable stylistic rules that conflict with Prettier — must come AFTER the
  // Next configs so its turn-offs win. (jsx-a11y + react-hooks are already
  // provided by eslint-config-next/core-web-vitals; do not re-register them or
  // flat config throws "Cannot redefine plugin".)
  eslintConfigPrettier,
  {
    plugins: { "unused-imports": pluginUnusedImports },
    rules: {
      // Auto-fixable removal of unused imports (the TS rule only warns).
      "unused-imports/no-unused-imports": "warn",
    },
  },
  {
    // i18n gate: flag hardcoded user-facing strings so they go through next-intl.
    // `markupOnly` limits it to JSX text + the listed props to keep noise low.
    // "warn" (not "error") — surfaces without failing `pnpm lint`.
    plugins: { i18next: i18nextPlugin },
    rules: {
      "i18next/no-literal-string": [
        "warn",
        {
          markupOnly: true,
          ignoreAttribute: [
            "data-qa",
            "data-testid",
            "className",
            "style",
            "key",
            "id",
            "name",
            "type",
            "href",
            "src",
            "rel",
            "target",
            "variant",
            "size",
            "align",
            "side",
          ],
        },
      ],
    },
    ignores: ["**/__tests__/**", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
