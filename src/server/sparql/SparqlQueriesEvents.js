export const eventProperties = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(?id AS ?prefLabel__dataProviderUrl)
    }
    UNION {
      ?id crm:P7_took_place_at ?place__id .
      ?place__id skos:prefLabel ?place__prefLabel .
      ?place__id owl:sameAs ?place__dataProviderUrl .
    }
    UNION {
      ?id crm:P4_has_time-span ?timespan__id .
      BIND(?timespan__id AS ?timespan__prefLabel)
    }
`;
