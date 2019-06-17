export const placeProperties = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(?id AS ?prefLabel__dataProviderUrl)
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
    }
    UNION {
      ?id ^mmm-schema:person_place ?actor__id .
      ?actor__id skos:prefLabel ?actor__prefLabel .
      ?actor__id mmm-schema:data_provider_url ?actor__dataProviderUrl .
    }
    UNION {
      ?id ^crm:P7_took_place_at/crm:P108_has_produced ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
    UNION {
      ?id ^crm:P7_took_place_at/
        (crm:P30_transferred_custody_of|mmm-schema:observed_manuscript) ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
`;

export const allPlacesQuery =  `
  SELECT *
  WHERE {
    <FILTER>
    ?id a crm:E53_Place .
    ?id skos:prefLabel ?prefLabel .
    ?id dct:source ?source .
    OPTIONAL {
      ?id wgs84:lat ?lat ;
          wgs84:long ?long .
    }
    OPTIONAL {
      ?id gvp:broaderPreferred ?area__id .
      ?area__id skos:prefLabel ?area__prefLabel .
    }
    OPTIONAL { ?id gvp:placeTypePreferred ?placeType  }
    OPTIONAL { ?id skos:altLabel ?altLabel  }
    OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
    OPTIONAL { ?id owl:sameAs ?placeAuthorityURI  }
    FILTER(?id != <http://ldf.fi/mmm/places/tgn_7031096>)
  }
`;

export const placeQuery =  `
  SELECT ?id ?prefLabel ?sameAs ?dataProviderUrl ?parent__id ?parent__prefLabel ?manuscript__id ?manuscript__dataProviderUrl
  WHERE {
    BIND (<ID> AS ?id)
    OPTIONAL { ?id skos:prefLabel ?prefLabel_ }
    BIND(COALESCE(?prefLabel_, ?id) AS ?prefLabel)
    OPTIONAL {
      ?id gvp:broaderPreferred ?parent__id .
      ?parent__id skos:prefLabel ?parent__prefLabel .
    }
    OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
    OPTIONAL { ?id owl:sameAs ?sameAs }
    OPTIONAL {
      <FILTER>
      ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?id .
      BIND(?manuscript__id AS ?manuscript__dataProviderUrl)
    }
  }
`;
