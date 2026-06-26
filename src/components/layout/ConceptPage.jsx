import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getConcept, getConceptContent } from '../../concepts';
import ConceptTabs from './ConceptTabs';

export default function ConceptPage() {
  const { conceptId } = useParams();
  const concept = getConcept(conceptId);
  const content = getConceptContent(conceptId);
  const availableTabs = [
    { id: 'concepts', label: 'Concepts', exists: Boolean(content.concepts) },
    { id: 'lab', label: 'Laboratory', exists: Boolean(content.lab) },
    { id: 'doubts', label: 'FAQ', exists: Boolean(content.doubts) },
    { id: 'resources', label: 'Resources', exists: Boolean(content.resources) },
  ].filter((tab) => tab.exists);
  const [activeTab, setActiveTab] = useState('concepts');

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id ?? 'concepts');
    }
  }, [availableTabs, activeTab]);

  if (!concept) {
    return <Navigate to="/" replace />;
  }

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
