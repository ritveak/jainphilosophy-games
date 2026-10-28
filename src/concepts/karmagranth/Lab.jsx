import { useEffect, useMemo, useState } from 'react';
import LabEmbedded from '../../components/lab/LabEmbedded';
import { karmaData } from './data';

const RELATIONS = [
  { id: 'bandh', label: 'Bandh' },
  { id: 'uday', label: 'Uday' },
  { id: 'udirna', label: 'Udirna' },
  { id: 'satta', label: 'Satta' },
];

const nodeById = Object.fromEntries(karmaData.nodes.map((node) => [node.id, node]));
const childrenById = karmaData.nodes.reduce((map, node) => {
  if (node.parentId) (map[node.parentId] ||= []).push(node);
  return map;
}, {});
function ancestorsOf(id) {
  const ancestors = [];
  let current = nodeById[id];
  while (current?.parentId) {
    ancestors.unshift(current.parentId);
    current = nodeById[current.parentId];
  }
  return ancestors;
}

function familyOf(node) {
  let current = node;
  while (current?.parentId) current = nodeById[current.parentId];
  return current;
}

function nodeLabel(node) {
  return node?.displayName || node?.name || '';
}

function stageLabel(id) {
  const stage = karmaData.gunasthans.find((item) => item.id === id);
  return stage ? `Gunasthan ${stage.number} · ${stage.displayName || stage.name}` : 'After Gunasthan 14';
}

function relationshipDescription(record) {
  if (record.state === 'unlocked') {
    return record.relationType === 'bandh'
      ? 'Binding becomes possible from this Gunasthan.'
      : 'This karma can enter uday from this Gunasthan.';
  }
  if (record.state === 'non-occurrence') {
    const action = record.relationType === 'bandh' ? 'Not bindable' : 'Not in uday';
    return `${action}${record.displayPeriod ? ` during ${record.displayPeriod}` : ' at this Gunasthan'}.`;
  }
  if (record.relationType === 'bandh') return 'Bandh stops from this Gunasthan onward.';
  if (record.stageContext?.includes('after Gunasthan 14')) return 'Uday stops upon leaving Gunasthan 14.';
  const stageNumber = Number(record.gunasthanId?.slice(1));
  return `Uday stops from this Gunasthan onward${stageNumber < 14 ? '; descent to a lower Gunasthan may allow it again' : ''}.`;
}

function sourceLinks() {
  return Object.values(karmaData.sources);
}

