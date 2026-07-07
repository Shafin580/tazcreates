#!/usr/bin/env tsx
/**
 * i18n:check — validates message-file parity across locales.
 *
 * Checks that every non-base locale (bn) has the same keys as the base (en) in
 * the root `messages/` directory. Missing keys are errors. Extra keys are
 * warnings. `__TODO__:` values are allowed (placeholder) but reported as warnings.
 *
 * Usage:
 *   pnpm i18n:check
 *   pnpm i18n:check --ci          (exit 1 on any missing key)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(__dirname, "../../");
const MESSAGES_DIR = join(ROOT, "messages");
const LOCALES = ["en", "bn"];
const BASE_LOCALE = "en";

const CI = process.argv.includes("--ci");

interface CheckResult {
  locale: string;
  missing: string[];
  extra: string[];
  todos: string[];
}

function flatKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatKeys(v, prefix ? `${prefix}.${k}` : k)
  );
}

function flatEntries(obj: unknown, prefix = ""): Array<[string, string]> {
  if (typeof obj !== "object" || obj === null) return [[prefix, String(obj)]];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatEntries(v, prefix ? `${prefix}.${k}` : k)
  );
}

function loadJson(path: string): unknown {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8"));
}

let errors = 0;
let warnings = 0;
const results: CheckResult[] = [];

const baseFile = join(MESSAGES_DIR, `${BASE_LOCALE}.json`);
const base = loadJson(baseFile);

if (!base) {
  console.error(`✗ missing base locale ${BASE_LOCALE}.json in messages/`);
  process.exit(1);
}

const baseKeys = new Set(flatKeys(base));

for (const locale of LOCALES) {
  if (locale === BASE_LOCALE) continue;
  const file = join(MESSAGES_DIR, `${locale}.json`);
  const data = loadJson(file);
  if (!data) {
    console.error(`✗ ${locale}.json not found`);
    errors++;
    continue;
  }

  const localeEntries = flatEntries(data);
  const localeKeys = new Set(localeEntries.map(([k]) => k));

  const missing = [...baseKeys].filter((k) => !localeKeys.has(k));
  const extra = [...localeKeys].filter((k) => !baseKeys.has(k));
  const todos = localeEntries
    .filter(([, v]) => v.startsWith("__TODO__:"))
    .map(([k]) => k);

  results.push({ locale, missing, extra, todos });

  if (missing.length) errors += missing.length;
  if (extra.length) warnings += extra.length;
  if (todos.length) warnings += todos.length;
}

// Report
for (const { locale, missing, extra, todos } of results) {
  if (!missing.length && !extra.length && !todos.length) {
    console.log(`✓ ${locale}.json — OK`);
    continue;
  }
  console.log(`\n${locale}.json:`);
  for (const k of missing) console.error(`  ✗ MISSING  ${k}`);
  for (const k of extra) console.warn(`  ⚠  EXTRA   ${k}`);
  for (const k of todos) console.warn(`  ~  TODO    ${k}`);
}

console.log(`\nSummary: ${errors} error(s), ${warnings} warning(s)`);

if (CI && errors > 0) process.exit(1);
