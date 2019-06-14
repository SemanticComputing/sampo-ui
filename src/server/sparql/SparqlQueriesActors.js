export const actorProperties = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(?id AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id a ?type__id .
      ?type__id skos:prefLabel|rdfs:label ?type__prefLabel .
      BIND(?id AS ?type__dataProviderUrl)
    }
    UNION
    {
      ?id mmm-schema:data_provider_url ?source__id .
      BIND(?source__id AS ?source__dataProviderUrl)
      BIND(?source__id AS ?source__prefLabel)
    }
    UNION
    {
      ?id crm:P98i_was_born/crm:P7_took_place_at ?birthPlace__id .
      ?birthPlace__id skos:prefLabel ?birthPlace__prefLabel .
      BIND(?birthPlace__id as ?birthPlace__dataProviderUrl)
    }
    UNION
    {
      ?id mmm-schema:person_place ?place__id .
      ?place__id skos:prefLabel ?place__prefLabel .
      BIND(?place__id as ?place__dataProviderUrl)
    }
    UNION
    {
      ?id (^mmm-schema:carried_out_by_as_possible_author
          |^mmm-schema:carried_out_by_as_author
          |^mmm-schema:carried_out_by_as_commissioner
          |^mmm-schema:carried_out_by_as_editor)
          /frbroo:R16_initiated ?work__id .
      ?work__id skos:prefLabel ?work__prefLabel .
      BIND(?work__id AS ?work__dataProviderUrl)
    }
`;
