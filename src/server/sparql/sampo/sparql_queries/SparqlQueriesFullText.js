export const fullTextSearchProperties = `
  {
    VALUES ?type__id {
      frbroo:F4_Manifestation_Singleton 
      frbroo:F1_Work
      frbroo:F2_Expression
      crm:E10_Transfer_of_Custody
      crm:E12_Production
      crm:E7_Activity
      crm:E67_Birth 
      crm:E69_Death 
      mmm-schema:ManuscriptActivity
      crm:E21_Person 
      crm:E74_Group 
      crm:E39_Actor
      crm:E53_Place
      crm:E78_Collection
    }
    ?id a ?type__id .
    ?type__id skos:prefLabel|rdfs:label ?type__prefLabel . 
  }
  UNION
  {
    ?id crm:P3_has_note ?note . # crm:P3_has_note has been added to text index
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
    VALUES ?eventClass { crm:E10_Transfer_of_Custody crm:E12_Production crm:E7_Activity crm:E67_Birth crm:E69_Death mmm-schema:ManuscriptActivity }
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
    OPTIONAL { ?id skos:prefLabel ?prefLabel__id_ }
    BIND(COALESCE(?prefLabel__id_, ?id) as ?prefLabel__id)
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
