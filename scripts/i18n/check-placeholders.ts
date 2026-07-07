#!/usr/bin/env tsx
/**
 * i18n:check-placeholders — validates ICU placeholder-argument parity across locales.
 *
 * For every key present in BOTH en and a target locale (bn), the SET of ICU
 * argument names referenced by the translation must equal en's set. A mismatch means
 * the translation dropped, renamed, or invented an interpolation argument — e.g.
 * en `"{disbursed} of {total} ..."` but bn `"{disbursed} ... {totals} ..."`, or a
 * dropped `{plural}` selector. Such drift yields empty/undefined interpolation or a
 * silently un-pluralized string at runtime.
 *
 * A self-contained ICU parser is used (not a regex) so that branch *text* — e.g. the
 * `{All}` in `{count, plural, =0 {All} other {#}}` or the `{field}` in
 * `one {field}` — is correctly NOT counted as an argument.
 *
 * Usage:
 *   pnpm i18n:check-placeholders
 *   pnpm i18n:check-placeholders --ci      (exit 1 on any mismatch)
 *   pnpm i18n:check-placeholders --reset    (quarantine mismatches back to __TODO__)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(__dirname, "../../");
const MESSAGES_DIR = join(ROOT, "messages");
const TARGET_LOCALES = ["bn"];
const BASE_LOCALE = "en";

const CI = process.argv.includes("--ci");
// --reset: quarantine each mismatched translation back to "__TODO__: <english>" so a
// later manual/AI translation pass re-fills it. Broken interpolation never ships.
const RESET = process.argv.includes("--reset");

function loadJson(path: string): unknown {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8"));
}

function flatEntries(obj: unknown, prefix = ""): Array<[string, string]> {
  if (typeof obj !== "object" || obj === null) return [[prefix, String(obj)]];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatEntries(v, prefix ? `${prefix}.${k}` : k)
  );
}

/**
 * Extract the set of ICU argument names referenced by a message.
 * Walks the ICU grammar so that branch-message text is not mistaken for an argument.
 */
