# Portfolio Project Metadata Guide

Use this guide when adding portfolio metadata to another GitHub repository.

The portfolio site reads this file from each source repo:

```text
.portfolio/project.json
```

Copy `docs/templates/portfolio-project.json` from this repo into the source repo as `.portfolio/project.json`, then replace the placeholder values with accurate project details.

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
- optional complexity notes

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

Explain the user's relationship to the project.

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

Optional. Add a short explanation of complexity that GitHub cannot infer.

Good:

```json
"complexityNotes": "The project combines static Astro routes, generated GitHub data, theme state, and reusable UI components."
```

The site will still calculate an estimated complexity level from public repo signals such as language count, repo size, topic count, and whether a live site is linked.

### `currentState`

Say what currently exists.

Good:

```json
"currentState": "Homepage, project routes, theme tokens, and the GitHub project sync workflow are in place."
```

Avoid pretending planned features already exist.

### `learned`

Describe the most useful lesson from the work.

This can be technical, design-related, workflow-related, or product-related.

Good:

```json
"learned": "Keeping project data normalized early makes it easier to add generated GitHub projects without rewriting page components."
```

### `next`

Describe the most useful next improvement.

Good:

```json
"next": "Add richer case-study content, screenshots, and clearer public copy for each project."
```

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
  "skills": ["Astro routing", "Static site generation", "Tailwind CSS", "GitHub API integration"],
  "complexityNotes": "The project combines static Astro routes, generated GitHub data, theme state, and reusable UI components.",
  "currentState": "Homepage, project routes, theme tokens, and the GitHub project sync workflow are in place.",
  "learned": "Keeping project data normalized early makes it easier to add generated GitHub projects without rewriting page components.",
  "next": "Add richer case-study content, screenshots, and clearer public copy for each project.",
  "include": true
}
```

## Agent Checklist

Before committing `.portfolio/project.json` in another repo:

- Confirm the status is honest.
- Prefer clear, modest copy over promotional copy.
- Keep the title human-readable.
- Keep tags useful for portfolio visitors.
- Use `skills` to clarify useful technical skills that are not obvious from GitHub topics.
- Use `complexityNotes` only for factual implementation detail.
- Do not invent features, metrics, users, or outcomes.
- Make sure the file is valid JSON.
- Run the portfolio repo's `pnpm sync:github-projects` afterward if checking the result locally.
