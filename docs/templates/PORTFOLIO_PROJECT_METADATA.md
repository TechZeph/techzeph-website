# Portfolio Project Metadata Guide

Use this guide when adding portfolio metadata to another GitHub repository.

The portfolio site reads these optional files from each source repo:

```text
.portfolio/project.json
.portfolio/progress.json
```

`docs/templates/portfolio-project.json` is a reusable source template only. Do not replace its placeholder values with repo-specific project data.
`docs/templates/portfolio-progress.json` is the matching source template for editable future-work lists.

When generating metadata for a repo, create `.portfolio/project.json` in that repo, then replace the placeholder values with accurate project details. Create `.portfolio/progress.json` only when the repo needs explicit future-work notes.

## Purpose

The JSON file gives the portfolio site better copy than GitHub can provide by itself.

GitHub already provides:

- repository URL
- description
- topics
- primary language
- language breakdown
- repository size
- updated dates
- star and fork counts

The JSON should provide:

- honest project status
- clear portfolio title
- human-readable summary
- project role/context
- case-study notes
- useful tags for the website UI
- optional skill/tooling notes
- optional build context notes

The progress JSON should provide:

- what the user wants to do next

Completed-work notes come from recent GitHub commit subjects on the repo's default branch. Use clear commit messages because they can appear on the portfolio as `done` items.

The portfolio site also estimates skills, languages, and complexity from GitHub repo data. Use the JSON fields to improve or clarify those signals, not to invent work that is not visible in the repo.

## Field Guide

### `title`

Use the public portfolio title, not necessarily the exact repo name.

Good:

```json
"title": "TechZeph Portfolio"
```

Avoid generated-looking names like `techzeph.github.io` unless that is the intended public title.

### `status`

Use one of these unless there is a strong reason not to:

- `Built`
- `Planned`
- `Prototype`
- `Concept`
- `Learning project`

Be conservative. Do not mark something as `Built` if it is only an idea, a partially working experiment, or a placeholder.

### `type`

Describe the kind of project in plain language.

Examples:

- `Personal site`
- `Static website`
- `CLI tool`
- `Content system`
- `Interface experiment`
- `Learning project`
- `Automation script`

### `summary`

Write one or two clear sentences explaining what the project is and why it exists.

Good summaries are specific but modest:

```json
"summary": "A static Astro portfolio that collects projects, case studies, interface experiments, and future writing in one place."
```

Avoid hype, fake impact, or claims that cannot be verified from the repo.

### `role`

Explain the user's build responsibility or contribution context for the project. This appears as `Build role` on project pages, so write it as a short project-context label rather than a job title.

Examples:

- `Solo build`
- `Solo build with AI-assisted iteration`
- `Maintainer`
- `Prototype exploration`
- `Learning project`

### `tags`

Use 3-8 tags that help the portfolio UI group and scan the project.

Prefer:

- primary framework/language
- important tooling
- project category
- domain/context

Example:

```json
"tags": ["Astro", "Tailwind", "Static site", "Portfolio"]
```

Do not duplicate every GitHub topic unless each one is useful to a portfolio visitor.

### `skills`

Optional. Use this when the project should show a more useful skills/tooling list than GitHub topics alone can provide.

Good:

```json
"skills": ["Astro routing", "Static site generation", "Tailwind CSS", "GitHub API integration"]
```

Prefer concrete skills, frameworks, workflows, and technical concepts. Do not list broad traits like `hard working` or `problem solving`.

If omitted, the portfolio sync script infers skills from detected languages and GitHub topics.

### `complexityNotes`

Optional. Add a short visitor-facing build context note that GitHub cannot infer.

Good:

```json
"complexityNotes": "The project combines static Astro routes, generated GitHub data, theme state, and reusable UI components."
```

The site can still calculate internal complexity signals from public repo data, but this note should read as plain build context rather than a rating.

### `currentState`

Say what currently exists.

Good:

```json
"currentState": "Homepage, project routes, theme tokens, and the GitHub project sync workflow are in place."
```

Avoid pretending planned features already exist.

### `caseStudy`

Optional narrative depth - the highest-value field. An object with up to three
short paragraphs: `problem`, `approach`, `outcome`. Renders as a "Case study"
card. Each part must be verifiable from the repo. No hype, no invented metrics.

```json
"caseStudy": {
  "problem": "Scaffolding a portfolio-ready repo by hand was many manual steps.",
  "approach": "A single script that scaffolds metadata, sets topics, and seeds a clean first commit.",
  "outcome": "New repos appear on the portfolio after the next sync with no hand-editing."
}
```

Omit any part, or the whole object; the section is skipped when all parts are empty.

### `highlights`

Optional. Up to 5 short, factual proof points. Renders as a scannable
"Highlights" card, distinct from the commit-derived `done` history.

```json
"highlights": ["Ships as a single static bundle", "Zero runtime JS on project pages"]
```

### `learned`

Optional. Up to 5 short takeaways ("What I learned"). Reflection, not features.

