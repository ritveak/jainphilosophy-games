# Karma Granth data maintenance

The bundled source of truth is `data.js`, exported as `karmaData`. It is intentionally static and is imported by the React lab; the app never fetches or parses the hosted notes.

## Add or edit a hierarchy entry

Add a node to `nodes` with a stable `id`, source-faithful `name`, `kind`, `parentId`, concise `summary`, `sourceHeading`, `sourcePath`, `sourceUrl`, aliases, and a `verification` value. IDs should not depend on display labels. Use the source's KG-1 numbered heading to preserve the hierarchy. Parent links are derived from `parentId`; do not maintain a second child list.

## Add a KG-2 relationship

Add one record to `relationships` for each explicit source statement. Set `subtypeId` only when the source reference maps unambiguously to a `nodes[].id`; otherwise keep it `null` and set `verification: "needs-review"`, preserving the displayed source label and anchor. Include `gunasthanId` (or a separate `stageContext` for a source context outside the 14 Gunasthans), optional `subStage`, `relationType` (`bandh`, `uday`, `udirna`, or `satta`), the exact `sourceTerm`, source wording, any concise `statement`/`qualification`, and source heading/URL. Keep `sourceTerm` separate from `state`, and do not infer a relationship at later stages from “same as previous” wording; retain that wording in `annotations` instead.

Update `coverage` independently from relationship semantics. `not-yet-populated` means the lab has no structured subtype records for the category; it is not a doctrinal state. Udirna and Satta can be populated by adding relationship records and changing their coverage metadata; the views discover categories from this shared data model.

After editing, run `npm run build` and inspect the affected hierarchy branches and Gunasthan/category view. Do not mark a record doctrinally verified because it builds; `source-extracted` describes transcription provenance only.

## Current source gaps

The notes contain embedded summary/count images that have not been transcribed. Sixteen KG-2 link references do not resolve to a numbered KG-1 hierarchy node (including Anantanubandhi, Apratyakhyana, Sanjvalana and related stages/concepts); these stay visible as mapping-review items. Some explanatory statements such as “Same as level above” are not expanded into later subtype records.
