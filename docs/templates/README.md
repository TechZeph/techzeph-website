# Templates

Reusable project files for this portfolio workflow.

## GitHub portfolio metadata

Copy `portfolio-project.json` into any GitHub repo that should provide richer portfolio data:

```text
.portfolio/project.json
```

The project sync script reads this file during `pnpm sync:github-projects` and merges it with GitHub repo metadata.

Repos can also be included by adding one of the configured GitHub topics, such as `portfolio`, `case-study`, or `featured`.

