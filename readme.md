# Concept Laboratory

Play with different concepts and understand them deeply.

Built with **React**, **Vite**, and **Tailwind CSS**.

## Project structure

```
/
├── index.html              # Vite entry
├── package.json
├── src/
│   ├── App.jsx             # Router
│   ├── concepts/
│   │   ├── index.jsx       # Concept loader (auto-detects content via globs)
│   │   └── samvaay/        # One concept per folder
│   │       ├── Concept.md
│   │       ├── faq.json
│   │       ├── resources.json
│   │       ├── data.js
│   │       ├── Lab.jsx
│   │       ├── useSamvaayLab.js
│   │       └── lab/
│   └── components/
│       ├── layout/         # ConceptHub, ConceptPage, ConceptTabs
│       ├── renderers/      # FaqRenderer, ResourcesRenderer
│       ├── faq/            # FaqSection (accordion)
│       ├── prose/          # ConceptMarkdown, Callout, etc.
│       └── lab/            # Lab components
└── shared/                 # Legacy vanilla assets
```

## Core Architecture

**Data-driven and render-agnostic**:

| Layer | Purpose |
|-------|---------|
| **Concepts folder** | JSON + Markdown content (+ concept-specific Lab) |
| **Generic renderers** | Display data from any concept (FaqRenderer, ResourcesRenderer) |
| **Dynamic tabs** | Auto-detect and build tabs based on JSON files present |

## Reusable components

Every concept shares the same page shell:

| Component | Purpose |
|-----------|---------|
| `ConceptHub` | Landing page with concept cards |
| `ConceptPage` | Header, back link, tab routing |
| `ConceptTabs` | Smart tab system (only shows available tabs) |
| `ConceptMarkdown` | Render markdown with styled prose |
| `FaqRenderer` | Render FAQ from JSON |
| `ResourcesRenderer` | Render resources from JSON |
| `LabEmbedded` | Laboratory wrapper with title |

## Adding a new concept

1. Create folder: `src/concepts/my-concept/`
2. Add required files:
   - `Concept.md` (frontmatter + markdown)
   - `faq.json` (optional - adds FAQ tab if present)
   - `resources.json` (optional - adds Resources tab if present)
3. Add Lab (optional):
   - `Lab.jsx` (wrapper component)
   - `lab/` folder (custom components)

That's it! The system automatically:
- ✓ Detects the concept
- ✓ Creates tabs based on available JSON files
- ✓ Renders content using appropriate renderers
- ✓ Displays in concept hub

See [structure.md](structure.md) for detailed guidelines.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build   # production build
npm run preview # preview production build
```

## FAQ Rendering

FAQ data flows through a generic renderer:

```
faq.json → FaqRenderer.jsx → Accordion UI
```

No component duplication across concepts. Just add `faq.json` to any concept folder.

## Resources Rendering

Resources data flows through a generic renderer:

```
resources.json → ResourcesRenderer.jsx → Card Grid UI
```

## Tab System

Tabs are built dynamically in `concepts/index.jsx`:

```javascript
const tabs = [
  { id: 'concepts', label: 'Concepts', exists: Boolean(content.concepts) },
  { id: 'lab', label: 'Laboratory', exists: Boolean(content.lab) },
  { id: 'doubts', label: 'FAQ', exists: Boolean(content.doubts) },
  { id: 'resources', label: 'Resources', exists: Boolean(content.resources) },
].filter((tab) => tab.exists);
```

Only tabs with available content appear on the page. No manual tab management needed.

