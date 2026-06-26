import ReactMarkdown from 'react-markdown';
import { useMemo } from 'react';
import remarkGfm from 'remark-gfm';
import { ConceptProse } from '../prose/ConceptProse';

function createNode(level, title) {
  return {
    level,
    title,
    bodyLines: [],
    children: [],
  };
}

function buildMarkdownTree(markdown) {
  const root = createNode(0, '');
  const stack = [root];
  let inFence = false;
  let fenceChar = '';
  let fenceLength = 0;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      const markerChar = marker[0];
      const markerLength = marker.length;

      if (!inFence) {
        inFence = true;
        fenceChar = markerChar;
        fenceLength = markerLength;
      } else if (markerChar === fenceChar && markerLength >= fenceLength) {
        inFence = false;
        fenceChar = '';
        fenceLength = 0;
      }

      stack[stack.length - 1].bodyLines.push(line);
      continue;
    }

    if (!inFence) {
      const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+(.*\S)\s*$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].replace(/\s+#+\s*$/, '');

        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        const parent = stack[stack.length - 1];
        const node = createNode(level, title);
        parent.children.push(node);
        stack.push(node);
        continue;
      }
    }

    stack[stack.length - 1].bodyLines.push(line);
  }

  return root;
}

const inlineMarkdownComponents = {
  p: ({ children }) => <>{children}</>,
};

function MarkdownBlock({ markdown, inline = false }) {
  if (!markdown || !markdown.trim()) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={inline ? inlineMarkdownComponents : undefined}
    >
      {markdown}
    </ReactMarkdown>
  );
}

function MarkdownSection({ node, path, defaultOpen = false }) {
  const bodyMarkdown = node.bodyLines.join('\n').trim();

  return (
    <details
      className={`concept-section concept-section-level-${node.level}`}
      open={defaultOpen}
    >
      <summary className="concept-section-summary">
        <span className="concept-section-heading">
          <MarkdownBlock markdown={node.title} inline />
        </span>
        <span className="concept-section-caret" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="concept-section-body">
        {bodyMarkdown ? <MarkdownBlock markdown={bodyMarkdown} /> : null}
        {node.children.map((child, index) => (
          <MarkdownSection
            key={`${path}.${index}`}
            node={child}
            path={`${path}.${index}`}
          />
        ))}
      </div>
    </details>
  );
}

export default function ConceptMarkdown({ markdown }) {
  const tree = useMemo(() => buildMarkdownTree(markdown ?? ''), [markdown]);

  return (
      <ConceptProse>
        {tree.bodyLines.length ? <MarkdownBlock markdown={tree.bodyLines.join('\n').trim()} /> : null}
        {tree.children.map((node, index) => (
          <MarkdownSection
            key={index}
            node={node}
            path={`${index}`}
            defaultOpen={index === 0}
          />
        ))}
    </ConceptProse>
  );
}
