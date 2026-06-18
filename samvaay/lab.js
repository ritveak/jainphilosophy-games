function initSamvaayLab() {
  const labScreen = document.getElementById('lab-screen');
  const pivotScreen = document.getElementById('pivot-screen');
  const pivotImmersive = document.getElementById('pivot-immersive');
  const labMatrixCanvas = document.getElementById('lab-matrix-canvas');
  const labTitle = document.getElementById('lab-title');
  let labInitialized = false;
  let pivotExitTimer = null;

  const state = {
    labStage: 'scenarios',
    style: 'premium',
    scenario: null,
    progressStep: 0,
    answers: { upadana: null, kala: null, effort: 0 },
    hidden: { niyatiPass: false, karmaPass: false },
    posture: null,
    revealQueue: [],
    revealIndex: 0,
    revealTimer: null,
    externalSuccess: null,
    internalSuccess: null,
    finalMatrix: '',
    roll: { niyati: '', karma: '' }
  };

  const scenarios = [
    {
      id: 'rice',
      icon: '🌾',
      title: 'Rice Farming',
      goal: 'Grow rice.',
      description: 'Choose the right cause, time, and effort to bring a crop to harvest.',
      upadana: ['Rice Seed','Rice Hay','Soil','Water'],
      correctUpadana: 'Rice Seed',
      kala: ['10 days','90 days','3 years'],
      correctKala: '90 days',
      effortRange: [20, 100],
      effortTarget: null,
      story: 'A farmer stands before a field. Four possibilities lie before him. Only one can become rice.'
    },
    {
      id: 'pottery',
      icon: '🏺',
      title: 'Pottery Crafting',
      goal: 'Create a finished clay pot.',
      description: 'Find the right clay, timing, and effort to shape a vessel that survives the kiln.',
      upadana: ['Moist alluvial clay','Stone fragments','Dried sand','Pure water'],
      correctUpadana: 'Moist alluvial clay',
      kala: ['2 hours','8 hours','2 days'],
      correctKala: '8 hours',
      effortRange: [10, 80],
      effortTarget: null,
      story: 'A potter lifts wet clay. The wheel teaches patience. The right material makes the pot possible.'
    },
    {
      id: 'translation',
      icon: '📜',
      title: 'Manuscript Translation',
      goal: 'Produce a complete translation.',
      description: 'Balance capacity, time, and effort to convert meaning from one language to another.',
      upadana: ['Cognitive Capacity','Blank paper','Ink','A dictionary'],
      correctUpadana: 'Cognitive Capacity',
      kala: ['1 hour','4 hours','12 hours'],
      correctKala: '4 hours',
      effortRange: [1000000, 1000000],
      effortTarget: null,
      story: 'A scholar opens an ancient text. The limit of effort becomes clear when the right capacity is the true material cause.'
    },
    {
      id: 'healing',
      icon: '🦴',
      title: 'Bone Healing',
      goal: 'Restore structural integrity.',
      description: 'Gather the right substance, timing, and steady effort to encourage repair.',
      upadana: ['Living bone matrix','Hot compress','Calcium pills','Bandages'],
      correctUpadana: 'Living bone matrix',
      kala: ['1 week','6 weeks','6 months'],
      correctKala: '6 weeks',
      effortRange: [5, 30],
      effortTarget: null,
      story: 'A healer waits beside a broken bone. The body needs time and the right living cause to mend.'
    }
  ];

  const stepNames = ['Upādāna','Svabhāva','Kāla','Niyati','Karma','Purushārtha'];
  const inputSteps = new Set([0, 2]);
  let advanceTimer = null;

  const hiddenFactorInfo = {
    niyati: 'Niyati is order and necessity — quiet background conditions that must align for a result to appear. In this experiment, whether Niyati aligned was decided randomly (50% chance), representing real-world factors you cannot fully see or control.',
    karma: 'Karma is invisible causal weight from prior actions. In this experiment, whether Karma aligned was decided randomly (50% chance), representing unseen momentum that can support or hinder an outcome even when everything else looks right.'
  };

  function showContinueStep(step) {
    return !inputSteps.has(step);
  }

  function continueLabel(step) {
    return step === stepNames.length - 1 ? 'Proceed to pivot' : 'Continue';
  }

  function clearAdvanceTimer() {
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }
  }

  function clearRevealTimer() {
    if (state.revealTimer) {
      clearTimeout(state.revealTimer);
      state.revealTimer = null;
    }
  }

  function scheduleDelayed(action, delay, guard) {
    clearAdvanceTimer();
    advanceTimer = setTimeout(() => {
      advanceTimer = null;
      if (!guard || guard()) action();
    }, delay);
  }

  function advanceFromStep(step) {
    if (step < stepNames.length - 1) {
      state.progressStep = step + 1;
    } else {
      state.labStage = 'pivot';
    }
    renderLabScreen();
  }

  function scheduleAdvance(fromStep, delay = 450) {
    scheduleDelayed(
      () => advanceFromStep(fromStep),
      delay,
      () => state.labStage === 'step' && state.progressStep === fromStep
    );
  }

  function scheduleScenarioStart(scenarioId) {
    scheduleDelayed(
      () => {
        state.labStage = 'step';
        state.progressStep = 0;
        renderLabScreen();
      },
      450,
      () => state.labStage === 'scenarios' && state.scenario?.id === scenarioId
    );
  }

  function startScenario(scenarioId) {
    state.scenario = scenarios.find(entry => entry.id === scenarioId);
    renderLabScreen();
    scheduleScenarioStart(scenarioId);
  }

  function getOutcomeMeta() {
    const external = state.externalSuccess;
    const internal = state.internalSuccess;
    if (external && internal) {
      return { label: 'Full alignment', reflection: 'Outcome and awareness moved together — a rare convergence.', tone: 'emerald' };
    }
    if (external && !internal) {
      return { label: 'Hollow victory', reflection: 'The world said yes. Something inside tightened anyway.', tone: 'amber' };
    }
    if (!external && internal) {
      return { label: 'Quiet freedom', reflection: 'The result slipped away. You did not slip with it.', tone: 'sky' };
    }
    return { label: 'Double loss', reflection: 'Neither the world nor the witness was preserved.', tone: 'rose' };
  }

  function renderResultScreen(scenario) {
    const correctedUpadana = scenario.correctUpadana;
    const correctKala = scenario.correctKala;
    const currentEffort = state.answers.effort;
    const target = scenario.effortTarget;
    const upadanaSuccess = state.answers.upadana === correctedUpadana;
    const kalaSuccess = state.answers.kala === correctKala;
    const effortSuccess = currentEffort >= target;
    const niyatiSuccess = state.roll.niyati === 'Aligned';
    const karmaSuccess = state.roll.karma === 'Aligned';
    const postureSuccess = state.posture === 'Knower-Seer';
    const meta = getOutcomeMeta();
    const lines = state.finalMatrix.split('\n');
    const toneBorder = {
      emerald: 'border-emerald-500/40',
      amber: 'border-amber-500/40',
      sky: 'border-sky-500/40',
      rose: 'border-rose-500/40'
    }[meta.tone];
    const toneBg = {
      emerald: 'from-stone-900 via-stone-900 to-emerald-950',
      amber: 'from-stone-900 via-stone-900 to-amber-950',
      sky: 'from-stone-900 via-stone-900 to-sky-950',
      rose: 'from-stone-900 via-stone-900 to-rose-950'
    }[meta.tone];
    const rowClass = (ok) => ok ? 'bg-emerald-500/10 text-emerald-900' : 'bg-rose-500/10 text-stone-900';

    return `
      <div class="max-w-4xl mx-auto space-y-8">
        <div class="rounded-[2rem] border ${toneBorder} bg-gradient-to-b ${toneBg} p-8 sm:p-12 text-center text-stone-50 card-shadow">
          <p class="text-xs uppercase tracking-[0.4em] text-stone-400">Final outcome</p>
          <p class="mt-4 inline-block rounded-full border border-stone-600 bg-stone-800/80 px-4 py-1 text-xs uppercase tracking-[0.28em] text-stone-300">${meta.label}</p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
            <div class="rounded-2xl border ${state.externalSuccess ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-rose-500/50 bg-rose-500/10'} p-5">
              <p class="text-[0.65rem] uppercase tracking-[0.3em] text-stone-400">External result</p>
              <p class="mt-2 text-2xl font-semibold">${state.externalSuccess ? 'Achieved' : 'Unmet'}</p>
              <p class="mt-2 text-sm text-stone-400 leading-6">Did the causal conditions produce the goal?</p>
            </div>
            <div class="rounded-2xl border ${state.internalSuccess ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-rose-500/50 bg-rose-500/10'} p-5">
              <p class="text-[0.65rem] uppercase tracking-[0.3em] text-stone-400">Internal posture</p>
              <p class="mt-2 text-2xl font-semibold">${state.internalSuccess ? 'Knower-Seer' : 'Reactive Loop'}</p>
              <p class="mt-2 text-sm text-stone-400 leading-6">Did awareness stay separate from the result?</p>
            </div>
          </div>
          <div class="mt-10 space-y-3">
            ${lines.map((line, i) => `<p class="${i === 0 ? 'text-2xl sm:text-4xl font-semibold leading-tight text-stone-50' : 'text-lg sm:text-xl text-stone-300 leading-relaxed'}">${line}</p>`).join('')}
          </div>
          <p class="mt-8 max-w-2xl mx-auto text-sm text-stone-400 leading-7 italic">${meta.reflection}</p>
        </div>

        <div class="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8 card-shadow">
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <p class="text-stone-500 uppercase text-xs tracking-[0.24em]">Causal breakdown</p>
              <h3 class="mt-2 text-xl font-semibold text-stone-800">${scenario.icon} ${scenario.title}</h3>
            </div>
            <p class="text-sm text-stone-500">Every parameter weighed against the ideal</p>
          </div>
          <div class="overflow-x-auto rounded-2xl border border-stone-200 bg-stone-100">
            <table class="min-w-full text-left text-sm text-stone-700">
              <thead>
                <tr class="border-b border-stone-200 text-stone-500 bg-stone-50">
                  <th class="px-4 py-3 font-medium">Parameter</th>
                  <th class="px-4 py-3 font-medium">Your choice</th>
                  <th class="px-4 py-3 font-medium">Required</th>
                  <th class="px-4 py-3 font-medium w-20">Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-stone-200 ${rowClass(upadanaSuccess)}">
                  <td class="px-4 py-4 font-semibold">Upādāna</td>
                  <td class="px-4 py-4">${state.answers.upadana || '—'}</td>
                  <td class="px-4 py-4">${correctedUpadana}</td>
                  <td class="px-4 py-4 font-semibold">${upadanaSuccess ? '✓' : '✗'}</td>
                </tr>
                <tr class="border-b border-stone-200 ${rowClass(kalaSuccess)}">
                  <td class="px-4 py-4 font-semibold">Kāla</td>
                  <td class="px-4 py-4">${state.answers.kala || '—'}</td>
                  <td class="px-4 py-4">${correctKala}</td>
                  <td class="px-4 py-4 font-semibold">${kalaSuccess ? '✓' : '✗'}</td>
                </tr>
                <tr class="border-b border-stone-200 ${rowClass(effortSuccess)}">
                  <td class="px-4 py-4 font-semibold">Purushārtha</td>
                  <td class="px-4 py-4">${currentEffort}</td>
                  <td class="px-4 py-4">≥ ${target}</td>
                  <td class="px-4 py-4 font-semibold">${effortSuccess ? '✓' : '✗'}</td>
                </tr>
                <tr class="border-b border-stone-200 ${rowClass(niyatiSuccess)}">
                  <td class="px-4 py-4 font-semibold">
                    Niyati
                    <button type="button" class="info-btn ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-500 hover:bg-stone-200 hover:border-stone-400" data-info="niyati" aria-label="About Niyati">ⓘ</button>
                  </td>
                  <td class="px-4 py-4">${state.roll.niyati}</td>
                  <td class="px-4 py-4">Aligned</td>
                  <td class="px-4 py-4 font-semibold">${niyatiSuccess ? '✓' : '✗'}</td>
                </tr>
                <tr class="border-b border-stone-200 ${rowClass(karmaSuccess)}">
                  <td class="px-4 py-4 font-semibold">
                    Karma
                    <button type="button" class="info-btn ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-500 hover:bg-stone-200 hover:border-stone-400" data-info="karma" aria-label="About Karma">ⓘ</button>
                  </td>
                  <td class="px-4 py-4">${state.roll.karma}</td>
                  <td class="px-4 py-4">Aligned</td>
                  <td class="px-4 py-4 font-semibold">${karmaSuccess ? '✓' : '✗'}</td>
                </tr>
                <tr class="${rowClass(postureSuccess)}">
                  <td class="px-4 py-4 font-semibold">Posture</td>
                  <td class="px-4 py-4">${state.posture}</td>
                  <td class="px-4 py-4">Knower-Seer</td>
                  <td class="px-4 py-4 font-semibold">${postureSuccess ? '✓' : '✗'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="factor-info-panel" class="hidden mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-stone-700 leading-7 text-left"></div>
        </div>

        <div class="flex flex-col sm:flex-row sm:justify-center gap-3 pb-4">
          <button id="try-again" class="rounded-full border border-stone-300 px-5 py-3 text-sm hover:border-stone-400 bg-stone-50">Try Again</button>
          <button id="choose-other" class="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Choose Another Experiment</button>
          <button id="new-experiment" class="rounded-full border border-stone-300 px-5 py-3 text-sm hover:border-stone-400 bg-stone-50">New experiment</button>
        </div>
      </div>
    `;
  }

  function enterPivotImmersive() {
    if (pivotExitTimer) {
      clearTimeout(pivotExitTimer);
      pivotExitTimer = null;
    }
    const wasHidden = pivotImmersive.classList.contains('hidden');
    pivotImmersive.classList.remove('hidden');
    pivotImmersive.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pivot-locked');
    if (wasHidden || !pivotImmersive.classList.contains('is-active')) {
      requestAnimationFrame(() => {
        pivotImmersive.classList.add('is-active');
      });
      startMatrix(labMatrixCanvas, { crisp: true });
    }
  }

  function exitPivotImmersive() {
    if (pivotImmersive.classList.contains('hidden')) return;
    pivotImmersive.classList.remove('is-active');
    pivotImmersive.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pivot-locked');
    stopMatrix();
    pivotExitTimer = setTimeout(() => {
      pivotImmersive.classList.add('hidden');
      pivotScreen.innerHTML = '';
      pivotExitTimer = null;
    }, 850);
  }

  function resetLab() {
    state.labStage = 'scenarios';
    state.scenario = null;
    state.progressStep = 0;
    state.answers = { upadana: null, kala: null, effort: 0 };
    state.hidden = { niyatiPass: Math.random() < 0.5, karmaPass: Math.random() < 0.5 };
    state.posture = null;
    state.revealQueue = [];
    state.revealIndex = 0;
    state.externalSuccess = null;
    state.internalSuccess = null;
    state.finalMatrix = '';
    state.roll = { niyati: '', karma: '' };
    scenarios.forEach(entry => {
      const min = entry.effortRange[0];
      const max = entry.effortRange[1];
      entry.effortTarget = min === max ? min : Math.floor(Math.random() * (max - min + 1) + min);
    });
  }

  function resetToScenarios() {
    exitPivotImmersive();
    state.labStage = 'scenarios';
    state.scenario = null;
    state.progressStep = 0;
    state.answers = { upadana: null, kala: null, effort: 0 };
    renderLabScreen();
  }

  function renderLabHeader() {
    const titleMap = {
      scenarios: 'Choose a scenario',
      step: stepNames[state.progressStep],
      pivot: 'How will you meet the outcome?',
      reveal: 'Reveal the experiment',
      result: 'Final scorecard'
    };
    labTitle.textContent = titleMap[state.labStage] || 'The Laboratory';
  }

  function makeRevealQueue() {
    const scenario = state.scenario;
    const correctUpadana = state.answers.upadana === scenario.correctUpadana;
    const correctKala = state.answers.kala === scenario.correctKala;
    const enoughEffort = state.answers.effort >= scenario.effortTarget;
    const niyatiPass = state.hidden.niyatiPass;
    const karmaPass = state.hidden.karmaPass;
    state.externalSuccess = correctUpadana && correctKala && enoughEffort && niyatiPass && karmaPass;
    state.internalSuccess = state.posture === 'Knower-Seer';
    state.finalMatrix = state.externalSuccess
      ? (state.internalSuccess ? 'Conditions aligned.\nAwareness remained clear.' : 'The goal was achieved.\nAttachment deepened.')
      : (state.internalSuccess ? 'The world did not cooperate.\nAwareness remained free.' : 'Neither result nor awareness was preserved.');
    state.roll = { niyati: niyatiPass ? 'Aligned' : 'Blocked', karma: karmaPass ? 'Aligned' : 'Blocked' };
    state.revealQueue = [
      { label: 'Correct Upādāna', passed: correctUpadana },
      { label: 'Correct Kāla', passed: correctKala },
      { label: 'Sufficient Purushārtha', passed: enoughEffort },
      { label: 'Niyati aligned', passed: niyatiPass },
      { label: 'Karma aligned', passed: karmaPass }
    ];
    state.revealIndex = 0;
  }

  function renderPivotScreen() {
    const narrative = state.style === 'narrative'
      ? '<p class="text-stone-400 leading-7">Every condition has been chosen. What posture will meet the outcome?</p>'
      : '';
    pivotScreen.innerHTML = `
      <div class="rounded-2xl border border-stone-600 bg-stone-950/95 p-8 sm:p-10 text-center space-y-6 text-stone-100 shadow-2xl">
        <p class="text-amber-400 uppercase tracking-[0.35em] text-xs">Everything stops here</p>
        <h3 class="text-3xl sm:text-4xl font-semibold leading-tight">The experiment is complete.</h3>
        <p class="text-stone-300 text-lg leading-relaxed">The outcome already exists. You have not yet seen it.<br/>How will you meet it?</p>
        ${narrative}
        <div class="grid gap-4 sm:grid-cols-2 pt-2">
          <button id="pick-reactive" type="button" class="rounded-2xl border border-stone-600 bg-stone-900/90 p-6 text-left transition hover:border-blue-500/70 hover:bg-stone-900">
            <div class="flex items-center justify-between gap-3">
              <p class="text-xs uppercase tracking-[0.24em] text-stone-500">Reactive Loop</p>
              <div class="pill blue scale-75 origin-right"></div>
            </div>
            <h4 class="mt-4 text-xl font-semibold text-stone-100">My happiness depends on results.</h4>
          </button>
          <button id="pick-knower" type="button" class="rounded-2xl border border-stone-600 bg-stone-900/90 p-6 text-left transition hover:border-red-500/70 hover:bg-stone-900">
            <div class="flex items-center justify-between gap-3">
              <p class="text-xs uppercase tracking-[0.24em] text-stone-500">Knower-Seer</p>
              <div class="pill red scale-75 origin-right"></div>
            </div>
            <h4 class="mt-4 text-xl font-semibold text-stone-100">I observe outcomes without becoming them.</h4>
          </button>
        </div>
        <button id="pivot-back" type="button" class="mt-2 rounded-full border border-stone-600 px-5 py-2.5 text-sm text-stone-400 hover:border-stone-500 hover:text-stone-200">Back</button>
      </div>
    `;
    document.getElementById('pick-reactive').addEventListener('click', () => {
      state.posture = 'Reactive Loop';
      state.labStage = 'reveal';
      makeRevealQueue();
      renderLabScreen();
    });
    document.getElementById('pick-knower').addEventListener('click', () => {
      state.posture = 'Knower-Seer';
      state.labStage = 'reveal';
      makeRevealQueue();
      renderLabScreen();
    });
    document.getElementById('pivot-back').addEventListener('click', () => {
      state.labStage = 'step';
      state.progressStep = stepNames.length - 1;
      renderLabScreen();
    });
  }

  function renderLabScreen() {
    renderLabHeader();
    clearAdvanceTimer();
    clearRevealTimer();

    if (state.labStage === 'pivot') {
      enterPivotImmersive();
      renderPivotScreen();
      return;
    }

    exitPivotImmersive();
    labScreen.innerHTML = '';

    if (state.labStage === 'scenarios') {
      const scenarioCards = scenarios.map(entry => `
        <button data-scenario-id="${entry.id}" class="group rounded-3xl border border-stone-200 p-6 text-left transition hover:border-emerald-400 ${state.scenario?.id===entry.id?'border-emerald-500 bg-emerald-500/10':''}">
          <div class="text-3xl">${entry.icon}</div>
          <h3 class="mt-4 text-2xl font-semibold">${entry.title}</h3>
          <p class="mt-3 text-stone-700 leading-7">${entry.description}</p>
          <p class="mt-4 text-sm uppercase tracking-[0.24em] text-stone-500">Goal: ${entry.goal}</p>
        </button>
      `).join('');
      labScreen.innerHTML = `<div class="grid gap-4 lg:grid-cols-2">${scenarioCards}</div>`;
      document.querySelectorAll('[data-scenario-id]').forEach(button => {
        button.addEventListener('click', () => startScenario(button.dataset.scenarioId));
      });
      return;
    }

    if (state.labStage === 'step') {
      const step = state.progressStep;
      const scenario = state.scenario;
      const progressButtons = stepNames.map((label, index) => `
        <button data-step="${index}" class="rounded-full px-3 py-1 text-xs font-semibold ${index===step?'bg-amber-300 text-stone-900':'bg-stone-100 text-stone-500 hover:bg-stone-200'}">${label}</button>
      `).join('');
      labScreen.innerHTML = `
        <div class="rounded-3xl border border-stone-200 bg-stone-50 p-5 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-stone-500 uppercase text-xs tracking-[0.24em]">Progress tracker</p>
              <h3 class="mt-2 text-xl font-semibold">${stepNames[step]}</h3>
            </div>
            <div class="flex flex-wrap gap-2">${progressButtons}</div>
          </div>
        </div>
        <div class="rounded-3xl border border-stone-200 bg-stone-50 p-6 space-y-6">
          ${renderStepScreen(step, scenario)}
        </div>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button id="step-back" class="rounded-full border border-stone-300 px-5 py-3 text-sm hover:border-stone-400">Back</button>
          ${showContinueStep(step) ? `<button id="step-next" class="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-200">${continueLabel(step)}</button>` : ''}
        </div>
      `;
      document.querySelectorAll('[data-step]').forEach(button => {
        button.addEventListener('click', () => {
          const target = Number(button.dataset.step);
          if (target <= step || canAdvanceTo(target)) {
            state.progressStep = target;
            renderLabScreen();
          }
        });
      });
      document.getElementById('step-back').addEventListener('click', () => {
        if (step > 0) state.progressStep = step - 1;
        else state.labStage = 'scenarios';
        renderLabScreen();
      });
      const stepNext = document.getElementById('step-next');
      if (stepNext) {
        stepNext.addEventListener('click', () => {
          if (!canAdvanceFrom(step)) return;
          advanceFromStep(step);
        });
      }
      return;
    }

    if (state.labStage === 'reveal') {
      const revealItems = state.revealQueue.slice(0, state.revealIndex).map(item => `
        <div class="rounded-3xl p-5 border ${item.passed ? 'bg-emerald-500/15 border-emerald-500' : 'bg-rose-500/10 border-rose-500'}">
          <p class="text-sm uppercase tracking-[0.24em] ${item.passed ? 'text-emerald-800' : 'text-rose-700'}">${item.passed ? '✓' : '✗'} ${item.label}</p>
        </div>
      `).join('');
      const inProgress = state.revealIndex < state.revealQueue.length;
      labScreen.innerHTML = `
        <div class="rounded-3xl border border-stone-200 bg-stone-50 p-10 text-center space-y-6">
          <p class="text-stone-500 uppercase tracking-[0.25em] text-xs">Reveal Engine</p>
          <h3 class="text-3xl font-semibold">Wait...</h3>
          <p class="max-w-2xl mx-auto text-stone-700 leading-7">Diagnostics are unfolding. The experiment reveals the causal alignment step by step.</p>
          <div class="grid gap-4 mt-6">${revealItems || '<div class="rounded-3xl border border-stone-200 bg-stone-100 p-6 text-stone-500">Revealing results...</div>'}</div>
          ${!inProgress ? '<button id="show-result" class="mt-6 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-200">View final scorecard</button>' : ''}
        </div>
      `;
      if (!inProgress) {
        document.getElementById('show-result').addEventListener('click', () => {
          state.labStage = 'result';
          renderLabScreen();
        });
      }
      if (inProgress) {
        state.revealTimer = setTimeout(() => {
          state.revealIndex += 1;
          renderLabScreen();
        }, 600);
      }
      return;
    }

    if (state.labStage === 'result') {
      labScreen.innerHTML = renderResultScreen(state.scenario);
      document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          const panel = document.getElementById('factor-info-panel');
          const key = button.dataset.info;
          const isOpen = !panel.classList.contains('hidden') && panel.dataset.active === key;
          if (isOpen) {
            panel.classList.add('hidden');
            return;
          }
          panel.textContent = hiddenFactorInfo[key] || '';
          panel.dataset.active = key;
          panel.classList.remove('hidden');
        });
      });
      document.getElementById('try-again').addEventListener('click', () => {
        state.labStage = 'step';
        state.progressStep = 0;
        state.answers.effort = 0;
        renderLabScreen();
      });
      document.getElementById('choose-other').addEventListener('click', () => {
        state.labStage = 'scenarios';
        state.scenario = null;
        state.answers = { upadana: null, kala: null, effort: 0 };
        renderLabScreen();
      });
      document.getElementById('new-experiment').addEventListener('click', resetToScenarios);
      return;
    }
  }

  function renderStepScreen(step, scenario) {
    const narrative = state.style === 'narrative' ? `<p class="text-stone-500 text-sm uppercase tracking-[0.24em] mb-4">${scenario.story}</p>` : '';
    if (step === 0) {
      return `
        ${narrative}
        <p class="text-lg font-semibold">What is the material cause?</p>
        <div class="grid gap-4 sm:grid-cols-2 mt-5">${scenario.upadana.map(item => `
          <button data-upadana="${item}" class="rounded-3xl border ${state.answers.upadana===item?'border-emerald-500 bg-emerald-500/10':'border-stone-200 bg-stone-50/80'} p-5 text-left hover:border-emerald-400 transition">${item}</button>
        `).join('')}</div>
      `;
    }
    if (step === 1) {
      return `
        ${narrative}
        <p class="text-lg font-semibold">Svabhāva</p>
        <p class="mt-4 text-stone-700 leading-7">The intrinsic nature of the chosen cause. This step reminds you that some properties belong to the material itself, not to your effort.</p>
        <div class="mt-6 rounded-3xl border border-stone-200 bg-stone-100 p-6">
          <p class="text-stone-500">Intrinsic nature is stable and present even before the result appears. It is part of the causal field, not the final result.</p>
        </div>
      `;
    }
    if (step === 2) {
      return `
        ${narrative}
        <p class="text-lg font-semibold">How much time is required?</p>
        <div class="grid gap-4 sm:grid-cols-2 mt-5">${scenario.kala.map(item => `
          <button data-kala="${item}" class="rounded-3xl border ${state.answers.kala===item?'border-emerald-500 bg-emerald-500/10':'border-stone-200 bg-stone-50/80'} p-5 text-left hover:border-emerald-400 transition">${item}</button>
        `).join('')}</div>
      `;
    }
    if (step === 3) {
      return `
        ${narrative}
        <p class="text-lg font-semibold">Niyati</p>
        <p class="mt-4 text-stone-700 leading-7">Order and necessity. Some conditions must align quietly in the background. You cannot see them directly, but they are part of whether the experiment succeeds.</p>
        <div class="mt-6 rounded-3xl border border-stone-200 bg-stone-100 p-6">
          <p class="text-stone-500">This is a hidden condition. You can prepare, but the world still needs to cooperate.</p>
        </div>
      `;
    }
    if (step === 4) {
      return `
        ${narrative}
        <p class="text-lg font-semibold">Karma</p>
        <p class="mt-4 text-stone-700 leading-7">Invisible causal weight from prior actions. It can support or hinder the experiment even if everything else looks right.</p>
        <div class="mt-6 rounded-3xl border border-stone-200 bg-stone-100 p-6">
          <p class="text-stone-500">Karma is unseen, but it changes the likelihood of success.</p>
        </div>
      `;
    }
    if (step === 5) {
      return `
        ${narrative}
        <p class="text-lg font-semibold">Purushārtha</p>
        <p class="mt-3 text-stone-500 leading-7">Effort is visible. Click to make effort. The final outcome still depends on other conditions.</p>
        <div class="mt-8 rounded-[2rem] border border-stone-200 bg-stone-100 p-10 text-center">
          <p class="text-sm uppercase tracking-[0.24em] text-stone-500">Effort</p>
          <p class="mt-4 text-6xl font-semibold text-amber-500">${state.answers.effort}</p>
          <p class="mt-4 text-stone-500 leading-7 max-w-xl mx-auto">You can stop whenever you want and proceed. Sometimes the required purushārtha for the same work can vary. You never know how much of it was actually required.</p>
          <button id="effort-button" class="mt-8 inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-4 text-sm font-semibold text-stone-900 hover:bg-amber-200">MAKE EFFORT</button>
        </div>
      `;
    }
    return '';
  }

  function canAdvanceFrom(step) {
    if (step === 0 && !state.answers.upadana) return false;
    if (step === 2 && !state.answers.kala) return false;
    return true;
  }

  function canAdvanceTo(target) {
    if (target === 0) return true;
    if (target > 0 && !state.answers.upadana) return false;
    if (target > 2 && !state.answers.kala) return false;
    return true;
  }

  labScreen.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.upadana) {
      state.answers.upadana = button.dataset.upadana;
      const fromStep = state.progressStep;
      renderLabScreen();
      scheduleAdvance(fromStep);
      return;
    }
    if (button.dataset.kala) {
      state.answers.kala = button.dataset.kala;
      const fromStep = state.progressStep;
      renderLabScreen();
      scheduleAdvance(fromStep);
      return;
    }
    if (button.id === 'effort-button') {
      state.answers.effort += 1;
      renderLabScreen();
    }
  });

  const tabLabBtn = document.getElementById('tab-lab-btn');
  if (tabLabBtn) {
    tabLabBtn.addEventListener('click', () => {
      if (!labInitialized) {
        resetLab();
        labInitialized = true;
      }
      renderLabScreen();
    });
  }
}
