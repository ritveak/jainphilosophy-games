# Concept Laboratory

Play with different concepts and understand them deeply.

No build tools, no React — just open `index.html` in a browser.

## Project structure

```
/
├── index.html              # Hub — cards for all concepts
├── concepts.js             # Registry of concepts (title, summary, path)
├── shared/
│   ├── theme.css           # Shared colors and UI components
│   ├── tabs.js             # Tab switching utility
│   └── matrix.js           # Matrix animation (laboratory pivot screen only)
└── samvaay/                # One concept per folder
    ├── index.html          # Concept page (Concepts, Lab, FAQ tabs)
    ├── project.md          # Design spec for this concept
    └── lab.js              # Interactive laboratory logic
```

## Adding a new concept

1. Create a folder, e.g. `my-concept/`
2. Add `index.html` with three tabs: **The Concepts**, **The Laboratory**, **Clarifying Doubts**
3. Link shared assets from `../shared/theme.css`, `../shared/tabs.js` (and `../shared/matrix.js` if the lab has a pivot screen)
4. Add concept-specific logic (e.g. `lab.js`) in the folder
5. Register it in `concepts.js`:

```js
{
  id: 'my-concept',
  title: 'My Concept',
  subtitle: 'Short tagline',
  summary: 'One-line description shown on the hub card.',
  path: 'my-concept/index.html',
  icon: '✨'
}
```

## Running locally

Double-click `index.html`, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000
