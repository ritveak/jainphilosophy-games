/**
 * Concept registry — add new entries here and create a matching folder under src/concepts/.
 */
export const CONCEPTS = [
  {
    id: 'samvaay',
    title: 'Samvāyas',
    subtitle: 'Jain Cause & Effect Laboratory',
    summary: 'Explore how multiple causes shape external outcomes while awareness remains free from success or failure.',
    icon: '🌾',
    tagline: 'Why effort alone does not guarantee a result — and why your peace does not have to depend on whether you succeed.',
  },
];

export function getConcept(id) {
  return CONCEPTS.find((c) => c.id === id);
}
