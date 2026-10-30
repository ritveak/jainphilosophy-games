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

function relationshipsForSubtype(subtypeId) {
  const direct = karmaData.relationships.filter((record) => record.subtypeId === subtypeId);
  const inherited = (karmaData.relationshipDependencies || [])
    .filter((dependency) => dependency.subtypeId === subtypeId)
    .flatMap((dependency) => karmaData.relationships
      .filter((record) => record.subtypeId === dependency.derivedFromSubtypeId && dependency.relationTypes.includes(record.relationType))
      .map((record) => {
        const sourceNode = nodeById[dependency.derivedFromSubtypeId];
        return {
          ...record,
          id: `${record.id}--${dependency.id}`,
          subtypeId,
          derivedFromSubtypeId: dependency.derivedFromSubtypeId,
          derivation: dependency.derivation,
          verification: dependency.verification,
          displayNote: `The notes group this ${nodeLabel(nodeById[subtypeId])} subtype with ${nodeLabel(sourceNode)} for row-count logic; this stage mapping follows the corresponding ${nodeLabel(sourceNode)} entry.`
        };
      }));
  return [...direct, ...inherited];
}

function nodeLabel(node) {
  return node?.displayName || node?.name || '';
}

function stageLabel(id) {
  const stage = karmaData.gunasthans.find((item) => item.id === id);
  const terminal = (karmaData.terminalStages || []).find((item) => item.id === id);
  return stage ? `Gunasthan ${stage.number} · ${stage.displayName || stage.name}` : terminal ? `${terminal.displayName} · ${terminal.sourceContext}` : 'Unknown stage';
}

function stageNoteUrl(relationType, stageId) {
  const anchor = karmaData.sources.kg2.stageAnchors?.[relationType]?.[stageId];
  return anchor ? `${karmaData.sources.kg2.url}#${anchor}` : `${karmaData.sources.kg2.url}#${karmaData.sources.kg2.sectionAnchors[relationType]}`;
}

function stageOrder(id) {
  const stage = karmaData.gunasthans.find((item) => item.id === id);
  if (stage) return stage.number;
  return (karmaData.terminalStages || []).find((item) => item.id === id)?.order ?? null;
}

function recordStageOrder(record) {
  if (record.gunasthanId) return stageOrder(record.gunasthanId);
  if (record.stageContext?.toLowerCase().includes('after gunasthan 14')) {
    return (karmaData.terminalStages || []).find((item) => item.sourceContext === 'After Gunasthan 14')?.order ?? null;
  }
  return null;
}

function subStageRange(value) {
  const match = value?.match(/Stage\s+(\d+)(?:\s+to\s+(\d+))?/i);
  return match ? [Number(match[1]), Number(match[2] || match[1])] : null;
}

function selectedSubStageRange(stageId, subStage) {
  const stage = karmaData.gunasthans.find((item) => item.id === stageId);
  if (!stage?.subStages?.length) return [1, Number.POSITIVE_INFINITY];
  if (subStage === 'all') {
    const ranges = stage.subStages.map(subStageRange).filter(Boolean);
    return [1, Math.max(...ranges.map((range) => range[1]))];
  }
  return subStageRange(subStage) || [1, Number.POSITIVE_INFINITY];
}

function relationshipAppliesAt(record, relationType, stageId, subStage) {
  if (record.relationType !== relationType) return false;
  const currentStage = stageOrder(stageId);
  const recordStage = recordStageOrder(record);
  if (currentStage == null || recordStage == null) return false;
  const [selectedStart, selectedEnd] = selectedSubStageRange(stageId, subStage);
  if (record.state === 'cessation') {
    if (recordStage < currentStage) return true;
    if (recordStage > currentStage) return false;
    const eventRange = subStageRange(record.subStage);
    return !eventRange || selectedEnd >= eventRange[0];
  }
  if (record.state !== 'non-occurrence') return false;
  const throughStage = Number(record.throughGunasthanId?.slice(1) || recordStage);
  if (currentStage < recordStage || currentStage > throughStage) return false;
  if (recordStage !== currentStage) return true;
  const eventRange = subStageRange(record.subStage);
  if (!eventRange) return true;
  return selectedStart <= eventRange[1] && selectedEnd >= eventRange[0];
}

