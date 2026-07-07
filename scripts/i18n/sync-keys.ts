#!/usr/bin/env tsx
/**
 * i18n:sync-keys — ensures bn.json has every key that en.json has.
 * Missing keys are added with `__TODO__: <english value>`.
 * Existing values (including __TODO__) are left untouched.
 * Extra keys in non-base locales are left in place.
 *
 * Usage:
 *   pnpm i18n:sync-keys
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(__dirname, "../../");
const MESSAGES_DIR = join(ROOT, "messages");
const LOCALES = ["bn"];
const BASE_LOCALE = "en";

function deepMergeWithTodos(
  base: Record<string, unknown>,
  target: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(base)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in result)) {
      // Key missing — add __TODO__ placeholder
      if (typeof value === "object" && value !== null) {
        result[key] = deepMergeWithTodos(value as Record<string, unknown>, {}, path);
      } else {
        result[key] = `__TODO__: ${value}`;
        console.log(`  + ${path}`);
      }
    } else if (
      typeof value === "object" &&
      value !== null &&
      typeof result[key] === "object" &&
      result[key] !== null
    ) {
      result[key] = deepMergeWithTodos(
        value as Record<string, unknown>,
        result[key] as Record<string, unknown>,
        path
      );
    }
  }
  return result;
}

const basePath = join(MESSAGES_DIR, `${BASE_LOCALE}.json`);
if (!existsSync(basePath)) {
  console.error(`✗ missing base locale ${BASE_LOCALE}.json in messages/`);
  process.exit(1);
}

const base = JSON.parse(readFileSync(basePath, "utf-8")) as Record<string, unknown>;

for (const locale of LOCALES) {
  const path = join(MESSAGES_DIR, `${locale}.json`);
  const existing = existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf-8")) as Record<string, unknown>)
    : {};

  console.log(`\nSyncing ${locale}.json…`);
  const merged = deepMergeWithTodos(base, existing);
  writeFileSync(path, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(`  ✓ written`);
}
