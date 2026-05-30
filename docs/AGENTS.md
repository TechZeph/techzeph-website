# AGENTS.md

Agent operating rules for `techzeph.github.io`.

This repository is a complete rewrite of `techzeph.co.uk` as a personal portfolio site. The previous TechZeph affiliate/SEO/content-review direction is no longer active for this repo.

The goal is to build a clean, fast, credible portfolio that can grow over time into a home for projects, experiments, case studies, blog posts, GitHub work, UI/UX component explorations, and future YouTube-related material.

---

## 1. Repository identity

- Repo name: `techzeph.github.io`
- Local path: `~/Workspace/repos/techzeph.github.io`
- Public domain target: `https://techzeph.co.uk`
- Hosting target: GitHub Pages behind Cloudflare
- Current state: blank canvas, only initial Astro project setup exists
- Primary purpose: main personal portfolio
- Scope: not limited to cyber/dev/AI; it should support any serious project work over time

This is not an affiliate site, product-review site, SEO farm, or business landing page.

---

## 2. Project priorities

Prioritise these in order:

1. Clear portfolio structure
2. Static-first Astro architecture
3. Fast loading and minimal client-side JavaScript
4. Mobile-first responsive layout
5. Accessibility
6. Clean reusable components
7. Easy project/case-study publishing
8. Maintainable Tailwind usage
9. Safe deployment through GitHub Pages/Cloudflare
10. Documentation that a local AI/coding agent can understand later

Avoid overengineering. This repo should stay understandable to a solo developer.

---

## 3. Current stack

Expected stack:

- Astro
- Tailwind
- GitHub
- GitHub Pages
- Cloudflare
- pnpm preferred
- TypeScript preferred where useful

The stack is not completely fixed. Agents may suggest changes, but must explain the trade-offs before making them.

Do not assume the project uses old Astro or old Tailwind patterns. Check the actual repo files first.

---

## 4. MCP usage rules

Available/expected MCPs:

- Astro Docs MCP
- Context7
- Playwright MCP
- Chrome DevTools MCP
- GitHub MCP, disabled unless explicitly enabled
- Cloudflare MCP, disabled unless explicitly enabled

### Astro Docs MCP

Use Astro Docs MCP before making framework-level Astro decisions involving:

- Routing
- Layouts
- Content collections
- Astro config
- Integrations
- Static output
- GitHub Pages deployment
- Image handling
- Markdown/content patterns

### Context7

Use Context7 before making changes involving:

- Tailwind
- Vite
- TypeScript
- pnpm/package usage
- third-party libraries
- current framework/package APIs

### Playwright MCP

Use Playwright for browser-flow checks after UI/navigation changes, especially:

- homepage loads
- nav works
- project pages open
- contact links work
- responsive layouts work
- no obvious broken routes

### Chrome DevTools MCP

Use Chrome DevTools for:

- console errors
- network errors
- layout inspection
- performance inspection
- accessibility/layout debugging

### GitHub MCP

Do not use GitHub MCP unless explicitly instructed.

Never create PRs, issues, push branches, or change repo settings without explicit permission.

### Cloudflare MCP

Do not use Cloudflare MCP unless explicitly instructed.

Never alter DNS, cache settings, redirects, analytics, security rules, or domain configuration without explicit permission.

---

## 5. Site structure

Target pages:

- `/` — Home
- `/about` — About
- `/projects` — Projects index
- `/projects/[slug]` — Individual project case studies
- `/contact` — Contact
- `/blog` — Later
- `/youtube` — Later
- `/github` — Optional GitHub-focused page or external link
- `/components` or `/ui` — UI/UX component showcase

Do not build the blog or YouTube section deeply until there is actual content or an explicit task.

It is acceptable to create placeholder routes only if they are useful and clearly marked as placeholders.

Avoid dead nav links in production. If a section is not ready, either omit it from the main nav or mark it clearly as “coming later.”

---

## 6. Content model

This portfolio should support project case studies.

Preferred long-term structure:

```text
src/content/projects/
src/content/blog/
src/pages/projects/
src/pages/blog/
src/components/
src/layouts/
src/styles/
```

Use Astro content collections when the project/blog content becomes substantial enough to justify them.

For the first few pages, simple `.astro` pages or local data files are acceptable if they keep the build simpler.

Do not add a CMS unless explicitly requested.

---

## 7. Project case-study rules

Case studies should clearly separate:

- Built
- Planned
- Prototype
- Concept
- Learning project

Avoid overclaiming. Do not present concepts, plans, or experiments as shipped production systems.

Preferred case-study structure:

```text
Title
Status
Summary
Problem
Context
My role
Tech stack
What I built
Important decisions
Current state
Screenshots or demo links
GitHub/live links
What I learned
What I would improve next
```

The first project can be the portfolio site itself, including different UI/theme experiments.

Future projects may include cyber, dev, AI, creative, product, field-ops, video, or other work. Do not constrain the portfolio to one niche too early.

