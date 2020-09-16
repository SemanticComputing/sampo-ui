import {
  personPropertiesFacetResults,
  findPropertiesInstancePage
} from '../sparql_queries/SparqlQueriesHellerau'
import { prefixes } from '../sparql_queries/SparqlQueriesPrefixes'

export const hellerauConfig = {
  endpoint: {
    // url: 'https://ldf.fi/sualt-fha-finds/sparql',
    url: 'http://localhost:3037/ds/sparql',
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
    }
  }
}
