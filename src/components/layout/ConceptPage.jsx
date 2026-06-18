import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getConcept } from '../../concepts/registry';
import ConceptTabs from './ConceptTabs';
import { getConceptContent } from '../../concepts';

const TABS = [
  { id: 'concepts', label: 'Concepts' },
  { id: 'lab', label: 'Laboratory' },
  { id: 'doubts', label: 'FAQ' },
];

export default function ConceptPage() {
  const { conceptId } = useParams();
  const concept = getConcept(conceptId);
  const [activeTab, setActiveTab] = useState('concepts');

  if (!concept) {
    return <Navigate to="/" replace />;
  }

  const content = getConceptContent(conceptId);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16 pt-8">
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
        tabs={TABS}
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
      </main>
    </div>
  );
}
