const perspectiveID = 'hellerau'

export const personPropertiesFacetResults =
`   {
      ?id skos:prefLabel ?prefLabel__id .
      BIND (?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
`

// # https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
export const hellerauMigrationsQuery = `
  SELECT DISTINCT ?id ?person__id ?person__prefLabel ?person__dataProviderUrl
    ?from__id ?from__prefLabel ?from__lat ?from__long
    ?to__id ?to__prefLabel ?to__lat ?to__long
  WHERE {
    <FILTER>
    # Koulun nimi ennen muuttoa 1925: Schule Hellerau für Rhythmus, Musik und Körperbildung.
    # Sijainti: Hellerau-Dresden: https://www.geonames.org/2906837/hellerau.html
    BIND(<https://sws.geonames.org/2906837/> as ?from__id)
    ?person__id h-schema:home_1930|h-schema:home_1937 ?to__id ;
                    skos:prefLabel ?person__prefLabel .
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?person__id), "^.*\\\\/(.+)", "$1")) AS ?person__dataProviderUrl)
    ?from__id gn:name ?from__prefLabel ;
              wgs84:lat ?from__lat ;
              wgs84:long ?from__long .
    ?to__id gn:name ?to__prefLabel ;
            wgs84:lat ?to__lat ;
            wgs84:long ?to__long .
    BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "https://sws.geonames.org", "--->"))) as ?id)
  }
`
