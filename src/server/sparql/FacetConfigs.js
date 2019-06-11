/* TODO:
  labelPath is only used when sorting results, so it should removed from
  facet configs
*/
export const facetConfigs = {
  manuscripts: {
    facetClass: 'frbroo:F4_Manifestation_Singleton',
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryProperty: 'skos:prefLabel',
      type: 'text',
    },
    author: {
      id: 'author',
      facetValueFilter: '',
      label: 'Author',
      labelPath: 'mmm-schema:manuscript_author/skos:prefLabel',
      predicate: 'mmm-schema:manuscript_author',
      type: 'list'
    },
    productionPlace: {
      id: 'productionPlace',
      facetValueFilter: `
      ?id dct:source <http://vocab.getty.edu/tgn/> .
      `,
      label: 'Production place',
      labelPath: '^crm:P108_has_produced/crm:P7_took_place_at/skos:prefLabel',
      predicate: '^crm:P108_has_produced/crm:P7_took_place_at',
      parentPredicate: '^crm:P108_has_produced/crm:P7_took_place_at/gvp:broaderPreferred+',
      type: 'hierarchical',
    },
    productionTimespan: {
      id: 'productionTimespan',
      facetValueFilter: '',
      startProperty: 'crm:P82a_begin_of_the_begin',
      endProperty: 'crm:P82b_end_of_the_end',
      labelPath: '^crm:P108_has_produced/crm:P4_has_time-span/crm:P82a_begin_of_the_begin',
      type: 'timespan',
    },
    language: {
      id: 'language',
      facetValueFilter: '',
      label: 'Language',
      labelPath: 'crm:P128_carries/crm:P72_has_language/skos:prefLabel',
      predicate: 'crm:P128_carries/crm:P72_has_language',
      type: 'list',
    },
    // event: {
    //   id: 'event',
    //   facetValueFilter: '',
    //   label: 'Event',
    //   labelPath: '^mmm-schema:observed_manuscript/mmm-schema:observed_time-span',
    //   type: 'list',
    // },
    collection: {
      id: 'collection',
      facetValueFilter: '',
      labelPath: 'crm:P46i_forms_part_of/skos:prefLabel',
      predicate: 'crm:P46i_forms_part_of',
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
    source: {
      id: 'source',
      facetValueFilter: '',
      label: 'Source',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
  },
  works: {
    facetClass: 'frbroo:F1_Work',
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryProperty: 'skos:prefLabel',
      type: 'text',
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
    author: {
      id: 'author',
      facetValueFilter: '',
      label: 'Author',
      labelPath: '^frbroo:R16_initiated/(mmm-schema:carried_out_by_as_possible_author|mmm-schema:carried_out_by_as_author)/skos:prefLabel',
      predicate: '^frbroo:R16_initiated/(mmm-schema:carried_out_by_as_possible_author|mmm-schema:carried_out_by_as_author)',
      type: 'list'
    },
  },
  events: {
    facetClass: 'crm:E10_Transfer_of_Custody crm:E12_Production',
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryProperty: 'skos:prefLabel',
      type: 'text',
    },
    type: {
      predicate: 'a',
      facetValueFilter: '',
      type: 'list',
      labelPath: 'a/(skos:prefLabel|rdfs:label)',
    },
    timespan: {
      id: 'productionTimespan',
      facetValueFilter: '',
      startProperty: 'crm:P82a_begin_of_the_begin',
      endProperty: 'crm:P82b_end_of_the_end',
      labelPath: 'crm:P4_has_time-span/crm:P82a_begin_of_the_begin',
      type: 'timespan',
    },
    place: {
      id: 'place',
      facetValueFilter: `
      ?id dct:source <http://vocab.getty.edu/tgn/> .
      `,
      label: 'Place',
      labelPath: 'crm:P7_took_place_at/skos:prefLabel',
      predicate: 'crm:P7_took_place_at',
      parentPredicate: 'crm:P7_took_place_at/gvp:broaderPreferred+',
      type: 'hierarchical',
    },
  },
  people: {
    facetClass: 'crm:E21_Person',
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryProperty: 'skos:prefLabel',
      type: 'text',
    },
    source: {
      id: 'source',
      facetValueFilter: '',
      labelPath: 'dct:source/skos:prefLabel',
      predicate: 'dct:source',
      type: 'list',
    },
    birthPlace: {
      id: 'birthPlace',
      facetValueFilter: `
      ?id dct:source <http://vocab.getty.edu/tgn/> .
      `,
      labelPath: 'crm:P98i_was_born/crm:P7_took_place_at/skos:prefLabel',
      predicate: 'crm:P98i_was_born/crm:P7_took_place_at',
      parentPredicate: 'crm:P98i_was_born/crm:P7_took_place_at/gvp:broaderPreferred+',
      type: 'hierarchical',
    },
    place: {
      id: 'source',
      facetValueFilter: `
      ?id dct:source <http://vocab.getty.edu/tgn/> .
      `,
      labelPath: 'mmm-schema:person_place/skos:prefLabel',
      predicate: 'mmm-schema:person_place',
      parentPredicate: 'mmm-schema:person_place/gvp:broaderPreferred+',
      type: 'hierarchical',
    },
    work: {
      labelPath: `
        (^mmm-schema:carried_out_by_as_possible_author
        |^mmm-schema:carried_out_by_as_author
        |^mmm-schema:carried_out_by_as_commissioner
        |^mmm-schema:carried_out_by_as_editor)
        /frbroo:R16_initiated/skos:prefLabel
      `,
    },
  },
  organizations: {
    facetClass: 'crm:E74_Group',
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryProperty: 'skos:prefLabel',
      type: 'text',
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
    facetClass: 'crm:E53_Place',
    prefLabel: {
      id: 'prefLabel',
      labelPath: 'skos:prefLabel',
      textQueryProperty: 'skos:prefLabel',
      type: 'text',
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
