export default function ResultScorecard({ scenario, reflections = [], selections = [], meta = {}, onTryAgain, onReset }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6 bg-stone-50">
        <h3 className="text-xl font-semibold">Scenario Complete</h3>
        <p className="text-stone-600 mt-2">{scenario.reveal?.lesson}</p>
      </div>

      <div className="rounded-2xl border p-6 bg-stone-50">
        <h4 className="font-semibold">Your choices</h4>
        <ul className="mt-3 space-y-2">
          {scenario.steps.map((s, i) => (
            <li key={s.id} className="p-3 border rounded-md bg-white">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{s.prompt}</p>
                  <p className="text-sm text-stone-500 mt-1">Chosen: {s.levels[selections[i]]?.response || '—'}</p>
                </div>
                <div className="text-sm text-stone-500">Reflections: {reflections[i] || 0}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onTryAgain} className="rounded-full border px-4 py-2">Try Again</button>
        <button type="button" onClick={onReset} className="rounded-full bg-emerald-600 px-4 py-2 text-white">New experiment</button>
      </div>
    </div>
  );
}
