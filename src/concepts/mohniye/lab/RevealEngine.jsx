import { useEffect, useRef } from 'react';

export default function RevealEngine({ revealQueue = [], revealIndex = 0, onTick, onShowResult }) {
  const inProgress = revealIndex < revealQueue.length;
  const revealed = revealQueue.slice(0, revealIndex);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!inProgress) return;
    const timer = setTimeout(() => onTickRef.current(), 700);
    return () => clearTimeout(timer);
  }, [inProgress, revealIndex]);

  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-8 text-left space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Reveal</p>
        <h3 className="text-2xl font-semibold">How the story unfolded</h3>
        <p className="text-stone-600">Each turn shows how one decision made the next one heavier, and how an earlier act of honesty could have reduced the fallout.</p>
      </div>

      <div className="space-y-3">
        {revealed.length > 0 ? (
          revealed.map((r, i) => (
            <div key={`${r.label}-${i}`} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-stone-800">{r.label}</p>
              <p className="mt-2 text-sm text-stone-600">{r.summary}</p>
              <p className="mt-2 text-sm text-amber-700">{r.insight}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-100 p-6 text-stone-500">Revealing the chain of consequences…</div>
        )}
      </div>

      {!inProgress && (
        <button type="button" onClick={onShowResult} className="rounded-full bg-amber-300 px-6 py-2 font-semibold">View reflection</button>
      )}
    </div>
  );
}
