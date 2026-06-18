export const STEP_NAMES = ['Upādāna', 'Svabhāva', 'Kāla', 'Niyati', 'Karma', 'Purushārtha'];
export const INPUT_STEPS = new Set([0, 2]);

export const HIDDEN_FACTOR_INFO = {
  niyati:
    'Niyati is order and necessity — quiet background conditions that must align for a result to appear. In this experiment, whether Niyati aligned was decided randomly (50% chance), representing real-world factors you cannot fully see or control.',
  karma:
    'Karma is invisible causal weight from prior actions. In this experiment, whether Karma aligned was decided randomly (50% chance), representing unseen momentum that can support or hinder an outcome even when everything else looks right.',
};

export const SCENARIOS = [
  {
    id: 'rice',
    icon: '🌾',
    title: 'Rice Farming',
    goal: 'Grow rice.',
    description: 'Choose the right cause, time, and effort to bring a crop to harvest.',
    upadana: ['Rice Seed', 'Rice Hay', 'Soil', 'Water'],
    correctUpadana: 'Rice Seed',
    kala: ['10 days', '90 days', '3 years'],
    correctKala: '90 days',
    effortRange: [20, 100],
    story:
      'A farmer stands before a field. Four possibilities lie before him. Only one can become rice.',
  },
  {
    id: 'pottery',
    icon: '🏺',
    title: 'Pottery Crafting',
    goal: 'Create a finished clay pot.',
    description: 'Find the right clay, timing, and effort to shape a vessel that survives the kiln.',
    upadana: ['Moist alluvial clay', 'Stone fragments', 'Dried sand', 'Pure water'],
    correctUpadana: 'Moist alluvial clay',
    kala: ['2 hours', '8 hours', '2 days'],
    correctKala: '8 hours',
    effortRange: [10, 80],
    story: 'A potter lifts wet clay. The wheel teaches patience. The right material makes the pot possible.',
  },
  {
    id: 'translation',
    icon: '📜',
    title: 'Manuscript Translation',
    goal: 'Produce a complete translation.',
    description: 'Balance capacity, time, and effort to convert meaning from one language to another.',
    upadana: ['Cognitive Capacity', 'Blank paper', 'Ink', 'A dictionary'],
    correctUpadana: 'Cognitive Capacity',
    kala: ['1 hour', '4 hours', '12 hours'],
    correctKala: '4 hours',
    effortRange: [1000000, 1000000],
    story:
      'A scholar opens an ancient text. The limit of effort becomes clear when the right capacity is the true material cause.',
  },
  {
    id: 'healing',
    icon: '🦴',
    title: 'Bone Healing',
    goal: 'Restore structural integrity.',
    description: 'Gather the right substance, timing, and steady effort to encourage repair.',
    upadana: ['Living bone matrix', 'Hot compress', 'Calcium pills', 'Bandages'],
    correctUpadana: 'Living bone matrix',
    kala: ['1 week', '6 weeks', '6 months'],
    correctKala: '6 weeks',
    effortRange: [5, 30],
    story: 'A healer waits beside a broken bone. The body needs time and the right living cause to mend.',
  },
];

export function randomEffortTarget(range) {
  const [min, max] = range;
  return min === max ? min : Math.floor(Math.random() * (max - min + 1) + min);
}

export function initEffortTargets(scenarios) {
  return scenarios.map((s) => ({
    ...s,
    effortTarget: randomEffortTarget(s.effortRange),
  }));
}

export const LAB_TITLES = {
  scenarios: 'Choose a scenario',
  step: (step) => STEP_NAMES[step],
  pivot: 'How will you meet the outcome?',
  reveal: 'Reveal the experiment',
  result: 'Final scorecard',
};

export function getOutcomeMeta(external, internal) {
  if (external && internal) {
    return {
      label: 'Full alignment',
      reflection: 'Outcome and awareness moved together — a rare convergence.',
      tone: 'emerald',
    };
  }
  if (external && !internal) {
    return {
      label: 'Hollow victory',
      reflection: 'The world said yes. Something inside tightened anyway.',
      tone: 'amber',
    };
  }
  if (!external && internal) {
    return {
      label: 'Quiet freedom',
      reflection: 'The result slipped away. You did not slip with it.',
      tone: 'sky',
    };
  }
  return {
    label: 'Double loss',
    reflection: 'Neither the world nor the witness was preserved.',
    tone: 'rose',
  };
}

const TONE_BORDER = {
  emerald: 'border-emerald-500/40',
  amber: 'border-amber-500/40',
  sky: 'border-sky-500/40',
  rose: 'border-rose-500/40',
};

const TONE_BG = {
  emerald: 'from-stone-900 via-stone-900 to-emerald-950',
  amber: 'from-stone-900 via-stone-900 to-amber-950',
  sky: 'from-stone-900 via-stone-900 to-sky-950',
  rose: 'from-stone-900 via-stone-900 to-rose-950',
};

export function getToneClasses(tone) {
  return { border: TONE_BORDER[tone], bg: TONE_BG[tone] };
}
