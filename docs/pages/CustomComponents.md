# Custom Components, mappers and queries

For projects where the components sampo-ui offers do not suffice, you have the option of making your own custom components.
Your custom components are part of your own config and are thus completely separate from the core sampo app; which allows
you to make components that are highly specific to your app. 

## Custom component logic
Custom components have to be built beforehand and then mounted into client image. At runtime if a config refers to a
custom component, sampo will be able to find and render said custom component from the mounted volume. Sampo passes
a lot of config as props to the component which allows for a lot of flexibility when developing them. 

The sampo client registers its react instance, important libraries as well as all default sampo components on 
`window.__sharedLibraries`.
This allows the custom components to make use of all of those and further expand on existing sampo components. Of course when building custom components you can also 
add extra libraries since they have their own `package.json`.

### Props and shared libraries
Under the example `custom_components` in the `index.jsx` of the custom components directory in this repository you can 
see exactly what props are passed in the `propTypes`.
The shared `webpack.base.js` registers all the shared libraries as externals.

### Building
To build a component you can run:
```bash
npx webpack --config "<path_to_component>/webpack.config.js" --mode production
```
Or to build them all simply run the `build.sh` script.

## Making custom result components
A custom result component is just a React component that gets bundled to `dist/{ComponentName}.js`.
It receives the exact same props every built-in result component does: `results`, `fetching`,
`resultClass`, `facetClass`, `facetState`, `facetUpdateID`, the fetch and sort actions
(`fetchResults`, `fetchPaginatedResults`, `sortResults`, …) and the full config objects
(`resultClassConfig`, `perspectiveConfig`, `portalConfig`). See the `propTypes` in
`ExampleCustomComponent` for the complete list.

The simplest custom component wraps an existing sampo component imported from
`@sampo-ui/components` and forwards its props:
```jsx
import React from 'react'
import { ResultTable } from '@sampo-ui/components'

const MyTable = (props) => <ResultTable {...props} />
export default MyTable
```

The mapped output of the result class' `resultMapper` is what ends up in the `results` prop.

To use the component, set `"component": "CustomComponent"` and point `componentName` at the bundle
filename (without `.js`) in the result class config. It then behaves like any other result tab:
```json
"myResultClass": {
  "tabID": 3,
  "tabPath": "mymap",
  "tabIcon": "BubbleChart",
  "component": "CustomComponent",
  "componentName": "MyResultComponent",
  "sparqlQuery": "myResultQuery",
  "facetClass": "myFacetClass",
  "filterTarget": "id",
  "resultMapper": "makeObjectList"
}
```

## Making custom mappers
In your config directory you can add a `mappers.js` file. All the mapper functions written in there will be loaded by 
the server on startup, meaning you can use them as you would any default mapper.

## Making custom facet components
A custom facet component is mounted in the facet bar and receives the facet props: `facetID`,
`facetClass`, `facet`, `facetState`, `updateFacetOption`, `clearFacet`, `fetchFacet`, … (see the
`propTypes` in `ExampleCustomFacet`). Read the current selection from `facet.<option>` (or
`facetState.facets[facetID]`), and push changes back with
`updateFacetOption({ facetClass, facetID, option, value })`. For custom facets the convention is
to store the selection under the `customFilter` option, so a custom filter can pick it up
server-side:
```jsx
updateFacetOption({ facetClass, facetID, option: 'customFilter', value })
```
Use `facet.componentConfig` to parameterize the component — anything you put in that config object
is passed straight through to the component, so you can reuse the same component with different
settings.

In the facet config set `"filterType": "CustomComponent"` and `componentName`. A custom facet
almost always pairs with a `customFilterName` (see below) so its selection becomes an actual SPARQL
constraint:
```json
"myFacet": {
  "containerClass": "ten",
  "facetType": "text",
  "filterType": "CustomComponent",
  "componentName": "MyFacetComponent",
  "customFilterName": "myFilter",
  "priority": 10,
  "componentConfig": {
    "someSetting": 42,
    "anotherSetting": "value"
  }
}
```

## Making custom filters
A custom facet usually also requires a custom filter function. The facet's `customFilterName`
names a function exported from your config's `filters.js` (see the `filters.js` section in
`AGENTS.md`). The server calls it with the value your component stored via `updateFacetOption` and
injects the returned SPARQL into the query's `<FILTER>` slot.

Facet config — wire the component to its filter with `customFilterName`:
```json
"myFacet": {
  "facetType": "custom",
  "filterType": "CustomComponent",
  "componentName": "MyFacetComponent",
  "customFilterName": "myFilter"
}
```
The matching filter in `filters.js` returns the SPARQL snippet:
```js
export const myFilter = ({ values, filterTarget }) => {
  const value = parseInt(values, 10)
  if (!Number.isInteger(value)) return ''
  return `?${filterTarget} my:predicate ${value} .`
}
```
The full signature is `({ backendSearchConfig, facetClass, facetID, filterTarget, values, inverse })`;
`values` is whatever the facet stored (a plain value for the example above, an array of URIs for a
`uriFilter`, etc).

## Overwriting general queries
The general sparql queries from sampo will sometimes not work for certain types of sparql endpoints, or will not be 
sufficient in some specific cases. These general queries can be overwritten per perspective by writing new ones in the
perspective's sparql queries file and putting a `generalQueries` object in the perspective's json config.
```json
"generalQueries": {
  "facetResultSetQuery": "customFacetResultSetQuery",
  "facetValuesQuery": "customFacetValuesQuery"
}
```

## robots.txt and index.html
To use a custom `robots.txt` file you can simply add a `robots.txt` file in the root of your configs. When the 
`docker-entrypoint.sh` script of the client for production runs, it will replace the default `robots.txt` by your custom 
one (if one is available).


Unfortunately `index.html` is not as easy to replace. Since at build time the react app gets built into it. What we can 
do however is choose to only replace part of the `<head>` tag. So to allow for a custom `index.html` without breaking 
the app you can still add one in your configs. The entrypoint script will replace the start of the `<head>` tag until 
the end of the `</title>` tag by whatever is there in your custom `index.html`. 