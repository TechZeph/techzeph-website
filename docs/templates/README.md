# Templates

Reusable project files for this portfolio workflow.

## GitHub portfolio metadata

Copy `portfolio-project.json` into any GitHub repo that should provide richer portfolio data:

```text
.portfolio/project.json
```

Copy `portfolio-progress.json` into the same repo when you want editable future-work notes:

```text
.portfolio/progress.json
```

The project sync script reads these files during `pnpm sync:github-projects` and merges them with GitHub repo metadata.

Completed-work notes are generated from recent GitHub commit subjects on the repo's default branch. Use clear commit messages because they can appear on the portfolio as `done` items.

Repos can also be included by adding one of the configured GitHub topics, such as `portfolio`, `case-study`, or `featured`.

Use `PORTFOLIO_PROJECT_METADATA.md` when asking an agent to populate this file in another repo.

## Customer theme system

Use `theme-system/` when creating a new customer site theme:

```text
docs/templates/theme-system/customer-theme-brief.md
docs/templates/theme-system/theme-registry.ts
docs/templates/theme-system/theme-tokens.css
```

Start with the brief, then copy the registry and token templates into the runtime theme files described in `docs/theme-system.md`.
