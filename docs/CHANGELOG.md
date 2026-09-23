# Changelog

This changelog documents the changes made in the **GhentCDH fork** of
[SemanticComputing/sampo-ui](https://github.com/SemanticComputing/sampo-ui), covering everything
from the fork point (`2cb7a97`, June 2025) through the current state (July 2026).

It is written for **developers building a Sampo portal**, focusing on what actually changes for you
rather than internal implementation details. For deeper reference see [`AGENTS.md`](../AGENTS.md)
and the [docs pages](README.md).

---

## v4.0.0 — Fork (major re-architecture)

> As the README notes: **v3 → v4 is a major change to how portals are built.**
>
> In short: your portal is now defined entirely by a **mounted config directory** (plus optional
> custom components) and shipped as **Docker images**. You no longer fork or edit the framework
> source code to build a portal — you configure and deploy it.

### 1. How you build a portal now (the biggest change)

- **Your whole portal lives in a config directory** (`configs/{portalID}/…`): the portal and
  perspective JSON, SPARQL queries, translations, and assets. Making a portal no longer means
  editing framework source.
- **Client and server are separate packages.** You configure and deploy them rather than building
  the framework yourself.
- **Config is loaded at runtime** — the server reads the config on startup and the client fetches
  it over HTTP — so you can change config without rebuilding the app.

### 2. Deploying your portal

- **Ship as Docker images**: run the client and server separately, or use the single **combo
  image** that serves everything on port 80 with the API under `/api`. Prebuilt images are
  published to GitHub Container Registry (GHCR).
- **Provide your config by mounting `configs/` (and custom components) as volumes**, or bake them
  into your own image built on top of the combo image.
- **Configure behavior with environment variables** (default SPARQL endpoint, client `API_URL`,
  ports) and an `.env` file. See `example.env` and `compose.yaml` / `compose-prod.yaml`.
- **Drop in a custom `robots.txt`** and partially override `index.html` for production; a `/health`
  endpoint is available for orchestration/health checks.

### 3. Extending beyond the built-ins (custom components)

- **Custom result components and custom facet components.** Build them separately, mount them in,
  and reference them from config (`"component": "CustomComponent"` for results,
  `"filterType": "CustomComponent"` for facets). They can reuse core Sampo components and MUI
  through shared libraries, so you don't rebuild what already exists.
- **Custom mappers** (`mappers.js`) and **custom filters** (`filters.js`) live in your config
  directory and are loaded on startup. Wire a filter to a facet with `customFilterName`.
- **Override the default (general) SPARQL queries** per perspective via `generalQueries` — useful
  for endpoints where the defaults don't fit.

See [Custom Components](pages/CustomComponents.md) for full details.

### 4. New config-driven layout & content options

- **Customisable main layout**, including **cards per row**.
- **Configurable footers**; the `infoDropdown` and feedback button are now optional.
- **Static content / text pages** with their own top-bar routes. Page content can be inline HTML
  or an external HTML file referenced from your locale files with the `htmlFile:` prefix.
- **Custom theming** via `layoutConfig.customCssFile`.

### 5. New map & chart capabilities for result classes

- **PMTiles basemaps** for both Leaflet and react-map-gl maps.
- The **Deck** map component was upgraded to modern react-map-gl / **MapLibre** (Mapbox fixed).
- Generic **aoristic charts** (ported and generalized from CoinSampo).
- **ApexCharts with exact dates on the x-axis**, plus `sliceVisibilityThreshold` and customizable
  category labels on facet charts.

### 6. Search / filter improvements & fixes

- **Text search is case-insensitive by default**, with an optional **regex** search mode.
- Option to use a **`defaultSparql` endpoint**, avoiding the requirement for Jena text-index
  filters.
- Fixes to the integer `NOT EXISTS` filter, multiple literal selections in facets, date/timespan
  filters, the empty-data chart mapper, custom-filter chips, and config-fetch error handling.

### 7. Under the hood (for maintainers, not portal authors)

- Upgraded to **Node 22**, **React 18**, and **MUI v6** (migrated off the deprecated
  `@mui/styles`).
- Introduced a **Zustand store** for configs and static assets, plus a range of dependency
  modernizations.
- Added architecture/reference docs (`AGENTS.md`, the `docs/` pages) and rewrote the README for the
  v4 workflow.
