export function ConceptProse({ children, className = '' }) {
  return <div className={`concept-prose ${className}`.trim()}>{children}</div>;
}

export function ConceptCallout({ children }) {
  return <div className="concept-callout">{children}</div>;
}

export function ConceptSplit({ children }) {
  return <div className="concept-split">{children}</div>;
}

export function ConceptSplitItem({ title, children }) {
  return (
    <div className="concept-split-item">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function DefinitionList({ items }) {
  return (
    <dl>
      {items.map(({ term, definition }) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{definition}</dd>
        </div>
      ))}
    </dl>
  );
}
