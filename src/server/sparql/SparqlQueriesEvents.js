export const eventProperties = `
    {
      ?id a ?type__id .
      ?type__id skos:prefLabel|rdfs:label ?type__prefLabel .
      BIND(?id AS ?type__dataProviderUrl)
    }
    UNION
    {
      ?id crm:P7_took_place_at ?place__id .
      ?place__id skos:prefLabel ?place__prefLabel .
      ?place__id owl:sameAs ?place__dataProviderUrl .
    }
    UNION
    {
      ?id crm:P4_has_time-span ?eventTimespan__id .
      ?eventTimespan__id skos:prefLabel ?eventTimespan__prefLabel .
      OPTIONAL { ?eventTimespan__id crm:P82a_begin_of_the_begin ?eventTimespan__start }
      OPTIONAL { ?eventTimespan__id crm:P82b_end_of_the_end ?eventTimespan__end }
    }
`;
