import { useCallback, useState } from 'react';
import { SCENARIOS, LAB_TITLES, getLevelSignal, getSignalScore, getVisibleSteps } from './data';

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
    const visibleSteps = getVisibleSteps(scenario.steps, []);
    setState((s) => ({
      ...s,
      scenario,
      labStage: 'step',
      progressStep: 0,
      reflections: visibleSteps.map(() => 0),
      selections: visibleSteps.map(() => 0),
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
      if (!s.scenario) return s;
      const visibleSteps = getVisibleSteps(s.scenario.steps, s.selections);
      const nextStep = s.progressStep + 1;
      if (nextStep < visibleSteps.length) {
        return { ...s, progressStep: nextStep };
      }

      const totalReflections = s.reflections.reduce((a, b) => a + b, 0);
      const score = visibleSteps.reduce((acc, step, index) => acc + getSignalScore(step.levels?.[s.selections[index]]), 0);
      const maxScore = visibleSteps.length * 5;
      const verdict = score >= maxScore * 0.6
        ? 'Your early choices kept the damage manageable.'
        : score >= maxScore * 0.3
          ? 'The situation became harder than it needed to be.'
          : 'The earlier choices made the problem much worse.';
      const bestEarlyIntervention = visibleSteps
        .map((step, index) => ({ step, level: step.levels?.[s.selections[index]] }))
        .find((entry) => getLevelSignal(entry.level) === 'good');
      const finalMeta = {
        totalReflections,
        score,
        maxScore,
        verdict,
        visibleSteps,
        bestEarlyIntervention: bestEarlyIntervention
          ? {
              prompt: bestEarlyIntervention.step.prompt,
              response: bestEarlyIntervention.level?.response || '—',
            }
          : null,
      };
      return { ...s, labStage: 'result', finalMeta };
    });
  }, []);

  const advanceReveal = useCallback(() => {
    setState((s) => ({ ...s, revealIndex: s.revealIndex + 1 }));
  }, []);

  const showResult = useCallback(() => setState((s) => ({ ...s, labStage: 'result' })), []);

  const reset = useCallback(() => setState(createInitialState()), []);

  const tryAgain = useCallback(() => {
    setState((s) => {
      if (!s.scenario) return s;
      const visibleSteps = getVisibleSteps(s.scenario.steps, []);
      return { ...s, labStage: 'step', progressStep: 0, reflections: visibleSteps.map(() => 0), selections: visibleSteps.map(() => 0) };
    });
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
    getVisibleSteps: (scenario, selections) => getVisibleSteps(scenario?.steps || [], selections || []),
  };
}
