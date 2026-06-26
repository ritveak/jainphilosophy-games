import { useEffect, useMemo, useRef, useState } from 'react';

export default function DecisionScreen({ step, totalSteps = 1, stepSpec, scenario, reflections = [], selections = [], onIncrementReflection, onSelectLevel, onSubmitStep }) {
  const spec = stepSpec;
  const [timeLeft, setTimeLeft] = useState(spec?.timer || 8);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const reflectionCount = reflections[step] || 0;
  const selected = selections[step] ?? 0;
  const holdTimerRef = useRef(null);
  const holdIntervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(spec?.timer || 8);
  }, [spec?.timer, step]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmitStep();
    }
  }, [timeLeft, onSubmitStep]);

  useEffect(() => () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  }, []);

  const clearHoldState = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdTimerRef.current = null;
    holdIntervalRef.current = null;
    setIsHolding(false);
    setHoldProgress(0);
  };

  const beginHold = () => {
    clearHoldState();
    setIsHolding(true);
    setHoldProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((value) => {
        console.log('hold progress', value);
        if (value >= 200) {
          return 100;
        }
        return Math.min(100, value+2 );
      });
    }, 10);

    holdTimerRef.current = setTimeout(() => {
      onIncrementReflection();
      clearHoldState();
    }, 1000);
  };

  const visibleLevels = useMemo(() => {
    const priorSelections = (selections || []).slice(0, step);
    return (spec?.levels || []).filter((level) => {
      const meetsUnlock = (level.unlockAfter || 0) <= reflectionCount;
      const meetsVisibility = !level.visibleWhen || level.visibleWhen({ selections: priorSelections, stepIndex: step, currentStep: spec, scenario });
      return meetsUnlock && meetsVisibility;
    });
  }, [spec, reflectionCount, scenario, selections, step]);

  const priorSelections = (selections || []).slice(0, step);
  const eligibleLevels = (spec?.levels || []).filter((level) => !level.visibleWhen || level.visibleWhen({ selections: priorSelections, stepIndex: step, currentStep: spec, scenario }));
  const hasMoreOptionsToReveal = visibleLevels.length < eligibleLevels.length;
  const unlockLabel = 'Keep me pressed as a measure of actively thinking';

  if (!spec) return null;

  return (
    <div>
      <div className="mb-6 rounded-3xl border border-stone-200 bg-stone-50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Step {step + 1} of {totalSteps}</p>
            <h3 className="text-xl font-semibold">{spec.prompt}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500">Time Remaining</p>
            <p className="text-2xl font-semibold">{Math.max(0, timeLeft)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {visibleLevels.map((level) => {
          const globalIndex = spec.levels.indexOf(level);
          const isSelected = globalIndex === selected;
          return (
            <button
              key={globalIndex}
              type="button"
              onClick={() => onSelectLevel(globalIndex)}
              className={`w-full rounded-2xl border p-4 text-left transition ${isSelected ? 'border-stone-800 bg-stone-100 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-400'}`}
            >
              <p className="font-semibold">{level.response}</p>
              <p className="mt-2 text-sm text-stone-500">{level.hiddenDriver || 'Choice'} • {level.consequence || 'This choice will shape what happens next.'}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          {hasMoreOptionsToReveal ? (
            <button
              type="button"
              onMouseDown={beginHold}
              onMouseUp={clearHoldState}
              onMouseLeave={clearHoldState}
              onTouchStart={beginHold}
              onTouchEnd={clearHoldState}
              onTouchCancel={clearHoldState}
              className="relative overflow-hidden rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
            >
              <span className="relative z-10">{unlockLabel}</span>
              <span
                className={`absolute inset-0 rounded-full transition-all ${isHolding ? 'bg-emerald-200/70' : 'bg-transparent'}`}
                style={{ width: `${holdProgress}%` }}
              />
            </button>
          ) : null}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onSubmitStep} className="rounded-full bg-amber-300 px-5 py-2 font-semibold">Submit</button>
        </div>
      </div>
    </div>
  );
}
