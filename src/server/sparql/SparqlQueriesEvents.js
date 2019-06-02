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
      ?id crm:P4_has_time-span ?timespan__id .
      ?timespan__id skos:prefLabel ?timespan__prefLabel .
    }
`;
