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
│   │   ├── registry.js     # Concept metadata (title, summary, icon)
│   │   ├── index.jsx        # Maps concept id → tab content
│   │   └── samvaay/        # One concept per folder
│   │       ├── SamvaayConcepts.jsx
│   │       ├── SamvaayFaq.jsx
│   │       ├── SamvaayLab.jsx
│   │       ├── data.js
│   │       └── lab/        # Lab stage components
│   └── components/
│       ├── layout/         # ConceptHub, ConceptPage, ConceptTabs
│       ├── prose/          # ConceptProse, Callout, Split, DefinitionList
│       ├── faq/            # FaqSection
│       └── lab/            # LabEmbedded, PivotImmersive
└── shared/                 # Legacy vanilla assets (kept for reference)
```

## Reusable components

Every concept shares the same page shell:

| Component | Purpose |
|-----------|---------|
| `ConceptHub` | Landing page with concept cards |
| `ConceptPage` | Header, back link, tab routing |
| `ConceptTabs` | Concepts / Laboratory / FAQ tabs |
| `ConceptProse` | Styled prose, callouts, splits, definition lists |
| `FaqSection` | Accordion FAQ tab |
| `LabEmbedded` | Laboratory wrapper with title |
| `PivotImmersive` | Fullscreen pivot overlay with matrix animation |

## Adding a new concept

1. Register it in `src/concepts/registry.js`
2. Create `src/concepts/my-concept/` with:
   - `MyConceptConcepts.jsx` — Concepts tab content
   - `MyConceptFaq.jsx` — FAQ tab
   - `MyConceptLab.jsx` — Laboratory tab (optional)
3. Wire it in `src/concepts/index.jsx`:

```js
import MyConceptConcepts from './my-concept/MyConceptConcepts';
import MyConceptFaq from './my-concept/MyConceptFaq';
import MyConceptLab from './my-concept/MyConceptLab';

const CONTENT = {
  // ...
  'my-concept': {
    concepts: <MyConceptConcepts />,
    lab: <MyConceptLab />,
    doubts: <MyConceptFaq />,
  },
};
```

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
