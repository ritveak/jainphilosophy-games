export const LAB_TITLES = {
  intro: 'Mohaniya Karma Laboratory',
  rules: 'How it works',
  scenarios: 'Choose a scenario',
  step: (i) => `Step ${i + 1}`,
  reveal: 'Scenario Reveal',
  result: 'Reflection',
};

export function getLevelSignal(level = {}, fallback = 'neutral') {
  if (level.signal) return level.signal;
  const text = `${level.response || ''} ${level.hiddenDriver || ''}`.toLowerCase();
  if (/measure together|stop and check|restart|honesty|responsibility|humility|empathy|compassion|openness|wisdom|awareness|acceptance|practicality|equanimity/i.test(text)) {
    return 'good';
  }
  if (/maybe|safer|check|order|before|tell|sorry|careful|just an accident|image|protect/i.test(text)) {
    return 'bad';
  }
  return fallback;
}

export function getSignalLabel(signal = 'neutral') {
  switch (signal) {
    case 'good': return 'Good';
    case 'bad': return 'Needs care';
    case 'worse': return 'Worse';
    default: return 'Neutral';
  }
}

export function getSignalScore(level = {}) {
  switch (getLevelSignal(level)) {
    case 'good': return 5;
    case 'bad': return 2;
    case 'worse': return 0;
    default: return 1;
  }
}

export function getVisibleSteps(steps = [], selections = []) {
  return steps.filter((step, index) => {
    if (!step?.visibleWhen) return true;
    return step.visibleWhen({
      selections,
      previousSelections: selections.slice(0, index),
      stepIndex: index,
    });
  });
}

export function getSignalClasses(signal = 'neutral') {
  switch (signal) {
    case 'good':
      return {
        container: 'border-emerald-400 bg-emerald-50/80',
        pill: 'bg-emerald-100 text-emerald-700',
        accent: 'text-emerald-700',
      };
    case 'bad':
      return {
        container: 'border-amber-400 bg-amber-50/80',
        pill: 'bg-amber-100 text-amber-700',
        accent: 'text-amber-700',
      };
    case 'worse':
      return {
        container: 'border-rose-400 bg-rose-50/80',
        pill: 'bg-rose-100 text-rose-700',
        accent: 'text-rose-700',
      };
    default:
      return {
        container: 'border-stone-200 bg-white',
        pill: 'bg-stone-100 text-stone-600',
        accent: 'text-stone-600',
      };
  }
}

