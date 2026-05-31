# Templates

Reusable project files for this portfolio workflow.

## GitHub portfolio metadata

Copy `portfolio-project.json` into any GitHub repo that should provide richer portfolio data:

```text
.portfolio/project.json
```

Copy `portfolio-progress.json` into the same repo when you want editable progress lists:

```text
.portfolio/progress.json
```

The project sync script reads these files during `pnpm sync:github-projects` and merges them with GitHub repo metadata.

Repos can also be included by adding one of the configured GitHub topics, such as `portfolio`, `case-study`, or `featured`.

Use `PORTFOLIO_PROJECT_METADATA.md` when asking an agent to populate this file in another repo.
