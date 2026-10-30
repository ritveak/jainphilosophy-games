# Karma Granth data maintenance

The bundled source of truth is `data.js`, exported as `karmaData`. It is intentionally static and is imported by the React lab; the app never fetches or parses the hosted notes.

## Add or edit a hierarchy entry

Add a node to `nodes` with a stable `id`, source-faithful `name` and `sourceHeading`, concise `displayName`, `parentId`, `summary`, `sourcePath`, `sourceUrl`, aliases, and a `verification` value. `sourceUrl` should point to the verified hosted KG-1 heading anchor, using the garden's rendered Markdown heading slug convention. Keep a source count in `countLabel` and its `karmicIndicator` (`positive`, `negative`, or `mixed`) separate from the display title. The UI shows a count only when the node has child entries. IDs should not depend on display labels. Use the source's KG-1 numbered heading to preserve the hierarchy. Parent links are derived from `parentId`; do not maintain a second child list.

Only add a child node when it represents a karma subtype included in the source's 158-count hierarchy. Finer knowledge classifications under Gyanavarniya and explanatory subdivisions such as the Sopkram/Niupkram Anapvartaniye and Labdhi/Karan Paryapta headings remain in the linked notes rather than appearing as additional counted subtypes. Keep the source text and links intact so omitted detail remains available without implying it was doctrinally reviewed.

## Add a KG-2 relationship

Add one record to `relationships` for each source-defined subtype transition or state. Set `subtypeId` only when the source reference maps unambiguously to a `nodes[].id`; otherwise keep it `null` and set `verification: "needs-review"`. Include `gunasthanId` (or a separate `stageContext` for a context outside the 14 Gunasthans), optional `subStage`, `relationType` (`bandh`, `uday`, `udirna`, or `satta`), the exact `sourceTerm`, and the source URL. Keep `sourceTerm` separate from normalized `state`. Use `throughGunasthanId` only when the note documents a continuous stage range, and use `displayNote` for a concise source-qualified exception. Keep counts and formulas in provenance fields; the views use simple display descriptions.

When a note says “same as previous,” carry records forward only when the included subtypes and end stage are clear; encode the range rather than copying the classification into each view. Keep a stop point distinct from a stage-specific non-occurrence range and from a later unlock. Preserve documented sub-stages as `subStage` values.

## Represent a source-defined dependency

Some count logic groups subtype families together instead of listing each family separately at every Gunasthan. For example, the notes group Bandhan and Sanghat with Sharir and state that their corresponding types follow the same five-type row grouping. Record this in `relationshipDependencies` as a stable mapping from each dependent subtype to its corresponding Sharir subtype, with the applicable relationship categories and source headings. The lab resolves those references through the shared relationship helper, so Karma View filtering, search, and the inspector all use the same Sharir stage records. Do not duplicate the stage classifications in `relationships`; keep the mapping marked `source-derived-mapping` so the source-based inference remains visible.

Update `coverage` independently from relationship semantics. `not-yet-populated` means the lab has no structured subtype records for the category; it is not a doctrinal state. Udirna and Satta can be populated by adding relationship records and changing their coverage metadata; the views discover categories from this shared data model.

`gunasthans` contains the fourteen Gunasthans. A source-defined stage after Gunasthan 14 belongs in `terminalStages`, not as a fifteenth Gunasthan. The current `siddhashila` filter stage is available for Uday only, because the note's final Uday Vichhed entries are explicitly after leaving Gunasthan 14. Cessation records remain effective at every later stage; sub-stage cessation starts applying from its documented sub-stage onward. Do not treat a stage-specific pause/non-occurrence range as a permanent stop.

`relationshipCounting` records the source's count units and exclusions for Bandh (120) and Uday (122). `sourceCountRows` transcribes active, pause, and cumulative Vichhed counts from the note's embedded stage tables, and the count cards use those source-reported values. Do not derive these totals by counting visible labels: the note groups some subtypes, and alternatives such as Sata/Asata do not count simultaneously. If a detailed subtype list conflicts with a count table, preserve both and add a `reviewNote`; do not silently reconcile them. Keep each count logic link pointed at its verified section anchor.

For a Gunasthan divided into countable sub-stages, keep the source's labels in `subStages` and add relation-specific `subStageDetails` entries containing each `label` and a concise, source-faithful `note`. Only relationships with a breakdown for the selected relation show sub-stage buttons. Their buttons select the matching `sourceCountRows` entry, and the selected note appears in the count window. Do not infer a Bandh sub-stage breakdown for Uday (or vice versa) just because the Gunasthan itself has sub-stages.

`sources.kg2.stageAnchors` maps each Bandh/Uday stage to the rendered section heading in the local note, using the garden's `headerToId` slugifier. Pause/stop side-panel lists show direct subtype mappings only; inherited Bandhan/Sanghat mappings still affect filtering but must not appear as extra source entries. Each list item links to the selected relationship's stage section instead of selecting that karma in the tree.

After editing, run `npm run build` and inspect the affected hierarchy branches and Gunasthan/category view. Do not mark a record doctrinally verified because it builds; `source-extracted` describes transcription provenance only.

## Current source coverage

The current Bandh and Uday entries have been mapped to named subtype nodes, including Bandhan and Sanghat relationships derived through their corresponding Sharir entries under the source count logic. Documented stage ranges, sub-stages, exceptions, and the after-Gunasthan-14 context are represented separately. The embedded summary images are retained as cross-checks; they do not replace the detailed source lists. This transcription has not been doctrinally verified. Keep ambiguous future references marked for review instead of guessing a subtype mapping.