function isActiveForFilter(nodeId, relationType, stageId, subStage) {
  const countRule = karmaData.relationshipCounting?.[relationType];
  if (countRule?.notApplicableNodeIds?.includes(nodeId)) return false;
  const records = relationshipsForSubtype(nodeId);
  return !records.some((record) => relationshipAppliesAt(record, relationType, stageId, subStage));
}

function countSummaryForFilter(filter) {
  if (!filter) return null;
  const stage = karmaData.gunasthans.find((item) => item.id === filter.gunasthanId);
  const subStage = filter.subStage === 'all' && stage?.subStages?.length
    ? stage.subStages.at(-1)
    : filter.subStage || 'all';
  const row = (karmaData.sourceCountRows || []).find((item) => item.relationType === filter.relationType && item.stageId === filter.gunasthanId && item.subStage === subStage);
  return row ? { ...row, sum: row.active + row.paused + row.stopped } : null;
}

function collectFilteredNodeIds(roots, filter) {
  if (!filter) return new Set(karmaData.nodes.map((node) => node.id));
  const visible = new Set();
  const countRule = karmaData.relationshipCounting?.[filter.relationType] || {};
  const excludedNodeIds = new Set(countRule.excludedNodeIds || []);
  const aggregateNodeIds = new Set(countRule.aggregateNodeIds || []);
  function visit(node) {
    if (excludedNodeIds.has(node.id)) return false;
    if (!isActiveForFilter(node.id, filter.relationType, filter.gunasthanId, filter.subStage)) return false;
    const children = childrenById[node.id] || [];
    const visibleChildren = children.map(visit).some(Boolean);
    const keep = children.length ? visibleChildren || aggregateNodeIds.has(node.id) : node.kind !== 'type';
    if (keep) visible.add(node.id);
    return keep;
  }
  roots.forEach(visit);
  return visible;
}

function collectCountableNodeIds(roots, relationType) {
  const countRule = karmaData.relationshipCounting?.[relationType] || {};
  const excludedNodeIds = new Set(countRule.excludedNodeIds || []);
  const aggregateNodeIds = new Set(countRule.aggregateNodeIds || []);
  const countable = new Set();
  function visit(node) {
    if (excludedNodeIds.has(node.id)) return false;
    const children = childrenById[node.id] || [];
    const hasCountableChildren = children.map(visit).some(Boolean);
    const keep = children.length ? hasCountableChildren || aggregateNodeIds.has(node.id) : node.kind !== 'type';
    if (keep) countable.add(node.id);
    return keep;
  }
  roots.forEach(visit);
  return countable;
}

function collectStateNodeIds(roots, filter, state) {
  if (!filter || state === 'active') return collectFilteredNodeIds(roots, filter);
  const targetState = state === 'paused' ? 'non-occurrence' : 'cessation';
  const selected = new Set();
  const countRule = karmaData.relationshipCounting?.[filter.relationType] || {};
  const notApplicableNodeIds = countRule.notApplicableNodeIds || [];
  const excludedNodeIds = new Set(countRule.excludedNodeIds || []);
  karmaData.nodes.filter((node) => node.kind !== 'type').forEach((node) => {
    if (notApplicableNodeIds.includes(node.id) || excludedNodeIds.has(node.id)) return;
    const matches = relationshipsForSubtype(node.id).some((record) => (state === 'total' || !record.derivation)
      && (state === 'total' ? ['non-occurrence', 'cessation'].includes(record.state) : record.state === targetState)
      && relationshipAppliesAt(record, filter.relationType, filter.gunasthanId, filter.subStage));
    if (matches) {
      selected.add(node.id);
      ancestorsOf(node.id).forEach((ancestorId) => selected.add(ancestorId));
    }
  });
  if (state === 'stopped') {
    (countRule.mutuallyExclusiveActiveGroups || [])
      .filter((group) => group.stageId === filter.gunasthanId && group.aggregateNodeId)
      .forEach((group) => selected.add(group.aggregateNodeId));
  }
  if (state === 'total') {
    collectFilteredNodeIds(roots, filter).forEach((id) => selected.add(id));
  }
  return selected;
}

