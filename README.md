# TechZeph Website

Static Astro portfolio for TechZeph, built to present project work, lightweight case studies, contact details, and a small reusable design system.

The site is currently focused on:

- a public landing page for website design, automation, and practical digital systems work
- an About page for the TechZeph personal/project direction
- a Projects index and generated project detail pages
- GitHub-synced project metadata for portfolio cards and case-study pages
- a themeable Astro/Tailwind component foundation that can grow into future client or personal site work

## Tech Stack

- Astro 6
- Tailwind CSS through the Vite plugin
- TypeScript-flavoured Astro data modules
- Lucide Astro icons
- Variable fonts from `@fontsource-variable`
- Static assets served from `public/`

## Routes

Astro maps the current files in `src/pages` to these public routes:

```text
src/pages/index.astro             /
src/pages/about.astro             /about
src/pages/contact.astro           /contact
src/pages/projects/index.astro    /projects
src/pages/projects/[slug].astro   /projects/:slug
```

Project detail routes are generated from `src/data/projects.ts`, which normalizes the generated GitHub project data in `src/data/github-projects.generated.ts`.

## Project Structure

```text
src/
  components/     Reusable Astro UI components
  data/           Theme registry and normalized project data
  layouts/        Shared page shell
  pages/          Astro routes
  scripts/        Client-side browser scripts
  styles/         Global styles and semantic theme tokens

public/           Favicons, web manifest, CNAME, and static public assets
scripts/          Node scripts for generated project data
docs/             Architecture notes, design guidance, and metadata templates
```

Key files:

- `src/layouts/Layout.astro` defines the document shell, metadata, favicon links, theme bootstrapping, header, main slot, and footer.
- `src/components/SiteHeader.astro`, `SiteMenu.astro`, and `ThemeMenu.astro` provide the shared navigation and theme controls.
- `src/components/ProjectCard.astro` renders project cards used on the homepage and project index.
- `src/pages/projects/[slug].astro` builds individual project pages from normalized project data.
- `src/styles/themes.css` holds semantic light/dark theme tokens.
- `scripts/sync-github-projects.mjs` refreshes generated portfolio data from GitHub.

## GitHub Project Sync

Portfolio projects are not meant to be hand-written directly into `src/data/projects.ts`. The usual flow is:

1. Add useful GitHub topics to a repository, such as `portfolio`, `case-study`, or `featured`.
2. Optionally add `.portfolio/project.json` in the source repository for stable human-written metadata.
3. Optionally add `.portfolio/progress.json` for future-work notes.
4. Run:

```sh
pnpm sync:github-projects
```

The sync script writes `src/data/github-projects.generated.ts`. That generated file includes repository URLs, topics, detected languages, recent commit-derived completed-work notes, rough complexity signals, and metadata overrides where present.

Useful environment variables:

```text
GITHUB_USERNAME                 GitHub username to sync from; defaults to techzeph
GH_PROJECTS_TOKEN               GitHub token for authenticated API access
GITHUB_TOKEN                    Fallback token name
GITHUB_INCLUDE_PRIVATE=true     Include private repos when using a token
GITHUB_PROJECT_TOPICS           Comma-separated include topics; defaults to portfolio,case-study,featured
GITHUB_PROJECT_SYNC_REQUIRED    Set true if sync failure should fail the command
```

## Theme System

The current default theme family is `earth-green`, with light and dark modes.

Theme registration lives in:

```text
src/data/themes.ts
```

Semantic CSS tokens live in:

```text
src/styles/themes.css
src/styles/global.css
```

Components should use semantic tokens and shared utility classes such as `tz-window`, `tz-control`, `tz-hard-control`, `tz-chip`, `tz-badge`, and `tz-dropdown` rather than hard-coded brand colours.

For adapting this foundation to another customer or brand theme, see:

```text
docs/theme-system.md
docs/templates/theme-system/
```

## Local Development

This repo expects Node `>=22.12.0` and uses pnpm.

Install dependencies:

```sh
pnpm install
```

Start the dev server:

```sh
pnpm dev
```

Build the static site:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

Run Astro CLI commands:

```sh
pnpm astro -- --help
```

## Deployment Notes

The Astro config sets the production site URL to:

```text
https://techzeph.co.uk
```

The repository includes `CNAME` files for the custom domain and a favicon/web manifest pack in `public/`.

The production build outputs static files to:

```text
dist/
```

## Documentation

The repo includes working notes for future development:

- `docs/ARCHITECTURE.md` explains route, layout, component, theme, and project-data flow.
- `docs/DESIGN.md` captures broader design direction and quality rules.
- `docs/AGENTS.md` contains workflow guidance for AI-assisted development.
- `docs/templates/` contains portfolio project metadata and theme-system starter files.

Run `pnpm build` before treating route, layout, component, or data changes as complete.
