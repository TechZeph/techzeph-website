# Theme System

Use this workflow when adapting the site foundation for a new customer brand.

## Files

Runtime theme files:

```text
src/data/themes.ts       Theme menu registry and default theme IDs
src/styles/themes.css    Semantic theme tokens and preview swatches
src/styles/global.css    Global base styles and reusable themed UI classes
```

Reusable starter files:

```text
docs/templates/theme-system/customer-theme-brief.md
docs/templates/theme-system/theme-registry.ts
docs/templates/theme-system/theme-tokens.css
```

## Workflow

1. Fill in `customer-theme-brief.md` for the customer.
2. Copy the relevant objects from `theme-registry.ts` into `src/data/themes.ts`.
3. Copy one complete light/dark family from `theme-tokens.css` into `src/styles/themes.css`.
4. Replace placeholder IDs, labels, and colors.
5. Set `defaultLightTheme` and `defaultDarkTheme` to the new customer theme IDs.
6. Run `pnpm build`.
7. Check the site in light and dark themes.

## Theme Contract

Components should not use raw brand colors directly. Components should use semantic tokens such as:

- `--surface-page`
- `--surface-panel`
- `--text-primary`
- `--text-muted`
- `--accent-primary`
- `--button-primary-bg`
- `--badge-bg`
- `--window-border`
- `--shadow-panel`
- `--header-pattern-color`
- `--project-header-pattern-color`
- `--project-header-pattern-size`

Theme IDs should follow this pattern:

```text
customer-slug-light
customer-slug-dark
```

The `family` field should be shared by both modes:

```text
customer-slug
```

The `familyLabel` is what users see in the theme menu:

```text
Customer Name
```

## Required CSS Blocks

Every theme family needs:

- one light `[data-theme="...-light"]` block
- one dark `[data-theme="...-dark"]` block
- one light `[data-preview-theme="...-light"]` block
- one dark `[data-preview-theme="...-dark"]` block

The default `:root` and `@media (prefers-color-scheme: dark)` blocks should mirror the current default customer/site theme.

## Quality Rules

- Keep light and dark modes structurally consistent.
- Avoid transparent control surfaces unless the whole theme system intentionally supports them.
- Keep header buttons, dropdowns, cards, badges, and chips readable over the header pattern.
- Do not add hard-coded brand colors in Astro markup.
- Browser-check both desktop and mobile when changing a customer theme.
