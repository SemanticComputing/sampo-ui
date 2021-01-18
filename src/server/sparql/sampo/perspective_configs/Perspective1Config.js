import {
  manuscriptPropertiesFacetResults,
  manuscriptPropertiesInstancePage
} from '../sparql_queries/SparqlQueriesPerspective1'
import { prefixes } from '../sparql_queries/SparqlQueriesPrefixes'

export const perspective1Config = {
  endpoint: {
    url: 'http://ldf.fi/mmm/sparql',
    prefixes,
    useAuth: false
  },
  facetClass: 'frbroo:F4_Manifestation_Singleton',
  includeInSitemap: true,
  // defaultConstraint: `
  //   <SUBJECT> dct:source mmm-schema:Bibale .
  // `,
  paginatedResults: {
    properties: manuscriptPropertiesFacetResults
  },
  instance: {
    properties: manuscriptPropertiesInstancePage,
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
    author: {
      id: 'author',
      facetValueFilter: '',
      label: 'Author',
      labelPath: 'mmm-schema:manuscript_author/skos:prefLabel',
      predicate: 'mmm-schema:manuscript_author',
      type: 'list'
    },
    work: {
      id: 'work',
      labelPath: 'mmm-schema:manuscript_work/skos:prefLabel',
      textQueryPredicate: 'mmm-schema:manuscript_work', // text query for works
      textQueryProperty: '', // query everything in text index
      type: 'text'
    },
    productionPlace: {
      id: 'productionPlace',
      facetValueFilter: `
        ?id dct:source <http://vocab.getty.edu/tgn/> .
        `,
      label: 'Production place',
      labelPath: '^crm:P108_has_produced/crm:P7_took_place_at/skos:prefLabel',
      predicate: '^crm:P108_has_produced/crm:P7_took_place_at',
      parentProperty: 'gvp:broaderPreferred',
      type: 'hierarchical'
    },
    productionTimespan: {
      id: 'productionTimespan',
      facetValueFilter: '',
      sortByAscPredicate: '^crm:P108_has_produced/crm:P4_has_time-span/crm:P82a_begin_of_the_begin',
      sortByDescPredicate: '^crm:P108_has_produced/crm:P4_has_time-span/crm:P82b_end_of_the_end',
      predicate: '^crm:P108_has_produced/crm:P4_has_time-span',
      startProperty: 'crm:P82a_begin_of_the_begin',
      endProperty: 'crm:P82b_end_of_the_end',
      type: 'timespan'
    },
    note: {
      id: 'note',
      labelPath: 'crm:P3_has_note',
      textQueryPredicate: '', // empty for querying the facetClass
      textQueryProperty: 'crm:P3_has_note',
      type: 'text'
    },
    transferOfCustodyPlace: {
      id: 'productionPlace',
      facetValueFilter: `
        ?id dct:source <http://vocab.getty.edu/tgn/> .
        `,
      label: 'Transfer of custody place',
      labelPath: '^crm:P30_transferred_custody_of/crm:P7_took_place_at/skos:prefLabel',
      predicate: '^crm:P30_transferred_custody_of/crm:P7_took_place_at',
      parentProperty: 'gvp:broaderPreferred',
      type: 'hierarchical'
    },

    transferOfCustodyTimespan: {
      id: 'transferOfCustodyTimespan',
      facetValueFilter: '',
      sortByAscPredicate: '^crm:P30_transferred_custody_of/crm:P4_has_time-span/crm:P82a_begin_of_the_begin',
      sortByDescPredicate: '^crm:P30_transferred_custody_of/crm:P4_has_time-span/crm:P82b_end_of_the_end',
      predicate: '^crm:P30_transferred_custody_of/crm:P4_has_time-span',
      startProperty: 'crm:P82a_begin_of_the_begin',
      endProperty: 'crm:P82b_end_of_the_end',
      type: 'timespan'
    },
    lastKnownLocation: {
      id: 'lastKnownLocation',
      facetValueFilter: `
        ?id dct:source <http://vocab.getty.edu/tgn/> .
        `,
      label: 'Production place',
      labelPath: 'mmm-schema:last_known_location/skos:prefLabel',
      predicate: 'mmm-schema:last_known_location',
      parentProperty: 'gvp:broaderPreferred',
      type: 'hierarchical'
    },
    language: {
      id: 'language',
      facetValueFilter: '',
      label: 'Language',
      labelPath: 'crm:P128_carries/crm:P72_has_language/skos:prefLabel',
      predicate: 'crm:P128_carries/crm:P72_has_language',
      type: 'list'
    },
    material: {
      id: 'material',
      facetValueFilter: '',
      label: 'Language',
      labelPath: 'crm:P45_consists_of/skos:prefLabel',
      predicate: 'crm:P45_consists_of',
      type: 'list'
    },
    height: {
      id: 'height',
      facetValueFilter: '',
      labelPath: 'mmm-schema:height/crm:P90_has_value',
      predicate: 'mmm-schema:height/crm:P90_has_value',
      type: 'integer'
    },
    width: {
      id: 'width',
      facetValueFilter: '',
      labelPath: 'mmm-schema:width/crm:P90_has_value',
      predicate: 'mmm-schema:width/crm:P90_has_value',
      type: 'integer'
    },
    folios: {
      id: 'folios',
      facetValueFilter: '',
      labelPath: 'mmm-schema:folios/crm:P90_has_value',
      predicate: 'mmm-schema:folios/crm:P90_has_value',
      type: 'integer'
    },
    lines: {
      id: 'lines',
      facetValueFilter: '',
      labelPath: 'mmm-schema:lines/crm:P90_has_value',
      predicate: 'mmm-schema:lines/crm:P90_has_value',
      type: 'integer'
    },
    columns: {
      id: 'columns',
      facetValueFilter: '',
      labelPath: 'mmm-schema:columns/crm:P90_has_value',
      predicate: 'mmm-schema:columns/crm:P90_has_value',
      type: 'integer'
    },
    miniatures: {
      id: 'miniatures',
      facetValueFilter: '',
      labelPath: 'mmm-schema:miniatures/crm:P90_has_value',
      predicate: 'mmm-schema:miniatures/crm:P90_has_value',
      type: 'integer'
    },
    decoratedInitials: {
      id: 'decoratedInitials',
      facetValueFilter: '',
      labelPath: 'mmm-schema:decorated_initials/crm:P90_has_value',
      predicate: 'mmm-schema:decorated_initials/crm:P90_has_value',
      type: 'integer'
    },
    historiatedInitials: {
      id: 'historiatedInitials',
      facetValueFilter: '',
      labelPath: 'mmm-schema:historiated_initials/crm:P90_has_value',
      predicate: 'mmm-schema:historiated_initials/crm:P90_has_value',
      type: 'integer'
    },
    collection: {
      id: 'collection',
      facetValueFilter: '',
      labelPath: 'crm:P46i_forms_part_of/skos:prefLabel',
      predicate: 'crm:P46i_forms_part_of',
      type: 'list'
    },
    owner: {
      id: 'owner',
      facetValueFilter: '',
      label: 'Owner',
      labelPath: 'crm:P51_has_former_or_current_owner/skos:prefLabel',
      predicate: 'crm:P51_has_former_or_current_owner',
      type: 'list'
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      label: 'Source',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list'
    }
  }
}
