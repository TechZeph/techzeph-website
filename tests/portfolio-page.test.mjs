import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const portfolio = readFileSync(new URL("src/pages/portfolio.astro", root), "utf8");
const links = readFileSync(new URL("src/components/PortfolioLinks.astro", root), "utf8");
const home = readFileSync(new URL("src/pages/index.astro", root), "utf8");
const menu = readFileSync(new URL("src/components/SiteMenu.astro", root), "utf8");
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const workflow = readFileSync(new URL(".github/workflows/deploy.yml", root), "utf8");

assert.match(portfolio, /A focused portfolio of work, profiles, and current direction/);
assert.match(links, /https:\/\/github\.com\/TechZeph/);
assert.match(links, /linkedin\.com\/in\/elliot-harrison-1211413a3/);
assert.match(links, /https:\/\/dukespoboys\.com/);
assert.match(home, /<PortfolioLinks \/>/);
assert.match(menu, /href: "\/portfolio"/);
assert.equal(pkg.scripts["sync:github-projects"], undefined);
assert.doesNotMatch(workflow, /schedule:|sync:github-projects|Sync GitHub project data/);
assert.equal(existsSync(new URL("scripts/sync-github-projects.mjs", root)), false);
assert.equal(existsSync(new URL("src/data/github-projects.generated.ts", root)), false);
assert.equal(existsSync(new URL("src/data/projects.ts", root)), false);
assert.equal(existsSync(new URL("src/pages/projects/[slug].astro", root)), false);
