# Karma Granth data maintenance

The bundled source of truth is `data.js`, exported as `karmaData`. It is intentionally static and is imported by the React lab; the app never fetches or parses the hosted notes.

## Add or edit a hierarchy entry

Add a node to `nodes` with a stable `id`, source-faithful `name` and `sourceHeading`, concise `displayName`, `parentId`, `summary`, `sourcePath`, `sourceUrl`, aliases, and a `verification` value. `sourceUrl` should point to the verified hosted KG-1 heading anchor, using the garden's rendered Markdown heading slug convention. Keep a source count in `countLabel` and its `karmicIndicator` (`positive`, `negative`, or `mixed`) separate from the display title. The UI shows a count only when the node has child entries. IDs should not depend on display labels. Use the source's KG-1 numbered heading to preserve the hierarchy. Parent links are derived from `parentId`; do not maintain a second child list.

Only add a child node when it represents a karma subtype included in the source's 158-count hierarchy. Finer knowledge classifications under Gyanavarniya and explanatory subdivisions such as the Sopkram/Niupkram Anapvartaniye and Labdhi/Karan Paryapta headings remain in the linked notes rather than appearing as additional counted subtypes. Keep the source text and links intact so omitted detail remains available without implying it was doctrinally reviewed.

## Add a KG-2 relationship

Add one record to `relationships` for each explicit source statement. Set `subtypeId` only when the source reference maps unambiguously to a `nodes[].id`; otherwise keep it `null` and set `verification: "needs-review"`, preserving the displayed source label and anchor. Include `gunasthanId` (or a separate `stageContext` for a source context outside the 14 Gunasthans), optional `subStage`, `relationType` (`bandh`, `uday`, `udirna`, or `satta`), the exact `sourceTerm`, source wording, any concise `statement`/`qualification`, and a KG-2 source URL. Current category URLs point to verified KG-2 section anchors. Keep `sourceTerm` separate from `state`, and do not infer a relationship at later stages from “same as previous” wording; retain that wording in `annotations` instead.

Update `coverage` independently from relationship semantics. `not-yet-populated` means the lab has no structured subtype records for the category; it is not a doctrinal state. Udirna and Satta can be populated by adding relationship records and changing their coverage metadata; the views discover categories from this shared data model.

After editing, run `npm run build` and inspect the affected hierarchy branches and Gunasthan/category view. Do not mark a record doctrinally verified because it builds; `source-extracted` describes transcription provenance only.

## Current source gaps

The notes contain embedded summary/count images that have not been transcribed. Sixteen KG-2 link references do not resolve to a numbered KG-1 hierarchy node (including Anantanubandhi, Apratyakhyana, Sanjvalana and related stages/concepts); these stay visible as mapping-review items. Some explanatory statements such as “Same as level above” are not expanded into later subtype records.
