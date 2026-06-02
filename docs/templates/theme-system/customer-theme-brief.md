# Customer Theme Brief

Use this as the input brief for generating a customer theme.

## Customer

```text
Customer name:
Customer slug:
Industry:
Audience:
Desired tone:
Words to avoid:
```

## Brand Inputs

```text
Primary color:
Secondary color:
Accent color:
Light background:
Dark background:
Preferred neutrals:
Existing logo/assets:
Accessibility requirements:
```

## Theme IDs

```text
Light theme ID: customer-slug-light
Dark theme ID: customer-slug-dark
Family ID: customer-slug
Family label: Customer Name
```

## Visual Direction

```text
Should feel like:
Should not feel like:
Header pattern color preference:
Card/control style preference:
Any competitor/reference sites:
```

## Output Checklist

- Add theme entries to `src/data/themes.ts`.
- Add light/dark token blocks to `src/styles/themes.css`.
- Add preview swatch blocks to `src/styles/themes.css`.
- Update `defaultLightTheme` and `defaultDarkTheme`.
- Run `pnpm build`.
- Review light and dark mode manually.
