import { sahaModel, sahaUrl } from './SparqlQueriesActors'
const perspectiveID = 'places'

export const placePropertiesInstancePage =
`
BIND(?id as ?uri__id)
BIND(?id as ?uri__prefLabel)
BIND(CONCAT(${sahaUrl}, STR(?id), ${sahaModel}) AS ?uri__dataProviderUrl)

?id skos:prefLabel ?prefLabel__id .
BIND (?prefLabel__id as ?prefLabel__prefLabel)
BIND (CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)

{
  ?id crm:P89_falls_within+ ?broader__id .
  ?broader__id skos:prefLabel ?broader__prefLabel .
  BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?broader__id), "^.*\\\\/(.+)", "$1")) AS ?broader__dataProviderUrl)
  OPTIONAL {
    ?broader__id a eschema:Country .
    BIND (?broader__id AS ?country__id)
    ?broader__id skos:prefLabel ?country__prefLabel .
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?broader__id), "^.*\\\\/(.+)", "$1")) AS ?country__dataProviderUrl)
  }
}
UNION
{
  ?narrower__id crm:P89_falls_within ?id ;
    skos:prefLabel ?narrower__prefLabel .
  BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?narrower__id), "^.*\\\\/(.+)", "$1")) AS ?narrower__dataProviderUrl)
}
`

export const placePropertiesFacetResults =
  `
  BIND(?id as ?uri__id)
  BIND(?id as ?uri__prefLabel)
  BIND(CONCAT(${sahaUrl}, STR(?id), ${sahaModel}) AS ?uri__dataProviderUrl)

  ?id a ?type__id .
  BIND (?type__id as ?type_dataProviderUrl)
  
  {
    ?id skos:prefLabel ?prefLabel__id .
    BIND (?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
{
  ?id crm:P89_falls_within+ ?broader__id .
  ?broader__id skos:prefLabel ?broader__prefLabel .
  BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?broader__id), "^.*\\\\/(.+)", "$1")) AS ?broader__dataProviderUrl)
  OPTIONAL {
    ?broader__id a eschema:Country .
    BIND (?broader__id AS ?country__id)
    ?broader__id skos:prefLabel ?country__prefLabel .
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?broader__id), "^.*\\\\/(.+)", "$1")) AS ?country__dataProviderUrl)
  }
}
UNION
{
  ?narrower__id crm:P89_falls_within ?id ;
    skos:prefLabel ?narrower__prefLabel .
  BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?narrower__id), "^.*\\\\/(.+)", "$1")) AS ?narrower__dataProviderUrl)
}
`

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
`

export const placePropertiesInstancePageOld = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/perspective3/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(CONCAT(${sahaUrl}, STR(?id), ${sahaModel}) AS ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id crm:P89_falls_within ?area__id .
      ?area__id skos:prefLabel ?area__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?area__id), "^.*\\\\/(.+)", "$1")) AS ?area__dataProviderUrl)
    }
`

export const placePropertiesInfoWindow = `
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id AS ?prefLabel__prefLabel)
    BIND(CONCAT("/places/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
`

//  https://api.triplydb.com/s/ck2-SDpCO
export const peopleRelatedTo = `
  OPTIONAL {
    <FILTER>
    { ?related__id eschema:cofk_union_relationship_type-created/eschema:cofk_union_relationship_type-was_sent_from ?id }
    UNION
    { ?related__id ^eschema:cofk_union_relationship_type-was_addressed_to/eschema:cofk_union_relationship_type-was_sent_to ?id }
    ?related__id skos:prefLabel ?related__prefLabel .
    BIND(CONCAT("/actors/page/", REPLACE(STR(?related__id), "^.*\\\\/(.+)", "$1")) AS ?related__dataProviderUrl)
  } 
`
