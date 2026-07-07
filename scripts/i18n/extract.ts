#!/usr/bin/env tsx
/**
 * i18n:extract — scans source files for hardcoded strings not wrapped in t().
 *
 * Outputs a list of files + line numbers with suspected hardcoded English text
 * in JSX text content and certain props (placeholder, title, label, aria-label,
 * alt, tooltip, description).
 *
 * This is a heuristic scanner — it will have false positives (URLs, IDs, etc.).
 * Use as a discovery tool, not as a parser.
 *
 * Usage:
 *   pnpm i18n:extract
 *   pnpm i18n:extract --output=report.json
 */

import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from "fs";
import { join, resolve, extname } from "path";

const ROOT = resolve(__dirname, "../../");
// Template source roots (single-app layout). Only dirs that exist are scanned.
const SCAN_ROOTS = ["app", "components", "hooks", "lib"];

const outputFile = process.argv
  .find((a) => a.startsWith("--output="))
  ?.replace("--output=", "");

const SKIP_PATTERNS = [
  /^https?:\/\//, // URLs
  /^\/[a-z]/, // paths
  /^\d+$/, // pure numbers
  /^[A-Z_]{3,}$/, // constants
  /^[a-z-]+$/, // single lowercase words / kebab-case
  /^\s*$/ // whitespace
];

const ENGLISH_PROP_RE =
  /(?:placeholder|title|label|aria-label|aria-labelledby|alt|description|tooltip|emptyText)=["']([^"']+)["']/g;
const JSX_TEXT_RE = />\s*([A-Z][a-zA-Z\s,.'!?:;()/\-]{4,})\s*</g;

interface Finding {
  file: string;
  line: number;
  text: string;
  type: "jsx-text" | "prop";
}

function isEnglish(s: string): boolean {
  if (SKIP_PATTERNS.some((p) => p.test(s.trim()))) return false;
  // Must contain at least one word ≥3 chars and start with uppercase
  return /[A-Z][a-z]{2,}/.test(s);
}

function* walkDir(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".next", "dist", "__tests__"].includes(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) yield* walkDir(full);
    else if ([".tsx", ".jsx"].includes(extname(full))) yield full;
  }
}

const findings: Finding[] = [];

for (const root of SCAN_ROOTS) {
  const dir = join(ROOT, root);
  if (!existsSync(dir)) continue;
  for (const file of walkDir(dir)) {
    const src = readFileSync(file, "utf-8");
    const lines = src.split("\n");

    lines.forEach((line, idx) => {
      // Check JSX text
      for (const m of line.matchAll(JSX_TEXT_RE)) {
        if (isEnglish(m[1].trim())) {
          findings.push({
            file: file.replace(ROOT, ""),
            line: idx + 1,
            text: m[1].trim(),
            type: "jsx-text"
          });
        }
      }
      // Check props
      for (const m of line.matchAll(ENGLISH_PROP_RE)) {
        if (isEnglish(m[1].trim())) {
          findings.push({
            file: file.replace(ROOT, ""),
            line: idx + 1,
            text: m[1].trim(),
            type: "prop"
          });
        }
      }
    });
  }
}

if (outputFile) {
  writeFileSync(resolve(process.cwd(), outputFile), JSON.stringify(findings, null, 2), "utf-8");
  console.log(`Wrote ${findings.length} findings to ${outputFile}`);
} else {
  for (const f of findings) {
    console.log(`${f.file}:${f.line}: [${f.type}] ${f.text}`);
  }
  console.log(`\n${findings.length} suspected hardcoded strings found.`);
}
