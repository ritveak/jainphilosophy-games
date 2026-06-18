# Master Product Prompt: Jain Cause & Effect Laboratory SPA

## Project Overview

Build a **single-file interactive Single Page Application (SPA)** using **HTML + Vanilla JavaScript + TailwindCSS via CDN only**.

The application should feel like a premium interactive philosophical simulation, not a form, quiz, or educational webpage.

The purpose of the experience is to help users deeply understand a central Jain insight:

> External outcomes are determined by multiple causes and conditions (Samvāyas), while internal spiritual freedom remains available regardless of outcome.

The application should gamify:

* Upādāna (material cause)
* Nimitta (instrumental cause)
* Svabhāva (intrinsic nature)
* Kāla (time)
* Niyati (order/necessity)
* Karma
* Purushārtha (effort)
* The distinction between:

  * The Reactive Loop
  * The Knower-Seer

The experience must leave users with the realization that:

> External success and internal success are independent dimensions.

---

# Core Design Philosophy

This is NOT:

* A quiz
* A school lesson
* A flashcard system
* A self-help app

This IS:

* An interactive philosophical laboratory
* A cause-and-effect simulator
* A guided insight experience
* A contemplative game

The user should feel:

* Curious
* Responsible
* Invested
* Slightly uncertain
* Then surprised
* Then reflective

The final insight should land emotionally, not merely intellectually.

---

# Technical Requirements

## Architecture

Single file only:

```html
index.html
```

No frameworks.

No React.

No Vue.

No build tools.

No external dependencies except:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Everything else must live inside:

```html
<style>
</style>

<script>
</script>
```

---

# Responsive Requirements

Must work perfectly on:

* Mobile
* Tablet
* Desktop

Design mobile-first.

---

# Application Structure

Three visible tabs:

```text
The Concepts
The Laboratory
Clarifying Doubts
```

---

# TAB 1: THE CONCEPTS

Purpose:

Quickly teach the framework.

Must be highly scannable.

Avoid walls of text.

Use:

* Cards
* Visual hierarchy
* Borders
* Icons
* Bullet points

---

## Section 1

### Upādāna

Explain:

Material cause.

Examples:

Seed → Plant

Clay → Pot

Bone Matrix → Healing

---

## Section 2

### Nimitta

Explain:

Instrumental conditions.

Examples:

Farmer

Potter

Translator

Doctor

---

## Section 3

### Five Samvāyas

Display visually:

```text
Result
↑

Upādāna
Svabhāva
Kāla
Niyati
Karma
```

Explain each.

---

## Section 4

Reactive Loop vs Knower-Seer

Use side-by-side comparison.

Reactive Loop:

* Blame
* Pride
* Anxiety
* Craving

Knower-Seer:

* Awareness
* Equanimity
* Observation
* Clarity

---

# TAB 2: THE LABORATORY

This is the heart of the application.

The experience must feel immersive.

---

# Laboratory State Machine

```text
Lobby

↓

Experience Selection

↓

Scenario Selection

↓

Step Journey

↓

Pivot Point

↓

Reveal

↓

Replay
```

---

# LABORATORY LOBBY

Show:

Large title:

```text
The Laboratory
```

Subtitle:

```text
Inspect the machinery behind outcomes.
```

Button:

```text
Start Experiment
```

---

# FULLSCREEN MODE

Clicking:

```text
Start Experiment
```

opens:

```css
fixed
inset-0
z-50
```

fullscreen overlay.

Hide entire SPA.

User is now inside laboratory mode.

---

# EXPERIENCE STYLE SELECTION

Before choosing a scenario.

Allow switching among:

---

## Minimal Jain

Mood:

Meditation

Colors:

```text
slate-950
slate-100
```

No gradients.

No glass.

Minimal transitions.

---

## Premium Product

Mood:

Modern SaaS

Features:

* Glass cards
* Progress bars
* Hover effects
* Microinteractions

Palette:

```text
slate
emerald
violet
```

---

## Narrative Experience

Mood:

Interactive philosophical story

Every step begins with a short narrative scene.

Example:

```text
A farmer stands before a field.

Four possibilities lie before him.

Only one can become rice.
```

Most immersive option.

---

# SCENARIO SELECTION SCREEN

Show 4 large cards.

Each card contains:

Icon

Title

Goal

Short description

---

## Scenario 1

🌾 Rice Farming

Goal:

Grow rice.

---

## Scenario 2

🏺 Pottery Crafting

Goal:

Create a finished clay pot.

---

## Scenario 3

📜 Manuscript Translation

Goal:

Produce a complete translation.

---

## Scenario 4

🦴 Bone Healing

Goal:

Restore structural integrity.

---

# SCENARIO DATABASE

Store in JS.

---

## Rice Farming

Upādāna:

```js
[
"Rice Seed",
"Rice Hay",
"Soil",
"Water"
]
```

Correct:

```js
Rice Seed
```

Kāla:

```js
[
"10 days",
"90 days",
"3 years"
]
```

Correct:

