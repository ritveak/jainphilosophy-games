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
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-10 text-center space-y-6">
      <p className="text-sm text-stone-500 uppercase">Reveal</p>
      <h3 className="text-2xl font-semibold">Revealing timeline</h3>
      <div className="mt-6 space-y-3">
        {revealed.length > 0 ? (
          revealed.map((r, i) => (
            <div key={`${r.label}-${i}`} className="rounded-2xl border p-4 bg-stone-100">{r.label}</div>
          ))
        ) : (
          <div className="rounded-2xl border p-6 bg-stone-100 text-stone-500">Revealing...</div>
        )}
      </div>
      {!inProgress && (
        <button type="button" onClick={onShowResult} className="mt-6 rounded-full bg-amber-300 px-6 py-2">View reflection</button>
      )}
    </div>
  );
}
