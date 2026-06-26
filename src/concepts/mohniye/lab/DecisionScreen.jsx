import { useEffect, useMemo, useState } from 'react';

export default function DecisionScreen({ step, totalSteps = 1, stepSpec, scenario, reflections = [], selections = [], onIncrementReflection, onSelectLevel, onSubmitStep }) {
  const spec = stepSpec;
  const [timeLeft, setTimeLeft] = useState(spec?.timer || 8);
  const reflectionCount = reflections[step] || 0;
  const selected = selections[step] ?? 0;

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

  const visibleLevels = useMemo(() => {
    const priorSelections = (selections || []).slice(0, step);
    return (spec?.levels || []).filter((level) => {
      const meetsUnlock = (level.unlockAfter || 0) <= reflectionCount;
      const meetsVisibility = !level.visibleWhen || level.visibleWhen({ selections: priorSelections, stepIndex: step, currentStep: spec, scenario });
      return meetsUnlock && meetsVisibility;
    });
  }, [spec, reflectionCount, scenario, selections, step]);

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
          <button type="button" onClick={onIncrementReflection} className="rounded-full border px-4 py-2">{spec.unlockButton} {reflectionCount}</button>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onSubmitStep} className="rounded-full bg-amber-300 px-5 py-2 font-semibold">Submit</button>
        </div>
      </div>
    </div>
  );
}
