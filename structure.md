# Concept Structure Framework

This document provides a master template for creating new concepts in Samvaay. It includes the structural components, guidelines for each section, and a detailed example using Samvaay (the first concept) to showcase how innovative interactivity works.

---

## Core Structure

Every concept on Samvaay consists of three main components:

```
Concept/
├── Concept.md          (Theory & Context)
├── data.js             (Configuration & Scenarios)
├── Faq.jsx             (Frequently Asked Questions)
└── Lab/                (Interactive Laboratory)
    ├── ScenarioPicker.jsx
    ├── StepJourney.jsx
    ├── RevealEngine.jsx
    ├── ResultScorecard.jsx
    └── [Custom components as needed]
```

---

## 1. CONCEPT.md - Theory & Narrative

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

### Component 1
Explain with examples.

### Component 2
Explain with examples.

## Important Distinctions
Call out common confusions or related concepts that need clarification.

## Real-World Application
Connect the theory to practical scenarios.

## Transition to Lab
Explicitly invite readers to the laboratory tab to experience the concept interactively.
```

### Example: Samvaay Concept.md
See the complete example in [src/concepts/samvaay/Concept.md](src/concepts/samvaay/Concept.md). Key features:
- Opens with Jain philosophy context (grounds readers)
- Defines "samvāya" clearly (conditions needed for outcomes)
- Lists 6 key factors: Upādāna, Purushārtha, Kāla, Svabhāva, Niyati, Karma
- Distinguishes material cause (upādāna) from instrumental cause (nimitta)
- Ends with invitation to the laboratory

---

## 2. FAQ.jsx - Clarification & Troubleshooting

### Purpose
Address common misconceptions, edge cases, and practical questions that emerge after users engage with the concept and lab.

### Structure Template

```javascript
const FAQ_ITEMS = [
  {
    question: 'Does this mean [common misconception]?',
    answer: 'No. [Clarification]. Instead, [correct understanding].'
  },
  {
    question: 'How does this apply to [common scenario]?',
    answer: '[Practical guidance].'
  },
  {
    question: 'Why is [this part] important?',
    answer: '[Explanation of significance].'
  },
  // 4-8 questions total
];
```

### Guidelines
- **Anticipate confusion**: What will readers misunderstand after the lab?
- **Be practical**: Ground answers in real-world application
- **Keep it concise**: Each answer should be 2-3 sentences max
- **Reference the lab**: Point back to scenarios where relevant

### Example: Samvaay FAQ
See [src/concepts/samvaay/Faq.jsx](src/concepts/samvaay/Faq.jsx). Key questions:
- "Does this mean everything is predetermined?" (addresses fatalism concern)
- "Where does free will exist?" (clarifies what remains in user's control)
- "Why can effort fail?" (explains the multi-factor nature)
- "How is this useful in daily life?" (bridges theory to practice)

---

## 3. Lab System - Interactive Experimentation

### Philosophy
The lab transforms abstract concepts into tangible experiences. Users should **feel** the concept through interactive choices that produce meaningful feedback. **Labs are flexible and can take many forms—design the interaction that best serves your concept.**

### Universal Design Principles

Regardless of structure, effective labs share these qualities:

1. **Active Engagement**: Users must make choices; they cannot passively consume
2. **Consequence Visualization**: Show outcomes clearly; explain why they happened
3. **Tangible Feedback**: Make abstract ideas concrete through visual/interactive feedback
4. **Progressive Complexity**: Start simple, build to subtle insights
5. **Multiple Angles**: Show the concept across different contexts or scenarios
6. **Teachable Moments**: Reveal gaps between user assumptions and reality

### Lab Structure: Flexible by Design

Labs can be structured many ways depending on your concept. Here are possible patterns:

**Pattern 1: Scenario Selection + Step Journey** (Like Samvaay)
- User picks a scenario
- Navigates through sequential decision points
- Each choice affects the outcome
- Ends with results and reflection

**Pattern 2: Simulation/Sandbox**
- Open-ended experimentation space
- User adjusts variables and observes real-time feedback
- No "correct" path—exploration drives learning

**Pattern 3: Comparison/Contrast**
- User selects different approaches to the same problem
- Side-by-side visualization of outcomes
- Direct comparison reveals concept mechanics

**Pattern 4: Progressive Unmasking**
- Start with intuitive guesses about what will happen
- Reveal reality step-by-step
- Highlight misconceptions through contradiction

**Pattern 5: Mini-Game/Challenge**
- Playful interaction (typing, timing, matching, clicking)
- Concept embedded in game mechanics
- Engagement through competition or achievement

**Pattern 6: Interactive Narrative**
- Story-driven with branching choices
- Each choice reveals new dimensions of the concept
- Emotional investment drives deeper understanding

### Example: Samvaay Lab - One Approach

Samvaay uses **Pattern 1 (Scenario Selection + Step Journey)** because the concept is about multiple causes stacking to produce outcomes. This structure works well because:

#### Scenario Structure (data.js)
```javascript
SCENARIOS = [
  {
    id: 'rice',
    icon: '🌾',
    title: 'Rice Farming',
    goal: 'Grow rice.',
    description: 'Choose the right cause, time, and effort...',
    upadana: ['Rice Seed', 'Rice Hay', 'Soil', 'Water'],
    correctUpadana: 'Rice Seed',
    kala: ['10 days', '90 days', '3 years'],
    correctKala: '90 days',
    effortRange: [20, 100],
    story: 'A farmer stands before a field...'
  }
]
```

**Why this works:**
- User sees 4 material options; only ONE is correct (teaches specificity of upādāna)
- Time options span too-short, optimal, and too-long (teaches kāla importance)
- Effort is a range—user must decide how much to try (agency visible within constraints)
- Story grounds the scenario emotionally

#### Step Journey (How Samvaay Structures Sequential Decisions)
Users go through 6 steps in order:
1. **Upādāna (Material)**: Choose the starting material
2. **Svabhāva (Nature)**: See the inherent nature of what you chose
3. **Kāla (Time)**: Choose how long to wait
4. **Niyati (Order)**: Learn if background conditions aligned (random 50%)
5. **Karma (Momentum)**: Learn if prior conditions help or hinder (random 50%)
6. **Purushārtha (Effort)**: Make effort toward a target—hit it or miss it

**Why Samvaay structures it this way:**
- Steps follow dependency order (material must be chosen first, then conditions affect it)
- User choices at each step stack to determine final outcome
- Niyati and Karma are randomized to teach the "you can't control everything" lesson
- Effort becomes a mini-game (hit a target via button clicks) making engagement visceral
- Perfect for concepts with layered, interdependent causes

**Alternative: Your concept might use:**
- Parallel choices (all options available simultaneously)
- Branching paths (different choices lead to different routes)
- Continuous adjustment (sliders that update in real-time)
- Discrete decisions (pick one and see immediate outcome)

#### Pivot Screen (Samvaay's Mindset Moment)
After all steps, user is asked: **"How will you meet the outcome?"**

Two choices presented:
- **Reactive Loop**: Success inflates you; failure diminishes you
- **Knower-Seer**: Register outcome clearly without fusing with it

**Why Samvaay includes this:**
- It splits external success from internal success (core teaching)
- It reveals that outcome + mindset = actual wisdom
- Same external result can lead to different internal states

**Your concept might instead:**
- Ask a reflection question without a binary choice
- Offer multiple interpretation frameworks
- Let users replay with different mindset choices
- Skip this entirely if your concept doesn't need it

#### Result Scorecard (How Samvaay Visualizes Outcomes)
Displays a matrix:
- **External Success**: Did all conditions align? Did you hit the effort target?
- **Internal Success**: Did you choose the knower-seer posture?

**Outcome categories Samvaay uses:**
- Full Alignment (external YES + internal YES) → "Rare convergence"
- Hollow Victory (external YES + internal NO) → "The world said yes. Something inside tightened."
- Meaningful Failure (external NO + internal YES) → "You stayed free even without the outcome"
- Compounded Loss (external NO + internal NO) → "Both effort and awareness lost"

**Why Samvaay structures results this way:**
- Multi-dimensional scoring (not just "win/loss")
- Separates what you can control from outcomes
- Offers wisdom in each outcome quadrant

**Your results might instead:**
- Show a single success metric with explanation
- Display a spectrum (not categories)
- Offer different retry paths based on outcome
- Highlight what would've changed the outcome

#### Hidden Factors Reveal (Samvaay's Unexpected Variable Moment)
At the end, explain:
- Which Niyati/Karma factors were randomly set
- How they affected the outcome
- Why this teaches the multi-causal nature of reality

**Why Samvaay uses hidden randomized factors:**
- Teaches that not everything is in your control
- Creates "failure despite perfect planning" moments
- Builds humility and realistic expectations

**Your concept might instead:**
- Make all factors visible from the start
- Use deterministic outcomes (same input = same output)
- Introduce surprises organically through story
- Have no hidden factors at all

---

## How to Use This Framework

### Step 1: Gather Raw Thoughts
Collect your concept's core ideas, examples, and scenarios.

### Step 2: Feed to AI (Master Prompt)

```
I want to create a new concept for Samvaay. Here are my raw thoughts:

