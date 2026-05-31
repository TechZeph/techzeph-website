# DESIGN.md

Design system and visual direction for `techzeph.github.io`.

This document is the visual contract for agents working on the portfolio site. `AGENTS.md` defines behaviour and workflow. This file defines how the site should look, feel, and behave visually.

The initial site should use the earthy green theme defined here. Future theme experiments can exist inside `/ui`, but the main public portfolio should stay coherent, calm, readable, and spacious.

---

## 1. Design summary

The site should feel like:

- a premium personal portfolio
- a clean technical archive
- a minimal creative lab
- a calm, earthy, modern interface
- technical without looking like a generic hacker template
- spacious and easy on the eye

The design should combine:

- premium restraint
- clean technical structure
- subtle command/search interface cues
- light experimental energy in controlled areas
- small traces of terminal/CLI influence

The site should not feel like:

- an affiliate site
- a corporate CV template
- a fake SaaS dashboard
- a loud cyberpunk interface
- an overanimated agency site
- a cluttered personal homepage
- a generic developer portfolio clone

---

## 2. Core aesthetic

Primary direction:

```text
Premium minimal technical archive with earthy green identity.
```

Supporting influences:

```text
Clean technical archive
Creative lab
Subtle terminal/command-line cues
Spacious editorial portfolio
```

The main pages should feel polished and restrained. Experimental UI work belongs mostly inside `/ui`.

---

## 3. Theme strategy

Initial default theme:

```text
System preference, using the earthy green palette as the primary identity.
```

Future theme support:

- Add a manual theme switcher later.
- Multiple theme experiments are allowed later.
- Theme experiments should live in `/ui`.
- Do not redesign the whole site around a new theme without explicit permission.

Until theme switching exists, build the main site around the earthy green palette.

---

## 4. Initial colour palette

Use this palette as the first brand theme:

```text
light-sage:  #cad2c5
sage:        #84a98c
eucalyptus:  #52796f
deep-teal:   #354f52
charcoal:    #2f3e46
```

### Intended usage

`#cad2c5`

- light backgrounds
- muted borders on dark backgrounds
- low-emphasis surface highlights
- subtle text tint on dark sections

`#84a98c`

- primary accent
- links
- status accents
- focus rings
- small highlights

`#52796f`

- stronger accent
- buttons
- active states
- selected nav items
- project status badges

`#354f52`

- dark surfaces
- section panels
- cards
- footer background

`#2f3e46`

- primary dark background
- deep contrast areas
- header/nav background
- base dark theme surface

### Colour principles

- Use colour sparingly.
- Use neutral spacing and typography to create premium feel.
- Avoid random gradients.
- Avoid colourful clutter.
- Keep contrast readable.
- Do not use neon cyber greens as the main identity.
- Do not introduce a second major colour family without permission.

---

## 5. Suggested design tokens

Agents may translate these into Tailwind variables, CSS custom properties, or theme config depending on the actual Tailwind setup.

```css
:root {
  --color-light-sage: #cad2c5;
  --color-sage: #84a98c;
  --color-eucalyptus: #52796f;
  --color-deep-teal: #354f52;
  --color-charcoal: #2f3e46;

  --color-bg: #cad2c5;
  --color-bg-muted: #f3f5f1;
  --color-surface: #ffffff;
  --color-surface-muted: #e7ece4;
  --color-text: #2f3e46;
  --color-text-muted: #52796f;
  --color-border: rgba(47, 62, 70, 0.16);
  --color-accent: #52796f;
  --color-accent-soft: #84a98c;
}

[data-theme="dark"] {
  --color-bg: #2f3e46;
  --color-bg-muted: #354f52;
  --color-surface: rgba(202, 210, 197, 0.06);
  --color-surface-muted: rgba(202, 210, 197, 0.1);
  --color-text: #cad2c5;
  --color-text-muted: #84a98c;
  --color-border: rgba(202, 210, 197, 0.16);
  --color-accent: #84a98c;
  --color-accent-soft: #52796f;
}
```

These are starting points, not final brand law. Preserve the colour relationships unless explicitly directed otherwise.

---

## 6. Light and dark behaviour

The site should initially respect system preference if practical.

Recommended behaviour:

- `prefers-color-scheme` support first
- manual theme switcher later
- no flash of unreadable theme
- both themes must remain accessible

