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

describe("component demo catalog coverage", () => {
  const componentModules = listTsxFiles(path.join(projectRoot, "components"))
    .map(toProjectPath)
    .filter((filePath) => !filePath.includes("/__tests__/"))
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
