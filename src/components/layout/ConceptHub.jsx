import { Link } from 'react-router-dom';
import { CONCEPTS } from '../../concepts/registry';

export default function ConceptHub() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-10 pt-8">
      <header className="mb-10 animate-fade">
        <p className="uppercase tracking-[0.35em] text-stone-500 text-xs">Concept Laboratory</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight">
          Play with ideas. Understand them deeply.
        </h1>
        <p className="mt-4 text-stone-700 max-w-2xl leading-7">
          Choose a concept to explore its framework, interactive lab, and clarifying doubts.
        </p>
      </header>

      <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade">
        {CONCEPTS.map((concept) => (
          <Link
            key={concept.id}
            to={`/concept/${concept.id}`}
            className="concept-card block rounded-3xl border border-stone-200 p-6 bg-stone-100/90 card-shadow no-underline text-inherit"
          >
            <div className="text-4xl">{concept.icon}</div>
            <p className="mt-4 text-stone-500 uppercase text-xs tracking-[0.24em]">{concept.subtitle}</p>
            <h2 className="mt-2 text-2xl font-semibold">{concept.title}</h2>
            <p className="mt-3 text-stone-700 leading-7">{concept.summary}</p>
            <p className="mt-6 text-sm font-medium text-amber-700">Enter concept →</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