function icuArgs(msg: string): Set<string> {
  const args = new Set<string>();
  let i = 0;

  const skipWs = () => {
    while (i < msg.length && /\s/.test(msg[i])) i++;
  };

  // Consume one balanced { ... } when we don't need to parse its interior (number/date/time styles).
  const skipBalanced = () => {
    let depth = 1; // caller already consumed the opening '{'
    while (i < msg.length && depth > 0) {
      const c = msg[i];
      if (c === "'") {
        consumeApostrophe();
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
  };

  // ICU apostrophe escaping: '' = literal '. A lone ' only starts a quoted span when
  // immediately followed by a syntax char ({ } # |); otherwise it is a literal apostrophe
  // (so French "L'auto" / "d'abord" are handled correctly).
  const consumeApostrophe = () => {
    const next = msg[i + 1];
    if (next === "'") {
      i += 2; // escaped apostrophe
      return;
    }
    if (next === "{" || next === "}" || next === "#" || next === "|") {
      i += 2; // open quoted literal
      while (i < msg.length && msg[i] !== "'") i++;
      if (i < msg.length) i++; // closing '
      return;
    }
    i++; // lone literal apostrophe
  };

  // Parse a message body. If stopAtBrace, an unescaped '}' terminates (end of a branch).
  const parseMessage = (stopAtBrace: boolean) => {
    while (i < msg.length) {
      const c = msg[i];
      if (c === "}" && stopAtBrace) return;
      if (c === "'") {
        consumeApostrophe();
        continue;
      }
      if (c === "{") {
        parseArgument();
        continue;
      }
      i++;
    }
  };

  const parseArgument = () => {
    i++; // consume '{'
    skipWs();
    let name = "";
    while (i < msg.length && /[a-zA-Z0-9_]/.test(msg[i])) name += msg[i++];
    skipWs();
    if (name) args.add(name);

    if (msg[i] === "}") {
      i++; // simple {name}
      return;
    }
    if (msg[i] === ",") {
      i++;
      skipWs();
      let type = "";
      while (i < msg.length && /[a-zA-Z]/.test(msg[i])) type += msg[i++];
      skipWs();
      if (type === "plural" || type === "select" || type === "selectordinal") {
        if (msg[i] === ",") i++;
        parseOptions();
        if (msg[i] === "}") i++;
        return;
      }
      // number / date / time / custom — skip its style to the matching brace
      skipBalanced();
      return;
    }
    // malformed; bail out of this brace
    if (msg[i] === "}") i++;
  };

  // Sequence of: selector [offset:N] '{' message '}'
  const parseOptions = () => {
    while (i < msg.length) {
      skipWs();
      if (msg[i] === "}") return; // end of plural/select argument
      // skip selector token(s) until the branch '{'
      while (i < msg.length && msg[i] !== "{" && msg[i] !== "}") i++;
      if (msg[i] !== "{") return;
      i++; // consume branch-opening '{'
      parseMessage(true); // branch message — '#' and literal text ignored; nested args counted
      if (msg[i] === "}") i++; // consume branch-closing '}'
    }
  };

  parseMessage(false);
  return args;
}

const setEq = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((x) => b.has(x));

interface Mismatch {
  locale: string;
  key: string;
  enRaw: string;
  en: string[];
  loc: string[];
}

// Set a dotted key path inside a nested object (mutates).
function setNested(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

const mismatches: Mismatch[] = [];
let checkedKeys = 0;

const base = loadJson(join(MESSAGES_DIR, `${BASE_LOCALE}.json`));
if (!base) {
  console.error(`✗ missing base locale ${BASE_LOCALE}.json in messages/`);
  process.exit(1);
}
const enMap = new Map(flatEntries(base));

for (const locale of TARGET_LOCALES) {
  const data = loadJson(join(MESSAGES_DIR, `${locale}.json`));
  if (!data) {
    console.error(`✗ ${locale}.json not found`);
    continue;
  }
  const locMap = new Map(flatEntries(data));

  for (const [key, enVal] of enMap) {
    const locVal = locMap.get(key);
    if (locVal === undefined) continue; // parity handled by i18n:check
    if (typeof locVal !== "string" || locVal.startsWith("__TODO__:")) continue; // untranslated
    if (typeof enVal !== "string") continue;
    checkedKeys++;
    const enSet = icuArgs(enVal);
    const locSet = icuArgs(locVal);
    if (!setEq(enSet, locSet)) {
      mismatches.push({
        locale,
        key,
        enRaw: enVal,
        en: [...enSet].sort(),
        loc: [...locSet].sort()
      });
    }
  }
}

if (mismatches.length === 0) {
  console.log(`✓ placeholder parity OK (${checkedKeys} translated keys checked)`);
} else {
  console.log(
    `\n✗ ${mismatches.length} placeholder mismatch(es) (${checkedKeys} translated keys checked):\n`
  );
  for (const m of mismatches) {
    console.log(`  ${m.locale}  ${m.key}`);
    console.log(`      en : {${m.en.join(", ")}}`);
    console.log(`      ${m.locale} : {${m.loc.join(", ")}}`);
  }
}

if (RESET && mismatches.length > 0) {
  // Group by locale file, mutate, write once per file.
  const byFile = new Map<string, Mismatch[]>();
  for (const m of mismatches) {
    const path = join(MESSAGES_DIR, `${m.locale}.json`);
    (byFile.get(path) ?? byFile.set(path, []).get(path)!).push(m);
  }
  let reset = 0;
  for (const [path, ms] of byFile) {
    const obj = loadJson(path) as Record<string, unknown>;
    for (const m of ms) {
      setNested(obj, m.key, `__TODO__: ${m.enRaw}`);
      reset++;
    }
    writeFileSync(path, JSON.stringify(obj, null, 2) + "\n", "utf-8");
    console.log(`  ↩ reset ${ms.length} key(s) in ${path}`);
  }
  console.log(
    `\n↩ Quarantined ${reset} corrupted translation(s) back to __TODO__. Re-translate to refill.`
  );
}

if (CI && mismatches.length > 0) process.exit(1);
