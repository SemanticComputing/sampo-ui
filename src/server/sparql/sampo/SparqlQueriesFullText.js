export const fullTextSearchProperties = `
{
    ?id a ?type__id .
    ?type__id rdfs:label|skos:prefLabel ?type__prefLabel_ .
    BIND(STR(?type__prefLabel_) AS ?type__prefLabel)  # ignore language tags
  }
  UNION
  {
    ?id dct:source ?source__id .
    ?source__id skos:prefLabel ?source__prefLabel .
    ?source__id mmm-schema:data_provider_url ?source__dataProviderUrl .
  }
  UNION
  {
    ?id mmm-schema:data_provider_url ?source__id .
    BIND(?source__id as ?source__dataProviderUrl)
    BIND(?source__id as ?source__prefLabel)
  }
  UNION
  {
    ?id a frbroo:F4_Manifestation_Singleton .
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    ?id a frbroo:F1_Work .
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/works/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    VALUES ?eventClass { crm:E10_Transfer_of_Custody crm:E12_Production crm:E7_Activity crm:E67_Birth crm:E69_Death }
    ?id a ?eventClass .
    OPTIONAL { ?id skos:prefLabel ?prefLabel__id_ }
    BIND(COALESCE(?prefLabel__id_, ?id) as ?prefLabel__id)
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/events/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    VALUES ?actorClass { crm:E21_Person crm:E74_Group crm:E39_Actor }
    ?id a ?actorClass .
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/actors/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    ?id a crm:E53_Place .
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/places/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    ?id a crm:E78_Collection .
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/collections/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    ?id a frbroo:F2_Expression .
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/expressions/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  `
