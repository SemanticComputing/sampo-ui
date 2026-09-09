# AGENTS.md — sampo-ui

Sampo-UI is a framework for building faceted-search portals over SPARQL endpoints. It consists of a React client, an Express server, and a JSON/JS config layer that defines the entire portal without touching the framework code.

---

## Architecture Overview

```
Browser
  └─ React client  (dev: port 8080 | prod: port 80)
        │  fetches config on startup
        │  sends facet/result queries
        ▼
Express server  (port 3001)
        │  loads config at startup
        │  builds & executes SPARQL queries
        ▼
SPARQL endpoint (e.g. Ontop, Fuseki)
        ▼
RDF / Virtual Knowledge Graph
```

The server is stateful: it loads all configs at startup and holds the resolved `backendSearchConfig` object for the lifetime of the process. The client is stateless: it re-fetches config files and results via HTTP.

In production the client and server are typically bundled into a single container (see [Combo Build](#combo-build) below).

---

## Client

### Entry point & startup

`client/src/index.js` bootstraps the app:
1. Calls `useConfigsStore.getState().initConfigs()` to fetch `portalConfig.json` from the server and then each perspective's JSON config.
2. Initializes the Redux store via `configureStore()` with redux-observable epic middleware.
3. Renders the app once configs are loaded.

Configs are stored in a **Zustand store** (`client/src/stores/configsStore.js`). The store exposes `getStaticFileUrl(path)` and `getConfigJsonFile(file)` helpers used by components and custom components alike.

### Routing & perspectives

`SemanticPortal.js` reads `perspectiveConfigs` from the Zustand store and dynamically creates React Router routes:

| URL pattern | Renders |
|---|---|
| `/:locale/:perspectiveID/faceted-search` | Faceted search page |
| `/:locale/:perspectiveID/page/:id` | Instance (detail) page |
| `/:locale/full-text-search` | Full-text search |

### Redux store

One set of reducers is created **per perspective** at startup:

- `state[perspectiveID]` — result data, pagination, sort
- `state[${perspectiveID}Facets]` — facet values, active filters, fetch state

Key action types (defined in `client/src/actions/index.js`):
- `FETCH_RESULTS`, `FETCH_PAGINATED_RESULTS`, `UPDATE_RESULTS`
- `FETCH_FACET`, `UPDATE_FACET_VALUES`, `UPDATE_FACET_OPTION`, `CLEAR_FACET`
- `FETCH_RESULT_COUNT`

### Facet interaction flow

When a user selects a facet value:

1. **UI component** (e.g. `HierarchicalFacet`) calls `dispatch(updateFacetOption({facetClass, facetID, option, value}))`.
2. **Facets reducer** updates `state[perspectiveIDFacets].facets[facetID][filterType]` and increments `facetUpdateID`.
3. **Epics** (`client/src/epics/index.js`, RxJS + redux-observable) watch for facet/result actions and fire API requests:
   - `POST /api/v1/faceted-search/{facetClass}/facet/{facetID}` — refreshes facet value counts
   - `POST /api/v1/faceted-search/{resultClass}/all` — fetches updated results
4. **Constraint serialization** (`client/src/helpers/helpers.js` — `stateToUrl()`) reads the current facet Redux state and builds a `constraints` array included in the request body.

### Result rendering

`ResultClassRoute.js` renders the correct component based on `resultClassConfig.component`:

- Built-ins: `ResultTable`, `LeafletMap`, `Deck`, `ApexCharts`, `Network`, `InstancePageTable`, `Export`, …
- `CustomComponent` — dynamically loaded from `/custom-components/{componentName}.js`

`FacetBar.js` does the same for facet components based on `facet.filterType`:

- Built-ins: `HierarchicalFacet`, `TextFacet`, `SliderFacet`, `RangeFacet`, `DatasetSelector`, …
- `CustomComponent` — same dynamic loading mechanism

### Custom components

Custom components are JavaScript bundles built with webpack and served at `/custom-components/{ComponentName}.js`. They must register themselves on `window.__customComponents[ComponentName]`.

**Loading**: `client/src/helpers/loadCustomComponent.js` injects a `<script>` tag and polls `window.__customComponents[name]` until the module is available.

**Shared libraries**: The main app exposes core dependencies on `window.__sharedLibraries` so custom components don't bundle their own copies:

```js
const { MUI, MuiIcons, intl, reactRedux, configsStore, helpers } = window.__sharedLibraries
```

Available libraries include: Material-UI, MUI Icons, react-intl-universal, react-redux, react-router-dom, lodash, PropTypes, query-string, and the Zustand configsStore.

**Props passed to a custom result component**: `results`, `fetching`, `resultClass`, `facetClass`, `facetState`, `facetUpdateID`, `resultClassConfig`, `perspectiveConfig`, `portalConfig`, `updateFacetOption`, `fetchResults`, `fetchPaginatedResults`, `showError`, and more.

**Props passed to a custom facet component**: `facetID`, `facetClass`, `facet`, `facetState`, `facetUpdateID`, `updatedFacet`, `updatedFilter`, `updateFacetOption`, `clearFacet`, `fetchFacet`, `perspectiveConfig`, `portalConfig`, and more.

---

## Server

### API routes

All routes are prefixed `/api/v1` (`server/src/index.js`):

| Endpoint | Method | Purpose |
|---|---|---|
| `/configs/*` | GET | Serves raw config files as static files |
| `/faceted-search/:resultClass/paginated` | POST | Paginated table results |
| `/faceted-search/:resultClass/all` | POST | All results (maps, charts, exports) |
| `/faceted-search/:resultClass/count` | POST | Result count |
| `/faceted-search/:facetClass/facet/:id` | POST | Facet values with counts |
| `/:resultClass/page` | POST | Single instance by URI |
| `/full-text-search` | GET | Jena full-text search |
| `/federated-search` | GET | Cross-endpoint federated search |
| `/health` | GET | Health check |

### Startup & config loading

`server/src/sparql/Utils.js` — `createBackendSearchConfig()`:

1. Loads `portalConfig.json` to determine `portalID`.
2. Loads **custom mappers** from `{portalID}/mappers.js` and merges them into the core mappers object via `Object.assign()`.
3. Loads **custom filters** from `{portalID}/filters.js` into `backendSearchConfig.customFilters`.
4. For each perspective in `portalConfig.perspectives.searchPerspectives`:
   - Loads the perspective JSON config.
   - Loads the SPARQL queries JS file and prefix file.
   - For each result class: resolves the `propertiesQueryBlock` reference to the actual SPARQL string; resolves `postprocess.func` and `resultMapper` string names to actual function references.
   - Runs `loadGeneralQueries()` to attach the standard query templates, with per-perspective overrides applied.
5. Repeats for `onlyInstancePages` perspectives.

The resulting `backendSearchConfig` object is keyed by `perspectiveID`. Each entry holds the fully-resolved perspective config including live function references.

### SPARQL query pipeline

For a paginated results request:

1. Fetch the `facetResultSetQuery` template from `perspectiveConfig.generalQueries`.
2. Replace placeholders:
   - `<FILTER>` → output of `generateConstraintsBlock()` (see below)
   - `<RESULT_SET_PROPERTIES>` → the `propertiesQueryBlock` SPARQL text
   - `<FACET_CLASS>` → the RDF class URI
   - `<LANG>` / `<LANG_SECONDARY>` → language tags
   - `<PAGE>` → `LIMIT n OFFSET m`
   - `<ORDER_BY>` / `<ORDER_BY_TRIPLE>` → sort clause
3. Prepend SPARQL prefixes.
4. `runSelectQuery()` POSTs to the SPARQL endpoint and receives JSON-LD bindings.
5. `resultMapper(bindings)` transforms the bindings into the shape the client component expects.
6. If `postprocess` is configured, `postprocess.func({ data, config })` runs over the mapped results.
7. Returns `{ data, sparqlQuery }`.

**General queries** (`server/src/sparql/SparqlQueriesGeneral.js`) provide the default templates for `facetResultSetQuery`, `countQuery`, `facetValuesQuery`, `instanceQuery`, etc. A perspective can override any of them by setting `"generalQueries": { "countQuery": "myCustomCountQuery" }` in its JSON config, pointing to a named export in the perspective's SPARQL queries file.

### Constraint/filter building

`server/src/sparql/Filters.js` — `generateConstraintsBlock()`:

Iterates the incoming `constraints` array (sorted by `priority`). For each constraint:

1. **Custom filter check**: if the facet config has a `customFilterName` field, look up that function in `backendSearchConfig.customFilters` and call it, returning the SPARQL string immediately.
2. **Standard switch** on `filterType`:
   - `textFilter` → full-text SPARQL pattern
   - `uriFilter` → `VALUES ?x { ... } ?subject predicate ?x` with optional hierarchy traversal
   - `spatialFilter` → spatial bounding box
   - `timespanFilter` / `dateFilter` → overlapping date-range FILTER
   - `dateNoTimespanFilter` → point-in-time date FILTER
   - `integerFilter` / `integerFilterRange` → numeric range FILTER

### Result mappers

A mapper transforms raw SPARQL bindings into a JS object/array the frontend component can consume.

**Standard signature** (bindings only):
```js
export const myMapper = (sparqlBindings) => { ... }
```

**With config** (when `resultMapperConfig` is set in the result class):
```js
export const myMapper = ({ sparqlBindings, config }) => { ... }
```

**Postprocess signature** (runs after mapping):
```js
export const myPostprocess = ({ data, config }) => { ... }
```

Built-in mappers live in `server/src/sparql/Mappers.js` (`makeObjectList`, `mapPlaces`, `mapFacet`, `mapAoristicChart`, `linearScale`, …). Custom mappers in `{portalID}/mappers.js` are merged on top and can override built-ins by exporting the same name.

---

## Config

A portal config directory has the following structure:

```
portalConfig.json                        # master config — portalID, perspectives, locales, layout
{portalID}/
  search_perspectives/
    {perspectiveID}.json                 # one file per searchable perspective
  only_instance_pages/
    {perspectiveID}.json                 # entity types accessible only via direct URL
  sparql_queries/
    prefixes.js                          # shared RDF prefix declarations
    {perspectiveID}.js                   # named SPARQL query string exports
  translations/
    localeEN.json
    localeNL.json
    …
  assets/
    logos/                               # portal logo, footer partner logos
    main_page/                           # perspective card images, banner
    maps/                                # PMTiles files, GeoJSON overlays
  mappers.js                             # custom result mapper functions
  filters.js                             # custom facet filter functions
```

### portalConfig.json

Top-level file. Key fields:
- `portalID` — subdirectory name the server loads configs from
- `perspectives.searchPerspectives` — ordered list of searchable perspective IDs
- `perspectives.onlyInstancePages` — perspective IDs for entity detail pages only
- `localeConfig` — available locales and their translation filenames
- `layoutConfig` — color palette, logo, main page banner, footer, top bar options

### Search perspective JSON

Each `search_perspectives/{id}.json` defines one faceted search view:

- `endpoint` — SPARQL endpoint URL, auth flag, prefixes file reference
- `sparqlQueriesFile` — which JS file exports the SPARQL queries for this perspective
- `generalQueries` — optional overrides for standard query templates (e.g. `"countQuery": "myCountQuery"`)
- `facetClass` — main RDF class being searched (e.g. `nmo:Coin`)
- `resultClasses` — object keyed by result class ID; each entry defines one tab/view
- `facets` — object keyed by facet ID; each entry defines one filter in the facet bar

**Result class fields** (common):

| Field | Purpose |
|---|---|
| `component` | Built-in component or `"CustomComponent"` |
| `componentName` | For `CustomComponent`: bundle name |
| `tabID`, `tabPath`, `tabIcon` | Tab ordering, URL segment, MUI icon |
| `sparqlQuery` | Named export from the queries JS file |
| `resultMapper` | Mapper function name |
| `filterTarget` | SPARQL variable filtered by facets (e.g. `"id"`) |
| `facetClass` | RDF class for this result class (often same as perspective) |
| `paginatedResultsConfig` | Table-specific: pagesize, sort, `propertiesQueryBlock` |
| `instanceConfig` | Instance page config: `propertiesQueryBlock`, nested result classes |
| `postprocess` | `{ func: "funcName", config: {...} }` — post-mapping transformation |
| `componentConfig` | Passed through to custom components |
| `customTilesLayer` | PMTiles map config: `{ type: "pmtiles", url: "maps/world.pmtiles", ... }` |

**Facet fields** (common):

| Field | Purpose |
|---|---|
| `filterType` | `"uriFilter"`, `"textFilter"`, `"integerFilter"`, `"timespanFilter"`, `"CustomComponent"`, … |
| `facetType` | `"list"`, `"text"`, `"integer"`, `"timespan"` |
| `containerClass` | Layout width (one, three, four, five, six, ten) |
| `predicate` | SPARQL property path to facet values |
| `customFilterName` | Name of a function in `filters.js` to use instead of the built-in filter |
| `componentName` | For `CustomComponent` filterType: bundle name |
| `componentConfig` | Passed through to custom facet components |
| `priority` | Constraint ordering when multiple filters are active |
| `sortBy`, `sortDirection` | Default sort for facet values |
| `searchField`, `sortButton` | UI controls shown in the facet |

### SPARQL query files

Each `sparql_queries/{perspectiveID}.js` exports named SPARQL fragments as template strings:

```js
export const coinProperties = `
  { ?id rdf:type nmo:Coin ; rdfs:label ?coinId__prefLabel . }
  UNION
  { ?id nmo:hasDenomination ?denomination__id .
    ?denomination__id rdfs:label ?denomination__prefLabel . }
`
```

The server inserts these fragments into general query templates by replacing placeholders like `<RESULT_SET_PROPERTIES>` and `<FILTER>`. The naming convention for SPARQL variables is `?varName__prefLabel` (display label), `?varName__id` (URI), `?varName__dataProviderUrl` (link).

A separate `prefixes.js` exports the string of PREFIX declarations shared across all queries in the portal.

### Locale files

`translations/localeEN.json` (and other locales) structure:

```json
{
  "appTitle": { "short": "...", "long": "..." },
  "tabs": { "table": "Table", "map": "Map", "aoristic_chart": "Aoristic chart" },
  "apexCharts": { "resultClasses": { "coinCountByRuler": "Coins per ruler" } },
  "perspectives": {
    "{perspectiveID}": {
      "label": "...",
      "facetResultsType": "...",
      "shortDescription": "...",
      "instancePage": { "label": "...", "description": "..." },
      "properties": {
        "{propertyID}": { "label": "...", "description": "..." }
      }
    }
  }
}
```

Property IDs in `properties` must match the facet IDs and result column IDs used in configs.

### Dummy-internal pages (static content pages)

A portal can add static content pages — declared as a perspective with
`"searchMode": "dummy-internal"` in `search_perspectives/{id}.json`, plus an `internalLink`.
They surface as main-page cards, top-bar buttons, and/or `topBar.infoDropdown` entries, and are
rendered by `client/src/components/main_layout/InternalPage.js` at the matching route in
`SemanticPortal.js`.

The page's content is looked up by **locale key** (the dropdown item / page `id`) in the
translation files. The value at that key can be either:

- **inline HTML** — `"myPage": "<p class=\"...\">…</p>"` (rendered via `intl.getHTML`), or
- **a reference to an external HTML file** — marked with the `htmlFile:` prefix, resolved
  relative to the portal config root and fetched at runtime:

```json
// localeEN.json
{ "myPage": "htmlFile:pages/myPage_en.html" }
// localeFI.json
{ "myPage": "htmlFile:pages/myPage_fi.html" }
```

Place the files under `{portalID}/pages/` (any path under `{portalID}/` works); they are served
by the existing `/api/v1/configs/*` static route, so no server change is needed. Because the
reference lives in the per-locale translation file, each language points to its own HTML file.
`<a href="/…">` links in the file are turned into in-app router links (`HTMLParser`,
`HTMLParserTask: 'addReactRouterLinks'`). Omitting the `htmlFile:` prefix keeps the old inline
behavior.

### mappers.js

Export functions that transform SPARQL bindings. They are merged with and can override core mappers:

```js
export const myMapper = (sparqlBindings) =>
  sparqlBindings.map(b => ({ id: b.id.value, label: b.label.value }))
```

Reference the function by name as `"resultMapper": "myMapper"` in a result class config.

### filters.js

Export functions that generate SPARQL filter patterns. Activated by setting `"customFilterName": "myFilter"` on any facet config:

```js
export const myFilter = ({ filterTarget, values, inverse }) => {
  // values shape depends on the facet's filterType (array of URIs for uriFilter, etc.)
  return `?${filterTarget} my:predicate <${values[0]}> .`
}
```

The full signature is `({ backendSearchConfig, facetClass, facetID, filterTarget, values, inverse })`.

---

## Combo Build

The combo build packages the React client, Express server, and nginx into a **single container** that exposes everything on port 80. This is the standard production deployment.

### How it works

`Dockerfile` uses a three-stage multi-stage build:

1. **client-build** — Builds the React bundle with `API_URL=/api/v1` (a relative path so requests go through nginx).
2. **server-build** — Transpiles the Express server with Babel.
3. **combo-prd** — Alpine runtime that installs nginx, copies both build outputs in, and uses `combo-entrypoint.sh` as the entrypoint.

### Request routing inside the container

nginx (`combo-nginx.conf`) listens on port 80 and routes:

| Path | Target |
|---|---|
| `/api/*` | `http://127.0.0.1:3001` (Express) |
| `/health` | `http://127.0.0.1:3001/health` (Express) |
| `/custom-components/*` | `/app/custom-components/` (volume-mounted directory) |
| everything else | React SPA (`index.html` fallback for client-side routing) |

Express still runs on port 3001 inside the container but is not published externally.

### Startup sequence (`combo-entrypoint.sh`)

1. Start Express in the background.
2. Poll `/health` until Express is ready (up to 30 retries).
3. Optionally fetch a custom `index.html` and `robots.txt` from the configs endpoint and patch them into the nginx web root.
4. Run `envsubst` on the nginx config to apply `$SAMPO_UI_CLIENT_PORT` (default 80) and `$SAMPO_UI_SERVER_PORT` (default 3001).
5. Start nginx in the foreground.

### Using the combo image in a portal

A portal (e.g. NuMAD) builds on top of the published `sampo-ui-combo` image:

```dockerfile
FROM ghcr.io/ghentcdh/sampo-ui-combo:vX.Y.Z
COPY --from=builder /app/dist/ /app/custom-components/
COPY sampoConfigs/ /app/configs/
```

At runtime, bind-mount overrides are also supported:

```yaml
volumes:
  - ./sampoConfigs:/app/configs
  - ./custom_components/dist:/app/custom-components
```

Custom components are picked up from `/app/custom-components/` and served by nginx at `/custom-components/{ComponentName}.js`.