function ExternalNoteLinks() {
  return (
    <div className="kg-source-links">
      {sourceLinks().map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" aria-label={`View detailed notes here: ${source.label}`}>
          View detailed notes here <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

function RelationBadge({ record }) {
  return (
    <span className="kg-relation-badge">
      {record.sourceTerm}
      {record.subStage ? ` · ${record.subStage}` : ''}
      {record.state === 'unlocked' ? ' · unlocked' : ''}
    </span>
  );
}

function KarmaTreeNode({ node, depth, selectedId, selectedAncestors, expanded, onToggle, onSelect }) {
  const children = childrenById[node.id] || [];
  const selected = selectedId === node.id;
  const indicatorLabel = node.karmicIndicator === 'positive' ? 'perceived as punya' : node.karmicIndicator === 'negative' ? 'perceived as paap' : node.karmicIndicator === 'mixed' ? 'mixed subtypes' : '';
  return (
    <li className="kg-tree-item" role="treeitem" aria-expanded={children.length ? expanded.has(node.id) : undefined} aria-selected={selected}>
      <div className={`kg-tree-row${selected ? ' is-selected' : ''}${selectedAncestors.has(node.id) ? ' is-ancestor' : ''}`} style={{ '--kg-depth': depth }}>
        {children.length ? <button type="button" className="kg-expand" onClick={() => { onToggle(node.id); onSelect(node.id); }} aria-label={`${expanded.has(node.id) ? 'Collapse' : 'Expand'} ${nodeLabel(node)}`} aria-expanded={expanded.has(node.id)}>{expanded.has(node.id) ? '▾' : '▸'}</button> : <span className="kg-expand-spacer" />}
        <button type="button" className={`kg-tree-label${node.karmicIndicator ? ` is-${node.karmicIndicator}` : ''}`} onClick={() => onSelect(node.id)} aria-pressed={selected} aria-label={`${nodeLabel(node)}${indicatorLabel ? `, ${indicatorLabel} marker` : ''}`} title={nodeLabel(node)}>
          <span>{nodeLabel(node)}</span>
          {children.length > 0 && node.countLabel ? <small><span className="kg-node-count">{node.countLabel} subtypes</span></small> : null}
        </button>
      </div>
      {children.length > 0 && expanded.has(node.id) && <ul role="group">{children.map((child) => <KarmaTreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />)}</ul>}
    </li>
  );
}

function KarmaTree({ roots, selectedId, selectedAncestors, expanded, onToggle, onSelect, onCollapseToLevelOne, onExpandAll }) {
  return (
    <section className="kg-canvas-graph" aria-label="Karma hierarchy">
      <div className="kg-canvas-head"><div><span className="kg-kicker">Karma hierarchy</span><h3>Karma View</h3></div><div className="kg-canvas-actions"><button type="button" onClick={onCollapseToLevelOne}>Collapse to level 1</button><button type="button" onClick={onExpandAll}>Full expansion</button></div></div>
      <div className="kg-indicator-legend" aria-label="Color marker legend"><span><i className="is-positive" />Green: perceived as punya</span><span><i className="is-negative" />Red: perceived as paap</span><span><i className="is-mixed" />Grey: mixed subtypes</span></div>
      <ul className="kg-tree" role="tree" aria-label="Karma types and subtypes">
        {roots.map((node) => <KarmaTreeNode key={node.id} node={node} depth={0} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />)}
      </ul>
    </section>
  );
}

function Inspector({ selectedNode, onGoToRelation, onClose, showClose = true }) {
  if (!selectedNode) {
    return (
      <aside className="kg-inspector" aria-label="Karma detail inspector">
        <div className="kg-empty-inspector">{showClose && <button type="button" className="kg-inspector-close" onClick={onClose} aria-label="Close detail panel">×</button>}<span className="kg-kicker">Inspector</span><h3>Select a karma node</h3><p>Choose a node in Karma View or a result in Gunsthan View to see its source-derived details.</p><ExternalNoteLinks /></div>
      </aside>
    );
  }

  const path = [...ancestorsOf(selectedNode.id), selectedNode.id].map((id) => nodeLabel(nodeById[id])).filter(Boolean);
  const records = karmaData.relationships.filter((record) => record.subtypeId === selectedNode.id);
  const grouped = RELATIONS.map((relation) => ({
    ...relation,
    records: records.filter((record) => record.relationType === relation.id),
    coverage: karmaData.coverage.find((item) => item.relationType === relation.id),
  }));
  return (
    <aside className="kg-inspector" aria-label="Karma detail inspector" aria-live="polite">
      <div className="kg-inspector-head">
        {showClose && <button type="button" className="kg-inspector-close" onClick={onClose} aria-label="Close detail panel">×</button>}
        <span className="kg-kicker">Source extracted</span>
        <h3>{nodeLabel(selectedNode)}</h3>
        <p className="kg-path">{path.join(' / ')}</p>
      </div>
      <div className="kg-inspector-body">
        <section><h4>Overview</h4><p>{selectedNode.summary || 'The notes do not provide a separate explanatory summary for this heading.'}</p><a className="kg-topic-link" href={selectedNode.sourceUrl} target="_blank" rel="noreferrer">View detailed notes here <span aria-hidden="true">↗</span></a></section>
        <section>
          <h4>Documented relationships</h4>
          {grouped.map((group) => (
            <div className="kg-relation-group" key={group.id}>
              <h5>{group.label}</h5>
              {group.records.length ? group.records.map((record) => {
                const stage = record.gunasthanId || 'g14';
                const metaLabel = record.state === 'non-occurrence' ? 'Pause Stage' : record.state === 'cessation' ? 'Stop Stage' : 'Available Stage';
                const stageDescription = record.displayPeriod || record.stageContext || stageLabel(stage);
                return <button key={record.id} className="kg-record-row" type="button" onClick={() => onGoToRelation(record)} aria-label={`Open ${group.label} view at ${stageDescription} for ${nodeLabel(selectedNode)}`}>
                  <span className="kg-record-main"><span className="kg-record-meta-label">{metaLabel}</span><strong>{record.sourceTerm}{record.state === 'unlocked' ? ' · unlocked' : ''}</strong></span>
                  <span className="kg-record-stage">{stageDescription}{record.subStage ? ` · ${record.subStage}` : ''}</span>
                  {record.displayNote && <small>{record.displayNote}</small>}
                </button>;
              }) : <p className="kg-muted">{group.coverage?.status === 'not-yet-populated' ? 'Not yet documented in this lab. This is source coverage, not a doctrinal absence.' : 'No separate entry for this relationship is documented here.'}</p>}
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
}

function Matrix({ stage, setStage, category, onSelectCategory, search, familyFilter, onSelectNode }) {
  const coverage = karmaData.coverage.find((item) => item.relationType === category);
  const stageData = karmaData.gunasthans.find((item) => item.id === stage);
  const records = karmaData.relationships.filter((record) => record.relationType === category && (
    record.gunasthanId === stage
    || (record.state === 'non-occurrence' && record.throughGunasthanId && Number(stage.slice(1)) >= Number(record.gunasthanId.slice(1)) && Number(stage.slice(1)) <= Number(record.throughGunasthanId.slice(1)))
  ));
  const afterStageRecords = stage === 'g14' ? karmaData.relationships.filter((record) => record.relationType === category && record.stageContext?.includes('after Gunasthan 14')) : [];
  const annotations = karmaData.annotations.filter((item) => item.displayText && item.gunasthanId === stage && item.relationType === category);
  const needle = search.trim().toLowerCase();
  const filterRecords = (source) => source.filter((record) => {
    const node = record.subtypeId ? nodeById[record.subtypeId] : null;
    const family = familyOf(node);
    const matchesFamily = !familyFilter || family?.id === familyFilter;
    const text = `${nodeLabel(node) || record.sourceLabel} ${node?.aliases?.join(' ') || ''} ${node?.summary || ''} ${record.sourceLabel} ${record.sourceTerm}`.toLowerCase();
    return matchesFamily && (!needle || text.includes(needle));
  });
  const filtered = filterRecords(records);
  const afterFiltered = filterRecords(afterStageRecords);
  const groups = new Map();
  for (const record of filtered) {
    const node = record.subtypeId ? nodeById[record.subtypeId] : null;
    const family = familyOf(node);
    const key = family?.id || '__unmapped';
    if (!groups.has(key)) groups.set(key, { name: nodeLabel(family) || 'Mapping review', records: [] });
    groups.get(key).records.push(record);
  }

  return (
    <section className="kg-matrix" aria-label="Gunsthan View">
      <div className="kg-matrix-controls">
        <label>Relationship category<select value={category} onChange={(event) => onSelectCategory(event.target.value)}>{RELATIONS.map((item) => <option key={item.id} value={item.id}>{item.label}{karmaData.coverage.find((c) => c.relationType === item.id)?.status === 'not-yet-populated' ? ' · not yet populated' : ''}</option>)}</select></label>
      </div>
      <div className="kg-stage-strip" role="group" aria-label="Choose a Gunasthan">
        {karmaData.gunasthans.map((item) => <button key={item.id} type="button" className={stage === item.id ? 'is-active' : ''} aria-pressed={stage === item.id} onClick={() => setStage(item.id)}><strong>{item.number}</strong><span>{item.displayName || item.name.replace(/^\d+\.?\s*/, '')}</span></button>)}
      </div>
      <div className="kg-matrix-heading"><div><span className="kg-kicker">Gunasthan {stageData.number}</span><h3>{stageData.displayName || stageData.name.replace(/\s*\([^)]*\)/, '')}</h3></div></div>
      <div className="kg-legend"><span><b>Vichhed</b> stops from this stage onward</span><span><b>Abandh / Anuday</b> not active for the shown stage or range</span><span><b>Unlocked</b> becomes available here</span></div>
      {annotations.length > 0 && <section className="kg-source-annotations"><h4>Notes</h4>{annotations.map((item) => <p key={item.id}>{item.displayText}</p>)}</section>}
      {coverage.status === 'not-yet-populated' ? (
        <div className="kg-coverage-empty"><span className="kg-status">Not yet documented in this lab</span><p>{coverage.message}</p><p>This is a source coverage gap, not a claim that the relationship is absent.</p></div>
      ) : filtered.length ? (
        <div className="kg-matrix-results">
      {[...groups.entries()].map(([key, group]) => <section className="kg-family-group" key={key}><h4>{group.name}</h4>{group.records.map((record) => <article className="kg-result-item" key={record.id}><button type="button" className="kg-result-card" onClick={() => onSelectNode(record.subtypeId)}><span className="kg-result-name">{nodeLabel(nodeById[record.subtypeId])}</span><RelationBadge record={record} /><span className="kg-result-copy">{relationshipDescription(record)}</span>{record.displayNote && <small>{record.displayNote}</small>}{record.displayPeriod && <small>{record.displayPeriod}</small>}</button><a className="kg-record-link" href={record.sourceUrl} target="_blank" rel="noreferrer">View detailed notes here ↗</a></article>)}</section>)}
        </div>
      ) : <p className="kg-empty-results">No {category} records for this Gunasthan match the current search and family filters.</p>}
      {afterFiltered.length > 0 && <section className="kg-after-stage"><h3>After leaving Gunasthan 14</h3><p>These uday events stop only after the soul leaves Gunasthan 14. Sata or Asata remains through Gunasthan 14; whichever is present stops afterward.</p>{afterFiltered.map((record) => <article className="kg-result-item" key={record.id}><button type="button" className="kg-result-card" onClick={() => onSelectNode(record.subtypeId)}><span className="kg-result-name">{nodeLabel(nodeById[record.subtypeId])}</span><RelationBadge record={record} /><span className="kg-result-copy">{relationshipDescription(record)}</span>{record.displayNote && <small>{record.displayNote}</small>}</button><a className="kg-record-link" href={record.sourceUrl} target="_blank" rel="noreferrer">View detailed notes here ↗</a></article>)}</section>}
    </section>
  );
}

export default function KarmaGranthLab() {
  const [view, setView] = useState('karma');
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState('');
  const [category, setCategory] = useState('bandh');
  const [stage, setStage] = useState('g1');
  const [selectedId, setSelectedId] = useState('');
  const [expanded, setExpanded] = useState(() => new Set());

  const roots = karmaData.nodes.filter((node) => !node.parentId);
  const families = roots;
  const selectedNode = nodeById[selectedId];
  const selectedAncestors = useMemo(() => new Set(ancestorsOf(selectedId)), [selectedId]);
  const query = search.trim().toLowerCase();
  const searchResults = useMemo(() => query ? karmaData.nodes.filter((node) => {
    const relationTerms = karmaData.relationships.filter((record) => record.subtypeId === node.id).map((record) => `${record.sourceTerm} ${record.sourceLabel} ${record.sourceExcerpt}`).join(' ');
    return `${nodeLabel(node)} ${node.name} ${node.aliases.join(' ')} ${node.summary} ${relationTerms}`.toLowerCase().includes(query);
  }).slice(0, 12) : [], [query]);

  useEffect(() => {
    if (!selectedId) return;
    setExpanded((current) => new Set([...current, ...ancestorsOf(selectedId)]));
  }, [selectedId]);

  function selectNode(id) {
    setSelectedId(id);
  }

  function goToRelation(record) {
    setCategory(record.relationType);
    setStage(record.gunasthanId || 'g14');
    setView('gunasthan');
  }

  function toggleNode(id) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function reset() {
    setSearch('');
    setFamilyFilter('');
    setCategory('bandh');
    setStage('g1');
    setView('karma');
    setSelectedId('');
    setExpanded(new Set());
  }

  function expandAll() {
    setExpanded(new Set(karmaData.nodes.filter((node) => childrenById[node.id]?.length).map((node) => node.id)));
  }

  function closeInspector() {
    setSelectedId('');
  }

  return (
    <LabEmbedded title="Karma Granth explorer">
      <div className="kg-lab">
        <header className="kg-toolbar">
          <div className="kg-toolbar-top"><label className="kg-search">Search names, aliases, note keywords, or relationship terms<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try ‘Aharaka’, ‘Vichhed’, ‘body’…" /></label><label className="kg-family-filter">Karma family<select value={familyFilter} onChange={(event) => setFamilyFilter(event.target.value)}><option value="">All families</option>{families.map((family) => <option key={family.id} value={family.id}>{nodeLabel(family)}</option>)}</select></label><button type="button" className="kg-reset" onClick={reset}>Reset view</button></div>
          {searchResults.length > 0 && <div className="kg-search-results" role="list" aria-label="Search results"><span>Search results · {searchResults.length}{searchResults.length === 12 ? '+' : ''}</span>{searchResults.map((node) => <button key={node.id} type="button" role="listitem" onClick={() => { selectNode(node.id); setView('karma'); }}>{nodeLabel(node)}<small>{nodeLabel(familyOf(node))}</small></button>)}</div>}
          {query && searchResults.length === 0 && <p className="kg-search-none">No hierarchy entries match “{search}”.</p>}
          <nav className="kg-view-switch" aria-label="Karma lab views"><button type="button" aria-pressed={view === 'karma'} className={view === 'karma' ? 'is-active' : ''} onClick={() => setView('karma')}>Karma View</button><button type="button" aria-pressed={view === 'gunasthan'} className={view === 'gunasthan' ? 'is-active' : ''} onClick={() => setView('gunasthan')}>Gunsthan View</button></nav>
        </header>

        <div className={`kg-workspace${view === 'karma' || selectedNode ? ' has-inspector' : ''}`}>
          <main className="kg-main-view">
            {view === 'karma' ? <KarmaTree roots={roots.filter((node) => !familyFilter || node.id === familyFilter)} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={toggleNode} onSelect={selectNode} onCollapseToLevelOne={() => setExpanded(new Set())} onExpandAll={expandAll} /> : <Matrix stage={stage} setStage={setStage} category={category} onSelectCategory={setCategory} search={search} familyFilter={familyFilter} onSelectNode={selectNode} />}
          </main>
          {(view === 'karma' || selectedNode) && <Inspector selectedNode={selectedNode} onGoToRelation={goToRelation} onClose={closeInspector} showClose={view !== 'karma'} />}
        </div>
        <footer className="kg-footnote"><span>Bandh and Uday details are transcribed from the linked notes.</span><span>Udirna and Satta are not yet documented in this lab.</span><span>Source-derived; not doctrinally verified.</span></footer>
      </div>
    </LabEmbedded>
  );
}
