# TechZeph Terminal Portfolio

A terminal-style portfolio website with matrix rain background animation, built with clean modular architecture.

## Project Overview

This is a single-page application that mimics a Linux terminal interface (inspired by Alacritty/Ghostty/Kitty) where visitors can interact with commands to learn about the portfolio owner, view projects, and access links.

## Directory Structure

```
/project-root
├── index.html                # HTML shell: structure + semantic containers only
├── README.md                 # Project documentation
│
├── styles/
│   ├── base.css              # Reset, tokens, utility classes
│   ├── layout.css            # Page layout, grid, positioning
│   └── terminal.css          # All terminal-specific appearance
│
├── scripts/
│   ├── app.init.js           # Bootstrapping and wiring modules
│   ├── matrix-rain.js        # Background animation, self-contained
│   ├── terminal.core.js      # Terminal engine (DOM + command plumbing)
│   ├── terminal.commands.js  # Command registry + handlers
│   └── utils.js              # Small helpers (debounce, safeOpen, a11y helpers)
│
├── assets/
│   ├── fonts/                # Local fonts or font-face files
│   └── cv.pdf                # CV for download
│
└── data/
    └── commands.json         # Lightweight registry of commands (optional)
```

## How to Run Locally

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build step required - pure HTML/CSS/JS

For local development with a server:
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server
```

Then visit `http://localhost:8000`

## Where to Edit

### Colors & Design Tokens
Edit `styles/base.css` - all design tokens are in the `:root` selector at the top:
- `--bg`: Background color
- `--matrix-green`: Primary accent color
- `--glass`: Transparency values
- `--radius`: Border radius
- `--gap`: Spacing units

### Commands
Edit `scripts/terminal.commands.js` to add/modify commands. Each command is registered with:
- Command name
- Handler function
- Metadata (description, category)

### Command Metadata (Optional)
Edit `data/commands.json` to add command descriptions and categories that can be loaded dynamically.

## Development Principles

### Separation of Concerns
- **HTML**: Structure only - no inline styles or scripts
- **CSS**: Appearance only - organized by purpose (base, layout, terminal)
- **JS**: Behavior only - modular files with single responsibilities

### Single Responsibility
Each JavaScript file and CSS file does one job:
- `utils.js` - pure helper functions
- `matrix-rain.js` - canvas animation only
- `terminal.core.js` - terminal engine logic
- `terminal.commands.js` - command definitions
- `app.init.js` - initialization and wiring

### Code Quality
- Small, pure functions where possible
- Readable names: `appendLine()` not `a()`
- Nouns for files/classes, verbs for functions
- Document decisions in README and file headers

## Accessibility

- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Respects `prefers-reduced-motion`
- Mobile-friendly input handling

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Personal portfolio project - all rights reserved.
