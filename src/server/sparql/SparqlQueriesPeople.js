export const personProperties = `
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id AS ?prefLabel__prefLabel)
    BIND(?id AS ?prefLabel__dataProviderUrl)
    {
      ?id dct:source ?source__id .
      OPTIONAL { ?source__id skos:prefLabel ?sourcePrefLabel_ }
      OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl_ }
      BIND(COALESCE(STR(?sourcePrefLabel_), STR(?source__id)) AS ?source__prefLabel)
      BIND(COALESCE(?dataProviderUrl_, ?id) AS ?source__dataProviderUrl)
    }
    UNION
    {
      ?id mmm-schema:person_place ?place__id .
      ?place__id skos:prefLabel ?place__prefLabel .
    }

`;
