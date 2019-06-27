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
      ?id crm:P98i_was_born/crm:P4_has_time-span ?birthDateTimespan__id .
      ?birthDateTimespan__id skos:prefLabel ?birthDateTimespan__prefLabel .
      OPTIONAL { ?birthDateTimespan__id crm:P82a_begin_of_the_begin ?birthDateTimespan__start }
      OPTIONAL { ?birthDateTimespan__id crm:P82b_end_of_the_end ?birthDateTimespan__end }
    }
    UNION
    {
      ?id crm:P100i_died_in/crm:P4_has_time-span ?deathDateTimespan__id .
      ?deathDateTimespan__id skos:prefLabel ?deathDateTimespan__prefLabel .
      OPTIONAL { ?deathDateTimespan__id crm:P82a_begin_of_the_begin ?deathDateTimespan__start }
      OPTIONAL { ?deathDateTimespan__id crm:P82b_end_of_the_end ?deathDateTimespan__end }
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
    UNION
    {
      ?id ^crm:P51_has_former_or_current_owner ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
    UNION
    {
      ?id (^mmm-schema:carried_out_by_as_commissioner
          |^mmm-schema:carried_out_by_as_illuminator
          |^mmm-schema:carried_out_by_as_printer
          |^mmm-schema:carried_out_by_as_scribe)
          /crm:P108_has_produced ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
    UNION
    {
      ?id (^mmm-schema:carried_out_by_as_possible_author
          |^mmm-schema:carried_out_by_as_author
          |^mmm-schema:carried_out_by_as_commissioner
          |^mmm-schema:carried_out_by_as_editor)
          /frbroo:R16_initiated/^mmm-schema:manuscript_work ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
    UNION
    {
      ?id (^crm:P11_had_participant
          |^crm:P28_custody_surrendered_by
          |^crm:P29_custody_received_by
          |^mmm-schema:carried_out_by_as_selling_agent)
          /^crm:P30_transferred_custody_of|^mmm-schema:observed_manuscript ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
`;

export const actorPlacesQuery = `
  SELECT ?id ?lat ?long
  (SAMPLE(?prefLabel_) AS ?prefLabel)
  (COUNT(DISTINCT ?actor) as ?instanceCount)
  WHERE {
    <FILTER>
    ?actor crm:P98i_was_born/crm:P7_took_place_at
          #|crm:P100i_died_in/crm:P7_took_place_at
          # |mmm-schema:person_place
          ?id .
    ?id skos:prefLabel ?prefLabel_ .
    OPTIONAL {
      ?id wgs84:lat ?lat ;
          wgs84:long ?long .
    }
    FILTER(?id != <http://ldf.fi/mmm/places/tgn_7026519>)
  }
  GROUP BY ?id ?lat ?long
`;