Dark mode should feel premium and calm, not neon or overly saturated.

Light mode should feel warm, muted, and editorial, not stark white.

---

## 7. Typography

Preferred typography direction:

```text
Instrument Sans for readable UI, with Workbench as a restrained retro-system accent.
```

Use Instrument Sans for:

- body text
- navigation
- project cards
- long-form content
- labels where readability matters

Use Workbench sparingly for:

- route labels
- project metadata
- command/search UI hints
- small technical tags
- code-adjacent content
- status badges where appropriate
- retro window headers

Avoid:

- Workbench-heavy body copy
- overly decorative typefaces
- too many font families
- cramped letter spacing
- unreadably small text

### Heading style

Headings should carry a slightly stronger brand identity than the body.

They can be:

- larger
- slightly tighter
- more architectural
- subtly technical
- calm but memorable

Do not make headings gimmicky.

---

## 8. Layout principles

The site should feel spacious.

Use:

- generous section padding
- readable max-widths
- consistent vertical rhythm
- clear separation between sections
- cards/grids only where they add clarity
- restrained borders
- subtle surfaces

Avoid:

- cramped layouts
- too many boxes
- dense dashboard grids on main pages
- large content walls
- excessive sidebars
- decorative elements that compete with content

Recommended page feel:

```text
Centered readable pages + clean project grids + controlled experimental lab.
```

---

## 9. Navigation

Preferred navigation:

```text
Simple top nav with a command/search feel.
```

The nav should be:

- simple
- clear
- keyboard-friendly
- mobile-friendly
- not overanimated
- not cluttered with future sections too early

Potential nav items for the initial version:

- Home
- About
- Projects
- UI
- Contact

Blog and YouTube should be added later when real content exists.

### Command/search influence

The command/search feel can appear through:

- subtle slash or command-palette visual language
- compact pill-like nav container
- monospace route hints
- minimal keyboard-style affordances
- understated focus states

Do not build a full command palette unless explicitly requested.

---

## 10. Motion and interaction

Global motion level:

```text
Subtle hover/fade only.
```

Allowed globally:

- gentle hover states
- small opacity transitions
- subtle transform on cards/buttons
- smooth focus states
- restrained reveal effects if they do not harm performance

Experimental motion is allowed in:

```text
/ui
```

But avoid heavy animation libraries unless explicitly approved.

Respect reduced motion preferences.

---

## 11. UI route

The component showcase should live at:

```text
/ui
```

Purpose:

- reusable components for this site
- experimental visual playground
- proof of interface design ability
- theme experiments
- interaction experiments
- future design-system work

The `/ui` section can be more experimental than the main portfolio, but it should still be accessible, purposeful, and documented.

The `/ui` section may include:

- buttons
- cards
- nav patterns
- badges
- forms
- project cards
- theme previews
- command/search UI experiments
- layout experiments
- small interaction demos

Do not let `/ui` experiments leak into the main site without explicit approval.

---

## 12. Page direction

Initial pages should be minimal.

Start with:

- Home
- About
- Projects
- Contact
- UI

Add later, under user direction:

- Blog
- YouTube
- GitHub page
- expanded case studies
- full theme switcher
- richer interaction demos

Do not build large placeholder sections just to fill space.

---

## 13. Homepage direction

The first homepage should be restrained and simple.

Suggested initial sections:

1. Hero
2. Short positioning statement
3. Featured/current projects
4. Current focus or small status section
5. Contact/link CTA

Avoid stuffing the homepage with every possible future feature.

The homepage should quickly answer:

- who this is
- what kind of work appears here
- what is currently being built
- where to view projects
- how to contact or follow

The user will rewrite final public copy. Boilerplate text should be easy to replace.

---

## 14. Project cards

Project cards should use a mixed style depending on project type.

Preferred direction:

```text
Visual enough to feel premium, structured enough to feel like a technical archive.
```

Project cards should support:

- title
- short summary
- status badge
- project type
- tech stack/tags
- live link
- GitHub link
- case-study link
- optional image or visual preview

Project status badges should be used.

Recommended statuses:

- Built
- Prototype
- Concept
- Learning
- Planned
- Paused
- Archived

