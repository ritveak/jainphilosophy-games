import { parse as parseYaml } from 'yaml';
import ConceptMarkdown from '../components/layout/ConceptMarkdown';

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
const faqFiles = import.meta.glob('./*/Faq.jsx', {
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

const faqById = Object.fromEntries(
  Object.entries(faqFiles)
    .map(([path, module]) => {
      const match = path.match(/^\.\/(.*?)\/Faq\.jsx$/);
      if (!match) return null;
      return [match[1], module];
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
  if (!concept) return {};

  const LabComponent = labById[conceptId];
  const FaqComponent = faqById[conceptId];

  return {
    concepts: concept.markdown ? <ConceptMarkdown markdown={concept.markdown} /> : undefined,
    lab: LabComponent ? <LabComponent /> : undefined,
    doubts: FaqComponent ? <FaqComponent /> : undefined,
  };
}
