export const eventProperties = `
    BIND("Transfer of Custody" AS ?prefLabel__prefLabel)
    BIND(?id AS ?prefLabel__dataProviderUrl)
    ?id crm:P7_took_place_at ?place__id .
    ?place__id skos:prefLabel ?place__prefLabel .
    OPTIONAL { ?place__id owl:sameAs ?place__dataProviderUrl }
`;