---

## 8. GitHub project sync

The projects index can be enriched from GitHub at build time.

This is not browser-live data. The bridge is:

```text
GitHub repos
  repo topics
  optional .portfolio/project.json
        ↓
scripts/sync-github-projects.mjs
        ↓
src/data/github-projects.generated.ts
        ↓
src/data/projects.ts
        ↓
/projects and /projects/[slug]
```

Use `pnpm sync:github-projects` to refresh generated GitHub project data manually. `pnpm build` runs the sync first through the `prebuild` script.

The sync script reads these environment variables:

- `GITHUB_USERNAME` - GitHub username to scan, defaults to `techzeph`
- `GH_PROJECTS_TOKEN` - optional GitHub token for higher rate limits or private repos
- `GITHUB_PROJECT_TOPICS` - comma-separated inclusion topics, defaults to `portfolio,case-study,featured`
- `GITHUB_INCLUDE_PRIVATE` - set to `true` to use authenticated owned repos
- `GITHUB_PROJECT_SYNC_REQUIRED` - set to `true` if build should fail when sync fails

Do not put tokens in source control. Use `.env` locally and GitHub Actions secrets in CI.

By default, existing repos can opt into the portfolio by adding a topic such as `portfolio`, `case-study`, or `featured`. A separate projects repo is not required.

For richer portfolio copy, add this optional file to the source repo:

```text
.portfolio/project.json
```

Example:

```json
{
  "title": "Portfolio Foundation",
  "status": "Built",
  "type": "Personal site",
  "summary": "A fast Astro portfolio for projects, case studies, UI experiments, and writing.",
  "role": "Solo build with AI-assisted iteration",
  "tags": ["Astro", "Tailwind", "Static site"],
  "currentState": "Homepage, theme system, layout, and project routes are in place.",
  "learned": "Semantic theme tokens made future experiments easier.",
  "next": "Add richer case-study content and screenshots."
}
```

Set `"include": true` in `.portfolio/project.json` to include a repo even if it does not have one of the configured topics.

Generated files are owned by the sync script. Do not hand-edit `src/data/github-projects.generated.ts`; edit GitHub repo topics or `.portfolio/project.json` instead.

Manual placeholder or planned projects may still live in `src/data/projects.ts`. Pages and components should consume the normalized `Project` type from `src/data/projects.ts`.

---

## 9. Writing rules

The user will rewrite final public-facing copy personally.

When writing boilerplate copy:

- Keep it direct
- Keep it modest
- Avoid hype
- Avoid fake achievements
- Avoid inflated seniority
- Avoid corporate filler
- Use placeholders where the user needs to add detail
- Make content easy to replace

Portfolio positioning should be a blend of:

- technical builder
- project-based learner
- cyber/dev/AI interest
- practical product thinker
- broader creative/technical portfolio

Mention hospitality/head-chef/managerial background only if explicitly requested or if writing an About-page draft where it is clearly useful.

Mention the Gateway Level 3 Cybersecurity & Networking qualification only if explicitly requested or when building a CV/credentials section.

---

## 10. Design workflow

- Read `DESIGN.md` before any visual/layout change
- Do not invent a new visual direction without permission
- Use design tokens/reusable components where possible
- Keep styling consistent with the design system
- Browser-check all meaningful design changes

The UI/UX component showcase can be experimental, but the main public site should remain coherent and professional.

---

## 11. Component rules

Prefer Astro components by default.

Astro layouts are normal Astro components, but this repo uses `src/layouts/Layout.astro` as the site document shell.

Layouts should define document/page structure, metadata, global wrappers, and slots. Do not let layouts become a home for page-specific sections or repeated UI patterns.

Reusable UI should live in `src/components/`, including navigation, footer, theme controls, buttons, cards, badges, panels, section headers, and project cards.

Pages should compose layouts and components. If a page or layout contains a reusable UI block, split that block into a named component before extending it further.

Use client-side JavaScript or framework islands only when they add clear value.

Acceptable reasons for interactivity:

- theme switcher
- interactive component showcase
- filtering projects
- small UI demos
- progressive enhancement
- future YouTube/content features

Avoid React/Svelte/Vue islands unless they are the simplest correct solution.

Keep components:

- small
- named clearly
- reusable
- accessible
- easy to delete/refactor

---

## 12. Tailwind rules

Use the project’s actual Tailwind setup. Do not assume Tailwind v3 or v4 until checking the files.

Prefer:

- consistent spacing
- readable typography
- reusable component patterns
- responsive classes from the start
- semantic HTML first

Avoid:

- huge arbitrary-value class strings unless necessary
- duplicated card/button/nav styles everywhere
- styling that only works on one viewport
- hidden accessibility problems caused by visual-only design

---

## 13. Accessibility rules

Accessibility is mandatory, not optional.

Check for:

