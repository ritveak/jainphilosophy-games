# Mohaniya Karma Laboratory Design

## Vision

This laboratory is not a decision-making simulator.

It is a **conditioning simulator.**

Most interactive stories ask:

> "What would you do?"

This laboratory asks a much deeper question:

> **"How much conscious effort does it take before you can even SEE a wiser response?"**

The goal is not to teach the "correct answer."

The goal is to let users experience how Mohaniya Karma (Deluding Karma) narrows awareness.

The interaction itself should become the metaphor.

---

# Core Philosophy

Every action starts with an instinct.

That instinct usually feels:

* obvious
* justified
* convincing
* natural

Only after conscious effort do alternative viewpoints become visible.

The laboratory recreates this process.

Instead of immediately showing all possible responses, they are gradually revealed as the player consciously pauses and reflects.

The player experiences the cost of awareness.

---

# Overall Flow

```
Introduction

↓

How this laboratory works

↓

Scenario Picker

↓

Scenario Introduction

↓

Decision Step 1

↓

Decision Step 2

↓

...

↓

Scenario Reveal

↓

Reflection

↓

Choose another scenario
```

---

# Screens

---

# 1. Introduction Screen

Title

> Mohaniya Karma Laboratory

Subtitle

> Discover how your mind slowly convinces you that only one option exists.

Body

Most poor decisions do not happen because we are unintelligent.

They happen because the first thought feels completely reasonable.

This laboratory lets you experience how awareness gradually uncovers better possibilities.

Button

> Begin

---

# 2. Rules Screen

Title

> How it works

Body

For every situation:

• One response will already be selected.

This represents your instinctive reaction.

If time runs out, that response becomes your decision.

You may press **"What Else?"** to consciously pause.

Each press represents effort.

As you continue reflecting, better possibilities gradually become visible.

Sometimes the wisest response requires much more awareness than the first one.

There are no perfect scores.

This laboratory is about observing your conditioning.

Button

> Continue

---

# 3. Scenario Picker

Cards

Example

```
🍲 Khichdi Saga

A small mistake becomes a chain of deception.
```

```
☕ Broken Mug

How protecting your image creates bigger problems.
```

```
💼 Forgotten Email

One missed email.
Many unnecessary lies.
```

```
👨‍👩‍👧 Parenting

Notice how anger shrinks your options.
```

Selecting one loads the scenario.

---

# 4. Scenario Introduction

Each scenario begins with context.

Example

Title

The Khichdi Saga

Body

You are cooking dinner.

Your flatmate casually watches you.

There is no conflict.

Everything is normal.

Button

Begin

---

# 5. Decision Screen

This is the primary screen.

Layout

```
------------------------------------

Step 1 / 5

Time Remaining

07

------------------------------------

Yug says,

"Maybe measure the dal?"

------------------------------------

Responses

● I know the ratio.
My estimate is good.

(default)

------------------------------------

[ What Else? ]

0 / 15

------------------------------------
```

---

# Response Levels

Responses exist in layers.

Initially only Layer 1 is visible.

After sufficient reflection another appears.

Example

Layer 1

Instinctive

```
I know the ratio.

My estimate is good.
```

Layer 2

```
Measuring isn't a bad idea.
```

Layer 3

```
Let's compare our estimates for fun.
```

Notice

Nothing says

"This is correct."

The user discovers it.

---

# What Else Button

This button represents conscious effort.

Every click:

• increments reflection counter

• slightly animates breathing / thinking

• updates progress indicator

Example

```
Thinking...

██████░░░░

6 / 15
```

No options appear until thresholds are crossed.

---

# Unlock Thresholds

Example

```
0 clicks

↓

Only Level 1
```

```
10 clicks

↓

Reveal Level 2
```

```
15 clicks

↓

Reveal Level 3
```

Each scenario may define its own thresholds.

---

# Timer

Every decision has a countdown.

Default

8 seconds.

If timer expires

Automatically submit the currently selected option.

Usually

this is the instinctive one.

This mirrors real life.

Many decisions happen before conscious reflection.

---

# Selecting Responses

Whenever a new response appears

Nothing changes automatically.

The default selection remains unchanged.

Player must consciously switch.

