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
        <button type="button" className={`kg-tree-label${node.karmicIndicator ? ` is-${node.karmicIndicator}` : ''}`} onClick={() => onSelect(node.id)} aria-pressed={selected} aria-label={`${nodeLabel(node)}${indicatorLabel ? `, ${indicatorLabel} marker` : ''}`} title={node.name}>
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

function Inspector({ selectedNode, selectedRecord, onSelectRelation, onClose, showClose = true }) {
  if (!selectedNode) {
    return (
      <aside className="kg-inspector" aria-label="Karma detail inspector">
        <div className="kg-empty-inspector">{showClose && <button type="button" className="kg-inspector-close" onClick={onClose} aria-label="Close detail panel">×</button>}<span className="kg-kicker">Inspector</span>{selectedRecord ? <><h3>{selectedRecord.sourceLabel}</h3><p><RelationBadge record={selectedRecord} /> · {selectedRecord.stageContext || `Gunasthan ${selectedRecord.gunasthanId?.slice(1) || 'unspecified'}`}</p><p>{selectedRecord.statement}</p><p className="kg-needs-review">This reference has no confident subtype mapping yet.</p><p>{selectedRecord.sourceHeading}</p></> : <><h3>Select a karma node</h3><p>Choose a node in Karma View or a result in Gunsthan View to see its source-derived details.</p></>}<ExternalNoteLinks /></div>
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
        {selectedRecord && <section className="kg-current-record"><h4>Selected relationship</h4><RelationBadge record={selectedRecord} /><p>{selectedRecord.statement}</p>{selectedRecord.sourceExcerpt && <p className="kg-source-excerpt">Source wording: {selectedRecord.sourceExcerpt}</p>}{selectedRecord.qualification && <p className="kg-muted">Source count/qualification: {selectedRecord.qualification}</p>}<small>{selectedRecord.sourceHeading} · {selectedRecord.verification}</small><a className="kg-topic-link" href={selectedRecord.sourceUrl} target="_blank" rel="noreferrer">View detailed notes here <span aria-hidden="true">↗</span></a></section>}
        <section>
          <h4>Documented relationships</h4>
          {grouped.map((group) => (
            <div className="kg-relation-group" key={group.id}>
              <h5>{group.label} <span>{group.records.length}</span></h5>
              {group.records.length ? group.records.map((record) => (
                <button key={record.id} className={`kg-record-row${selectedRecord?.id === record.id ? ' is-active' : ''}`} type="button" onClick={() => onSelectRelation(record)}>
                  <RelationBadge record={record} />
                  <span>{record.stageContext || `Gun. ${record.gunasthanId?.slice(1) || '—'}`}{record.subStage ? ` · ${record.subStage}` : ''}</span>
                  <small>{record.sourceHeading}</small>
                </button>
              )) : <p className="kg-muted">{group.coverage?.status === 'not-yet-populated' ? 'Not yet populated in this lab. This is source coverage, not a doctrinal absence.' : 'No mapped subtype records in the current transcription.'}</p>}
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
}

function Matrix({ stage, setStage, category, onSelectCategory, search, familyFilter, onSelectNode, onSelectRecord }) {
  const coverage = karmaData.coverage.find((item) => item.relationType === category);
  const stageData = karmaData.gunasthans.find((item) => item.id === stage);
  const records = karmaData.relationships.filter((record) => (record.gunasthanId === stage || (stage === 'g14' && record.stageContext)) && record.relationType === category);
  const annotations = karmaData.annotations.filter((item) => (item.gunasthanId === stage || (stage === 'g14' && item.stageContext)) && item.relationType === category);
  const needle = search.trim().toLowerCase();
  const filtered = records.filter((record) => {
    const node = record.subtypeId ? nodeById[record.subtypeId] : null;
    const family = familyOf(node);
    const matchesFamily = !familyFilter || family?.id === familyFilter;
    const text = `${nodeLabel(node) || record.sourceLabel} ${node?.aliases?.join(' ') || ''} ${node?.summary || ''} ${record.sourceLabel} ${record.sourceTerm}`.toLowerCase();
    return matchesFamily && (!needle || text.includes(needle));
  });
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
        {karmaData.gunasthans.map((item) => <button key={item.id} type="button" className={stage === item.id ? 'is-active' : ''} aria-pressed={stage === item.id} onClick={() => setStage(item.id)}><strong>{item.number}</strong><span>{item.name.replace(/^\d+\.?\s*/, '')}</span></button>)}
      </div>
      <div className="kg-matrix-heading"><div><span className="kg-kicker">Gunasthan {stageData.number}</span><h3>{stageData.name}</h3></div><span className="kg-count">{filtered.length} source entries</span></div>
      <div className="kg-legend"><span><b>Vichhed</b> source term for cessation</span><span><b>Abandh / Anuday</b> source terms kept distinct</span><span><b>Mapping review</b> source reference not confidently mapped</span></div>
      {annotations.length > 0 && <section className="kg-source-annotations"><h4>Notes carry-forward wording</h4>{annotations.map((item) => <p key={item.id}><RelationBadge record={item} /> <span>{item.stageContext || stageData.name}</span><br />{item.text}</p>)}</section>}
      {coverage.status === 'not-yet-populated' ? (
        <div className="kg-coverage-empty"><span className="kg-status">Not yet populated in lab</span><p>{coverage.message}</p><p>Empty lab coverage does not mean doctrinal absence. No relationship entries are inferred here.</p></div>
      ) : filtered.length ? (
        <div className="kg-matrix-results">
      {[...groups.entries()].map(([key, group]) => <section className="kg-family-group" key={key}><h4>{group.name}</h4>{group.records.map((record) => <button key={record.id} type="button" className="kg-result-card" onClick={() => { if (record.subtypeId) onSelectNode(record.subtypeId); else onSelectNode(''); onSelectRecord(record); }}><span className="kg-result-name">{record.subtypeId ? nodeLabel(nodeById[record.subtypeId]) : record.sourceLabel}</span><RelationBadge record={record} /><span className="kg-result-copy">{record.statement}</span>{record.sourceExcerpt && <small>Source wording: {record.sourceExcerpt}</small>}{record.stageContext && <small>{record.stageContext}</small>}{record.qualification && <small>{record.qualification}</small>}<small className="kg-record-source">Source note: {record.sourceHeading}</small>{!record.subtypeId && <small className="kg-needs-review">Needs subtype mapping review</small>}</button>)}</section>)}
        </div>
      ) : <p className="kg-empty-results">No {category} records for this Gunasthan match the current search and family filters.</p>}
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
  const [selectedRecord, setSelectedRecord] = useState(null);
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
    setSelectedRecord(null);
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
    setSelectedRecord(null);
    setSelectedId('');
    setExpanded(new Set());
  }

  function expandAll() {
    setExpanded(new Set(karmaData.nodes.filter((node) => childrenById[node.id]?.length).map((node) => node.id)));
  }

  function closeInspector() {
    setSelectedId('');
    setSelectedRecord(null);
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

        <div className={`kg-workspace${view === 'karma' || selectedNode || selectedRecord ? ' has-inspector' : ''}`}>
          <main className="kg-main-view">
            {view === 'karma' ? <KarmaTree roots={roots.filter((node) => !familyFilter || node.id === familyFilter)} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={toggleNode} onSelect={selectNode} onCollapseToLevelOne={() => setExpanded(new Set())} onExpandAll={expandAll} /> : <Matrix stage={stage} setStage={setStage} category={category} onSelectCategory={setCategory} search={search} familyFilter={familyFilter} onSelectNode={selectNode} onSelectRecord={setSelectedRecord} />}
          </main>
          {(view === 'karma' || selectedNode || selectedRecord) && <Inspector selectedNode={selectedNode} selectedRecord={selectedRecord} onSelectRelation={setSelectedRecord} onClose={closeInspector} showClose={view !== 'karma'} />}
        </div>
        <footer className="kg-footnote"><span>{karmaData.nodes.length} hierarchy entries</span><span>{karmaData.relationships.length} documented relationships · {karmaData.unresolvedReferences.length} mapping reviews</span><span>Source-extracted; not doctrinally verified</span></footer>
      </div>
    </LabEmbedded>
  );
}
