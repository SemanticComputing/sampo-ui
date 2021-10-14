// import {
//   speechPropertiesFacetResults,
//   speechPropertiesInstancePage
// } from '../sparql_queries/SparqlQueriesSpeeches'
import { prefixes } from '../sparql_queries/SparqlQueriesPrefixes'

export const speechesConfig = {
  endpoint: {
    url: 'http://ldf.fi/semparl/sparql',
    prefixes,
    useAuth: true
  },
  facetClass: 'semparls:Speech',
  langTag: 'fi',
  includeInSitemap: true,
  // defaultConstraint: `
  //   <SUBJECT> dct:source mmm-schema:Bibale .
  // `,
  // paginatedResults: {
  //   properties: speechPropertiesFacetResults
  // },
  // instance: {
  //   properties: speechPropertiesInstancePage,
  //   relatedInstances: '',
  //   defaultTab: 'table'
  // },
  facets: {
    contentTextFacet: {
      textQueryPredicate: '', // empty for querying the facetClass
      textQueryProperty: 'semparls:content',
      type: 'text'
    },
    prefLabel: {
      labelPath: 'skos:prefLabel'
    },
    speaker: {
      facetValueFilter: '',
      labelPath: 'semparls:speaker/skos:prefLabel',
      predicate: 'semparls:speaker',
      type: 'list'
    },
    party: {
      facetValueFilter: '',
      labelPath: 'semparls:party/skos:prefLabel',
      predicate: 'semparls:party',
      type: 'list',
      facetLabelFilter: 'FILTER(LANG(?prefLabel_) = "<LANG>")'
    },
    speechType: {
      facetValueFilter: '',
      labelPath: 'semparls:speechType/skos:prefLabel',
      predicate: 'semparls:speechType',
      type: 'list'
    },
    language: {
      facetValueFilter: '',
      labelPath: 'dct:language/skos:prefLabel',
      predicate: 'dct:language',
      type: 'list',
      facetLabelFilter: 'FILTER(LANG(?prefLabel_) = "<LANG>")'
    },
    date: {
      facetValueFilter: '',
      labelPath: 'dct:date',
      predicate: 'dct:date',
      type: 'dateNoTimespan'
    },
    referencedPlace: {
      facetValueFilter: '?id a crm:E53_Place', // use only semparl places
      labelPath: 'semparl_linguistics:referenceToPlaceName/semparl_linguistics:link/skos:prefLabel',
      predicate: 'semparl_linguistics:referenceToPlaceName/semparl_linguistics:link',
      type: 'list',
      facetLabelFilter: `
        FILTER(LANG(?prefLabel_) = "<LANG>")`
    },
    documentType: {
      facetValueFilter: '',
      // labelPath: 'semparls:item/(semparls:relatedDocument|semparls:legislativeMotion|semparls:account|semparls:debateMotion|semparls:committeeReport|semparls:governmentProposal)/a',
      labelPath: 'semparls:item/semparls:governmentProposal/a',
      predicate: 'semparls:item/semparls:governmentProposal/a',
      type: 'list'
    }
  }
}
