# TechZeph Website

Static Astro portfolio for TechZeph, built as a clear editorial landing page for public work, professional context, services, and contact details.

## Current routes

```text
/             Main landing page
/about        Background and current focus
/portfolio    Focused links to GitHub, LinkedIn, and Duke’s Po-Boys
/ai-ops       Practical AI workflow service page
/contact      Public contact route
```

## Portfolio direction

The portfolio is intentionally hand-written and small. It does not import repository data or generate case studies from the GitHub API.

Current portfolio links are maintained in:

```text
src/components/PortfolioLinks.astro
```

The three current destinations are:

- https://github.com/TechZeph
- https://www.linkedin.com/in/elliot-harrison-1211413a3/
- https://dukespoboys.com

Future work should be added manually when there is a useful, honest project worth presenting.

## Stack

- Astro 6
- Tailwind CSS through Vite
- Instrument Sans and Workbench variable fonts
- Static GitHub Pages deployment

## Structure

```text
src/components/   Reusable editorial UI
src/layouts/      Shared document shell
src/pages/        Static routes
src/styles/       Global editorial styles and theme tokens
public/           Favicons, manifest, and static assets
```

## Local development

```sh
pnpm install
pnpm dev
```

Production build:

```sh
pnpm build
```

Preview the production output:

```sh
pnpm preview
```

The production site URL is configured as `https://techzeph.co.uk`.