### `related`

Optional. Slugs of OTHER projects to cross-link. Renders as internal
"Related projects" links (keeps visitors on-site). Unknown slugs are filtered.

```json
"related": ["techzeph-website"]
```

### `featured` and `order`

Optional curation. `featured: true` sorts the card first on the index pages;
`order` (integer, ascending, default 9999) is the manual tiebreak after
`featured`. Together they are the real ranking lever (every repo has 0 stars,
so the legacy stars sort is inert).

### `category`

Optional single grouping label (e.g. `Web`, `Automation`, `AI`) for future
filtering. Do not overload `tags` for this.

### `demoUrl`

Optional live interactive demo URL. Renders as a CTA button distinct from the
repo and homepage links. A release link auto-fills from the latest GitHub
release when present.

### `started` and `shipped`

Optional `YYYY-MM` or `YYYY-MM-DD` strings. Render as a human "Timeline" line.

### `ogImage`

Optional absolute URL to override the social-share image. When omitted, the
portfolio uses the FREE GitHub auto-generated social-preview image
(`opengraph.githubassets.com/1/<owner>/<repo>`), which always resolves.

### `doneOverride`

Optional. The ONLY sanctioned way to bypass the commit-derived `done` list.
When this is a non-empty array (max 8), it REPLACES the generated items. Leave
it out (or empty) to keep the default commit-derived behaviour.

```json
"doneOverride": [
  "Scaffold .portfolio metadata and topics in one command.",
  "Validate generated JSON with jq / python / built-in fallback."
]
```

### Free GitHub signals (no metadata needed)

The sync also surfaces, with no metadata from you: the repository license, the
open-issues count (labelled "open issues / PRs" because GitHub counts PRs), the
latest release, and the social-preview image. You do not set these here.

## Progress File

Future-work notes should live in `.portfolio/progress.json`, not `.portfolio/project.json`.

By default, do not write manual `done` entries: the portfolio sync script generates `done` from recent default-branch commit subjects. The ONE exception is `doneOverride` (see the Field Guide) - when you provide a non-empty `doneOverride` array in `.portfolio/project.json`, it REPLACES the commit-derived list. Use it only when the commit history reads poorly; otherwise prefer clean commit subjects.

Use `next` for useful future work:

```json
"next": [
  "Add screenshots to project detail pages.",
  "Refine public copy across project pages."
]
```

Keep these as short, factual bullets. They are not personal reflections or long-form case-study notes.

Complete progress example:

```json
{
  "next": [
    "Add screenshots to project detail pages.",
    "Refine public copy across project pages."
  ]
}
```

## Commit Message Guidance

Because recent commit subjects become public `done` items, always use clear, factual commit subjects that read well as completed-work notes. Prefer a concise subject plus a detailed commit body that explains what changed, why it changed, user/developer impact, and validation run.

Good:

```text
feat: add project screenshot gallery
docs: document setup workflow
fix: improve mobile card spacing
```

These become readable portfolio notes such as:

- `Add project screenshot gallery.`
- `Document setup workflow.`
- `Improve mobile card spacing.`

Avoid vague messages like `updates`, `stuff`, `test`, or private notes that would look odd on a public project page.

### `include`

Set this to `true` when the repo should be included even if it does not have one of the configured GitHub topics.

Most repos should use GitHub topics instead:

- `portfolio`
- `case-study`
- `featured`

## Complete Example

```json
{
  "title": "TechZeph Portfolio",
  "status": "Built",
  "type": "Personal site",
  "summary": "A static Astro portfolio that collects projects, case studies, interface experiments, and future writing in one place.",
  "role": "Solo build with AI-assisted iteration",
  "tags": ["Astro", "Tailwind", "Static site", "Portfolio"],
  "skills": [
    "Astro routing",
    "Static site generation",
    "Tailwind CSS",
    "GitHub API integration"
  ],
  "complexityNotes": "The project combines static Astro routes, generated GitHub data, theme state, and reusable UI components.",
  "currentState": "Homepage, project routes, theme tokens, and the GitHub project sync workflow are in place.",
  "include": true
}
```

## Agent Checklist

Before committing portfolio metadata in another repo:

- Create or update `.portfolio/project.json`; do not put repo-specific values in `templates/portfolio-project.json`.
- Create or update `.portfolio/progress.json` only for future-work notes; do not put repo-specific values in `templates/portfolio-progress.json`.
- Confirm the status is honest.
- Prefer clear, modest copy over promotional copy.
- Keep the title human-readable.
- Keep tags useful for portfolio visitors.
- Use `skills` to clarify useful technical skills that are not obvious from GitHub topics.
- Use `complexityNotes` only for factual visitor-facing build context.
- Use `next` only for useful future work.
- Use clear commit subjects because recent commits generate the public `done` list.
- Do not invent features, metrics, users, or outcomes.
- Make sure any metadata files are valid JSON.
- Run the portfolio repo's `pnpm sync:github-projects` afterward if checking the result locally.
