import {
  personPropertiesFacetResults,
  findPropertiesInstancePage
} from '../sparql_queries/SparqlQueriesHellerau'
import { prefixes } from '../sparql_queries/SparqlQueriesPrefixes'

export const hellerauConfig = {
  endpoint: {
    url: 'https://ldf.fi/hellerau/sparql',
    // url: 'http://localhost:3037/ds/sparql',
    prefixes,
    useAuth: false
  },
  facetClass: 'foaf:person',
  paginatedResults: {
    properties: personPropertiesFacetResults
  },
  instance: {
    properties: findPropertiesInstancePage,
    relatedInstances: ''
  },
  facets: {
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryPredicate: '', // empty for querying the facetClass
      textQueryProperty: '',
      type: 'text'
    },
    home1930: {
      id: 'home1930',
      predicate: 'h-schema:home_1930',
      labelPath: 'h-schema:home_1930/gn:name',
      facetValueFilter: '',
      facetLabelPredicate: 'gn:name',
      type: 'list'
    },
    home1937: {
      id: 'home1937',
      predicate: 'h-schema:home_1937',
      labelPath: 'h-schema:home_1937/gn:name',
      facetValueFilter: '',
      facetLabelPredicate: 'gn:name',
      type: 'list'
    }
  }
}
