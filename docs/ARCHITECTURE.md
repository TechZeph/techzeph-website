# Architecture

Working notes for future agents and local development on `techzeph.github.io`.

## Current Shape

This is a static-first Astro portfolio. Astro file-based routes live in `src/pages`, shared page shells live in `src/layouts`, reusable UI lives in `src/components`, and small structured data lives in `src/data`.

```text
src/
  components/       Reusable UI pieces
  data/             Small typed data sources
  layouts/          Page/document shells
  pages/            Astro routes
  styles/           Global CSS and theme tokens
```

## Route Flow

Astro maps files under `src/pages` to public routes:

- `src/pages/index.astro` -> `/`
- `src/pages/about.astro` -> `/about`
- `src/pages/contact.astro` -> `/contact`
- `src/pages/ui.astro` -> `/ui`
- `src/pages/projects/index.astro` -> `/projects`
- `src/pages/projects/[slug].astro` -> `/projects/:slug`

Dynamic project routes are generated from `src/data/projects.ts` through `getStaticPaths()` in `src/pages/projects/[slug].astro`.

## Layout Flow

`src/layouts/Layout.astro` is the base document shell. It owns:

- global CSS import
- `<html>`, `<head>`, and `<body>`
- page metadata props
- early theme hydration
- skip link
- `SiteHeader`
- main `<slot />`
- `SiteFooter`

Astro layouts are normal Astro components. In this repo, `Layout.astro` is intentionally treated as the site document shell, not a dumping ground for reusable UI.

Use `Layout.astro` for:

- document structure
- shared metadata
- global CSS imports
- theme bootstrapping
- skip link
- shared header/footer placement
- the page `<main>` and `<slot />`

Do not put page-specific sections, cards, project markup, or repeated UI patterns directly in `Layout.astro`. Put those in `src/components` and compose them from pages.

For `.astro` pages, import the layout manually:

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Page title | TechZeph" description="Page description">
  Page content
</Layout>
```

For individual `.md` pages in `src/pages`, Astro supports the special frontmatter `layout` property.

For content collections, do not rely on frontmatter `layout`. Generate routes in `src/pages`, fetch/render entries, and wrap the rendered content with the repo layout manually.

## Component Flow

Current shared components:

- `ButtonLink.astro` - semantic themed link buttons
- `InfoCard.astro` - compact titled content card
- `PageIntro.astro` - common page hero/introduction
- `Panel.astro` - reusable bordered content panel
- `ProjectCard.astro` - project summary card
- `SectionBand.astro` - full-width section background/tone wrapper
- `SectionHeader.astro` - section kicker, heading, and description
- `SiteMenu.astro` - responsive site menu
- `SiteHeader.astro` - primary navigation and theme menu placement
- `SiteFooter.astro` - footer
- `StatusBadge.astro` - project status label
- `TagList.astro` - reusable tag list display
- `ThemeMenu.astro` - theme dropdown behavior and options
- `Welcome.astro` - starter component; do not extend unless it remains intentionally useful

Pages should compose these components rather than duplicating card, button, badge, or section header markup.

## Theme Flow

Theme options are registered in `src/data/themes.ts`.

Global semantic theme tokens live in `src/styles/global.css`. Components should use semantic tokens such as:

- `--surface-panel`
- `--text-muted`
- `--button-primary-bg`
- `--badge-bg`
- `--shadow-panel`

Avoid using raw palette names or hard-coded hex values inside page/component markup unless building an intentional theme preview.

## Project Data Flow

Project summaries are normalized through `src/data/projects.ts`, but the actual project entries come from generated GitHub data.

Use this data for:

- homepage featured work
- `/projects` index
- `/projects/[slug]` case-study pages
- UI preview examples

Do not add manual project placeholders to `src/data/projects.ts`. Add GitHub topics or `.portfolio/project.json` metadata to the source repo, then refresh `src/data/github-projects.generated.ts` with `pnpm sync:github-projects`.

Move long-form project or blog content to Astro content collections later when the content becomes substantial enough to need Markdown, schemas, or richer publishing workflows.

## Working Rules

- Keep layouts structural.
- Put reusable UI in `src/components`.
- Keep page files focused on route composition.
- Keep data reusable in `src/data` until content collections are justified.
- Avoid dead nav links.
- Keep case-study statuses honest.
- Use Astro Docs before changing routing, layouts, content collections, or Astro config.
- Run `pnpm build` before calling route or component work complete.
