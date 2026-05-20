# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm test           # Run tests in watch mode
npm test -- --watchAll=false   # Run tests once (CI mode)
npm run build      # Production build
```

To run a single test file:
```bash
npm test -- --testPathPattern=src/test/homepage.test.js --watchAll=false
```

## Architecture

This is a React 16 single-page application (bootstrapped with Create React App, using craco) that builds AIM (Annotation and Image Markup) JSON templates for the ePAD radiology platform.

### Data flow

State lives almost entirely in `App.js`, which passes handlers down to child components. The core data object is a `template` state shaped as:

```
{ TemplateContainer: { uid, name, authors, ..., Template: [{ Component: [...questions] }] } }
```

**Key state in `App.js`:**
- `template` — the complete AIM template being built
- `lexicon` — a map of `term → { ids: [questionIDs], description }` tracking terms added by the user that need to be persisted to ePAD on download

**Download flow** (`handleDownload` in `App.js`):
1. Validate the template against the AIM JSON schema (`AIMTemplate_v2rvStanford_schema.json`) using AJV
2. Save the template itself to ePAD's ontology API
3. Save all user-created terms to ePAD and get back assigned `codeValue`s
4. Patch those `codeValue`s back into the template JSON
5. Download the file via a created `<a>` element

### Component tree

```
App.js
├── Navbar — Download / Upload / Add Question buttons
├── Homepage (src/components/homepage/index.jsx)
│   ├── Template metadata form (name, type, author, version, codeMeaning, etc.)
│   ├── QuestionList — drag-and-drop ordered list of questions
│   ├── TemplatePreview — live preview using AimEditor (parseClass.js)
│   └── QuestionCreation (modal dialog, src/components/questionCreation/index.jsx)
│       ├── QuestionForm — question text, type, answers/terms, quantification
│       ├── TermSearch / TermSearchDialog — BioPortal ontology search
│       └── DetailCreation — sub-dialog for adding characteristics
├── UploadTemplate — load an existing JSON template
└── ErrorDisplay — shows AJV validation errors with option to download anyway
```

### External services

Configured via env vars (defaults shown):

| Variable | Default | Purpose |
|---|---|---|
| `REACT_APP_BIOPORTAL_URL` | `http://data.bioontology.org` | BioPortal ontology search |
| `REACT_APP_EPAD_URL` | `http://ch4.local:8080` | ePAD backend for API keys, ontology persistence |

The app fetches BioPortal and ePAD API keys from ePAD on startup (`getAPIKey` in `apiServices.js`). Without a running ePAD instance, the initial key fetch will fail and show an error snackbar, but the template builder UI still works.

Supported ontologies for term search: `ICD10`, `RADLEX`, `NCIT`, `SNOMEDCT`.

### Question types

Questions (AIM `Component` objects) have a `questionType` field that controls the JSON shape:
- `anatomic` → wraps in `AnatomicEntity`, supports `AnatomicEntityCharacteristic` sub-questions
- `observation` → wraps in `ImagingObservation`, supports `ImagingObservationCharacteristic` sub-questions
- `inference` → wraps in `Inference`
- default → plain component with `AllowedTerm` answers

Answers can be linked to subsequent questions via `nextid`, creating conditional branching in the rendered form.

### Key utilities

- `src/utils/helper.js` — `createID()` (2.25.xxx UIDs), `createTemplateQuestion()`, `validateTemplate()` (AJV against schema)
- `src/utils/parseClass.js` — `AimEditor` class: a large jQuery/Semantic-UI class that renders a live preview of the AIM template form. Uses DOM manipulation directly; not a React component.
- `src/utils/templates.js` — sample/dummy template data
- `src/utils/AIMTemplate_v2rvStanford_schema.json` — the AIM template JSON schema used for validation

### UI libraries

Uses **Material UI v4** (`@material-ui/core`) for most components. There is also a vendored **Semantic UI** (in `src/utils/semantic/`) used exclusively by `AimEditor` / `parseClass.js` for the template preview accordion. Do not mix Semantic UI into new React components.
