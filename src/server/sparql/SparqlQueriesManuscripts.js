export const manuscriptProperties = `
  ?id skos:prefLabel ?prefLabel .
  {
    ?id dct:source ?source__id .
    ?source__id skos:prefLabel ?source__prefLabel .
    OPTIONAL { ?id mmm-schema:data_provider_url ?source__dataProviderUrl }
  }
  UNION
  {
    ?id mmm-schema:manuscript_author ?author__id .
    ?author__id skos:prefLabel ?author__prefLabel .
    OPTIONAL { ?author__id mmm-schema:data_provider_url ?author__dataProviderUrl }
  }
  UNION
  {
    ?production crm:P108_has_produced ?id .
    ?production crm:P4_has_time-span ?productionTimespan .
    ?productionTimespan skos:prefLabel ?productionTimespan__id .
    OPTIONAL { ?productionTimespan crm:P79_beginning_is_qualified_by ?productionTimespan__start }
    OPTIONAL { ?productionTimespan crm:P80_end_is_qualified_by ?productionTimespan__end }
    BIND (?productionTimespan__id AS ?productionTimespan__prefLabel)
  }
  UNION
  {
    ?production crm:P108_has_produced ?id .
    ?production crm:P7_took_place_at ?productionPlace__id .
    ?productionPlace__id skos:prefLabel ?productionPlace__prefLabel .
    OPTIONAL { ?productionPlace__id mmm-schema:data_provider_url ?productionPlace__dataProviderUrl }
    # FILTER NOT EXISTS {
    #   ?production crm:P7_took_place_at ?productionPlace__id2 .
    #   ?productionPlace__id2 crm:P89_falls_within+ ?productionPlace__id .
    # }
  }
  UNION
  {
    ?id crm:P51_has_former_or_current_owner ?owner__id .
    ?owner__id skos:prefLabel ?owner__prefLabel .
    OPTIONAL { ?owner__id mmm-schema:data_provider_url ?owner__dataProviderUrl }
    OPTIONAL {
      [] rdf:subject ?id ;
        rdf:predicate crm:P51_has_former_or_current_owner ;
        rdf:object ?owner__id ;
        mmm-schema:order ?order .
      BIND(xsd:integer(?order) + 1 AS ?owner__order)
    }
  }
  UNION
  {
    ?id crm:P128_carries ?expression .
    ?expression crm:P72_has_language ?language .
  }
  UNION
  {
    ?event__id crm:P24_transferred_title_of|mmm-schema:observed_manuscript ?id .
    ?event__id a ?event__type .
    OPTIONAL { ?event__id skos:prefLabel ?event__prefLabel . }
    OPTIONAL { ?event__id crm:P4_has_time-span|mmm-schema:observed_time-span ?event__date. }
    OPTIONAL { ?event__id crm:P7_took_place_at|mmm-schema:observed_location ?event__place. }
    OPTIONAL { ?event__id  mmm-schema:data_provider_url ?event__dataProviderUrl }
  }
`;

export const productionPlacesQuery = `
  SELECT ?id ?lat ?long ?prefLabel ?source ?dataProviderUrl
  (COUNT(DISTINCT ?manuscripts) as ?instanceCount)
  WHERE {
    <FILTER>
    ?manuscripts ^crm:P108_has_produced/crm:P7_took_place_at ?id .
    ?id skos:prefLabel ?prefLabel .
    ?id dct:source ?source .
    ?id dct:source <http://vocab.getty.edu/tgn/> .
    OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
    OPTIONAL {
      ?id wgs84:lat ?lat ;
          wgs84:long ?long .
    }
    FILTER(?id != <http://ldf.fi/mmm/places/tgn_7026519>)
  }
  GROUP BY ?id ?lat ?long ?prefLabel ?source ?dataProviderUrl
`;

//# https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
export const migrationsQuery = `
  SELECT DISTINCT ?id ?manuscript__id ?manuscript__url ?from__id ?from__name ?from__lat ?from__long ?to__id ?to__name ?to__lat ?to__long
  WHERE {
    <FILTER>
    ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?from__id .
    ?manuscript__id mmm-schema:data_provider_url ?manuscript__url .
    ?from__id skos:prefLabel ?from__name .
    ?from__id wgs84:lat ?from__lat ;
              wgs84:long ?from__long .
    ?event__id crm:P24_transferred_title_of|mmm-schema:observed_manuscript ?manuscript__id .
    OPTIONAL { ?event__id skos:prefLabel ?event__prefLabel }
    ?event__id crm:P4_has_time-span|mmm-schema:observed_time-span ?event__date .
    ?event__id crm:P7_took_place_at|mmm-schema:observed_location ?to__id .
    ?to__id skos:prefLabel ?to__name .
    ?to__id wgs84:lat ?to__lat ;
            wgs84:long ?to__long .
    BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "http://ldf.fi/mmm/places/", ""))) as ?id)
    FILTER NOT EXISTS {
      ?event__id2 crm:P24_transferred_title_of ?manuscript__id .
      ?event__id2 crm:P4_has_time-span ?event__date2 .
      filter (?event__date2 > ?event__date)
    }
  }
`;