[Your raw concept notes]

Using the Samvaay structure framework, help me design three key components:

1. Write a compelling Concept.md that:
   - Opens with a narrative hook
   - Defines the concept clearly
   - Breaks it into 3-6 key components
   - Ends with an invitation to the lab

2. Design an interactive lab that:
   - Makes the concept tangible through choices/actions
   - Shows the concept across 2-3 different contexts or scenarios
   - Produces visible consequences that illuminate the concept
   - Could be: sequential scenarios (like Samvaay), a sandbox, 
     a narrative with branching, a comparison tool, a game, etc.
   - (Note: Samvaay uses sequential scenarios + step-by-step decisions, 
     but your concept might work better with a different interaction model)

3. Create FAQ items that address:
   - Common misconceptions people will have
   - How this applies to daily life
   - Why each component/insight matters
   - Questions that emerge after trying the lab
```

### Step 3: Refine & Implement
- Review the AI output for clarity and coherence
- Adjust the lab design to match your concept's needs (not Samvaay's template)
- Add more FAQ items based on testing
- Develop specific React components for your unique lab interaction

---

## Samvaay as One Example

Samvaay exemplifies one effective approach to lab design—but it's just one approach:

### ✓ Why Samvaay's Structure Works Well
- **Dense Concept Needs Structure**: Samvaay deals with 6 interdependent causes, so sequential step-by-step choices make sense
- **Scenarios Span Domains**: Rice Farming (agriculture), Pottery (craft), Translation (knowledge), Healing (medicine)—universality is shown
- **Interactive Choices Have Weight**: Each choice (material, time, effort) directly impacts outcome
- **Hidden Randomness Teaches a Lesson**: Not everything is controllable; planning doesn't guarantee success
- **Mindset Pivot Deepens Insight**: Separates external success from internal peace
- **Multi-Dimensional Scoring**: "Success" isn't binary—it depends on what you measure

### ✓ When Your Lab Might Look Different
- **Simpler concept?** Maybe a sandbox where users tweak variables and see instant feedback (no steps needed)
- **Story-heavy concept?** Branching narrative where choices reveal different facets
- **Practical concept?** Open-ended challenges where users solve problems their own way
- **Visual concept?** Side-by-side comparisons or interactive diagrams
- **Playful concept?** A game where the concept emerges through gameplay

**The key:** Design the lab interaction that best makes your specific concept tangible and memorable.

---

## Implementation Checklist

- [ ] Concept.md written and narrative-driven
- [ ] 3-4 scenarios designed with domain diversity
- [ ] User choices clearly impact outcomes
- [ ] At least 2 hidden factors included (things beyond user control)
- [ ] A pivot/mindset moment included
- [ ] Result visualization is multi-dimensional
- [ ] FAQ written after lab is functional (anticipate real user confusion)
- [ ] Lab components are React-based and interactive
- [ ] Tested with real users for clarity and engagement
- [ ] Concept data exported to data.js for maintainability

---

## Resources

- **Samvaay Example**: See `/src/concepts/samvaay/` for the complete implementation
- **FAQ Component**: [src/components/faq/FaqSection.jsx](src/components/faq/FaqSection.jsx)
- **Lab Layout**: [src/components/lab/LabEmbedded.jsx](src/components/lab/LabEmbedded.jsx)
- **Concept Page**: [src/components/layout/ConceptPage.jsx](src/components/layout/ConceptPage.jsx)

---

## Questions to Ask Before Building

1. **What's the core insight?** Can you explain it in one sentence?
2. **What's the common misconception?** What do people usually get wrong?
3. **Why does it matter?** Where will someone apply this understanding?
4. **What's the best way to make it tangible?** Is it through scenarios, simulation, comparison, narrative, game, or something else?
5. **What's the "aha" moment?** What interaction or revelation should make people go "oh, I get it now"?
6. **What should users control vs. what should surprise them?** What's learnable and what's better discovered?
7. **How will you know they understood?** What would they be able to explain or do after the lab?

---

## Design Freedom

Remember: **Samvaay is one example, not the template.** Your lab should fit your concept:

- A concept about **dynamic systems** might be a real-time simulator
- A concept about **contrasts** might be a side-by-side comparison tool
- A concept about **decision-making** might be a branching narrative
- A concept about **patterns** might be an interactive pattern-builder
- A concept about **systems** might be a network visualization you can tweak

The structure.md shows you the philosophy and components. Use what serves your concept, and innovate where your concept needs something new.
