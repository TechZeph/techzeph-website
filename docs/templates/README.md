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

The project sync script reads these files during `pnpm sync:github-projects` and merges them with GitHub repo metadata. Validate against `portfolio-project.schema.json` before committing.

Completed-work notes are generated from recent GitHub commit subjects on the repo's default branch. Use clear, factual commit subjects because they can appear on the portfolio as `done` items, and include a detailed commit body so future agents can understand the context behind the work.

Repos can also be included by adding one of the configured GitHub topics, such as `portfolio`, `case-study`, or `featured`.

Use `PORTFOLIO_PROJECT_METADATA.md` when asking an agent to populate this file in another repo.

Everything is optional. Each field degrades to a sensible default when absent.

### Existing fields (unchanged contract)

| Field | Type | Renders as | Default when omitted |
| --- | --- | --- | --- |
| `slug` | string | URL path `/projects/<slug>` | slugified repo name |
| `title` | string | Card + page title | titleized repo name |
| `status` | enum | Status badge | inferred from topics, else `Built` |
| `type` | string | Card/page type label | primary language, else `GitHub project` |
| `summary` | string | Card summary + page intro | GitHub description |
| `role` | string | "Build role" | `Project owner` |
| `tags` | string[] (max 8) | Tag chips (now link to `/topics/<slug>`) | `[language, ...topics]` |
| `skills` | string[] (max 12) | "Skills and tooling" chips | inferred from languages + topics |
| `complexityNotes` | string | "Build context" | (section hidden) |
| `currentState` | string | Card reveal text | `Public GitHub repository. Last pushed <date>.` |
| `include` | boolean | (inclusion gate) | `false` |

### New depth fields

| Field | Type | Renders as | Notes |
| --- | --- | --- | --- |
| `caseStudy` | `{problem?, approach?, outcome?}` | "Case study" InfoCard (three labelled paragraphs) | The single biggest depth win. Each part is a short paragraph. Section is skipped when all three are empty. Must be verifiable from the repo - no hype, no invented outcomes. |
| `highlights` | string[] (max 5) | "Highlights" bulleted card near the top | Fast scannable proof points, distinct from the commit-derived `done` history. |
| `learned` | string[] (max 5) | "What I learned" bulleted card | Short takeaways; reinforces the learning-project framing. |
| `related` | string[] (slugs, max 6) | "Related projects" internal links | Cross-links to OTHER project slugs. Unknown slugs are filtered at render. Keeps visitors on-site. |
| `featured` | boolean | (ranking) + optional card marker | Featured projects sort first on the index pages. |
| `order` | integer | (ranking) | Manual ascending key applied after `featured`. Lower sorts earlier. Default `9999`. |
| `category` | string | (grouping, future filter) | Single label like `Web`, `Automation`, `AI`. Does not overload `tags`. |
| `demoUrl` | string (uri) | Extra CTA button | Live interactive demo, distinct from repo/homepage links. |
| `started` / `shipped` | `YYYY-MM` or `YYYY-MM-DD` | "Timeline" line | Reads more human than the auto "Last pushed" date. |
| `ogImage` | string (url) | `og:image` / Twitter card | Override. When omitted, the FREE GitHub auto-generated social-preview image is used (`opengraph.githubassets.com/1/<owner>/<repo>`). |
| `doneOverride` | string[] (max 8) | Replaces the "What has been done" list | The ONLY sanctioned way to bypass the commit-derived `done[]`. Leave empty `[]` to keep the default commit-derived behaviour. |

### What the sync adds for free (no metadata needed)

The sync script also pulls these from data already in the GitHub API response (no
extra requests except one 404-safe call), so you do not set them here:

- `github.license` - from the repo list payload (`license.spdx_id`).
- `github.openIssues` - from the repo list payload. **Counts PRs as issues**, so it
  is labelled "open issues / PRs" in the UI.
- `github.socialImage` - the always-available `opengraph.githubassets.com` preview.
- `github.latestRelease` - from `GET /repos/{o}/{r}/releases/latest` (returns 404
  cleanly when there are no releases; no new error handling).

### Topics

`tags`, `skills`, and the repo's GitHub topics are unified into one canonical "topic"
vocabulary (see `src/data/topics.taxonomy.json`). Adding a tag or a GitHub topic to any
repo auto-creates/extends its `/topics/<slug>` landing page on the next sync + build - no
code edits required.

## Customer theme system

Use `theme-system/` when creating a new customer site theme:

```text
docs/templates/theme-system/customer-theme-brief.md
docs/templates/theme-system/theme-registry.ts
docs/templates/theme-system/theme-tokens.css
```

Start with the brief, then copy the registry and token templates into the runtime theme files described in `docs/theme-system.md`.