```js
90 days
```

Purushārtha Target:

```js
random 20-100
```

---

## Pottery

Correct Upādāna:

```js
Moist alluvial clay
```

Correct Kāla:

```js
8 hours
```

Purushārtha:

```js
10-80
```

---

## Translation

Correct Upādāna:

```js
Cognitive Capacity
```

Correct Kāla:

```js
4 hours
```

Purushārtha:

```js
1000000
```

Purpose:

Teach limits of effort.

---

## Bone Healing

Correct Upādāna:

```js
Living bone matrix
```

Correct Kāla:

```js
6 weeks
```

Purushārtha:

```js
5-30
```

---

# HIDDEN ENGINE

Immediately after scenario selection:

Generate:

```js
hiddenTarget
```

Generate:

```js
hiddenNiyati
```

75% chance success.

Generate:

```js
hiddenKarma
```

75% chance success.

Store invisibly.

Never show.

---

# STEP JOURNEY

Each step occupies the entire screen.

Only one concept visible at a time.

---

# STEP 1

UPĀDĀNA

Question:

```text
What is the material cause?
```

Large option cards.

Required.

Cannot continue until answered.

---

# STEP 2

SVABHĀVA

Teaching screen.

No answer required.

Explain:

Intrinsic nature.

Continue button.

---

# STEP 3

KĀLA

Question:

```text
How much time is required?
```

Required.

Cannot continue until answered.

---

# STEP 4

NIYATI

Teaching screen.

Explain:

Orderliness.

Hidden condition.

No answer.

---

# STEP 5

KARMA

Teaching screen.

Explain:

Invisible causal forces.

No answer.

---

# STEP 6

PURUSHĀRTHA

Huge effort screen.

Center:

```text
Effort
```

Large counter.

Button:

```text
MAKE EFFORT
```

Every click increments.

Show total.

Button:

```text
I AM DONE
```

moves forward.

---

# PROGRESS TRACKER

Persistent top bar.

Example:

```text
Upādāna
Svabhāva
Kāla
Niyati
Karma
Purushārtha
```

Current step highlighted.

Clickable.

---

# NAVIGATION RULES

Can move backwards anytime.

Cannot move forward if required step unanswered.

Must feel like a guided journey.

---

# PIVOT POINT

Most important screen.

Dark.

Minimal.

Pause before reveal.

Text:

```text
The experiment is complete.

The outcome already exists.

You have not yet seen it.

How will you meet it?
```

Two huge cards:

---

## Reactive Loop

```text
My happiness depends on results.
```

---

## Knower-Seer

```text
I observe outcomes without becoming them.
```

---

Must select one.

---

# REVEAL ENGINE

Do NOT instantly show scorecard.

Create suspense.

Animate diagnostics one at a time.

Every:

```js
600ms
```

Show:

```text
✓ Correct Upādāna
```

Then:

```text
✓ Correct Kāla
```

Then:

```text
✗ Insufficient Purushārtha
```

Then:

```text
✓ Niyati aligned
```

Then:

```text
✗ Karma failed
```

etc.

---

# SUCCESS FORMULA

External Success:

```js
correctUpadana &&
correctKala &&
enoughEffort &&
niyatiPass &&
karmaPass
```

---

Internal Success:

```js
posture === "Knower-Seer"
```

---

# FINAL OUTCOME MATRIX

Generate one of four teachings.

---

## External Fail + Internal Success

```text
The world did not cooperate.

Awareness remained free.
```

---

## External Success + Internal Failure

```text
The goal was achieved.

Attachment deepened.
```

---

## Both Success

```text
Conditions aligned.

Awareness remained clear.
```

---

## Both Failure

```text
Neither result nor awareness was preserved.
```

---

# FINAL SCORECARD

Show:

Chosen values.

Correct values.

Hidden values.

Roll results.

Effort target.

Actual effort.

Use elegant cards.

---

# REPLAY

Buttons:

```text
Try Again
Choose Another Experiment
Exit Laboratory
```

---

# TAB 3: CLARIFYING DOUBTS

Accordion UI.

---

Question:

```text
Does this mean everything is predetermined?
```

Answer nuanced.

---

Question:

```text
Where does free will exist?
```

Answer:

Internal posture.

Choice of effort.

---

Question:

```text
Why can effort fail?
```

Explain:

Multiple conditions required.

---

Question:

```text
How is this useful today?
```

Explain:

Reduced attachment.

Better decision making.

Less egoic suffering.

---

# Visual Standards

Modern.

Elegant.

Minimal.

Never cluttered.

Use:

* rounded-3xl
* subtle shadows
* generous spacing
* strong typography hierarchy

Avoid:

* dense paragraphs
* tiny text
* bright saturated colors
* gimmicky effects

---

# Desired Emotional Arc

Beginning:

```text
I understand this concept.
```

Middle:

```text
I am trying to win.
```

Reveal:

```text
Wait...
```

End:

```text
I understand the distinction between outcomes and awareness.
```

That emotional realization is the primary product outcome.
