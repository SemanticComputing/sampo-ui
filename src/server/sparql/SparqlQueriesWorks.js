export const workProperties = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(?id AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id ^mmm-schema:manuscript_work ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
    UNION
    {
      ?id dct:source ?source__id .
      ?source__id skos:prefLabel ?source__prefLabel .
      OPTIONAL { ?id mmm-schema:data_provider_url ?source__dataProviderUrl }
    }
    UNION
    {
      ?id ^frbroo:R16_initiated/(mmm-schema:carried_out_by_as_possible_author|mmm-schema:carried_out_by_as_author) ?author__id .
      ?author__id skos:prefLabel ?author__prefLabel .
      BIND(?author__id AS ?author__dataProviderUrl)
    }
`;
