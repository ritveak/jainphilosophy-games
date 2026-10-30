import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONCEPTS, isConceptUnlocked } from '../../concepts';
import ConceptPasswordForm from './ConceptPasswordForm';

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ConceptHub() {
  const [activeGateId, setActiveGateId] = useState('');
  const navigate = useNavigate();

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
        {CONCEPTS.map((concept) => {
          const isLocked = Boolean(concept.password) && !isConceptUnlocked(concept.id);
          const cardClassName = 'concept-card block rounded-3xl border border-stone-200 p-6 bg-stone-100/90 card-shadow no-underline text-inherit';
          const cardContent = (
            <>
              <div className={isLocked ? 'concept-card-preview' : ''}>
                <div className="text-4xl">{concept.icon}</div>
                <p className="mt-4 text-stone-500 uppercase text-xs tracking-[0.24em]">{concept.subtitle}</p>
                <h2 className="mt-2 text-2xl font-semibold">{concept.title}</h2>
                <p className="mt-3 text-stone-700 leading-7">{concept.summary}</p>
                <p className="mt-6 text-sm font-medium text-amber-700">Enter concept →</p>
              </div>
              {isLocked && (
                <div className="concept-lock-badge">
                  <LockIcon />
                  <span>In progress</span>
                </div>
              )}
            </>
          );

          return (
            <article key={concept.id} className={isLocked ? `${cardClassName} concept-card-locked` : ''}>
              {isLocked ? (
                <>
                  {cardContent}
                  {activeGateId === concept.id ? (
                    <ConceptPasswordForm
                      conceptId={concept.id}
                      onUnlock={() => navigate(`/concept/${concept.id}`)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveGateId(concept.id)}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
                    >
                      <LockIcon /> Enter password
                    </button>
                  )}
                </>
              ) : (
                <Link to={`/concept/${concept.id}`} className={cardClassName}>
                  {cardContent}
                </Link>
              )}
            </article>
          );
        })}
      </main>
    </div>
  );
}
