import { useEffect, useMemo, useState } from 'react';

export default function DecisionScreen({ step, scenario, reflections = [], selections = [], onIncrementReflection, onSelectLevel, onSubmitStep }) {
  const spec = scenario.steps[step];
  const [timeLeft, setTimeLeft] = useState(spec.timer || 8);
  const reflectionCount = reflections[step] || 0;
  const selected = selections[step] ?? 0;

  useEffect(() => {
    setTimeLeft(spec.timer || 8);
  }, [spec.timer, step]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmitStep();
    }
  }, [timeLeft, onSubmitStep]);

  const visibleLevels = useMemo(() => spec.levels.filter((l) => (l.unlockAfter || 0) <= reflectionCount), [spec.levels, reflectionCount]);

  return (
    <div>
      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-stone-500">Step {step + 1}</p>
            <h3 className="text-xl font-semibold">{spec.prompt}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500">Time Remaining</p>
            <p className="text-2xl font-semibold">{Math.max(0, timeLeft)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {visibleLevels.map((level, idx) => {
          const globalIndex = spec.levels.indexOf(level);
          const isSelected = globalIndex === selected;
          return (
            <button key={globalIndex} type="button" onClick={() => onSelectLevel(globalIndex)} className={`w-full text-left rounded-2xl p-4 border ${isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'border-stone-200 bg-white'}`}>
              <p className="font-semibold">{level.response}</p>
              <p className="text-sm text-stone-500 mt-2">{level.mentalState}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
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
