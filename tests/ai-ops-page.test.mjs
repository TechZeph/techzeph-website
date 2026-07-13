import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pagePath = new URL('../src/pages/ai-ops.astro', import.meta.url);
assert.equal(existsSync(pagePath), true, 'generic /ai-ops page should exist');

const page = readFileSync(pagePath, 'utf8');
const menu = readFileSync(new URL('../src/components/SiteMenu.astro', import.meta.url), 'utf8');

assert.match(page, /Practical AI and website systems for small businesses/);
assert.match(page, /AI Workflow Audit/);
assert.match(page, /AI Ops Starter System/);
assert.match(page, /admin, content, customer replies, and internal documentation/);
assert.match(page, /hello@techzeph\.co\.uk/);
assert.doesNotMatch(page, /outdoor\/adventure businesses/);
assert.doesNotMatch(page, /Guided walks and local tour operators/);
assert.doesNotMatch(page, /Best fit/);
assert.doesNotMatch(page, /\/best-fit/);
assert.doesNotMatch(page, /validation loop/);
assert.doesNotMatch(page, /One offer, multiple niche tests/);
assert.doesNotMatch(page, /The public page stays generic so ads can test different audiences/);
assert.match(menu, /href: "\/ai-ops"/);
assert.doesNotMatch(menu, /href: "\/ai-ops-outdoor"/);
assert.match(menu, /AI Ops/);
