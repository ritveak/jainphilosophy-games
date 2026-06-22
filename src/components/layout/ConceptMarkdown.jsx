import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConceptProse } from '../prose/ConceptProse';

export default function ConceptMarkdown({ markdown }) {
  return (
    <ConceptProse>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </ConceptProse>
  );
}
