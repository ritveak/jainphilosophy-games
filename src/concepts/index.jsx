import SamvaayConcepts from './samvaay/SamvaayConcepts';
import SamvaayFaq from './samvaay/SamvaayFaq';
import SamvaayLab from './samvaay/SamvaayLab';

const CONTENT = {
  samvaay: {
    concepts: <SamvaayConcepts />,
    lab: <SamvaayLab />,
    doubts: <SamvaayFaq />,
  },
};

export function getConceptContent(conceptId) {
  const content = CONTENT[conceptId];
  if (!content) {
    throw new Error(`No content registered for concept: ${conceptId}`);
  }
  return content;
}
