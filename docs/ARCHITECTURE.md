# Architecture

## Overview

TechZeph is a static Astro portfolio with an editorial visual system. It deliberately avoids runtime APIs, repository imports, and generated project data.

## Routes

```text
src/pages/index.astro       /
src/pages/about.astro       /about
src/pages/portfolio.astro   /portfolio
src/pages/ai-ops.astro      /ai-ops
src/pages/contact.astro     /contact
```

## Page shell

`src/layouts/Layout.astro` owns metadata, favicons, the shared header, the main content slot, and the shared footer.

`src/components/SiteHeader.astro` and `SiteMenu.astro` provide desktop and mobile navigation. `SiteFooter.astro` mirrors the primary routes.

## Portfolio content

`src/components/PortfolioLinks.astro` is the single source for the three portfolio destinations and their descriptions. It is rendered on both the homepage and `/portfolio`.

Portfolio content is edited by hand. There is no GitHub API sync, generated data file, schedule, project normalization layer, or dynamic project-detail route.

## Visual system

- `src/styles/themes.css` defines the cream, forest-green, lime, and warm accent tokens.
- `src/styles/global.css` defines the editorial typography, shared layout primitives, responsive behavior, portfolio rows, buttons, sections, and navigation.
- Shared components such as `PageIntro`, `SectionBand`, `SectionHeader`, and `ButtonLink` keep page structure consistent.

## Deployment

`.github/workflows/deploy.yml` builds on pushes to `main` or manual dispatch and deploys the static `dist/` output to GitHub Pages. No scheduled content-import job runs.
