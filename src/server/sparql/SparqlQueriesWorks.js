export const workProperties = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/works/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id ^mmm-schema:manuscript_work ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
    }
    UNION
    {
      ?id  ^mmm-schema:manuscript_work/crm:P46i_forms_part_of ?collection__id .
      ?collection__id skos:prefLabel ?collection__prefLabel .
      BIND(CONCAT("/collections/page/", REPLACE(STR(?collection__id), "^.*\\\\/(.+)", "$1")) AS ?collection__dataProviderUrl)
    }
    UNION
    {
      ?id ^mmm-schema:manuscript_work/crm:P45_consists_of ?material__id .
      ?material__id skos:prefLabel ?material__prefLabel .
    }
    UNION
    {
      ?id mmm-schema:data_provider_url ?source__id .
      BIND(?source__id AS ?source__prefLabel)
    }
    UNION
    {
      ?id ^frbroo:R16_initiated/(mmm-schema:carried_out_by_as_possible_author|mmm-schema:carried_out_by_as_author) ?author__id .
      ?author__id skos:prefLabel ?author__prefLabel .
      BIND(CONCAT("/actors/page/", REPLACE(STR(?author__id), "^.*\\\\/(.+)", "$1")) AS ?author__dataProviderUrl)
    }
    UNION
    {
      ?id ^frbroo:R19_created_a_realisation_of/frbroo:R17_created ?expression .
      ?expression crm:P72_has_language ?language__id .
      ?language__id skos:prefLabel ?language__prefLabel .
    }
`;
