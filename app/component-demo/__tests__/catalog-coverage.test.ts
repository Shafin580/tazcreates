import fs from "node:fs";
import path from "node:path";

import { demoCatalog, getDemoId } from "../_components/catalog";

const projectRoot = process.cwd();

function listTsxFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listTsxFiles(entryPath);
    return entry.name.endsWith(".tsx") ? [entryPath] : [];
  });
}

function toProjectPath(filePath: string) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

/**
 * Directories under `components/` that are NOT part of the shared design system
 * and therefore have no place in the component demo.
 *
 * `components/portfolio/` holds the marketing page's sections and motion
 * primitives. They are bound to `content/site.ts` and to their scroll position
 * on the page, so there is nothing meaningful to render in an isolated demo
 * frame — they are covered by `components/portfolio/__tests__/` instead.
 *
 * `components/seo/` holds `JsonLd`, which renders a `<script type="application/ld+json">`
 * tag and no visible UI — there is nothing meaningful to show in a demo frame. It is
 * exercised through the pages that mount it instead.
 */
const NON_CATALOG_DIRECTORIES = ["components/portfolio/", "components/seo/"];

describe("component demo catalog coverage", () => {
  const componentModules = listTsxFiles(path.join(projectRoot, "components"))
    .map(toProjectPath)
    .filter((filePath) => !filePath.includes("/__tests__/"))
    .filter((filePath) => !NON_CATALOG_DIRECTORIES.some((dir) => filePath.startsWith(dir)))
    .sort();
  const catalogSources = demoCatalog.map((entry) => entry.source).sort();

  it("accounts for every non-test component TSX module", () => {
    expect(catalogSources).toEqual(componentModules);
    expect(demoCatalog).toHaveLength(105);
  });

  it("uses unique source paths and anchor ids", () => {
    expect(new Set(catalogSources).size).toBe(demoCatalog.length);
    expect(new Set(demoCatalog.map((entry) => getDemoId(entry.source))).size).toBe(
      demoCatalog.length
    );
  });

  it("has a rendered demo frame for every catalog entry", () => {
    const sectionsDirectory = path.join(projectRoot, "app/component-demo/_components/sections");
    const sectionSource = fs
      .readdirSync(sectionsDirectory)
      .filter((fileName) => fileName.endsWith("-demo.tsx"))
      .map((fileName) => fs.readFileSync(path.join(sectionsDirectory, fileName), "utf8"))
      .join("\n");

    for (const entry of demoCatalog) {
      expect(sectionSource).toContain(`source="${entry.source}"`);
    }
  });
});
