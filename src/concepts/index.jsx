import { parse as parseYaml } from 'yaml';
import ConceptMarkdown from '../components/layout/ConceptMarkdown';
import FaqRenderer from '../components/renderers/FaqRenderer';
import ResourcesRenderer from '../components/renderers/ResourcesRenderer';

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { data: {}, content: markdown };
  }

  const yamlText = match[1];
  const data = parseYaml(yamlText) ?? {};
  const content = markdown.slice(match[0].length);
  return { data, content };
}

const markdownFiles = import.meta.glob('./*/Concept.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const labFiles = import.meta.glob('./*/Lab.jsx', {
  eager: true,
  import: 'default',
});
const faqJsonFiles = import.meta.glob('./*/faq.json', {
  eager: true,
  import: 'default',
});
const resourcesJsonFiles = import.meta.glob('./*/resources.json', {
  eager: true,
  import: 'default',
});

const conceptEntries = Object.entries(markdownFiles)
  .map(([path, markdown]) => {
    const match = path.match(/^\.\/(.*?)\/Concept\.md$/);
    if (!match) return null;

    const folder = match[1];
    const { data = {}, content } = parseFrontmatter(markdown);
    const id = typeof data.id === 'string' && data.id.trim() ? data.id.trim() : folder;

    return [
      id,
      {
        id,
        folder,
        meta: {
          id,
          title: data.title ?? id,
          subtitle: data.subtitle ?? '',
          summary: data.summary ?? '',
          icon: data.icon ?? '🧠',
          tagline: data.tagline ?? '',
        },
        markdown: content,
      },
    ];
  })
  .filter(Boolean);

const CONCEPTS = conceptEntries.map(([, concept]) => concept.meta);
const conceptById = Object.fromEntries(conceptEntries);

const labById = Object.fromEntries(
  Object.entries(labFiles)
    .map(([path, module]) => {
      const match = path.match(/^\.\/(.*?)\/Lab\.jsx$/);
      if (!match) return null;
      return [match[1], module];
    })
    .filter(Boolean)
);

const faqDataById = Object.fromEntries(
  Object.entries(faqJsonFiles)
    .map(([path, data]) => {
      const match = path.match(/^\.\/(.*?)\/faq\.json$/);
      if (!match) return null;
      return [match[1], data];
    })
    .filter(Boolean)
);

const resourcesDataById = Object.fromEntries(
  Object.entries(resourcesJsonFiles)
    .map(([path, data]) => {
      const match = path.match(/^\.\/(.*?)\/resources\.json$/);
      if (!match) return null;
      return [match[1], data];
    })
    .filter(Boolean)
);

export { CONCEPTS };

export function getConcept(id) {
  return conceptById[id]?.meta;
}

export function getConcepts() {
  return CONCEPTS;
}

export function getConceptContent(conceptId) {
  const concept = conceptById[conceptId];
  if (!concept) return { content: {}, tabs: [] };

  const LabComponent = labById[conceptId];
  const faqData = faqDataById[conceptId];
  const resourcesData = resourcesDataById[conceptId];

  const content = {
    concepts: concept.markdown ? <ConceptMarkdown markdown={concept.markdown} /> : undefined,
    lab: LabComponent ? <LabComponent /> : undefined,
    doubts: faqData ? <FaqRenderer items={faqData} /> : undefined,
    resources: resourcesData ? <ResourcesRenderer items={resourcesData} /> : undefined,
  };

  // Build dynamic tabs based on what's available
  const tabs = [
    { id: 'concepts', label: 'Concepts', exists: Boolean(content.concepts) },
    { id: 'lab', label: 'Laboratory', exists: Boolean(content.lab) },
    { id: 'doubts', label: 'FAQ', exists: Boolean(content.doubts) },
    { id: 'resources', label: 'Resources', exists: Boolean(content.resources) },
  ].filter((tab) => tab.exists);

  return { content, tabs };
}
