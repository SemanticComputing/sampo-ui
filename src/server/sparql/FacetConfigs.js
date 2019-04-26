export const facetConfigs = {
  manuscripts: {
    rdfType: 'frbroo:F4_Manifestation_Singleton',
    productionPlace: {
      id: 'productionPlace',
      facetValueFilter: `
      ?id dct:source <http://vocab.getty.edu/tgn/> .
      FILTER(?id != <http://ldf.fi/mmm/places/tgn_7031096>)
      `,
      label: 'Production place',
      labelPath: '^crm:P108_has_produced/crm:P7_took_place_at/skos:prefLabel',
      predicate: '^crm:P108_has_produced/crm:P7_took_place_at',
      parentPredicate: '^crm:P108_has_produced/crm:P7_took_place_at/gvp:broaderPreferred+',
      type: 'hierarchical',
    },
    author: {
      id: 'author',
      facetValueFilter: '',
      label: 'Author',
      labelPath: 'mmm-schema:manuscript_author/skos:prefLabel',
      predicate: 'mmm-schema:manuscript_author',
      type: 'list'
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      label: 'Source',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
    language: {
      id: 'language',
      facetValueFilter: '',
      label: 'Language',
      labelPath: 'crm:P128_carries/crm:P72_has_language',
      predicate: 'crm:P128_carries/crm:P72_has_language',
      type: 'list',
    },
    productionTimespan: {
      id: 'productionTimespan',
      facetValueFilter: '',
      label: 'Production Date',
      labelPath: '^crm:P108_has_produced/crm:P4_has_time-span/skos:prefLabel',
      type: 'list',
    },
    prefLabel: {
      id: 'prefLabel',
      facetValueFilter: '',
      label: 'Title',
      labelPath: 'skos:prefLabel',
      type: 'list',
    },
    event: {
      id: 'event',
      facetValueFilter: '',
      label: 'Event',
      labelPath: '^mmm-schema:observed_manuscript/mmm-schema:observed_time-span',
      type: 'list',
    },
    owner: {
      id: 'owner',
      facetValueFilter: '',
      label: 'Owner',
      labelPath: 'crm:P51_has_former_or_current_owner/skos:prefLabel',
      predicate: 'crm:P51_has_former_or_current_owner',
      type: 'list',
    },
  },
  works: {
    rdfType: 'frbroo:F1_Work',
    prefLabel: {
      id: 'prefLabel',
      facetValueFilter: '',
      labelPath: 'skos:prefLabel',
      type: 'list',
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
  },
  people: {
    rdfType: 'mmm-schema:Person',
    prefLabel: {
      id: 'prefLabel',
      facetValueFilter: '',
      labelPath: 'skos:prefLabel',
      type: 'list',
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
    place: {
      id: 'source',
      facetValueFilter: '',
      labelPath: 'mmm-schema:person_place/skos:prefLabel',
      predicate: 'mmm-schema:person_place',
      //parentPredicate: 'gvp:broaderPreferred+',
      type: 'list',
      //type: 'hierarchical',
    },
  },
  organizations: {
    rdfType: 'mmm-schema:Organization',
    prefLabel: {
      id: 'prefLabel',
      facetValueFilter: '',
      labelPath: 'skos:prefLabel',
      type: 'list',
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
  },
  places: {
    rdfType: 'crm:E53_Place',
    prefLabel: {
      id: 'prefLabel',
      facetValueFilter: '',
      label: 'Title',
      labelPath: 'skos:prefLabel',
      type: 'list',
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      label: 'Source',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
    area: {
      id: 'area',
      facetValueFilter: `
      FILTER(?id != <http://ldf.fi/mmm/place/tgn_7026519>)
      `,
      label: 'Area',
      labelPath: 'gvp:broaderPreferred/skos:prefLabel',
      predicate: 'gvp:broaderPreferred',
      parentPredicate: 'gvp:broaderPreferred+',
      type: 'hierarchical',
    },
    placeType: {
      id: 'type',
      facetValueFilter: '',
      label: 'Type',
      labelPath: 'gvp:placeTypePreferred',
      predicate: 'gvp:placeTypePreferred',
      type: 'list',
    },
  },
};
