export const placeProperties = `
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id AS ?prefLabel__prefLabel)
    BIND(?id AS ?prefLabel__dataProviderUrl)
    {
      ?id dct:source ?source__id .
      OPTIONAL { ?source__id skos:prefLabel ?prefLabel_ }
      OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl_ }
      BIND(COALESCE(STR(?prefLabel_), STR(?source__id)) AS ?source__prefLabel)
      BIND(COALESCE(?dataProviderUrl_, ?id) AS ?source__dataProviderUrl)
    }
    UNION
    {
      ?id gvp:placeTypePreferred ?placeType .
    }
`;

export const allPlacesQuery =  `
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
  PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
  PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
  PREFIX gvp: <http://vocab.getty.edu/ontology#>
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
      ?id gvp:broaderPreferred ?parent__id .
      ?parent__id skos:prefLabe ?parent__prefLabel .
    }
    OPTIONAL { ?id gvp:placeTypePreferred ?placeType  }
    OPTIONAL { ?id skos:altLabel ?altLabel  }
    OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
    OPTIONAL { ?id owl:sameAs ?placeAuthorityURI  }
    FILTER(?id != <http://ldf.fi/mmm/places/tgn_7031096>)
  }
`;

export const placeQuery =  `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      PREFIX gvp: <http://vocab.getty.edu/ontology#>
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
        <MANUSCRIPTS>
      }
`;
