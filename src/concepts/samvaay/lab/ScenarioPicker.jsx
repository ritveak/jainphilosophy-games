export default function ScenarioPicker({ scenarios, selectedId, onSelect }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {scenarios.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onSelect(entry.id)}
          className={`group rounded-3xl border border-stone-200 p-6 text-left transition hover:border-emerald-400 ${
            selectedId === entry.id ? 'border-emerald-500 bg-emerald-500/10' : ''
          }`}
        >
          <div className="text-3xl">{entry.icon}</div>
          <h3 className="mt-4 text-2xl font-semibold">{entry.title}</h3>
          <p className="mt-3 text-stone-700 leading-7">{entry.description}</p>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-stone-500">Goal: {entry.goal}</p>
        </button>
      ))}
    </div>
  );
}