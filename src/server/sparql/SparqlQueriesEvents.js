export const eventProperties = `
    {
      ?id a ?type__id .
      ?type__id skos:prefLabel|rdfs:label ?type__prefLabel .
      BIND(?type__id as ?prefLabel__id)
      BIND(?type__prefLabel as ?prefLabel__prefLabel)
      BIND(CONCAT("/events/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?type__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id crm:P7_took_place_at ?place__id .
      ?place__id skos:prefLabel ?place__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?place__id), "^.*\\\\/(.+)", "$1")) AS ?place__dataProviderUrl)
    }
    UNION
    {
      ?id crm:P4_has_time-span ?eventTimespan__id .
      ?eventTimespan__id skos:prefLabel ?eventTimespan__prefLabel .
      OPTIONAL { ?eventTimespan__id crm:P82a_begin_of_the_begin ?eventTimespan__start }
      OPTIONAL { ?eventTimespan__id crm:P82b_end_of_the_end ?eventTimespan__end }
    }
    UNION
    {
      ?id crm:P30_transferred_custody_of ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      OPTIONAL {
        ?manuscript__id a frbroo:F4_Manifestation_Singleton .
        BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
      }
      OPTIONAL {
        ?manuscript__id a crm:E78_Collection  .
        BIND(CONCAT("/collections/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
      }
      OPTIONAL {
        ?id crm:P28_custody_surrendered_by ?surrender__id .
        ?surrender__id skos:prefLabel ?surrender__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?surrender__id), "^.*\\\\/(.+)", "$1")) AS ?surrender__dataProviderUrl)
      }
      OPTIONAL {
        ?id crm:P29_custody_received_by ?receiver__id .
        ?receiver__id skos:prefLabel ?receiver__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?receiver__id), "^.*\\\\/(.+)", "$1")) AS ?receiver__dataProviderUrl)
      }
    }
    UNION
    {
      ?id mmm-schema:observed_manuscript ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      OPTIONAL {
        ?id mmm-schema:ownership_attributed_to ?observedOwner__id .
        ?observedOwner__id skos:prefLabel ?observedOwner__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?observedOwner__id), "^.*\\\\/(.+)", "$1")) AS ?observedOwner__dataProviderUrl)
      }
      OPTIONAL {
        ?manuscript__id a frbroo:F4_Manifestation_Singleton .
        BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
      }
      OPTIONAL {
        ?manuscript__id a crm:E78_Collection  .
        BIND(CONCAT("/collections/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
      }
    }
    UNION
    {
      ?id crm:P108_has_produced ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
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
      ?id crm:P3_has_note ?note .
    }
`;

export const eventPlacesQuery = `
  SELECT ?id ?lat ?long
  (COUNT(DISTINCT ?event) as ?instanceCount)
  WHERE {
    <FILTER>
    ?event crm:P7_took_place_at ?id .
    ?id wgs84:lat ?lat ;
        wgs84:long ?long .
  }
  GROUP BY ?id ?lat ?long
`;

export const eventsByTimePeriodQuery = `
  SELECT ?id ?type__id ?type__prefLabel
  (COUNT(DISTINCT ?event) as ?type__instanceCount)
  WHERE {
    <FILTER>
    <TIME_PERIODS>
  }
  GROUP BY ?id ?type__id ?type__prefLabel
  ORDER BY ?id
`;

export const eventsByTimePeriodQuery2 = `
  SELECT ?id ?prefLabel ?period ?instanceCount
  WHERE {
    <FILTER>
    <TIME_PERIODS>
  }
`;