- semantic HTML
- proper heading order
- keyboard navigation
- visible focus states
- readable contrast
- descriptive links
- image alt text
- no layout-breaking zoom assumptions
- no mobile-only traps
- reduced-motion considerations for animation-heavy UI

Do not add visual effects that harm readability.

---

## 14. Performance rules

The site should remain lightweight.

Prefer:

- static rendering
- minimal JavaScript
- optimised images
- simple CSS
- Astro-native features
- no unnecessary dependencies

Avoid:

- heavy animation libraries unless explicitly requested
- large icon packs imported carelessly
- client-side rendering for static content
- analytics bloat
- CMS/database dependencies without a clear reason

Every page should have sensible metadata.

---

## 15. Agent behaviour

Default behaviour:

- Make small controlled changes
- Read relevant files before editing
- Explain the plan before broad changes
- Do not make unrelated improvements
- Do not rewrite large areas unless requested
- Preserve user intent over personal preference

Ask before:

- installing packages
- deleting files
- changing routing structure
- changing deployment config
- changing GitHub Actions
- changing Cloudflare/domain assumptions
- adding a framework island
- adding a CMS
- adding analytics
- changing global styling direction
- editing `.codex/config.toml`
- editing `.env` or secret files
- making broad refactors

Agents may create new files inside `src/` when clearly required by the task, but should summarise them afterwards.

---

## 16. Safety rules

Do not read, edit, create, rename, print, or delete secret-bearing files unless explicitly instructed.

Forbidden by default:

- `.env`
- `.env.*`
- API keys
- tokens
- credentials
- SSH keys
- private keys
- deployment secrets
- Cloudflare credentials
- GitHub tokens

Never paste secrets into code, docs, logs, commits, or chat.

Before suggesting a commit, check for obvious accidental secrets in changed files.

Do not edit `.codex/config.toml` unless explicitly asked.

---

## 17. Testing and validation

Before saying a task is complete, run the strongest available validation commands from `package.json`.

Preferred checks, if available:

```bash
pnpm astro check
pnpm build
pnpm lint
pnpm format:check
pnpm typecheck
```

If scripts do not exist, do not invent success. Say what exists and what is missing.

For UI/layout/navigation changes:

1. Start the dev server if needed:

```bash
pnpm dev
```

2. Check the local site, usually:

```text
http://localhost:4321
```

3. Use browser tooling where available to verify:

- no console errors
- homepage renders
- navigation works
- mobile layout is not broken
- project/contact routes work if present

If a command fails, report the failure and the likely cause. Do not claim completion.

---

## 18. Git workflow

Recommended workflow:

- Work on `develop` or feature branches
- Keep `main` production-ready
- Do not push without explicit permission
- Do not create PRs without explicit permission
- Do not commit without explicit permission unless the user has asked for commits

Before any commit, summarise:

```text
Changed files
What changed
Why it changed
Validation run
Known risks
```

Suggested commit style:

```text
feat: add portfolio project layout
fix: correct Astro routing issue
docs: add deployment notes
style: refine homepage spacing
refactor: simplify project card component
```

---

## 19. Deployment rules

Deployment target is currently GitHub Pages behind Cloudflare.

Do not change deployment strategy without explaining the trade-offs.

Before deployment-related changes, inspect:

- `astro.config.*`
- `package.json`
- GitHub Actions workflows
- public/base path assumptions
- domain/CNAME setup if present

For `techzeph.co.uk`, avoid guessing DNS state. Ask before changing Cloudflare or GitHub Pages settings.

---

## 20. Documentation rules

This repo should support durable documentation for future AI/local-agent use.

Preferred docs over time:

```text
AGENTS.md
DESIGN.md
docs/ARCHITECTURE.md
docs/DEPLOYMENT.md
docs/CONTENT_MODEL.md
docs/TASKS.md
```

Do not create all docs at once unless requested.

When making meaningful architectural changes, update or propose updates to docs.

Use clear headings, concise notes, and copyable commands.

Obsidian-compatible task metadata is welcome for planning docs.

Example task format:

```md
- [ ] Task description
  - status: todo
  - area: portfolio
  - priority: medium
  - owner: user
  - updated: YYYY-MM-DD
```

---

## 21. Current recommended build direction

For the initial build, prefer:

1. Clean Astro scaffold
2. Basic layout system
3. Header/nav/footer
4. Home page boilerplate
5. About placeholder
6. Projects index
7. First project case study: this portfolio itself
8. Contact page
9. Component showcase route
10. Later: blog
11. Later: YouTube page

The first version should be simple, stable, and easy to redesign later.

Do not spend excessive effort on advanced animations or final copy before `DESIGN.md` exists.

---

## 22. Completion response format

When finishing a task, respond with:

```text
Summary:
- ...

Changed files:
- ...

Validation:
- ...

Notes / risks:
- ...

Suggested next step:
- ...
```

Keep responses practical. Do not hide uncertainty. If something was not tested, say so.