Status badges must not overclaim. Concepts must be labelled as concepts. Prototypes must be labelled as prototypes.

---

## 15. Buttons and links

Buttons should be simple and tactile.

Preferred button types:

- primary
- secondary
- ghost
- text/link

Primary buttons should use the green accent palette.

Secondary buttons can use borders and muted surfaces.

Focus states must be visible.

Avoid:

- oversized CTA spam
- glossy SaaS buttons
- excessive icon usage
- unclear clickable areas

---

## 16. Cards and surfaces

Cards should feel calm and architectural.

Use:

- subtle borders
- soft background contrast
- moderate radius
- careful spacing
- restrained hover states

Avoid:

- excessive glassmorphism
- heavy shadows
- loud gradients
- cards nested inside cards without reason
- dense fake dashboard panels

---

## 17. Iconography

Use icons sparingly.

Icons should:

- clarify action or category
- not replace text where text is needed
- use consistent stroke/weight
- remain accessible

Avoid large icon packs unless necessary. Do not import huge libraries carelessly.

---

## 18. Imagery

Use images only where they add value.

Preferred image types:

- project screenshots
- interface previews
- simple diagrams
- meaningful visual case-study assets

Avoid:

- stock photography
- generic AI-generated filler
- decorative images that slow the site
- huge unoptimised images

Images should have useful alt text.

---

## 19. Accessibility requirements

The design must remain accessible.

Requirements:

- readable contrast
- logical heading hierarchy
- visible focus states
- keyboard navigation
- semantic HTML
- descriptive links
- alt text for meaningful images
- mobile readability
- no hover-only critical information
- reduced-motion support for animated areas

Design choices that reduce accessibility should be rejected or revised.

---

## 20. Performance requirements

The visual design must support a lightweight static site.

Prefer:

- Astro-native static rendering
- minimal JavaScript
- CSS-first styling
- optimised assets
- no unnecessary client hydration
- no heavy animation frameworks
- no large UI libraries unless justified

The site should feel fast.

---

## 21. Tailwind implementation rules

Use Tailwind carefully.

Prefer:

- reusable component patterns
- theme tokens where practical
- consistent spacing
- clear class grouping
- semantic components

Avoid:

- one-off class chaos
- huge unreadable class strings
- repeated card/button styles everywhere
- arbitrary values without reason
- changing the whole style direction inside one component

If the Tailwind version is unclear, inspect the repo before editing.

---

## 22. Design boundaries

Agents must avoid:

- random gradients everywhere
- excessive glassmorphism
- unreadable contrast
- huge animation libraries without permission
- corporate stock aesthetic
- fake dashboards
- overuse of icons
- one-off Tailwind class chaos
- redesigning the whole site without permission
- cluttered sections
- cramped information density
- pretending unfinished sections are complete
- adding new brand colours without approval
- turning the main site into an experimental playground

---

## 23. When changing design

Before making meaningful visual/layout changes:

1. Read `AGENTS.md`.
2. Read this `DESIGN.md`.
3. Inspect the existing components/styles.
4. Make the smallest coherent change.
5. Prefer reusable components/tokens.
6. Browser-check the result.
7. Report what changed.

For major design changes, ask before implementing.

Major design changes include:

- changing the colour system
- changing the nav pattern
- changing layout structure across pages
- adding animation systems
- adding new UI libraries
- changing typography direction
- redesigning project cards
- redesigning the homepage

---

## 24. Baseline layout workflow

When adding or changing public pages:

1. Use the existing colour tokens.
2. Wrap pages in the base layout.
3. Reuse the existing top nav and footer.
4. Compose pages from existing components first.
5. Create a named component for any repeated UI pattern.
6. Keep route files focused on page composition.
7. Keep experiments contained in `/ui` unless explicitly approved for the main site.
8. Browser-check the changed page on mobile and desktop.

Keep it simple. New page work should extend the existing visual system rather than restarting it.

---

## 25. Visual quality checklist

Before marking visual work complete, check:

- Does it feel spacious?
- Is the colour palette still earthy green?
- Is the page readable on mobile?
- Are focus states visible?
- Is the layout calm rather than cluttered?
- Are project statuses honest?
- Are components reusable?
- Is there unnecessary JavaScript?
- Are there console errors?
- Does the result still match this document?

If not tested, say what was not tested.
