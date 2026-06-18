export default function PivotScreen({ onSelectReactive, onSelectKnower, onBack }) {
  return (
    <div className="rounded-2xl border border-stone-600 bg-stone-950/95 p-8 sm:p-10 text-center space-y-6 text-stone-100 shadow-2xl">
      <p className="text-amber-400 uppercase tracking-[0.35em] text-xs">Everything stops here</p>
      <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">The experiment is complete.</h3>
      <p className="text-stone-300 text-lg leading-relaxed">
        The outcome already exists. You have not yet seen it.
        <br />
        How will you meet it?
      </p>
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <button
          type="button"
          onClick={onSelectReactive}
          className="rounded-2xl border border-stone-600 bg-stone-900/90 p-6 text-left transition hover:border-blue-500/70 hover:bg-stone-900"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Reactive Loop</p>
            <div className="pill blue scale-75 origin-right" />
          </div>
          <h4 className="mt-4 text-xl font-semibold text-stone-100">
            My happiness depends on results.
          </h4>
        </button>
        <button
          type="button"
          onClick={onSelectKnower}
          className="rounded-2xl border border-stone-600 bg-stone-900/90 p-6 text-left transition hover:border-red-500/70 hover:bg-stone-900"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Knower-Seer</p>
            <div className="pill red scale-75 origin-right" />
          </div>
          <h4 className="mt-4 text-xl font-semibold text-stone-100">
            I observe outcomes without becoming them.
          </h4>
        </button>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-2 rounded-full border border-stone-600 px-5 py-2.5 text-sm text-stone-400 hover:border-stone-500 hover:text-stone-200"
      >
        Back
      </button>
    </div>
  );
}
