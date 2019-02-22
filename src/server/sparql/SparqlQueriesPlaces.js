export const tableProperties = `

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
    OPTIONAL { ?id owl:sameAs ?placeAuthorityURI  }
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
        BIND (<PLACE_ID> AS ?id)
        ?id skos:prefLabel ?prefLabel .
        OPTIONAL {
          ?id gvp:broaderPreferred ?parent__id .
          ?parent__id skos:prefLabel ?parent__prefLabel .
        }
        OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
        OPTIONAL { ?id owl:sameAs ?sameAs }
        OPTIONAL {
          ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?id .
          ?manuscript__id mmm-schema:data_provider_url ?manuscript__dataProviderUrl .
          <FILTER>
        }
      }
`;
