# Karma Granth Lab: Implementation Plan

## 1. Goal

Build a new `karmagranth` concept inside the existing Concept Laboratory. The lab should provide an interactive, frontend-only way to explore the karma hierarchy and its relationship with the 14 Gunasthans, while linking back to the detailed Obsidian notes hosted on Unchained Notes.

This is a visualization and exploration layer over the existing knowledge, not a replacement for the notes and not a new note-taking system.

## 2. Existing context and source of truth

The owner maintains the notes in Obsidian and publishes them through a Vercel Digital Garden. Codex has access to the local vault notes and Concept Laboratory repository, so it must inspect those local files directly instead of reconstructing classifications from the public pages or relying on general Jain knowledge.

Primary notes:

- KG-1: [1. Karma Types and Subtypes](https://unchainednotes.vercel.app/1-learning-list/1-jainism-core-concepts/2-karnanuyog/karma/1-karma-types-and-subtypes/)
- KG-2: [2. Karma Bandh, Uday, Udirna and Satta based on Gunsthan](https://unchainednotes.vercel.app/1-learning-list/1-jainism-core-concepts/2-karnanuyog/karma/2-karma-bandh-uday-udirna-and-satta-based-on-gunsthan/)

Current state of the notes:

- KG-1 is complete for the owner's current study and contains the karma types, subtypes, hierarchy, descriptions and relevant unique notes.
- KG-2 currently contains the owner's studied material for **Bandh** and **Uday**. The owner plans to enrich it later with **Udirna**, **Satta**, and further observations.
- The KG-1 note describes multiple counting conventions, including a maximum count of 158 when Naam Karma is represented with 103 subtypes. Preserve the classification and counting conventions exactly as recorded in the local note; do not hard-code an assumed universal count or silently normalize the hierarchy.
- KG-2 contains distinctions such as `Bandh Vichhed`, `Abandh`, `Uday Vichhed`, and `Anuday`, as well as Gunasthan-specific notes and subdivisions within certain stages. These distinctions must not be flattened into a generic yes/no or a single `stopStage` field.

KG-2's public page is protected. Use the local vault note available to Codex as the working source. The lab should link to the hosted page, but must not depend on scraping or fetching its protected contents at runtime.

## 3. Existing application constraints

The Concept Laboratory is built with React, Vite and Tailwind CSS. Its architecture is concept-folder based and includes shared layout components, Markdown rendering, optional FAQ/resources files, dynamic tabs, and optional concept-specific `Lab.jsx` files.

Before coding, Codex must inspect:

1. The root README and `structure.md` (if present).
2. `package.json` and current dependencies.
3. `src/App.jsx`, the concept loader/index, and shared layout components.
4. The existing `samvaay` and `mohniye` concept folders, including their labs and data files.
5. The actual local KG-1 and KG-2 Obsidian notes, including headings, hierarchy, aliases, special cases and internal links.

Follow established project conventions. Do not build a parallel application, duplicate the shared concept shell, or replace the existing router/tab system without a concrete reason.

## 4. Product principles

### 4.1 One knowledge model, multiple views

The same static data must power all of the lab's views. The tree, matrix, detail panel, search and comparison view must not contain separate hard-coded copies of the same classifications.

### 4.2 Source fidelity over visual simplicity

Do not infer or invent doctrinal relationships. For every KG-2 relationship, retain its source terminology, stage, qualification, note and source location wherever available. If something is ambiguous, preserve the ambiguity and flag it for review instead of guessing.

### 4.3 Additive enrichment

The schema must accommodate later additions to KG-2 without requiring a redesign. Bandh and Uday are populated first. Udirna and Satta are future categories and must be represented as supported-but-not-yet-populated, not as absent, false or doctrinally inapplicable.

### 4.4 Readable at large scale

The entire hierarchy may contain around 158 subtype entries under the owner's counting convention. Do not display every node and every relationship at full detail simultaneously. Support search, collapse/expand, selection, contextual highlighting and progressive disclosure.

### 4.5 Frontend-only

No database, backend, API service, authentication service or runtime dependency on the hosted notes. Use static JS/JSON data bundled with the app and compute views in the browser. Browser local storage is optional only for non-authoritative preferences, not for source-of-truth data.

### 4.6 Keep existing notes authoritative

The lab displays concise summaries, classification metadata, relationship information and links. It should not attempt to become a second full copy of the notes. The detailed explanation remains in Obsidian / Unchained Notes.

## 5. Proposed UX

The Karma Lab should have a main workspace with synchronized views, a shared search/filter area and a contextual detail inspector.

### 5.1 Main navigation

Provide a simple view switcher, preferably as tabs or segmented navigation consistent with the existing project UI:

- **Canvas**: hierarchical karma family/type/subtype navigation.
- **Gunasthan Matrix**: browse the relationship records from the Gunasthan perspective.
- **Compare**: optional follow-on view for comparing two subtypes or two Gunasthans; only implement in the first release if the core views are stable and scope allows.

The inspector should remain available across the Canvas and Matrix views, or preserve the selected subtype when changing views.

### 5.2 Canvas view

The canvas is the primary way to explore the KG-1 hierarchy.

Requirements:

- Render the hierarchy from the actual KG-1 note structure, preserving parent-child relationships and the owner's naming/count conventions.
- Use stable IDs for all nodes. Display names can change without breaking relationships or links.
- Support expanding/collapsing branches.
- Support pan/zoom if a graph/canvas library is used; include a way to reset/fit the view.
- Keep node labels short enough to scan. The full name, short definition, special notes and source links belong in the inspector.
- Selecting a node opens its details without navigating away from the current view.
- Highlight the selected node and its ancestors. When feasible, highlight related Gunasthan stages or matching relationship records.
- Provide search that can locate a subtype even if its branch is collapsed; selecting a result should reveal the branch and select the node.
- Do not render all relationship edges between karma subtypes and Gunasthans on the same default canvas. That would mix a classification tree with a many-to-many relationship graph and quickly become cluttered.

Use a suitable existing graph/canvas dependency if the repository already has one. If not, inspect the dependency budget and propose a client-only solution that supports the actual interaction requirements. Do not add a large dependency casually; explain any new dependency and avoid backend features.

### 5.3 Subtype inspector / side panel

Selecting a karma type or subtype should populate a contextual side panel. For a subtype, show relevant available fields such as:

1. Canonical name and hierarchy path.
2. KG-1 description, effect, classification markers and unique notes, where present in the source.
3. KG-2 relationship summary grouped by Bandh and Uday.
4. A Gunasthan-by-Gunasthan breakdown, showing detailed source terminology and special conditions.
5. Relationship details or annotations that do not fit a generic status field.
6. Links to KG-1 and KG-2 hosted notes, and to a specific heading/section if a reliable fragment can be identified.
7. A source/verification indicator for each relationship record.

The panel should be resizable or collapsible on wide screens, and usable as a drawer or full-width detail view on smaller screens. Do not render empty fields as if they were known facts.

At a parent karma-family/type node, show a family summary, number of children if reliably calculated, and its source link. Keep subtype-specific relation details out of parent nodes unless the source explicitly defines a parent-level rule.

### 5.4 Gunasthan Matrix

Provide a second navigation direction: start from one of the 14 Gunasthans and discover which subtypes have a documented relationship with that stage.

Requirements:

- Use one canonical list of 14 Gunasthans in the data model. Do not retype the labels and stage numbers independently across components.
- Let the user select a relation category. Initially, Bandh and Uday contain data; Udirna and Satta should be visibly marked as not yet populated, with no fabricated states.
- Present subtype records grouped by karma family/type, with search and filtering.
- Let the user click a result to select that subtype in the inspector and, when switching to Canvas, reveal/select its position in the hierarchy.
- Preserve the source's actual semantics: for example, distinctions between cessation, non-occurrence/absence, a relationship that continues, and stage-specific conditions must remain separate if the note distinguishes them.
- Do not rely on color alone. Use explicit labels/icons/legends and accessible states.
- Support special sub-stages or subdivisions recorded in the notes. In particular, do not assume that a Gunasthan can always be represented as one undivided row or one simple state for a relation.

The matrix may be rendered as 14 columns with subtype rows, or as a selected-Gunasthan explorer with a 14-stage strip plus grouped subtype results. Choose the implementation that stays readable at the project's actual screen sizes and data volume. If a full 158-row-by-14-column table is too dense, provide family grouping, sticky stage headers and filters.

### 5.5 Relationship / stage detail

When a cell, status or relationship record is selected, show a focused detail panel with:

- The exact category (Bandh, Uday, Udirna or Satta).
- The source-defined relationship term (e.g. Vichhed/Abandh/Anuday when applicable).
- The Gunasthan and any internal sub-stage specified by the note.
- The relevant subtype(s), explanation, exceptions and counts/calculations if present.
- A link back to the corresponding section in the hosted KG-2 note where possible.

Avoid forcing all information into a boolean cell or a single start/end/stop field. The visualization can summarize, but the source-backed details must remain accessible.

### 5.6 Search and filters

At minimum, support:

- Search by subtype/type name, alternate spelling/alias and relevant keyword.
- Filter by relation category.
- Filter by selected Gunasthan.
- Filter by karma family/type.
- Quickly show only records with source information, records needing review, and missing/incomplete relationship data.

Keep filters synchronized across the active view. If URL query parameters fit the app's routing conventions, use them for shareable selected views; do not introduce a new router to achieve this.

### 5.7 Future comparison and revision

Design the data model so these can be added later without reworking the core schema:

- Compare the relationship patterns of two subtypes.
- Compare how a chosen category differs between two Gunasthans.
- Revision mode that hides relationship answers until revealed.
- Coverage view showing which records are populated, missing or flagged for review.

Do not let these future features delay a working Canvas + Matrix + Inspector MVP.

## 6. Data model requirements

A pragmatic starting point is static data modules, possibly split across files if the dataset becomes too large. Keep the shape consistent with the existing repository. For example, `data.js` may re-export data from smaller modules inside `lab/data/`.

### 6.1 Karma node

Conceptual fields:

- `id`: stable, unique identifier.
- `name`: canonical display name taken from the local note.
- `aliases`: optional alternative names/spellings for search.
- `kind`: category/type/subtype, according to the actual hierarchy.
- `parentId`: stable parent ID, if applicable.
- `children`: optional child IDs, or derive children from `parentId`; avoid maintaining two conflicting sources of hierarchy.
- `noteSummary`: short source-derived summary when useful.
- `sourceLinks`: KG-1 URL and section/fragment if resolvable.
- `sourceHeading` / `sourcePath`: enough local provenance to trace the record back to the source note.
- `metadata`: optional source-derived information such as count annotations or unique notes. Do not make all metadata mandatory.

### 6.2 Gunasthan

Conceptual fields:

- `id`: stable identifier, preferably including the stage number.
- `number`: 1-14.
- `name`: stage name from the owner's study notes.
- `aliases`: optional variants.
- `sourceLinks`: note and section links where available.
- `subStages`: optional source-defined subdivisions if the relevant Gunasthan has them in KG-2.

Do not create subdivisions merely for visual consistency; only represent subdivisions supported by the note.

### 6.3 Relationship

A relationship is an independent record linking a karma node to a Gunasthan/stage or sub-stage.

Conceptual fields:

- `id`: stable, unique record ID.
- `subtypeId`: ID of the related karma node; allow parent-level links only when the source actually makes a family/type-level statement.
- `gunasthanId`: canonical stage ID.
- `subStageId`: optional, only when the source specifies a sub-stage.
- `relationType`: one of `bandh`, `uday`, `udirna`, `satta`.
- `sourceTerm`: source's exact label or concept, when available (e.g. `Bandh Vichhed`, `Abandh`, `Uday Vichhed`, `Anuday`).
- `state`: a source-backed normalized state only if normalization preserves the source meaning. Keep the exact source term separately.
- `statement` / `explanation`: concise faithful summary of the source record.
- `conditions`: optional contextual conditions or caveats.
- `counts` / `calculation`: optional source values, formatted as data only if their meaning is clear.
- `source`: local note path, heading/section and hosted link/fragment if known.
- `verification`: e.g. `pending`, `reviewed`, `needs-review`; do not imply doctrinal validation just because a record was parsed.

Do not force every source entry into a relationship record if it is a general concept or explanatory note. Consider a separate annotation/note record where that better preserves the original structure.

### 6.4 Study coverage is not doctrinal status

Represent the completeness of the lab data separately from the karmic relationship itself. Example coverage flags:

- `documented`: relationship is present in KG-2 source material.
- `not-yet-studied`: owner has not covered this category in the current notes.
- `needs-review`: source entry exists but needs a second pass.
- `reviewed`: record has been checked against the local source.

Do not use an empty array, `false`, or `not-applicable` to stand in for `not-yet-studied`. Do not mark a record `reviewed` solely because the app successfully built.

## 7. Source extraction and maintenance

Codex must use the local files as the primary source for initial data extraction. It should:

1. Read the whole KG-1 note and extract the hierarchy and subtype descriptions without losing source annotations.
2. Read the whole currently available KG-2 note and extract the current Bandh and Uday sections, including summary material, stage-by-stage relationships, special cases, calculations and sub-stage divisions.
3. Build a mapping from source headings/links to stable IDs. Where a relationship to a specific subtype is ambiguous, flag it rather than guessing.
4. Use the two hosted URLs as external note links. For section links, use actual anchors confirmed from the published site or the local markdown's link conventions. Do not guess fragments and do not scrape the protected hosted KG-2 page at runtime.
5. Keep the source data editable and auditable. Prefer hand-maintainable JS/JSON over a compact generated blob with unexplained logic.
6. Document how future KG-2 additions for Udirna and Satta should be added. The existing view components must pick up new records by data changes rather than requiring a new UI implementation.

If automated extraction from Markdown is considered, it must be build-time or developer tooling only, not a server runtime. For the first implementation, choose the simplest dependable method compatible with the notes' current structure. Do not attempt to build a general-purpose Markdown parser just for this task unless the source genuinely requires it.

## 8. Accuracy and terminology guardrails

- Preserve the owner's terminology and wording where it encodes distinctions.
- Do not replace the author's source with internet research or generic Jain philosophy knowledge.
- Do not silently reconcile differing counts or classification conventions. Show the convention as documented in KG-1, if it needs to be visible.
- Do not infer relationships from adjacent stages unless the source explicitly states the inheritance/continuation rule. If the note says "same as previous level and more," preserve the reference to the previous-level rule without losing its accumulated additions.
- Preserve exceptions and contextual explanations, such as a relationship that can continue due to something initiated at the previous stage.
- Where a source image or table contains relevant data that cannot be reliably extracted from the local note, report it in an implementation note and leave that portion visibly incomplete rather than inventing a transcription.
- Keep `sourceTerm` and any normalized display state distinct.
- Udirna and Satta are future data categories for this lab's current scope. Their screens may show an informative empty state, but no invented relation data.

## 9. Visual and interaction design

- Follow the existing Concept Laboratory design system, typography, spacing, dark/light theme handling and reusable UI components.
- Keep the page visually clear at typical laptop widths and usable on smaller screens.
- Prefer progressive disclosure over dense tooltips or tiny text.
- Include visible labels and a legend for relation states; do not rely only on color.
- Ensure keyboard focus, readable contrast, semantic buttons and useful empty/loading/error states. There should be no network loading state for the local static data.
- Add a clear way to reset the active filters and return the canvas to its overview.
- Keep the relationship detail readable without requiring the user to hover. Hover may be a convenience, not the only way to access information.
- External note links should open appropriately and be identifiable as leaving the lab.

## 10. Non-goals for this iteration

- No backend or database.
- No account system, collaboration, remote editing or user-submitted corrections.
- No runtime fetching/parsing of the protected KG-2 page.
- No replacement for Obsidian or the published notes.
- No unverified doctrinal completion of Udirna/Satta.
- No mandatory all-edges-at-once graph visualization.
- No advanced quiz system, animated timeline or analytics dashboard before the core views work.

## 11. Implementation phases

### Phase 0: Repository and source audit

Inspect the real repo, README, `structure.md`, dependencies, sample concepts/labs and local notes. Report the existing integration conventions and any uncertain or image-only source material. Do not start by rewriting the architecture.

### Phase 1: Data extraction and model

Create stable IDs and static data for the hierarchy, 14 Gunasthans, the currently documented Bandh/Uday relationships and source links. Preserve exceptions, sub-stage distinctions and provenance. Add a short data-maintenance guide.

### Phase 2: Concept integration and Canvas

Create `src/concepts/karmagranth/` matching existing naming conventions. Add `Concept.md`, required link/resource metadata as appropriate, `data.js`, `Lab.jsx` and the canvas/detail components. Confirm automatic concept discovery and existing tabs still work.

### Phase 3: Gunasthan Matrix

Build the reverse lookup from Gunasthan to relevant subtypes. Add relation-category filters and synchronized selection between the Matrix and Canvas. Show explicit not-yet-studied states for Udirna/Satta.

### Phase 4: Quality and handoff

Run existing lint/test/build commands found in `package.json`. Fix regressions, validate all external links, verify responsive behavior and keyboard interactions, and check that no doctrinal entries have been fabricated. Provide a concise summary of changed files, decisions, known gaps and the process for extending the data when KG-2 notes are enriched.

## 12. Acceptance criteria

The implementation is accepted when:

- [ ] A new `karmagranth` concept appears through the existing Concept Laboratory loader and shares the existing page shell.
- [ ] The Canvas renders the hierarchy extracted from the local KG-1 note, with expandable branches and stable node IDs.
- [ ] Selecting a subtype displays its source-derived KG-1 information and KG-2 relationship information that is currently documented.
- [ ] The 14-Gunasthan Matrix supports reverse lookup and can select the same subtype shown in Canvas.
- [ ] Bandh and Uday data preserve source terminology, qualifications, exceptions and internal stage subdivisions where recorded.
- [ ] Udirna and Satta are explicitly incomplete/not yet studied in the lab and contain no invented classifications.
- [ ] Each relevant record can be traced back to a local source heading and the hosted KG-1/KG-2 notes where possible.
- [ ] Search works across the hierarchy, including collapsed branches and aliases where available.
- [ ] Relationship state and study-data completeness are not conflated.
- [ ] The UI is usable on laptop and smaller screens, supports keyboard navigation, and does not rely on color alone.
- [ ] No database, backend, runtime scraping or new service has been added.
- [ ] Existing concepts still work and the project's production build succeeds.
- [ ] Codex lists any source ambiguities or content it could not extract reliably instead of silently filling gaps.

## 13. Final handoff from Codex

At completion, report:

1. The components and data files created or changed.
2. How the hierarchy and KG-2 records were derived from the local source notes.
3. The data schema, including how to add a new subtype or new Udirna/Satta data later.
4. Any entries requiring manual review, especially image-only tables or ambiguous source references.
5. Build/test results.
6. Any new dependency and why it was necessary.

Do not claim doctrinal verification; describe verification only in terms of checking the implementation against the local notes unless an actual subject-matter review was performed.