This reinforces effort.

---

# Step Completion

After choosing

Show a brief consequence.

Example

```
You continue without measuring.

...

The cooker is now almost overflowing.
```

No judgement.

Only consequences.

Continue to next step.

---

# Final Reveal

After the scenario ends

Replay everything.

Timeline

```
Suggestion

↓

Pride

↓

Wrong estimate

↓

Fear

↓

Concealment

↓

More Fear

↓

Partial honesty
```

Then show

## Hidden Chain

```
Instinct

↓

Pride

↓

Protect Image

↓

Fear

↓

Deceit

↓

More Attachment

↓

Stress
```

---

# Reflection Screen

Title

What happened?

Body

Notice something.

None of your later decisions were obviously bad.

Each one simply felt like the least painful option available.

The real turning point happened much earlier.

Every later decision merely protected the previous one.

That is how Mohaniya Karma operates.

---

# Personal Reflection

Ask

Which option felt most natural?

Which option did you finally choose?

How many reflections did it take before another possibility appeared?

The distance between those two moments represents your current conditioning.

Fortunately,

conditioning can be retrained.

---

# Scenario Completion

Display

```
Scenario Complete

Instinctive Responses

█████

Conscious Responses

███

Deep Reflection

██
```

Not a score.

Only a mirror.

---

# Generic Data Structure

```
Scenario

↓

Multiple Steps

↓

Each Step

↓

Multiple Response Levels

↓

Each Level unlocks after N reflections

↓

Each response leads to consequences
```

---

Example JSON

```json
{
  "id": "khichdi",

  "title": "The Khichdi Saga",

  "description": "A tiny moment of pride slowly snowballs into deceit.",

  "intro": [
    "You are cooking dinner.",
    "Everything is going normally."
  ],

  "steps": [
    {
      "id": "measure",

      "timer": 8,

      "prompt": "Your flatmate says, 'Maybe measure the dal?'",

      "unlockButton": "What Else?",

      "levels": [
        {
          "unlockAfter": 0,

          "default": true,

          "response": "No need. I know the ratio.",

          "mentalState": "Pride",

          "consequence": "You continue estimating."
        },
        {
          "unlockAfter": 10,

          "response": "Maybe measuring is safer.",

          "mentalState": "Awareness",

          "consequence": "You measure before cooking."
        },
        {
          "unlockAfter": 15,

          "response": "Let's see whose estimate is closer.",

          "mentalState": "Humility",

          "consequence": "Both of you laugh and compare."
        }
      ]
    }
  ],

  "reveal": {
    "timeline": [
      "Pride",
      "Fear",
      "Deceit",
      "Attachment",
      "Stress"
    ],

    "lesson": "The first instinct wasn't evil. It simply became protected."
  }
}
```

---

# Data Model

Every scenario contains

```
Title

Description

Intro

Steps[]

Reveal
```

Every step contains

```
Prompt

Timer

Unlock Button Label

Levels[]
```

Every level contains

```
Unlock Threshold

Response

Mental State

Consequence

Optional Tag

Optional Explanation
```

---

# Components

```
Lab.jsx

↓

IntroScreen

↓

RulesScreen

↓

ScenarioPicker

↓

ScenarioIntro

↓

DecisionScreen

↓

StepOutcome

↓

RevealTimeline

↓

ReflectionScreen

↓

CompletionScreen
```

Everything except these components should be completely data-driven.

---

# Design Principles

## Never tell the user they are wrong.

Reveal possibilities.

Do not reward.

Do not punish.

Simply allow awareness to emerge.

---

## Never use "Correct Answer"

There are only

* instinctive responses
* reflective responses
* deeply aware responses

---

## The user should never feel judged.

Instead they should think

> "Wow...that first response really did feel convincing."

That realization is the entire purpose of the laboratory.

---

# Future Extensibility

Because the laboratory is data-driven, the same engine can later support:

* Mohaniya Karma
* Anger (Krodha)
* Pride (Mana)
* Deceit (Maya)
* Greed (Lobha)
* Ahimsa
* Samyak Darshan
* Aparigraha
* Forgiveness
* Mindfulness

Only the scenario JSON changes.

The engine remains exactly the same.
