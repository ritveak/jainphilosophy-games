export const LAB_TITLES = {
  intro: 'Mohaniya Karma Laboratory',
  rules: 'How it works',
  scenarios: 'Choose a scenario',
  step: (i) => `Step ${i + 1}`,
  reveal: 'Scenario Reveal',
  result: 'Reflection',
};

export const SCENARIOS = [
  {
    id: 'khichdi',
    icon: '🍲',
    title: 'The Khichdi Saga',
    description: 'A tiny moment of pride slowly snowballs into deceit.',
    intro: ['You are cooking dinner.', 'Everything is going normally.'],
    steps: [
      {
        id: 'measure',
        timer: 8,
        prompt: "Your flatmate says, 'Maybe measure the dal?'",
        unlockButton: 'Think harder to come up with more options',
        levels: [
          {
            unlockAfter: 0,
            default: true,
            response: "No need. I know the ratio.",
            mentalState: 'Pride',
            consequence: 'You continue estimating.',
          },
          {
            unlockAfter: 6,
            response: 'Maybe measuring is safer.',
            mentalState: 'Awareness',
            consequence: 'You measure before cooking.',
          },
          {
            unlockAfter: 12,
            response: "Let\'s see whose estimate is closer.",
            mentalState: 'Humility',
            consequence: 'Both of you laugh and compare.',
          },
        ],
      },
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
        id: 'explain',
        timer: 7,
        prompt: "You consider saying you didn\'t do it.",
        unlockButton: 'Think harder to come up with more options',
        levels: [
          { unlockAfter: 0, default: true, response: 'Say nothing. It was already like that.', mentalState: 'Self-protection', consequence: 'You avoid blame.' },
          { unlockAfter: 5, response: 'Admit accidentally and offer to replace.', mentalState: 'Responsibility', consequence: 'You accept the cost.' },
        ],
      },
    ],
    reveal: {
      timeline: ['Self-protection', 'Rationalization', 'Evasion'],
      lesson: 'Protecting image tends to expand the cost later.',
    },
  },
];
