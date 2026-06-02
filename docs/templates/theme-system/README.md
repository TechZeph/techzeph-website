# Theme System Templates

Use these files when creating a new customer site or adding a new customer theme family to this site foundation.

## Files

- `customer-theme-brief.md` - fill this in before generating the theme.
- `theme-registry.ts` - copyable `src/data/themes.ts` entries.
- `theme-tokens.css` - copyable `src/styles/themes.css` token blocks.

## Recommended Order

1. Fill in the customer brief.
2. Create light and dark theme IDs.
3. Add the registry entries.
4. Add the CSS token blocks.
5. Set the default theme IDs.
6. Run `pnpm build`.
7. Review the header, dropdowns, cards, buttons, chips, badges, and page backgrounds.
