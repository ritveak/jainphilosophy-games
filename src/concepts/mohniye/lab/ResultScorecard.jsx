import { getLevelSignal, getSignalClasses, getSignalLabel } from '../data';

export default function ResultScorecard({ scenario, reflections = [], selections = [], meta = {}, onTryAgain, onReset }) {
  const steps = meta.visibleSteps || scenario.steps || [];
  const score = meta.score || 0;
  const maxScore = meta.maxScore || Math.max(steps.length * 5, 1);
  const scorePct = Math.round((score / maxScore) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
        <h3 className="text-xl font-semibold">Scenario Complete</h3>
        <p className="mt-2 text-stone-600">{scenario.reveal?.lesson}</p>
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <p className="text-sm font-semibold text-emerald-700">Decision quality: {scorePct}%</p>
          <p className="mt-1 text-sm text-stone-600">{meta.verdict || 'The choices shaped the amount of pain that followed.'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Your path</h4>
          <p className="text-sm text-stone-500">Score {score}/{maxScore}</p>
        </div>
        <ul className="mt-3 space-y-3">
          {steps.map((s, i) => {
            const level = s.levels?.[selections[i]] || null;
            const signal = getLevelSignal(level);
            const classes = getSignalClasses(signal);
            return (
              <li key={s.id} className={`rounded-xl border p-4 ${classes.container}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{s.prompt}</p>
                    <p className="mt-2 text-sm text-stone-600">{level?.response || 'No choice made yet'}</p>
                    <p className="mt-2 text-sm text-stone-500">{level?.consequence || 'A decision that shaped the next step.'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes.pill}`}>{getSignalLabel(signal)}</span>
                    <p className="mt-2 text-sm text-stone-500">Reflections: {reflections[i] || 0}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {meta.bestEarlyIntervention && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
          <p className="text-sm font-semibold text-emerald-700">Best early intervention</p>
          <p className="mt-2 font-semibold text-stone-800">{meta.bestEarlyIntervention.prompt}</p>
          <p className="mt-1 text-sm text-stone-600">{meta.bestEarlyIntervention.response}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onTryAgain} className="rounded-full border px-4 py-2">Try Again</button>
        <button type="button" onClick={onReset} className="rounded-full bg-emerald-600 px-4 py-2 text-white">New experiment</button>
      </div>
    </div>
  );
}