export const SCENARIOS = [
  {
    id: 'khichdi',
    icon: '🍲',
    title: 'The Khichdi Saga',
    description: 'A tiny moment of pride slowly snowballs into deceit.',
    intro: ['You are cooking dinner.', 'Everything is going normally.'],
    steps: [
        {
            id: "measure",
            timer: 8,
            prompt: "Your flatmate says, 'Maybe measure the dal?'",
            unlockButton: "What else could I do?",
            levels: [
            {
                unlockAfter: 0,
                default: true,
                response: "No need. I know the ratio.",
                hiddenDriver: "Pride",
                consequence: "You confidently continue estimating."
            },
            {
                unlockAfter: 5,
                response: "Maybe measuring is safer.",
                hiddenDriver: "Openness",
                consequence: "You pause for a moment."
            },
            {
                unlockAfter: 10,
                response: "Let's measure together.",
                hiddenDriver: "Humility",
                consequence: "The cooking continues without tension."
            }
            ]
        },

        {
            id: "overflow",
            timer: 8,
            prompt: "The cooker whistles strangely. You realize there's probably too much dal.",
            unlockButton: "What else could I do?",
            levels: [
            {
                unlockAfter: 0,
                default: true,
                response: "It'll settle down after another whistle.",
                hiddenDriver: "Denial",
                consequence: "You wait."
            },
            {
                unlockAfter: 5,
                response: "Maybe I should stop and check.",
                hiddenDriver: "Acceptance",
                consequence: "You inspect the cooker."
            },
            {
                unlockAfter: 10,
                response: "Let's restart before it gets worse.",
                hiddenDriver: "Wisdom",
                consequence: "A small delay prevents a bigger mess."
            }
            ]
        },

        {
            id: "burn",
            timer: 8,
            prompt: "The bottom has started burning. The smell is spreading.",
            unlockButton: "What else could I do?",
            levels: [
            {
                unlockAfter: 0,
                default: true,
                response: "Quickly stir it. Maybe nobody will notice.",
                hiddenDriver: "Fear",
                consequence: "The smell gets stronger."
            },
            {
                unlockAfter: 5,
                response: "Turn it off and see how bad it is.",
                hiddenDriver: "Awareness",
                consequence: "You stop making it worse."
            },
            {
                unlockAfter: 10,
                response: "Looks like I messed up. Time for Plan B.",
                hiddenDriver: "Humility",
                consequence: "You prevent further damage."
            }
            ]
        },

        {
            id: "question",
            timer: 8,
            prompt: "Your flatmate asks, 'Everything okay in the kitchen?'",
            unlockButton: "What else could I do?",
            levels: [
            {
                unlockAfter: 0,
                default: true,
                response: "Yeah! Almost done.",
                hiddenDriver: "Deceit",
                consequence: "Now you must maintain the lie."
            },
            {
                unlockAfter: 5,
                response: "It's taking longer than expected.",
                hiddenDriver: "Partial Honesty",
                consequence: "Some pressure reduces."
            },
            {
                unlockAfter: 10,
                response: "I think I messed it up 😂",
                hiddenDriver: "Honesty",
                consequence: "Both of you laugh and decide what to do."
            }
            ]
        },

        {
            id: "dinner",
            timer: 8,
            prompt: "Dinner is clearly ruined.",
            unlockButton: "What else could I do?",
            levels: [
            {
                unlockAfter: 0,
                default: true,
                response: "Let's just eat it. It's not THAT bad.",
                hiddenDriver: "Ego Preservation",
                consequence: "Everyone pretends it's edible."
            },
            {
                unlockAfter: 5,
                response: "Maybe let's order something.",
                hiddenDriver: "Practicality",
                consequence: "Problem solved."
            },
            {
                unlockAfter: 10,
                response: "Tonight's lesson cost one ruined khichdi 😄",
                hiddenDriver: "Equanimity",
                consequence: "The mistake becomes a shared memory instead of embarrassment."
            }
            ]
        }
        ],
    reveal: {
      timeline: ['Pride', 'Fear', 'Deceit', 'Attachment', 'Stress'],
      lesson: "The first instinct wasn't evil. It simply became protected.",
    },
  },
  {
    id: 'broken-mug',
    icon: '☕',
    title: 'Broken Mug',
    description: 'How protecting your image creates bigger problems.',
    intro: ['A mug slips and cracks while you wash it.'],
    steps: [
    {
        id: "break",
        timer: 8,
        prompt: "While washing your friend's favourite mug, it slips from your hand and cracks.",

        unlockButton: "What else could I do?",

        levels: [
        {
            unlockAfter: 0,
            default: true,
            response: "Maybe it isn't that noticeable.",
            hiddenDriver: "Denial",
            consequence: "You stare at the crack, hoping it isn't serious."
        },
        {
            unlockAfter: 5,
            response: "Let me check how bad the damage is.",
            hiddenDriver: "Acceptance",
            consequence: "You inspect it calmly instead of reacting."
        },
        {
            unlockAfter: 10,
            response: "Accidents happen. I'll tell them.",
            hiddenDriver: "Responsibility",
            consequence: "You decide not to hide what happened."
        }
        ]
    },

    {
        id: "hide",
        timer: 8,
        prompt: "Nobody else is home. The broken mug is still in your hand.",

        unlockButton: "What else could I do?",

        levels: [
        {
            unlockAfter: 0,
            default: true,
            response: "I'll put it back. Maybe they won't notice for a while.",
            hiddenDriver: "Fear",
            consequence: "The problem is postponed, not solved."
        },
        {
            unlockAfter: 5,
            response: "I'll order the same mug before they return.",
            hiddenDriver: "Image Protection",
            consequence: "Now you're trying to erase evidence."
        },
        {
            unlockAfter: 10,
            response: "I'll leave the mug aside and send them a message.",
            hiddenDriver: "Honesty",
            consequence: "You choose openness over appearance."
        }
        ]
    },

    {
        id: "question",
        timer: 8,
        prompt: "Later your friend asks, 'Have you seen my mug? I can't find it.'",

        unlockButton: "What else could I do?",

        levels: [
        {
            unlockAfter: 0,
            default: true,
            response: "No... I haven't seen it.",
            hiddenDriver: "Deceit",
            consequence: "Now you must remember and defend this lie."
        },
        {
            unlockAfter: 5,
            response: "I was going to tell you... something happened to it.",
            hiddenDriver: "Reluctant Honesty",
            consequence: "The conversation becomes uncomfortable, but the lie ends here."
        },
        {
            unlockAfter: 10,
            response: "I'm really sorry. I accidentally broke it while washing it.",
            hiddenDriver: "Humility",
            consequence: "The truth is painful, but simple."
        }
        ]
    },

    {
        id: "sentimental",
        timer: 8,
        prompt: "They quietly reply, 'That mug was a gift from my grandmother.'",

        unlockButton: "What else could I do?",

        levels: [
        {
            unlockAfter: 0,
            default: true,
            response: "I didn't know. Anyway, it was just an accident.",
            hiddenDriver: "Defensiveness",
            consequence: "You begin protecting yourself instead of understanding their pain.",
            signal: 'worse',
            visibleWhen: ({ selections = [] }) => (selections[2] ?? 0) < 2,
        },
        {
            unlockAfter: 5,
            response: "I really wish I had been more careful.",
            hiddenDriver: "Empathy",
            consequence: "You acknowledge their loss."
        },
        {
            unlockAfter: 10,
            response: "I'm sorry—not just for breaking it, but for hiding it from you.",
            hiddenDriver: "Compassion",
            consequence: "The focus shifts from the mug to rebuilding trust."
        }
        ]
    },

    {
        id: "closure",
        timer: 8,
        prompt: "Looking back, what matters most now?",
        visibleWhen: ({ selections = [] }) => (selections[2] ?? 0) < 2,

        unlockButton: "What else could I do?",

        levels: [
        {
            unlockAfter: 0,
            default: true,
            response: "I should've hidden it better.",
            hiddenDriver: "Ego",
            consequence: "The lesson is lost.",
            signal: 'worse',
        },
        {
            unlockAfter: 5,
            response: "I should've admitted it sooner.",
            hiddenDriver: "Reflection",
            consequence: "You realise the lie caused more suffering than the accident.",
            signal: 'bad',
        },
        {
            unlockAfter: 10,
            response: "The mug wasn't the biggest mistake. Protecting my image was.",
            hiddenDriver: "Insight",
            consequence: "You recognise how Mohaniya Karma transformed one accident into many unnecessary decisions.",
            signal: 'good',
        }
        ]
    }
    ],
    reveal: {
      timeline: ['Self-protection', 'Rationalization', 'Evasion'],
      lesson: 'Protecting image tends to expand the cost later.',
    },
  },
];
