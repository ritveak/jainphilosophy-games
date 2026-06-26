export default function ScenarioPicker({ scenarios, selectedId, onSelect }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {scenarios.map((s) => (
        <button key={s.id} type="button" onClick={() => onSelect(s.id)} className={`group rounded-3xl border p-6 text-left hover:border-emerald-400 ${selectedId === s.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-stone-200'}`}>
          <div className="text-3xl">{s.icon}</div>
          <h3 className="mt-4 text-2xl font-semibold">{s.title}</h3>
          <p className="mt-3 text-stone-700 leading-7">{s.description}</p>
        </button>
      ))}
    </div>
  );
}
