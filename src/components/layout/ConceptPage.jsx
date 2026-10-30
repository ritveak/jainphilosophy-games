import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getConcept, getConceptContent, isConceptUnlocked } from '../../concepts';
import ConceptTabs from './ConceptTabs';
import ConceptPasswordForm from './ConceptPasswordForm';

export default function ConceptPage() {
  const { conceptId } = useParams();
  const concept = getConcept(conceptId);
  const { content, tabs: availableTabs } = getConceptContent(conceptId);
  const [activeTab, setActiveTab] = useState('concepts');
  const [hasAccess, setHasAccess] = useState(() => isConceptUnlocked(conceptId));

  useEffect(() => {
    setHasAccess(isConceptUnlocked(conceptId));
    if (!availableTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id ?? 'concepts');
    }
  }, [availableTabs, activeTab, conceptId]);

  if (!concept) {
    return <Navigate to="/" replace />;
  }

  if (concept.password && !hasAccess) {
    return (
      <main className="mx-auto max-w-xl px-4 pb-16 pt-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 no-underline mb-6">
          ← All concepts
        </Link>
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <span aria-hidden="true">🔒</span> In progress
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-stone-900">{concept.title}</h1>
          <p className="mt-2 text-stone-600">This concept is in progress. Enter its password to continue.</p>
          <ConceptPasswordForm conceptId={conceptId} onUnlock={() => setHasAccess(true)} />
        </section>
      </main>
    );
  }

  return (
    <div className={`${conceptId === 'karmagranth' ? 'w-full max-w-none' : 'max-w-3xl'} mx-auto px-4 pb-16 pt-8`}>
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 no-underline mb-4"
        >
          ← All concepts
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{concept.title}</h1>
        <p className="mt-2 text-stone-600 leading-relaxed max-w-2xl">{concept.tagline}</p>
      </header>

      <ConceptTabs
        tabs={availableTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel={`${concept.title} sections`}
      />

      <main>
        {activeTab === 'concepts' && (
          <section className="animate-fade">{content.concepts}</section>
        )}
        {activeTab === 'lab' && (
          <section className="animate-fade">{content.lab}</section>
        )}
        {activeTab === 'doubts' && (
          <section className="animate-fade">{content.doubts}</section>
        )}
        {activeTab === 'resources' && (
          <section className="animate-fade">{content.resources}</section>
        )}
      </main>
    </div>
  );
}
