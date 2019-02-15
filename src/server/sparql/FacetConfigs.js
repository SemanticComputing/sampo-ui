export const facetConfigs = {
  productionPlace: {
    id: 'productionPlace',
    label: 'Production place',
    labelPath: '^crm:P108_has_produced/crm:P7_took_place_at/skos:prefLabel',
    predicate: '^crm:P108_has_produced/crm:P7_took_place_at',
    parentPredicate: '^crm:P108_has_produced/crm:P7_took_place_at/gvp:broaderPreferred+',
    type: 'hierarchical',
  },
  author: {
    id: 'author',
    label: 'Author',
    labelPath: 'mmm-schema:manuscript_author/skos:prefLabel',
    predicate: 'mmm-schema:manuscript_author',
    type: 'list'
  },
  source: {
    id: 'source',
    label: 'Source',
    labelPath: 'dct:source/skos:prefLabel',
    predicate: 'dct:source',
    type: 'list',
  },
  language: {
    id: 'language',
    label: 'Language',
    labelPath: 'crm:P128_carries/crm:P72_has_language',
    predicate: 'crm:P128_carries/crm:P72_has_language',
    type: 'list',
  },
  productionTimespan: {
    id: 'productionTimespan',
    label: 'Production Date',
    labelPath: '^crm:P108_has_produced/crm:P4_has_time-span/skos:prefLabel',
    type: 'list',
  },
  prefLabel: {
    id: 'prefLabel',
    label: 'Title',
    labelPath: 'skos:prefLabel',
    type: 'list',
  },
  event: {
    id: 'event',
    label: 'Event',
    labelPath: '^mmm-schema:observed_manuscript/mmm-schema:observed_time-span',
    type: 'list',
  },
};
