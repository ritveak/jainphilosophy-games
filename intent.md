# Samvaay - Learning Through Concepts

## Intent

Samvaay is a platform designed to help people deeply understand complex concepts through a multi-faceted learning experience.

## Core Features

### 1. **Concept Learning**
Learn foundational knowledge about key concepts through clear, structured explanations. Each concept is presented with comprehensive markdown documentation that builds understanding progressively.

**Technical**: Concepts are stored as `Concept.md` with YAML frontmatter. Content is parsed and rendered as styled prose.

### 2. **FAQ Clarification**
Frequently asked questions address common points of confusion, misconceptions, and edge cases. Get quick answers to questions that typically arise when learning each concept.

**Technical**: FAQ data is stored as `faq.json` (one per concept). A generic `FaqRenderer` displays all FAQs as an interactive accordion. Just add the JSON file to auto-enable the FAQ tab.

### 3. **Resource Curation** *(New)*
Curated external resources (videos, articles, books) that deepen understanding of the concept.

**Technical**: Resources are stored as `resources.json` (one per concept). A generic `ResourcesRenderer` displays them as styled cards. Just add the JSON file to auto-enable the Resources tab.

### 4. **Practical Laboratory**
Move beyond theory into hands-on experimentation. The integrated lab allows you to:
- Interact with real-world examples
- Play with practical implementations
- See concepts come alive through immersive, interactive experiences
- Test your understanding in real-time

**Technical**: Each concept can have a `Lab.jsx` component with custom sub-components in a `lab/` folder. Labs are concept-specific and not templated.

### 5. **AI-Powered Concept Export** *(Coming Soon)*
Export any concept as markdown for use with AI tools:
- Download complete concept documentation
- Seamlessly load into ChatGPT, Gemini, or any AI assistant
- Have intelligent conversations about the concept
- Get personalized explanations and variations

## Architecture Highlights

### Data-Driven Design
- **Concepts folder**: Contains only JSON, Markdown, and concept-specific Lab code
- **Components folder**: Contains generic renderers (FaqRenderer, ResourcesRenderer, etc.)
- **No duplication**: Each content type (FAQ, Resources) has one renderer used by all concepts

### Smart Tab System
Tabs are automatically determined by file presence:
- `Concept.md` present? → Show **Concepts** tab
- `Lab.jsx` present? → Show **Laboratory** tab
- `faq.json` present? → Show **FAQ** tab
- `resources.json` present? → Show **Resources** tab

Add or remove JSON files to control which tabs appear. No code changes needed.

### Scalability
Adding a new concept is simple:
1. Create `src/concepts/my-concept/`
2. Add `Concept.md` (required)
3. Add `faq.json` (optional)
4. Add `resources.json` (optional)
5. Add `Lab.jsx` + `lab/` (optional)
6. Done! System auto-detects everything.

## Learning Flow

```
Concept Hub (Browse concepts)
    ↓
Concept Page
    ├─→ [Learn] Concepts tab
    ├─→ [Explore] Lab tab
    ├─→ [Ask] FAQ tab
    └─→ [Discover] Resources tab
```

## Use Cases

- **Students**: Understand complex concepts faster with interactive examples
- **Educators**: Use Samvaay as a teaching supplement
- **Practitioners**: Refresh knowledge and explore practical applications
- **AI Enthusiasts**: Leverage AI tools for deeper concept exploration

---

**Goal**: Make learning more interactive, accessible, and effective by combining structured knowledge with practical experimentation, FAQ clarity, curated resources, and modern AI capabilities.

