import {
  actorPropertiesFacetResults,
  actorPropertiesInstancePage
} from '../sparql_queries/SparqlQueriesEmloActors'
import { prefixes } from '../sparql_queries/SparqlQueriesPrefixesEmlo'

export const actorsConfig = {
  endpoint: {
    url: 'http://ldf.fi/emlo/sparql',
    prefixes,
    useAuth: true
  },
  facetClass: 'crm:E21_Person crm:E74_Group',
  paginatedResults: {
    properties: actorPropertiesFacetResults
  },
  instance: {
    properties: actorPropertiesInstancePage,
    relatedInstances: ''
  },
  facets: {
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryPredicate: '', // empty for querying the facetClass
      textQueryProperty: 'skos:prefLabel', // limit only to prefLabels
      type: 'text'
    },
    gender: {
      id: 'gender',
      facetValueFilter: '',
      label: 'Gender',
      labelPath: 'foaf:gender',
      predicate: 'foaf:gender',
      type: 'text'
    },
    type: {
      id: 'type',
      facetValueFilter: '',
      label: 'Type',
      labelPath: 'a',
      predicate: 'a',
      type: 'text'
    },
    birthDateTimespan: {
      id: 'birthDateTimespan',
      facetValueFilter: '',
      sortByAscPredicate: 'eschema:birthDate/crm:P82a_begin_of_the_begin',
      sortByDescPredicate: 'eschema:birthDate/crm:P82b_end_of_the_end',
      predicate: 'eschema:birthDate',
      startProperty: 'crm:P82a_begin_of_the_begin',
      endProperty: 'crm:P82b_end_of_the_end',
      dataType: 'xsd:dateTime',
      type: 'timespan'
    },
    deathDateTimespan: {
      id: 'deathDateTimespan',
      facetValueFilter: '',
      sortByAscPredicate: 'eschema:deathDate/crm:P82a_begin_of_the_begin',
      sortByDescPredicate: 'eschema:deathDate/crm:P82b_end_of_the_end',
      predicate: 'eschema:deathDate',
      startProperty: 'crm:P82a_begin_of_the_begin',
      endProperty: 'crm:P82b_end_of_the_end',
      dataType: 'xsd:dateTime',
      type: 'timespan'
    }
  }
}
