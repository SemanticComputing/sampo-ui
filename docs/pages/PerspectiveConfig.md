# Perspectives config

Every perspective referenced in `portalConfig.json` needs a perspective json config file. Some example configs are presented here.

## Search perspectives
Search perspectives are the perspectives for faceted search pages.

### General structure

```
{
    "id": "corporations",
    ... // more general config
    "resultClasses": {
        "corporations": {
            "paginatedResultsConfig": {
                "tabID": 0,
                "component": "ResultTable",
                ... // more resultclass config
            },
            "instanceConfig": {
                ...
                "instancePageResultClasses": {
                    "instancePageTable": {
                        "tabID": 0,
                        "component": "InstancePageTable",
                        ...
                    }
                }
            }
        },
        "export": {
            "tabID": 1,
            "component": "ExportCSV",
            ...
        },
        ... //more tabs
    },
    "properties": [
        {
            "id": "scobID",
            ... // more property config
        },
        {
            "id": "uri",
            ...
        },
        ... // more properties
    ],
    "facets": {
        "corporationName": {
            ... // facet config
        },
        ... // more facets
    }
}
```

The id of the perspective is what you need to reference in `portalConfig.json`. 

In resultClasses you define all the different tabs you want in your perspective, as well as eventually an instanceConfig if you want an instance page with the same properties as your table.

Under properties, you can define all the columns shown in your table.

Under facets, you can define all the filters and sorting predicates of your columns.

---

### General config properties
```
"id": "corporations",
"endpoint": {
    "url": "",
    "useAuth": false,
    "prefixesFile": "SparqlQueriesPrefixes.js",
    "defaultSparql": true
},
"generalQueries": {
    "facetResultSetQuery": "facetResultSetQueryCustom"
},
"sparqlQueriesFile": "SparqlQueriesScob.js",
"baseURI": "http://example.com/resource",
"URITemplate": "<BASE_URI>/corporation/<LOCAL_ID>",
"facetClass": "bhf:Corporation",
"frontPageImage": "main_page/events-452x262.jpg",
"searchMode": "faceted-search",
"defaultTab": "table",
"defaultInstancePageTab": "table",
```

#### Instance page URLs: `baseURI`, `URITemplate` and `instancePageUrlMode`

Instance page URLs contain only a short `LOCAL_ID`, not the full resource URI. `baseURI` and
`URITemplate` are what turn that `LOCAL_ID` back into the URI that gets queried, so `URITemplate`
must be the exact inverse of however your SPARQL builds the link. `<LOCAL_ID>` must be the **last**
segment of `URITemplate`.

`instancePageUrlMode` chooses the URL shape:

| Value | Instance page URL for `http://example.com/resource/corporation/12345` |
|---|---|
| omitted / `"localID"` | `/en/corporations/page/12345` (default) |
| `"uri"` | `/en/resource/corporation/12345` |

In `"uri"` mode the URL path is the resource URI's path, so in production — where the portal is
served from the same domain as your URIs — the URI itself is a working address: opening
`http://example.com/resource/corporation/12345` lands on the instance page (it redirects to add the
default locale, exactly like a locale-less link does today). Only the URI's *path* is ever used in
URLs, and the URI is rebuilt from the configured `baseURI` rather than from the browser's address,
so the same config also works in development on `localhost:8080/resource/corporation/12345`.

`"uri"` mode requires both `baseURI` and `URITemplate`; if either is missing it falls back to the
default URL shape. Faceted search URLs are unaffected and keep the `/en/corporations/faceted-search/table`
form, so a portal using this mode has two URL styles side by side.

Each mode needs a matching `dataProviderUrl` binding in your SPARQL — this is what builds the link,
and the framework uses the string verbatim. Default mode keeps only the last URI segment:

```sparql
BIND(CONCAT("/corporations/page/", REPLACE(STR(?id), "^.*\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
```

`"uri"` mode drops `/page/` and the perspective, and emits the URI's path instead. The domain is
written out in full because it is a property of your data, identical in development and production:

```sparql
BIND(IF(STRSTARTS(STR(?id), "http://example.com/resource/"),
        STRAFTER(STR(?id), "http://example.com"), "") AS ?prefLabel__dataProviderUrl)
```

The `STRSTARTS` guard matters: `STRAFTER` returns an empty string when the URI does not start with
your domain, and a resource with an empty `dataProviderUrl` renders as plain text instead of a link.

Limitations of `"uri"` mode: URIs with `#` fragments cannot be used (a `#` becomes a browser
fragment); the `baseURIs` prefix-map is not supported (use the singular `baseURI`); and because the
route is mounted at the site root, the first path segment of your URIs must not collide with a
locale code or a perspective id.

---

### Table resultClass
The most basic resultclass used in virtually every perspective is table with also an associated instance page. 

#### ResultClass
```
"resultClasses": {
  "yourTable": {
      "paginatedResultsConfig": {
          "tabID": 0,
          "component": "ResultTable",
          "tabPath": "table",
          "tabIcon": "CalendarViewDay",
          "propertiesQueryBlock": "yourQueryBlock",
          "pagesize": 20,
          "sortBy": null,
          "sortDirection": null
      },
      "instanceConfig": {
          "propertiesQueryBlock": "yourQueryBlock",
          "instancePageResultClasses": {
              "instancePageTable": {
                  "tabID": 0,
                  "component": "InstancePageTable",
                  "tabPath": "table",
                  "tabIcon": "CalendarViewDay"
              }
          }
      }
  },
  ...
},
```
See [sparql config](./SparqlConfig.md) for how to exactly config your sparql queries.

#### Properties
```
"properties": [
    {
        "id": "ID",
        "valueType": "object",
        "makeLink": true,
        "externalLink": false,
        "sortValues": true,
        "numberedList": false,
        "minWidth": 30
    },
    {
        "id": "uri",
        "valueType": "object",
        "makeLink": false,
        "sortValues": true,
        "onlyOnInstancePage": true
    },
    {
        "id": "name",
        "valueType": "object",
        "makeLink": true,
        "externalLink": false,
        "sortValues": true,
        "sortBy": "startDate",
        "numberedList": false,
        "minWidth": 250
    },
    ...
],
```
The properties list lists all columns that can be displayed in the table. See [sparql config](./SparqlConfig.md) for how exactly to query the data to be displayed in the table. `onlyOnInstancePage` can be set to only display the value on instance pages as to not bloat the results table. `sortBy` defines by which field a cell with multiple entries will be sorted.

#### Facets
```
"facets": {
  "id": {
      "sortByPredicate": "ex:id"
  },
  "name": {
      "containerClass": "one",
      "facetType": "text",
      "filterType": "textFilter",
      "sortByPredicate": "ex:hasName/rdfs:label",
      "textQueryProperty": "ex:hasName/rdfs:label"
  },
}
```

Under facets the filter facets on the left side of the result components get defined. `sortByPredicate` can also be defined here which declares which predicate should be used to sort on the matching column. 

Facets can use a variety of default components and filters. Custom facet components and filters are also supported as documented in [custom components](./CustomComponents.md).

---

