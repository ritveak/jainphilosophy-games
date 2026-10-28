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

function sourceLinks() {
  return Object.values(karmaData.sources);
}

function ExternalNoteLinks() {
  return (
    <div className="kg-source-links">
      {sourceLinks().map((source) => (
        <a key={source.label} href={source.url} target="_blank" rel="noreferrer">
          {source.label} <span aria-hidden="true">↗</span>
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

function TreeNode({ node, depth, selectedId, selectedAncestors, expanded, onToggle, onSelect, category }) {
  const children = childrenById[node.id] || [];
  const nodeRelations = karmaData.relationships.filter((record) => record.subtypeId === node.id && (!category || record.relationType === category));
  const selected = selectedId === node.id;
  return (
    <li className="kg-tree-item" role="treeitem" aria-expanded={children.length ? expanded.has(node.id) : undefined} aria-selected={selected}>
      <div className={`kg-tree-row${selected ? ' is-selected' : ''}${selectedAncestors.has(node.id) ? ' is-ancestor' : ''}`} style={{ '--kg-depth': depth }}>
        {children.length ? (
          <button className="kg-expand" type="button" onClick={() => onToggle(node.id)} aria-label={`${expanded.has(node.id) ? 'Collapse' : 'Expand'} ${node.name}`}>
            {expanded.has(node.id) ? '▾' : '▸'}
          </button>
        ) : <span className="kg-expand-spacer" />}
        <button type="button" className="kg-tree-label" onClick={() => onSelect(node.id)}>
          <span>{node.name}</span>
          <small>{node.kind}{nodeRelations.length ? ` · ${nodeRelations.length} KG-2` : ''}</small>
        </button>
      </div>
      {children.length > 0 && expanded.has(node.id) && (
        <ul role="group">
          {children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={onToggle} onSelect={onSelect} category={category} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Inspector({ selectedNode, selectedRecord, onSelectRelation }) {
  if (!selectedNode) {
    return (
      <aside className="kg-inspector" aria-label="Karma detail inspector">
        <div className="kg-empty-inspector"><span className="kg-kicker">Inspector</span>{selectedRecord ? <><h3>{selectedRecord.sourceLabel}</h3><p><RelationBadge record={selectedRecord} /> · {selectedRecord.stageContext || `Gunasthan ${selectedRecord.gunasthanId?.slice(1) || 'unspecified'}`}</p><p>{selectedRecord.statement}</p><p className="kg-needs-review">This KG-2 reference has no confident subtype mapping yet.</p><p>{selectedRecord.sourceHeading}</p></> : <><h3>Select a karma node</h3><p>Choose a node in the Canvas or a result in the Gunasthan Matrix to see its source-derived details.</p></>}<ExternalNoteLinks /></div>
      </aside>
    );
  }

  const path = [...ancestorsOf(selectedNode.id), selectedNode.id].map((id) => nodeById[id]?.name).filter(Boolean);
  const records = karmaData.relationships.filter((record) => record.subtypeId === selectedNode.id);
  const grouped = RELATIONS.map((relation) => ({
    ...relation,
    records: records.filter((record) => record.relationType === relation.id),
    coverage: karmaData.coverage.find((item) => item.relationType === relation.id),
  }));
  const children = childrenById[selectedNode.id] || [];

  return (
    <aside className="kg-inspector" aria-label="Karma detail inspector" aria-live="polite">
      <div className="kg-inspector-head">
        <span className="kg-kicker">{selectedNode.kind} · source extracted</span>
        <h3>{selectedNode.name}</h3>
        <p className="kg-path">{path.join(' / ')}</p>
      </div>
      <div className="kg-inspector-body">
        {selectedNode.summary && <section><h4>KG-1 note</h4><p>{selectedNode.summary}</p></section>}
        <section><h4>Hierarchy</h4><p>{children.length ? `${children.length} directly nested entries in this source map.` : 'No numbered child headings in KG-1.'}</p></section>
        {selectedRecord && <section className="kg-current-record"><h4>Selected KG-2 record</h4><RelationBadge record={selectedRecord} /><p>{selectedRecord.statement}</p>{selectedRecord.sourceExcerpt && <p className="kg-source-excerpt">Source wording: {selectedRecord.sourceExcerpt}</p>}{selectedRecord.qualification && <p className="kg-muted">Source count/qualification: {selectedRecord.qualification}</p>}<small>{selectedRecord.sourceHeading} · {selectedRecord.verification}</small></section>}
        <section>
          <h4>KG-2 relationships</h4>
          {grouped.map((group) => (
            <div className="kg-relation-group" key={group.id}>
              <h5>{group.label} <span>{group.records.length}</span></h5>
              {group.records.length ? group.records.map((record) => (
                <button key={record.id} className={`kg-record-row${selectedRecord?.id === record.id ? ' is-active' : ''}`} type="button" onClick={() => onSelectRelation(record)}>
                  <RelationBadge record={record} />
                  <span>{record.stageContext || `Gun. ${record.gunasthanId?.slice(1) || '—'}`}{record.subStage ? ` · ${record.subStage}` : ''}</span>
                  <small>{record.sourceHeading}</small>
                </button>
              )) : <p className="kg-muted">{group.coverage?.status === 'not-yet-populated' ? 'Not yet populated in this lab. This is source coverage, not a doctrinal absence.' : 'No mapped subtype records in the current KG-2 transcription.'}</p>}
            </div>
          ))}
        </section>
        <section><h4>Source and transcription</h4><p><span className="kg-status">{selectedNode.verification}</span> This indicates transcription provenance, not doctrinal verification.</p><ExternalNoteLinks /></section>
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
    const text = `${node?.name || record.sourceLabel} ${node?.summary || ''} ${record.sourceLabel} ${record.sourceTerm}`.toLowerCase();
    return matchesFamily && (!needle || text.includes(needle));
  });
  const groups = new Map();
  for (const record of filtered) {
    const node = record.subtypeId ? nodeById[record.subtypeId] : null;
    const family = familyOf(node);
    const key = family?.id || '__unmapped';
    if (!groups.has(key)) groups.set(key, { name: family?.name || 'Mapping review', records: [] });
    groups.get(key).records.push(record);
  }

  return (
    <section className="kg-matrix" aria-label="Gunasthan Matrix">
      <div className="kg-matrix-controls">
        <label>Relationship category<select value={category} onChange={(event) => onSelectCategory(event.target.value)}>{RELATIONS.map((item) => <option key={item.id} value={item.id}>{item.label}{karmaData.coverage.find((c) => c.relationType === item.id)?.status === 'not-yet-populated' ? ' · not yet populated' : ''}</option>)}</select></label>
      </div>
      <div className="kg-stage-strip" role="group" aria-label="Choose a Gunasthan">
        {karmaData.gunasthans.map((item) => <button key={item.id} type="button" className={stage === item.id ? 'is-active' : ''} aria-pressed={stage === item.id} onClick={() => setStage(item.id)}><strong>{item.number}</strong><span>{item.name.replace(/^\d+\.?\s*/, '')}</span></button>)}
      </div>
      <div className="kg-matrix-heading"><div><span className="kg-kicker">Gunasthan {stageData.number}</span><h3>{stageData.name}</h3></div><span className="kg-count">{filtered.length} source entries</span></div>
      <div className="kg-legend"><span><b>Vichhed</b> source term for cessation</span><span><b>Abandh / Anuday</b> source terms kept distinct</span><span><b>Mapping review</b> source reference not confidently mapped</span></div>
      {annotations.length > 0 && <section className="kg-source-annotations"><h4>KG-2 carry-forward wording</h4>{annotations.map((item) => <p key={item.id}><RelationBadge record={item} /> <span>{item.stageContext || stageData.name}</span><br />{item.text}</p>)}</section>}
      {coverage.status === 'not-yet-populated' ? (
        <div className="kg-coverage-empty"><span className="kg-status">Not yet populated in lab</span><p>{coverage.message}</p><p>Empty lab coverage does not mean doctrinal absence. No relationship entries are inferred here.</p></div>
      ) : filtered.length ? (
        <div className="kg-matrix-results">
      {[...groups.entries()].map(([key, group]) => <section className="kg-family-group" key={key}><h4>{group.name}</h4>{group.records.map((record) => <button key={record.id} type="button" className="kg-result-card" onClick={() => { if (record.subtypeId) onSelectNode(record.subtypeId); else onSelectNode(''); onSelectRecord(record); }}><span className="kg-result-name">{record.subtypeId ? nodeById[record.subtypeId].name : record.sourceLabel}</span><RelationBadge record={record} /><span className="kg-result-copy">{record.statement}</span>{record.sourceExcerpt && <small>Source wording: {record.sourceExcerpt}</small>}{record.stageContext && <small>{record.stageContext}</small>}{record.qualification && <small>{record.qualification}</small>}{!record.subtypeId && <small className="kg-needs-review">Needs subtype mapping review</small>}</button>)}</section>)}
        </div>
      ) : <p className="kg-empty-results">No {category} records for this Gunasthan match the current search and family filters.</p>}
    </section>
  );
}

export default function KarmaGranthLab() {
  const [view, setView] = useState('canvas');
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState('');
  const [category, setCategory] = useState('bandh');
  const [stage, setStage] = useState('g1');
  const [selectedId, setSelectedId] = useState(() => karmaData.nodes.find((node) => !node.parentId)?.id || '');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set(karmaData.nodes.filter((node) => !node.parentId).map((node) => node.id)));

  const roots = karmaData.nodes.filter((node) => !node.parentId);
  const families = roots;
  const selectedNode = nodeById[selectedId];
  const selectedAncestors = useMemo(() => new Set(ancestorsOf(selectedId)), [selectedId]);
  const query = search.trim().toLowerCase();
  const searchResults = useMemo(() => query ? karmaData.nodes.filter((node) => {
    const relationTerms = karmaData.relationships.filter((record) => record.subtypeId === node.id).map((record) => `${record.sourceTerm} ${record.sourceLabel} ${record.sourceExcerpt}`).join(' ');
    return `${node.name} ${node.aliases.join(' ')} ${node.summary} ${relationTerms}`.toLowerCase().includes(query);
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
    setView('canvas');
    setSelectedRecord(null);
    setExpanded(new Set(roots.map((node) => node.id)));
  }

  return (
    <LabEmbedded title="Karma Granth explorer">
      <div className="kg-lab">
        <header className="kg-toolbar">
          <div className="kg-toolbar-top"><label className="kg-search">Search names, aliases, note keywords, or KG-2 terms<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try ‘Aharaka’, ‘Vichhed’, ‘body’…" /></label><label className="kg-family-filter">Karma family<select value={familyFilter} onChange={(event) => setFamilyFilter(event.target.value)}><option value="">All families</option>{families.map((family) => <option key={family.id} value={family.id}>{family.name.replace(/^\d+\.?\s*/, '')}</option>)}</select></label><button type="button" className="kg-reset" onClick={reset}>Reset view</button></div>
          {searchResults.length > 0 && <div className="kg-search-results" role="list" aria-label="Search results"><span>Search results · {searchResults.length}{searchResults.length === 12 ? '+' : ''}</span>{searchResults.map((node) => <button key={node.id} type="button" role="listitem" onClick={() => { selectNode(node.id); setView('canvas'); }}>{node.name}<small>{familyOf(node)?.name}</small></button>)}</div>}
          {query && searchResults.length === 0 && <p className="kg-search-none">No hierarchy entries match “{search}”.</p>}
          <nav className="kg-view-switch" aria-label="Karma lab views"><button type="button" aria-pressed={view === 'canvas'} className={view === 'canvas' ? 'is-active' : ''} onClick={() => setView('canvas')}>Canvas</button><button type="button" aria-pressed={view === 'matrix'} className={view === 'matrix' ? 'is-active' : ''} onClick={() => setView('matrix')}>Gunasthan Matrix</button></nav>
        </header>

        <div className="kg-workspace">
          <main className="kg-main-view">
            {view === 'canvas' ? <section className="kg-canvas" aria-label="Karma hierarchy canvas">
              <div className="kg-canvas-head"><div><span className="kg-kicker">KG-1 hierarchy</span><h3>Numbered source outline</h3></div><div className="kg-canvas-actions"><button type="button" onClick={() => setExpanded(new Set(roots.map((node) => node.id)))}>Collapse branches</button><button type="button" onClick={() => setExpanded(new Set(karmaData.nodes.filter((node) => childrenById[node.id]?.length).map((node) => node.id)))}>Expand all</button></div></div>
              <p className="kg-canvas-note">Select a label for details. Search results can reveal entries inside collapsed branches.</p>
              <ul className="kg-tree" role="tree" aria-label="Karma types and subtypes">{roots.filter((node) => !familyFilter || node.id === familyFilter).map((node) => <TreeNode key={node.id} node={node} depth={0} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={toggleNode} onSelect={selectNode} category={category} />)}</ul>
              <div className="kg-count-note"><strong>Source count conventions</strong><p>KG-1 records 158 with 103 Naam Karma subtypes, 148 when that is compressed to 93, and separate 120/122 Bandh/Uday counts. These are retained as distinct source conventions.</p><ExternalNoteLinks /></div>
            </section> : <Matrix stage={stage} setStage={setStage} category={category} onSelectCategory={setCategory} search={search} familyFilter={familyFilter} onSelectNode={selectNode} onSelectRecord={setSelectedRecord} />}
          </main>
          <Inspector selectedNode={selectedNode} selectedRecord={selectedRecord} onSelectRelation={setSelectedRecord} />
        </div>
        <footer className="kg-footnote"><span>{karmaData.nodes.length} numbered KG-1 headings</span><span>{karmaData.relationships.length} explicit KG-2 references · {karmaData.unresolvedReferences.length} mapping review</span><span>Source-extracted; not doctrinally verified</span></footer>
      </div>
    </LabEmbedded>
  );
}