function familyScopedCountSummary(roots, filter, familyId, summary) {
  if (!summary || !familyId) return summary;
  const countRule = karmaData.relationshipCounting?.[filter.relationType];
  const family = nodeById[familyId];
  const active = visibleSubtypeCount(family, collectFilteredNodeIds(roots, filter), countRule, filter.gunasthanId, 'active');
  const paused = visibleSubtypeCount(family, collectStateNodeIds(roots, filter, 'paused'), countRule, filter.gunasthanId, 'paused');
  const stopped = visibleSubtypeCount(family, collectStateNodeIds(roots, filter, 'stopped'), countRule, filter.gunasthanId, 'stopped');
  const sum = active + paused + stopped;
  return {
    ...summary,
    active,
    paused,
    stopped,
    sum,
    sourceCount: sum,
    familyLabel: nodeLabel(nodeById[familyId]),
    familyScoped: true,
    sourceNote: null,
    reviewNote: null,
  };
}

function visibleSubtypeCount(node, visibleNodeIds, countRule = null, stageId = null, state = 'active') {
  function countLeaves(current) {
    const children = (childrenById[current.id] || []).filter((child) => visibleNodeIds.has(child.id));
    if (!children.length) return current.kind === 'type' ? 0 : 1;
    return children.reduce((total, child) => total + countLeaves(child), 0);
  }
  let count = (childrenById[node.id] || [])
    .filter((child) => visibleNodeIds.has(child.id))
    .reduce((total, child) => total + countLeaves(child), 0);
  for (const group of countRule?.mutuallyExclusiveActiveGroups || []) {
    if (group.stageId !== stageId) continue;
    const inSubtree = (id) => id === node.id || ancestorsOf(id).includes(node.id);
    const groupUnits = group.nodeIds.filter(inSubtree);
    if (state === 'active') {
      const visibleAlternatives = groupUnits.filter((id) => visibleNodeIds.has(id)).length;
      count -= Math.max(0, visibleAlternatives - 1);
    } else if (state === 'stopped' && groupUnits.length > 1) {
      // The aggregate row represents the alternative that is not in uday.
      if (group.aggregateNodeId === node.id && visibleNodeIds.has(node.id)) count += 1;
      else if (!group.aggregateNodeId) count += groupUnits.length - 1;
    }
  }
  return count;
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

function KarmaTreeNode({ node, depth, selectedId, selectedAncestors, expanded, onToggle, onSelect, visibleNodeIds, totalPossibleNodeIds, filter, displayMode }) {
  const children = (childrenById[node.id] || []).filter((child) => visibleNodeIds.has(child.id));
  const countRule = filter ? karmaData.relationshipCounting?.[filter.relationType] : null;
  const filteredCount = visibleSubtypeCount(node, visibleNodeIds, countRule, filter?.gunasthanId, displayMode);
  const totalPossibleCount = totalPossibleNodeIds ? visibleSubtypeCount(node, totalPossibleNodeIds) : null;
  const dynamicCounts = Boolean(totalPossibleNodeIds);
  const selected = selectedId === node.id;
  const indicatorLabel = node.karmicIndicator === 'positive' ? 'perceived as punya' : node.karmicIndicator === 'negative' ? 'perceived as paap' : node.karmicIndicator === 'mixed' ? 'mixed subtypes' : '';
  return (
    <li className="kg-tree-item" role="treeitem" aria-expanded={children.length ? expanded.has(node.id) : undefined} aria-selected={selected}>
      <div className={`kg-tree-row${selected ? ' is-selected' : ''}${selectedAncestors.has(node.id) ? ' is-ancestor' : ''}`} style={{ '--kg-depth': depth }}>
        {children.length ? <button type="button" className="kg-expand" onClick={() => { onToggle(node.id); onSelect(node.id); }} aria-label={`${expanded.has(node.id) ? 'Collapse' : 'Expand'} ${nodeLabel(node)}`} aria-expanded={expanded.has(node.id)}>{expanded.has(node.id) ? '▾' : '▸'}</button> : <span className="kg-expand-spacer" />}
        <button type="button" className={`kg-tree-label${node.karmicIndicator ? ` is-${node.karmicIndicator}` : ''}`} onClick={() => onSelect(node.id)} aria-pressed={selected} aria-label={`${nodeLabel(node)}${indicatorLabel ? `, ${indicatorLabel} marker` : ''}`} title={nodeLabel(node)}>
          <span>{nodeLabel(node)}</span>
          {dynamicCounts
            ? totalPossibleCount > 1 && children.length > 0 && <small><span className="kg-node-count">{filteredCount} / {totalPossibleCount}</span></small>
            : children.length > 0 && node.countLabel ? <small><span className="kg-node-count">{node.countLabel} subtypes</span></small> : null}
        </button>
      </div>
      {children.length > 0 && expanded.has(node.id) && <ul role="group">{children.map((child) => <KarmaTreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={onToggle} onSelect={onSelect} visibleNodeIds={visibleNodeIds} totalPossibleNodeIds={totalPossibleNodeIds} filter={filter} displayMode={displayMode} />)}</ul>}
    </li>
  );
}

function KarmaTree({ roots, selectedId, selectedAncestors, expanded, onToggle, onSelect, onCollapseToLevelOne, onExpandAll, visibleNodeIds, filter, totalPossibleNodeIds, countSummary, displayMode, onChangeDisplayMode }) {
  const countSum = countSummary?.sum || 0;
  const familyScoped = countSummary?.familyScoped;
  const pausedLabel = familyScoped ? 'Paused entries' : filter?.relationType === 'bandh' ? 'Paused · Abandh' : 'Paused · Anuday';
  const stoppedLabel = familyScoped ? 'Stopped entries' : filter?.relationType === 'bandh' ? 'Stopped · Bandh Vichhed' : 'Stopped · Uday Vichhed';
  return (
    <section className="kg-canvas-graph" aria-label="Karma hierarchy">
      <div className="kg-canvas-head"><div><span className="kg-kicker">Karma hierarchy</span><h3>Karma View</h3></div><div className="kg-canvas-actions"><button type="button" onClick={onCollapseToLevelOne}>Collapse to level 1</button><button type="button" onClick={onExpandAll}>Full expansion</button></div></div>
      {countSummary && <section className="kg-count-summary" aria-label={`${filter.relationLabel} count summary for ${stageLabel(filter.gunasthanId)}${familyScoped ? `, ${countSummary.familyLabel} family` : ''}`}>
        <div className="kg-count-heading"><div><span className="kg-kicker">{familyScoped ? 'Family-scoped entries' : 'Source row-count'}</span><h4>{filter.relationLabel} at {stageLabel(filter.gunasthanId)}{filter.subStage && filter.subStage !== 'all' ? ` · ${filter.subStage}` : ''}{familyScoped ? ` · ${countSummary.familyLabel}` : ''}</h4></div><div className="kg-count-heading-links"><a href={stageNoteUrl(filter.relationType, filter.gunasthanId)} target="_blank" rel="noreferrer">View detailed notes here <span aria-hidden="true">↗</span></a><a href={countSummary.sourceUrl} target="_blank" rel="noreferrer">{familyScoped ? 'Source count method' : 'How this count is calculated'} <span aria-hidden="true">↗</span></a></div></div>
        <div className="kg-count-grid">
          <button type="button" className={`kg-count-tile is-active${displayMode === 'active' ? ' is-current' : ''}`} title={familyScoped ? `Show active ${countSummary.familyLabel} entries` : 'Show active karma'} onClick={() => onChangeDisplayMode('active')} aria-pressed={displayMode === 'active'}><strong>{countSummary.active}</strong><span>{familyScoped ? 'Active entries' : 'Active karma'}</span></button>
          <button type="button" className={`kg-count-tile is-paused${displayMode === 'paused' ? ' is-current' : ''}`} title={`Show subtype entries paused at ${stageLabel(filter.gunasthanId)}`} onClick={() => onChangeDisplayMode('paused')} aria-label={`Show subtype entries for ${pausedLabel}: ${countSummary.paused}`} aria-pressed={displayMode === 'paused'}><strong>{countSummary.paused}</strong><span>{pausedLabel}</span></button>
          <button type="button" className={`kg-count-tile is-stopped${displayMode === 'stopped' ? ' is-current' : ''}`} title={`Show subtype entries stopped by ${stageLabel(filter.gunasthanId)}`} onClick={() => onChangeDisplayMode('stopped')} aria-label={`Show subtype entries for ${stoppedLabel}: ${countSummary.stopped}`} aria-pressed={displayMode === 'stopped'}><strong>{countSummary.stopped}</strong><span>{stoppedLabel}</span></button>
          <button type="button" className={`kg-count-tile is-total${displayMode === 'total' ? ' is-current' : ''}`} title={familyScoped ? `Show all ${countSummary.familyLabel} entries` : 'Show all active, paused, and stopped karma'} onClick={() => onChangeDisplayMode('total')} aria-pressed={displayMode === 'total'}><strong>{countSum}</strong><span>{familyScoped ? `Sum · ${countSummary.sourceCount} family entries` : `Sum · ${countSummary.sourceCount} source units`}</span></button>
        </div>
        {familyScoped && <p className="kg-count-note" role="note">Counts are scoped to mapped subtype entries in this family. The source table reports overall count units, not family-specific totals.</p>}
        {!familyScoped && countSummary.sourceNote && <p className="kg-count-note" role="note">Source qualification: {countSummary.sourceNote}</p>}
        {countSummary.reviewNote && <p className="kg-count-review" role="note">Count detail to review: {countSummary.reviewNote}</p>}
      </section>}
      <div className="kg-indicator-legend" aria-label="Color marker legend"><span><i className="is-positive" />Green: perceived as punya</span><span><i className="is-negative" />Red: perceived as paap</span><span><i className="is-mixed" />Grey: mixed subtypes</span></div>
      {roots.length ? <ul className="kg-tree" role="tree" aria-label="Karma types and subtypes">
        {roots.map((node) => <KarmaTreeNode key={node.id} node={node} depth={0} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={onToggle} onSelect={onSelect} visibleNodeIds={visibleNodeIds} totalPossibleNodeIds={totalPossibleNodeIds} filter={filter} displayMode={displayMode} />)}
      </ul> : <p className="kg-empty-results">No karma entries remain visible for this relationship and Gunasthan.</p>}
    </section>
  );
}

function Inspector({ selectedNode, onSelectFilter, onClose }) {
  if (!selectedNode) {
    return (
      <aside className="kg-inspector" aria-label="Karma detail inspector">
        <div className="kg-empty-inspector"><button type="button" className="kg-inspector-close" onClick={onClose} aria-label="Close detail panel">×</button><span className="kg-kicker">Inspector</span><h3>Select a karma node</h3><p>Choose a node in Karma View to see its source-derived details.</p><ExternalNoteLinks /></div>
      </aside>
    );
  }

  const path = [...ancestorsOf(selectedNode.id), selectedNode.id].map((id) => nodeLabel(nodeById[id])).filter(Boolean);
  const records = relationshipsForSubtype(selectedNode.id);
  const grouped = RELATIONS.map((relation) => ({
    ...relation,
    records: records.filter((record) => record.relationType === relation.id),
    coverage: karmaData.coverage.find((item) => item.relationType === relation.id),
  }));
  return (
    <aside className="kg-inspector" aria-label="Karma detail inspector" aria-live="polite">
      <div className="kg-inspector-head">
        <button type="button" className="kg-inspector-close" onClick={onClose} aria-label="Close detail panel">×</button>
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
                return <button key={record.id} className="kg-record-row" type="button" onClick={() => onSelectFilter(record)} aria-label={`Filter Karma View to ${group.label} at ${stageDescription}`}>
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

export default function KarmaGranthLab() {
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterSubStage, setFilterSubStage] = useState('all');
  const [selectedId, setSelectedId] = useState('');
  const [displayMode, setDisplayMode] = useState('active');
  const [expanded, setExpanded] = useState(() => new Set());

  const roots = karmaData.nodes.filter((node) => !node.parentId);
  const families = roots;
  const activeFilter = filterCategory && filterStage ? { relationType: filterCategory, relationLabel: RELATIONS.find((item) => item.id === filterCategory)?.label, gunasthanId: filterStage, subStage: filterSubStage } : null;
  const filterKey = activeFilter ? `${activeFilter.relationType}:${activeFilter.gunasthanId}:${activeFilter.subStage}` : '';
  const visibleNodeIds = useMemo(() => collectStateNodeIds(roots, activeFilter, displayMode), [filterKey, displayMode]);
  const visibleRoots = roots.filter((node) => visibleNodeIds.has(node.id) && (!familyFilter || node.id === familyFilter));
  const selectedNode = visibleNodeIds.has(selectedId) && (!familyFilter || familyOf(nodeById[selectedId])?.id === familyFilter) ? nodeById[selectedId] : undefined;
  const selectedAncestors = useMemo(() => new Set(ancestorsOf(selectedId)), [selectedId]);
  const query = search.trim().toLowerCase();
  const searchResults = useMemo(() => query ? karmaData.nodes.filter((node) => {
    if (!visibleNodeIds.has(node.id) || (familyFilter && familyOf(node)?.id !== familyFilter)) return false;
    const relationTerms = relationshipsForSubtype(node.id).map((record) => `${record.sourceTerm} ${record.sourceLabel} ${record.sourceExcerpt}`).join(' ');
    return `${nodeLabel(node)} ${node.name} ${(node.aliases || []).join(' ')} ${node.summary || ''} ${relationTerms}`.toLowerCase().includes(query);
  }).slice(0, 12) : [], [query, visibleNodeIds, familyFilter]);

  useEffect(() => {
    if (!selectedId || !visibleNodeIds.has(selectedId) || (familyFilter && familyOf(nodeById[selectedId])?.id !== familyFilter)) setSelectedId((current) => current && (!visibleNodeIds.has(current) || (familyFilter && familyOf(nodeById[current])?.id !== familyFilter)) ? '' : current);
  }, [selectedId, visibleNodeIds, familyFilter]);
  useEffect(() => {
    if (!filterKey) return;
    setExpanded(new Set(karmaData.nodes.filter((node) => visibleNodeIds.has(node.id) && childrenById[node.id]?.some((child) => visibleNodeIds.has(child.id))).map((node) => node.id)));
  }, [filterKey, displayMode]);
  useEffect(() => {
    setDisplayMode('active');
  }, [filterKey]);
  useEffect(() => {
    if (!selectedId) return;
    setExpanded((current) => new Set([...current, ...ancestorsOf(selectedId)]));
  }, [selectedId]);

  function selectNode(id) { setSelectedId(id); }
  function selectFilter(record) {
    setFilterCategory(record.relationType);
    const terminal = (karmaData.terminalStages || []).find((stage) => stage.relationTypes.includes(record.relationType) && record.stageContext?.toLowerCase().includes('after gunasthan 14'));
    setFilterStage(record.gunasthanId || terminal?.id || 'g14');
    setFilterSubStage(record.subStage || 'all');
    setFilterOpen(true);
  }
  function toggleNode(id) {
    setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }
  function reset() {
    setSearch(''); setFamilyFilter(''); setFilterCategory(''); setFilterStage(''); setFilterSubStage('all'); setSelectedId(''); setDisplayMode('active'); setExpanded(new Set());
  }
  function expandAll() {
    setExpanded(new Set(karmaData.nodes.filter((node) => visibleNodeIds.has(node.id) && childrenById[node.id]?.some((child) => visibleNodeIds.has(child.id))).map((node) => node.id)));
  }

  const selectedStage = karmaData.gunasthans.find((item) => item.id === filterStage);
  const stageOptions = [...karmaData.gunasthans, ...(karmaData.terminalStages || [])];
  const countSummary = familyScopedCountSummary(roots, activeFilter, familyFilter, countSummaryForFilter(activeFilter));
  const totalPossibleNodeIds = useMemo(() => activeFilter ? collectCountableNodeIds(roots, activeFilter.relationType) : null, [activeFilter?.relationType, filterStage]);
  return (
    <LabEmbedded title="Karma Granth explorer">
      <div className="kg-lab">
        <header className="kg-toolbar">
          <div className="kg-toolbar-top">
            <label className="kg-search">Search names, aliases, note keywords, or relationship terms<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try ‘Aharaka’, ‘Vichhed’, ‘body’…" /></label>
            <label className="kg-family-filter">Karma family<select value={familyFilter} onChange={(event) => setFamilyFilter(event.target.value)}><option value="">All families</option>{families.map((family) => <option key={family.id} value={family.id}>{nodeLabel(family)}</option>)}</select></label>
            <button type="button" className={`kg-filter-toggle${activeFilter ? ' is-filtered' : ''}`} aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)}>Filter{activeFilter ? ' · active' : ''}</button>
            <button type="button" className="kg-reset" onClick={reset}>Reset view</button>
          </div>
          {filterOpen && <div className="kg-filter-panel">
            <label>Relationship<select value={filterCategory} onChange={(event) => { const next = event.target.value; setFilterCategory(next); if (!next) setFilterStage(''); else if ((karmaData.terminalStages || []).some((stage) => stage.id === filterStage && !stage.relationTypes.includes(next))) setFilterStage('g14'); }}><option value="">Choose relationship</option><option value="bandh">Bandh</option><option value="uday">Uday</option><option value="udirna" disabled>Udirna · not yet documented</option><option value="satta" disabled>Satta · not yet documented</option></select></label>
            <label>Gunasthan / final stage<select value={filterStage} onChange={(event) => { setFilterStage(event.target.value); setFilterSubStage('all'); }} disabled={!filterCategory}>{filterStage ? null : <option value="">Choose a stage</option>}{stageOptions.map((stage) => <option key={stage.id} value={stage.id} disabled={stage.relationTypes ? !stage.relationTypes.includes(filterCategory) : false}>{stage.number ? `${stage.number} · ` : ''}{stage.displayName || stage.name.replace(/^\d+\.?\s*/, '')}{stage.sourceContext ? ` · ${stage.sourceContext}` : ''}</option>)}</select></label>
            {selectedStage?.subStages?.length > 0 && <label>Sub-stage<select value={filterSubStage} onChange={(event) => setFilterSubStage(event.target.value)}><option value="all">Active throughout this Gunasthan</option>{selectedStage.subStages.map((subStage) => <option key={subStage} value={subStage}>{subStage}</option>)}</select></label>}
            {activeFilter && <button type="button" className="kg-clear-filter" onClick={() => { setFilterCategory(''); setFilterStage(''); setFilterSubStage('all'); }}>Clear filter</button>}
            <p>Use the count cards to show Active, Paused, Stopped, or Total entries below. Empty source coverage does not indicate doctrinal absence.</p>
          </div>}
          {searchResults.length > 0 && <div className="kg-search-results" role="list" aria-label="Search results"><span>Search results · {searchResults.length}{searchResults.length === 12 ? '+' : ''}</span>{searchResults.map((node) => <button key={node.id} type="button" role="listitem" onClick={() => selectNode(node.id)}>{nodeLabel(node)}<small>{nodeLabel(familyOf(node))}</small></button>)}</div>}
          {query && searchResults.length === 0 && <p className="kg-search-none">No visible hierarchy entries match “{search}”.</p>}
        </header>

        <div className="kg-workspace has-inspector">
          <main className="kg-main-view">
            <KarmaTree roots={visibleRoots} selectedId={selectedId} selectedAncestors={selectedAncestors} expanded={expanded} onToggle={toggleNode} onSelect={selectNode} onCollapseToLevelOne={() => setExpanded(new Set())} onExpandAll={expandAll} visibleNodeIds={visibleNodeIds} filter={activeFilter} totalPossibleNodeIds={totalPossibleNodeIds} countSummary={countSummary} displayMode={displayMode} onChangeDisplayMode={setDisplayMode} />
          </main>
          <Inspector selectedNode={selectedNode} onSelectFilter={selectFilter} onClose={() => setSelectedId('')} />
        </div>
        <footer className="kg-footnote"><span>Bandh and Uday details are transcribed from the linked notes.</span><span>Udirna and Satta are not yet documented in this lab.</span><span>Source-derived; not doctrinally verified.</span></footer>
      </div>
    </LabEmbedded>
  );
}
