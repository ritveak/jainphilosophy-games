import { useState } from 'react';
import { getOutcomeMeta, getToneClasses, HIDDEN_FACTOR_INFO } from '../data';

function rowClass(ok) {
  return ok ? 'bg-emerald-500/10 text-emerald-900' : 'bg-rose-500/10 text-stone-900';
}

export default function ResultScorecard({
  scenario,
  answers,
  roll,
  posture,
  externalSuccess,
  internalSuccess,
  finalMatrix,
  onTryAgain,
  onChooseOther,
  onReset,
}) {
  const [infoKey, setInfoKey] = useState(null);
  const meta = getOutcomeMeta(externalSuccess, internalSuccess);
  const tone = getToneClasses(meta.tone);
  const lines = finalMatrix.split('\n');

  const upadanaSuccess = answers.upadana === scenario.correctUpadana;
  const kalaSuccess = answers.kala === scenario.correctKala;
  const effortSuccess = answers.effort >= scenario.effortTarget;
  const niyatiSuccess = roll.niyati === 'Aligned';
  const karmaSuccess = roll.karma === 'Aligned';
  const postureSuccess = posture === 'Knower-Seer';

  const toggleInfo = (key) => {
    setInfoKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div
        className={`rounded-[2rem] border ${tone.border} bg-gradient-to-b ${tone.bg} p-8 sm:p-12 text-center text-stone-50 card-shadow`}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Final outcome</p>
        <p className="mt-4 inline-block rounded-full border border-stone-600 bg-stone-800/80 px-4 py-1 text-xs uppercase tracking-[0.28em] text-stone-300">
          {meta.label}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
          <div
            className={`rounded-2xl border p-5 ${
              externalSuccess
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-rose-500/50 bg-rose-500/10'
            }`}
          >
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-stone-400">External result</p>
            <p className="mt-2 text-2xl font-semibold">{externalSuccess ? 'Achieved' : 'Unmet'}</p>
            <p className="mt-2 text-sm text-stone-400 leading-6">
              Did the causal conditions produce the goal?
            </p>
          </div>
          <div
            className={`rounded-2xl border p-5 ${
              internalSuccess
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-rose-500/50 bg-rose-500/10'
            }`}
          >
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-stone-400">Internal posture</p>
            <p className="mt-2 text-2xl font-semibold">
              {internalSuccess ? 'Knower-Seer' : 'Reactive Loop'}
            </p>
            <p className="mt-2 text-sm text-stone-400 leading-6">
              Did awareness stay separate from the result?
            </p>
          </div>
        </div>
        <div className="mt-10 space-y-3">
          {lines.map((line, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'text-2xl sm:text-4xl font-semibold leading-tight text-stone-50'
                  : 'text-lg sm:text-xl text-stone-300 leading-relaxed'
              }
            >
              {line}
            </p>
          ))}
        </div>
        <p className="mt-8 max-w-2xl mx-auto text-sm text-stone-400 leading-7 italic">
          {meta.reflection}
        </p>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-stone-500 uppercase text-xs tracking-[0.24em]">Causal breakdown</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-800">
              {scenario.icon} {scenario.title}
            </h3>
          </div>
          <p className="text-sm text-stone-500">Every parameter weighed against the ideal</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-stone-100">
          <table className="min-w-full text-left text-sm text-stone-700">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 bg-stone-50">
                <th className="px-4 py-3 font-medium">Parameter</th>
                <th className="px-4 py-3 font-medium">Your choice</th>
                <th className="px-4 py-3 font-medium">Required</th>
                <th className="px-4 py-3 font-medium w-20">Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b border-stone-200 ${rowClass(upadanaSuccess)}`}>
                <td className="px-4 py-4 font-semibold">Upādāna</td>
                <td className="px-4 py-4">{answers.upadana || '—'}</td>
                <td className="px-4 py-4">{scenario.correctUpadana}</td>
                <td className="px-4 py-4 font-semibold">{upadanaSuccess ? '✓' : '✗'}</td>
              </tr>
              <tr className={`border-b border-stone-200 ${rowClass(kalaSuccess)}`}>
                <td className="px-4 py-4 font-semibold">Kāla</td>
                <td className="px-4 py-4">{answers.kala || '—'}</td>
                <td className="px-4 py-4">{scenario.correctKala}</td>
                <td className="px-4 py-4 font-semibold">{kalaSuccess ? '✓' : '✗'}</td>
              </tr>
              <tr className={`border-b border-stone-200 ${rowClass(effortSuccess)}`}>
                <td className="px-4 py-4 font-semibold">Purushārtha</td>
                <td className="px-4 py-4">{answers.effort}</td>
                <td className="px-4 py-4">≥ {scenario.effortTarget}</td>
                <td className="px-4 py-4 font-semibold">{effortSuccess ? '✓' : '✗'}</td>
              </tr>
              <tr className={`border-b border-stone-200 ${rowClass(niyatiSuccess)}`}>
                <td className="px-4 py-4 font-semibold">
                  Niyati
                  <button
                    type="button"
                    onClick={() => toggleInfo('niyati')}
                    className="info-btn ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-500 hover:bg-stone-200 hover:border-stone-400"
                    aria-label="About Niyati"
                  >
                    ⓘ
                  </button>
                </td>
                <td className="px-4 py-4">{roll.niyati}</td>
                <td className="px-4 py-4">Aligned</td>
                <td className="px-4 py-4 font-semibold">{niyatiSuccess ? '✓' : '✗'}</td>
              </tr>
              <tr className={`border-b border-stone-200 ${rowClass(karmaSuccess)}`}>
                <td className="px-4 py-4 font-semibold">
                  Karma
                  <button
                    type="button"
                    onClick={() => toggleInfo('karma')}
                    className="info-btn ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-xs text-stone-500 hover:bg-stone-200 hover:border-stone-400"
                    aria-label="About Karma"
                  >
                    ⓘ
                  </button>
                </td>
                <td className="px-4 py-4">{roll.karma}</td>
                <td className="px-4 py-4">Aligned</td>
                <td className="px-4 py-4 font-semibold">{karmaSuccess ? '✓' : '✗'}</td>
              </tr>
              <tr className={rowClass(postureSuccess)}>
                <td className="px-4 py-4 font-semibold">Posture</td>
                <td className="px-4 py-4">{posture}</td>
                <td className="px-4 py-4">Knower-Seer</td>
                <td className="px-4 py-4 font-semibold">{postureSuccess ? '✓' : '✗'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {infoKey && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-stone-700 leading-7 text-left">
            {HIDDEN_FACTOR_INFO[infoKey]}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-center gap-3 pb-4">
        <button
          type="button"
          onClick={onTryAgain}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm hover:border-stone-400 bg-stone-50"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onChooseOther}
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Choose Another Experiment
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm hover:border-stone-400 bg-stone-50"
        >
          New experiment
        </button>
      </div>
    </div>
  );
}
