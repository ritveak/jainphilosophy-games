import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SCENARIOS,
  STEP_NAMES,
  INPUT_STEPS,
  initEffortTargets,
  getOutcomeMeta,
} from './data';

function createInitialState() {
  const scenarios = initEffortTargets(SCENARIOS);
  return {
    scenarios,
    labStage: 'scenarios',
    scenario: null,
    progressStep: 0,
    answers: { upadana: null, kala: null, effort: 0 },
    hidden: { niyatiPass: Math.random() < 0.5, karmaPass: Math.random() < 0.5 },
    posture: null,
    revealQueue: [],
    revealIndex: 0,
    externalSuccess: null,
    internalSuccess: null,
    finalMatrix: '',
    roll: { niyati: '', karma: '' },
  };
}

export function useSamvaayLab() {
  const [state, setState] = useState(createInitialState);
  const advanceTimer = useRef(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => () => {
    clearAdvanceTimer();
  }, [clearAdvanceTimer]);

  const scheduleDelayed = useCallback((action, delay, guard) => {
    clearAdvanceTimer();
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      if (!guard || guard()) action();
    }, delay);
  }, [clearAdvanceTimer]);

  const makeRevealQueue = useCallback((s) => {
    const scenario = s.scenario;
    const correctUpadana = s.answers.upadana === scenario.correctUpadana;
    const correctKala = s.answers.kala === scenario.correctKala;
    const enoughEffort = s.answers.effort >= scenario.effortTarget;
    const niyatiPass = s.hidden.niyatiPass;
    const karmaPass = s.hidden.karmaPass;
    const externalSuccess = correctUpadana && correctKala && enoughEffort && niyatiPass && karmaPass;
    const internalSuccess = s.posture === 'Knower-Seer';
    const finalMatrix = externalSuccess
      ? internalSuccess
        ? 'Conditions aligned.\nAwareness remained clear.'
        : 'The goal was achieved.\nAttachment deepened.'
      : internalSuccess
        ? 'The world did not cooperate.\nAwareness remained free.'
        : 'Neither result nor awareness was preserved.';
    const roll = {
      niyati: niyatiPass ? 'Aligned' : 'Blocked',
      karma: karmaPass ? 'Aligned' : 'Blocked',
    };
    const revealQueue = [
      { label: 'Correct Upādāna', passed: correctUpadana },
      { label: 'Correct Kāla', passed: correctKala },
      { label: 'Sufficient Purushārtha', passed: enoughEffort },
      { label: 'Niyati aligned', passed: niyatiPass },
      { label: 'Karma aligned', passed: karmaPass },
    ];
    return {
      externalSuccess,
      internalSuccess,
      finalMatrix,
      roll,
      revealQueue,
      revealIndex: 0,
    };
  }, []);

  const startScenario = useCallback((scenarioId) => {
    setState((s) => {
      const scenarios = initEffortTargets(SCENARIOS);
      const full = scenarios.find((e) => e.id === scenarioId);
      return {
        ...s,
        scenarios,
        scenario: full,
        labStage: 'scenarios',
        hidden: { niyatiPass: Math.random() < 0.5, karmaPass: Math.random() < 0.5 },
      };
    });
    scheduleDelayed(
      () => setState((s) => ({ ...s, labStage: 'step', progressStep: 0 })),
      450,
      () => true,
    );
  }, [scheduleDelayed]);

  const advanceFromStep = useCallback((step) => {
    setState((s) => {
      if (step < STEP_NAMES.length - 1) {
        return { ...s, progressStep: step + 1 };
      }
      return { ...s, labStage: 'pivot' };
    });
  }, []);

  const scheduleAdvance = useCallback((fromStep, delay = 450) => {
    scheduleDelayed(
      () => advanceFromStep(fromStep),
      delay,
      () => true,
    );
  }, [scheduleDelayed, advanceFromStep]);

  const selectUpadana = useCallback((value, fromStep) => {
    setState((s) => ({ ...s, answers: { ...s.answers, upadana: value } }));
    scheduleAdvance(fromStep);
  }, [scheduleAdvance]);

  const selectKala = useCallback((value, fromStep) => {
    setState((s) => ({ ...s, answers: { ...s.answers, kala: value } }));
    scheduleAdvance(fromStep);
  }, [scheduleAdvance]);

  const incrementEffort = useCallback(() => {
    setState((s) => ({ ...s, answers: { ...s.answers, effort: s.answers.effort + 1 } }));
  }, []);

  const selectPosture = useCallback((posture) => {
    setState((s) => {
      const reveal = makeRevealQueue({ ...s, posture });
      return { ...s, posture, labStage: 'reveal', ...reveal };
    });
  }, [makeRevealQueue]);

  const pivotBack = useCallback(() => {
    setState((s) => ({ ...s, labStage: 'step', progressStep: STEP_NAMES.length - 1 }));
  }, []);

  const goToStep = useCallback((target, currentStep) => {
    setState((s) => {
      if (target <= currentStep || canAdvanceTo(target, s.answers)) {
        return { ...s, progressStep: target };
      }
      return s;
    });
  }, []);

  const stepBack = useCallback((step) => {
    if (step > 0) {
      setState((s) => ({ ...s, progressStep: step - 1 }));
    } else {
      setState((s) => ({ ...s, labStage: 'scenarios', scenario: null }));
    }
  }, []);

  const showResult = useCallback(() => {
    setState((s) => ({ ...s, labStage: 'result' }));
  }, []);

  const tryAgain = useCallback(() => {
    setState((s) => ({
      ...s,
      labStage: 'step',
      progressStep: 0,
      answers: { ...s.answers, effort: 0 },
    }));
  }, []);

  const chooseOther = useCallback(() => {
    setState((s) => ({
      ...s,
      labStage: 'scenarios',
      scenario: null,
      answers: { upadana: null, kala: null, effort: 0 },
    }));
  }, []);

  const resetToScenarios = useCallback(() => {
    setState(createInitialState());
  }, []);

  const advanceReveal = useCallback(() => {
    setState((s) => ({ ...s, revealIndex: s.revealIndex + 1 }));
  }, []);

  return {
    state,
    clearAdvanceTimer,
    startScenario,
    advanceFromStep,
    selectUpadana,
    selectKala,
    incrementEffort,
    selectPosture,
    pivotBack,
    goToStep,
    stepBack,
    showResult,
    tryAgain,
    chooseOther,
    resetToScenarios,
    advanceReveal,
  };
}

export function canAdvanceFrom(step, answers) {
  if (step === 0 && !answers.upadana) return false;
  if (step === 2 && !answers.kala) return false;
  return true;
}

export function canAdvanceTo(target, answers) {
  if (target === 0) return true;
  if (target > 0 && !answers.upadana) return false;
  if (target > 2 && !answers.kala) return false;
  return true;
}

export function showContinueStep(step) {
  return !INPUT_STEPS.has(step);
}

export function continueLabel(step) {
  return step === STEP_NAMES.length - 1 ? 'Proceed to pivot' : 'Continue';
}

export { getOutcomeMeta };
