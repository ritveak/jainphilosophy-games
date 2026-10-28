# Karma Granth data maintenance

The bundled source of truth is `data.js`, exported as `karmaData`. It is intentionally static and is imported by the React lab; the app never fetches or parses the hosted notes.

## Add or edit a hierarchy entry

Add a node to `nodes` with a stable `id`, source-faithful `name` and `sourceHeading`, concise `displayName`, `parentId`, `summary`, `sourcePath`, `sourceUrl`, aliases, and a `verification` value. `sourceUrl` should point to the verified hosted KG-1 heading anchor, using the garden's rendered Markdown heading slug convention. Keep a source count in `countLabel` and its `karmicIndicator` (`positive`, `negative`, or `mixed`) separate from the display title. The UI shows a count only when the node has child entries. IDs should not depend on display labels. Use the source's KG-1 numbered heading to preserve the hierarchy. Parent links are derived from `parentId`; do not maintain a second child list.

Only add a child node when it represents a karma subtype included in the source's 158-count hierarchy. Finer knowledge classifications under Gyanavarniya and explanatory subdivisions such as the Sopkram/Niupkram Anapvartaniye and Labdhi/Karan Paryapta headings remain in the linked notes rather than appearing as additional counted subtypes. Keep the source text and links intact so omitted detail remains available without implying it was doctrinally reviewed.

## Add a KG-2 relationship

Add one record to `relationships` for each source-defined subtype transition or state. Set `subtypeId` only when the source reference maps unambiguously to a `nodes[].id`; otherwise keep it `null` and set `verification: "needs-review"`. Include `gunasthanId` (or a separate `stageContext` for a context outside the 14 Gunasthans), optional `subStage`, `relationType` (`bandh`, `uday`, `udirna`, or `satta`), the exact `sourceTerm`, and the source URL. Keep `sourceTerm` separate from normalized `state`. Use `throughGunasthanId` only when the note documents a continuous stage range, and use `displayNote` for a concise source-qualified exception. Keep counts and formulas in provenance fields; the views use simple display descriptions.

When a note says “same as previous,” carry records forward only when the included subtypes and end stage are clear; encode the range rather than copying the classification into each view. Keep a stop point distinct from a stage-specific non-occurrence range and from a later unlock. Preserve documented sub-stages as `subStage` values.

Update `coverage` independently from relationship semantics. `not-yet-populated` means the lab has no structured subtype records for the category; it is not a doctrinal state. Udirna and Satta can be populated by adding relationship records and changing their coverage metadata; the views discover categories from this shared data model.

After editing, run `npm run build` and inspect the affected hierarchy branches and Gunasthan/category view. Do not mark a record doctrinally verified because it builds; `source-extracted` describes transcription provenance only.

## Current source coverage

The current Bandh and Uday entries have been mapped to the named subtype nodes, with documented stage ranges, sub-stages, exceptions, and the after-Gunasthan-14 context represented separately. The embedded summary images are retained as cross-checks; they do not replace the detailed source lists. This transcription has not been doctrinally verified. Keep ambiguous future references marked for review instead of guessing a subtype mapping.
