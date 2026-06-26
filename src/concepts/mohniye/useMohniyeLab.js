import { useCallback, useState } from 'react';
import { SCENARIOS, LAB_TITLES } from './data';

function createInitialState() {
  return {
    scenarios: SCENARIOS,
    labStage: 'intro',
    scenario: null,
    progressStep: 0,
    // per-step reflection counts and selected level index
    reflections: [],
    selections: [],
    revealQueue: [],
    revealIndex: 0,
    finalMeta: null,
  };
}

export function useMohniyeLab() {
  const [state, setState] = useState(createInitialState);

  const goTo = useCallback((stage) => setState((s) => ({ ...s, labStage: stage })), []);

  const startScenario = useCallback((id) => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return;
    setState((s) => ({
      ...s,
      scenario,
      labStage: 'step',
      progressStep: 0,
      reflections: scenario.steps.map(() => 0),
      selections: scenario.steps.map(() => 0),
      revealQueue: [],
      revealIndex: 0,
      finalMeta: null,
    }));
  }, []);

  const incrementReflection = useCallback(() => {
    setState((s) => {
      const next = [...s.reflections];
      next[s.progressStep] = (next[s.progressStep] || 0) + 1;
      return { ...s, reflections: next };
    });
  }, []);

  const selectLevel = useCallback((levelIndex) => {
    setState((s) => {
      const next = [...s.selections];
      next[s.progressStep] = levelIndex;
      return { ...s, selections: next };
    });
  }, []);

  const submitStep = useCallback(() => {
    setState((s) => {
      const nextStep = s.progressStep + 1;
      if (nextStep < s.scenario.steps.length) {
        return { ...s, progressStep: nextStep };
      }
      // build reveal queue and final meta
      const timeline = s.scenario.reveal?.timeline || [];
      const revealQueue = timeline.map((label) => ({ label }));
      const totalReflections = s.reflections.reduce((a, b) => a + b, 0);
      const finalMeta = { totalReflections };
      return { ...s, labStage: 'reveal', revealQueue, revealIndex: 0, finalMeta };
    });
  }, []);

  const advanceReveal = useCallback(() => {
    setState((s) => ({ ...s, revealIndex: s.revealIndex + 1 }));
  }, []);

  const showResult = useCallback(() => setState((s) => ({ ...s, labStage: 'result' })), []);

  const reset = useCallback(() => setState(createInitialState()), []);

  const tryAgain = useCallback(() => {
    setState((s) => ({ ...s, labStage: 'step', progressStep: 0, reflections: s.scenario.steps.map(() => 0), selections: s.scenario.steps.map(() => 0) }));
  }, []);

  return {
    state,
    goTo,
    startScenario,
    incrementReflection,
    selectLevel,
    submitStep,
    advanceReveal,
    showResult,
    reset,
    tryAgain,
  };
}
