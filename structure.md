# Concept Structure Framework

This document provides a master template for creating new concepts in Samvaay. It includes the structural components, guidelines for each section, and a detailed example using Samvaay (the first concept) to showcase how innovative interactivity works.

---

## Core Architecture

Samvaay follows a **data-driven, render-agnostic architecture**:

- **Concepts folder**: Contains only JSON configuration and markdown content (+ concept-specific Lab)
- **Components folder**: Contains generic renderers that display data from any concept
- **Dynamic tabs**: Automatically appear/disappear based on JSON file presence

### Concept Folder Structure

```
samvaay/
├── Concept.md          (Markdown: Theory & narrative)
├── faq.json            (Data: Frequently asked questions)
├── resources.json      (Data: External learning resources)
├── data.js             (Config: Lab-specific scenarios & constants)
├── Lab.jsx             (Component: Concept-specific lab wrapper)
└── lab/                (Lab components - concept-specific)
    ├── ScenarioPicker.jsx
    ├── StepJourney.jsx
    ├── RevealEngine.jsx
    ├── ResultScorecard.jsx
    └── [Custom components as needed]
```

### Generic Renderers (in components/)

```
components/
└── renderers/
    ├── FaqRenderer.jsx       (Renders any faq.json)
    └── ResourcesRenderer.jsx (Renders any resources.json)
```

### Why This Structure?

✓ **Scalability**: Add new concepts with just JSON + Markdown + Lab  
✓ **Maintainability**: Rendering logic centralized, not duplicated  
✓ **Flexibility**: Easily add/remove content types by adding/removing JSON files  
✓ **Smart tabs**: Tabs automatically appear based on available JSON files  

---

## 1. CONCEPT.MD - Theory & Narrative

### Purpose
Present the foundational theory in accessible, narrative-driven prose. This is where readers build conceptual understanding.

### Structure Template

```markdown
---
id: concept-slug
title: Display Title
subtitle: One-line hook
summary: 2-3 sentence overview
icon: "🎯"
tagline: Powerful closing statement that captures the core insight
---

## Opening Narrative
Start with a grounding story or question that resonates emotionally.

## Core Definition
Define the concept clearly and establish its scope.

## Key Components/Principles
Break down the concept into logical parts. Use sub-sections and clear language.

## Important Distinctions
Call out common confusions or related concepts that need clarification.

## Real-World Application
Connect the theory to practical scenarios.

## Transition to Lab
Explicitly invite readers to the laboratory tab to experience the concept interactively.
```

---

## 2. FAQ.JSON - Clarification & Troubleshooting

### Purpose
Address common misconceptions, edge cases, and practical questions that emerge after users engage with the concept and lab.

### Structure Template

```json
[
  {
    "question": "Does this mean [common misconception]?",
    "answer": "No. [Clarification]. Instead, [correct understanding]."
  },
  {
    "question": "How does this apply to [common scenario]?",
    "answer": "[Practical guidance]."
  }
]
```

### Key Guidelines

- **4-8 questions** per concept
- **Q/A format**: Direct, concise answers (2-4 sentences max)
- **Address misconceptions**: What students commonly get wrong
- **Practical application**: How the concept applies in real scenarios
- **Edge cases**: Boundary conditions or special situations

### Rendered By
`FaqRenderer.jsx` — Displays as an accordion with smooth interactions

---

## 3. RESOURCES.JSON - External Learning Materials (Optional)

### Purpose
Curate high-quality external resources (articles, videos, books) that deepen understanding of the concept.

### Structure Template

```json
[
  {
    "title": "[Source] Resource Title",
    "url": "https://example.com/resource",
    "description": "A brief description of what this resource covers and why it's valuable."
  }
]
```

### Key Guidelines

- **Diversity**: Mix video, articles, books, podcasts
- **Quality over quantity**: 3-6 best resources
- **Source attribution**: Always include where the resource comes from
- **Active links**: Verify URLs work
- **Descriptive text**: Help readers decide if resource is for them

### Rendered By
`ResourcesRenderer.jsx` — Displays as styled cards with domain references

---

## 4. LAB.JSX + LAB/ - Interactive Laboratory

### Purpose
Move beyond passive learning into active exploration and experimentation.

### Structure Template

```
lab/
├── Lab.jsx              (Wrapper component)
├── ScenarioPicker.jsx   (Choose scenario)
├── StepJourney.jsx      (Multi-step progression)
├── RevealEngine.jsx     (Gradual reveal of results)
├── ResultScorecard.jsx  (Summary & reflection)
└── [Custom components]
```

### Key Principles

- **Scenario-based**: Present realistic situations where the concept applies
- **Progressive disclosure**: Reveal information in stages
- **Immediate feedback**: Show results and explanations as user interacts
- **Reflection prompts**: Help users think about what they learned

### Concept-Specific
Lab components are **unique to each concept**. This is intentional:
- Labs test deep understanding of specific concepts
- They require custom logic and UI
- They are not reusable across concepts

---

## 5. DATA.JS - Configuration & Constants (Optional)

### Purpose
Store lab-specific scenarios, constants, and configuration data.

### When to Use
- Complex labs with multiple scenarios
- Shared data between lab components
- Scenario definitions and outcome logic

---

## Adding a New Concept

### Step 1: Create the folder
```bash
mkdir src/concepts/my-concept
```

### Step 2: Add core files

**Concept.md** (Required)
```markdown
---
id: my-concept
title: My Concept Title
subtitle: One-line subtitle
summary: 2-3 sentence summary
icon: "🎯"
tagline: Powerful closing insight
---

[Your content here]
```

**faq.json** (Optional)
```json
[
  { "question": "Q1?", "answer": "A1" },
  { "question": "Q2?", "answer": "A2" }
]
```

**resources.json** (Optional)
```json
[
  {
    "title": "[Source] Title",
    "url": "https://...",
    "description": "Description"
  }
]
```

### Step 3: Add Lab (Optional)

If you want an interactive lab, create:
```
my-concept/
├── Lab.jsx
└── lab/
    └── [your custom components]
```

### Step 4: Done!

The system automatically:
- ✓ Detects the new concept
- ✓ Creates tabs based on available JSON files
- ✓ Renders content using appropriate renderers
- ✓ Displays in the concept hub

No wiring needed in `index.jsx` — it all happens automatically via glob imports.

---

## How Tabs Are Determined

The `concepts/index.jsx` loader:

1. **Scans for files** using glob patterns
2. **Maps to concept IDs** (folder names)
3. **Returns both content AND tab metadata**

```javascript
// Tabs are built dynamically based on what exists
const tabs = [
  { id: 'concepts', label: 'Concepts', exists: Boolean(content.concepts) },
  { id: 'lab', label: 'Laboratory', exists: Boolean(content.lab) },
  { id: 'doubts', label: 'FAQ', exists: Boolean(content.doubts) },
  { id: 'resources', label: 'Resources', exists: Boolean(content.resources) },
].filter((tab) => tab.exists);
```

**Result**: Only tabs with available content appear on the page.
