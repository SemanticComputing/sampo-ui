export const placePropertiesInstancePage = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/places/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id  owl:sameAs
          |mmm-schema:data_provider_url
          |mmm-schema:geonames_uri
          ?source__id .
      OPTIONAL { ?source__id skos:prefLabel ?source__prefLabel_}
      BIND(?source__id AS ?source__dataProviderUrl)
      BIND(COALESCE(?source__prefLabel_, ?source__id) AS ?source__prefLabel)
    }
    UNION { ?id gvp:placeTypePreferred ?placeType }
    UNION
    {
      ?id gvp:broaderPreferred ?area__id .
      ?area__id skos:prefLabel ?area__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?area__id), "^.*\\\\/(.+)", "$1")) AS ?area__dataProviderUrl)
    }
    UNION
    {
      { ?actorPredicate rdfs:subPropertyOf* crm:P14_carried_out_by }
      UNION
      { ?actorPredicate rdfs:subPropertyOf* crm:P11_had_participant }

      {
        ?id ^crm:P7_took_place_at ?event .
        ?event ?actorPredicate ?actor__id .
      }
      UNION
      {
        ?id ^crm:P7_took_place_at ?event .
        ?actor__id crm:P98i_was_born|crm:P100i_died_in ?event
      }

      ?actor__id skos:prefLabel ?actor__prefLabel .
      BIND(CONCAT("/actors/page/", REPLACE(STR(?actor__id), "^.*\\\\/(.+)", "$1")) AS ?actor__dataProviderUrl)
    }
    UNION
    {
      ?productionPlace gvp:broaderPreferred* ?id .
      ?productionPlace ^crm:P7_took_place_at/crm:P108_has_produced ?manuscriptProduced__id .
      ?manuscriptProduced__id skos:prefLabel ?manuscriptProduced__prefLabel .
      BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscriptProduced__id), "^.*\\\\/(.+)", "$1")) AS ?manuscriptProduced__dataProviderUrl)
      FILTER (?id != <http://ldf.fi/mmm/place/tgn_7029392>) # exclude the top concept
    }
    UNION
    {
      ?transferPlace gvp:broaderPreferred* ?id .
      ?transferPlace ^crm:P7_took_place_at/crm:P30_transferred_custody_of ?manuscriptTransferred__id .
      OPTIONAL {
        ?manuscriptTransferred__id a frbroo:F4_Manifestation_Singleton .
        BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscriptTransferred__id), "^.*\\\\/(.+)", "$1")) AS ?manuscriptTransferred__dataProviderUrl)
      }
      OPTIONAL {
        ?manuscriptTransferred__id a crm:E78_Collection  .
        BIND(CONCAT("/collections/page/", REPLACE(STR(?manuscriptTransferred__id), "^.*\\\\/(.+)", "$1")) AS ?manuscriptTransferred__dataProviderUrl)
      }
      ?manuscriptTransferred__id skos:prefLabel ?manuscriptTransferred__prefLabel .
      FILTER (?id != <http://ldf.fi/mmm/place/tgn_7029392>) # exclude the top concept
    }
    UNION
    {
      ?observedPlace gvp:broaderPreferred* ?id .
      ?observedPlace ^crm:P7_took_place_at/mmm-schema:observed_manuscript ?manuscriptObserved__id .
      ?manuscriptObserved__id skos:prefLabel ?manuscriptObserved__prefLabel .
      BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscriptObserved__id), "^.*\\\\/(.+)", "$1")) AS ?manuscriptObserved__dataProviderUrl)
      FILTER (?id != <http://ldf.fi/mmm/place/tgn_7029392>) # exclude the top concept
    }
`

export const placePropertiesFacetResults = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/places/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id  owl:sameAs
          |mmm-schema:data_provider_url
          |mmm-schema:geonames_uri
          ?source__id .
      OPTIONAL { ?source__id skos:prefLabel ?source__prefLabel_}
      BIND(?source__id AS ?source__dataProviderUrl)
      BIND(COALESCE(?source__prefLabel_, ?source__id) AS ?source__prefLabel)
    }
    UNION { ?id gvp:placeTypePreferred ?placeType }
    UNION {
      ?id gvp:broaderPreferred ?area__id .
      ?area__id skos:prefLabel ?area__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?area__id), "^.*\\\\/(.+)", "$1")) AS ?area__dataProviderUrl)
    }
`
