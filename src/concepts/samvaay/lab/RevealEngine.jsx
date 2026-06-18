import { useEffect, useRef } from 'react';

export default function RevealEngine({ revealQueue, revealIndex, onTick, onShowResult }) {
  const inProgress = revealIndex < revealQueue.length;
  const revealed = revealQueue.slice(0, revealIndex);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!inProgress) return;
    const timer = setTimeout(() => onTickRef.current(), 600);
    return () => clearTimeout(timer);
  }, [inProgress, revealIndex]);

  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-10 text-center space-y-6">
      <p className="text-stone-500 uppercase tracking-[0.25em] text-xs">Reveal Engine</p>
      <h3 className="text-3xl font-semibold">Wait...</h3>
      <p className="max-w-2xl mx-auto text-stone-700 leading-7">
        Diagnostics are unfolding. The experiment reveals the causal alignment step by step.
      </p>
      <div className="grid gap-4 mt-6">
        {revealed.length > 0 ? (
          revealed.map((item) => (
            <div
              key={item.label}
              className={`rounded-3xl p-5 border ${
                item.passed
                  ? 'bg-emerald-500/15 border-emerald-500'
                  : 'bg-rose-500/10 border-rose-500'
              }`}
            >
              <p
                className={`text-sm uppercase tracking-[0.24em] ${
                  item.passed ? 'text-emerald-800' : 'text-rose-700'
                }`}
              >
                {item.passed ? '✓' : '✗'} {item.label}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-stone-200 bg-stone-100 p-6 text-stone-500">
            Revealing results...
          </div>
        )}
      </div>
      {!inProgress && (
        <button
          type="button"
          onClick={onShowResult}
          className="mt-6 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-200"
        >
          View final scorecard
        </button>
      )}
    </div>
  );
}
