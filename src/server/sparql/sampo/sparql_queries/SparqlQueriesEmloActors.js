const perspectiveID = 'emloActors'
export const sahaUrl = '"http://demo.seco.tkk.fi/saha/project/resource.shtml?uri="'
export const sahaModel = '"&model=emlo"'

//  http://demo.seco.tkk.fi/saha/project/resource.shtml?uri=http%3A%2F%2Femlo.bodleian.ox.ac.uk%2Fid%2F822ba92b-3ccf-4f1e-b776-e87aca45c866&model=emlo
export const actorPropertiesInstancePage =
`   BIND(?id as ?uri__id)
    BIND(?id as ?uri__prefLabel)
    BIND(CONCAT(${sahaUrl}, STR(?id), ${sahaModel}) AS ?uri__dataProviderUrl)
    
    VALUES (?type__id ?type__prefLabel) { 
      (crm:E21_Person "Person")
      (crm:E74_Group "Group") }
    ?id a ?type__id .
    BIND (?type__id as ?type_dataProviderUrl)

    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND (?prefLabel__id as ?prefLabel__prefLabel)
    }
    UNION 
    {
      ?id foaf:gender ?gender . 
      VALUES (?gender ?gender__prefLabel) { 
        (sdmx-code:sex-M "Male") 
        (sdmx-code:sex-F "Female") 
      }
      BIND(?gender as ?gender__dataProviderUrl)
    }
    UNION 
    { ?id skos:altLabel ?altLabel }
    UNION
    { ?id eschema:cofk_union_relationship_type-is_related_to ?related__id . 
      ?related__id skos:prefLabel ?related__prefLabel .
      BIND(?related__id AS ?related__dataProviderUrl)
    }
    UNION
    {
      ?id eschema:birthDate ?birthDateTimespan__id .
      ?birthDateTimespan__id skos:prefLabel ?birthDateTimespan__prefLabel .
      OPTIONAL { ?birthDateTimespan__id crm:P82a_begin_of_the_begin ?birthDateTimespan__start }
      OPTIONAL { ?birthDateTimespan__id crm:P82b_end_of_the_end ?birthDateTimespan__end }
    }
    UNION
    {
      ?id eschema:deathDate ?deathDateTimespan__id .
      ?deathDateTimespan__id skos:prefLabel ?deathDateTimespan__prefLabel .
      OPTIONAL { ?deathDateTimespan__id crm:P82a_begin_of_the_begin ?deathDateTimespan__start }
      OPTIONAL { ?deathDateTimespan__id crm:P82b_end_of_the_end ?deathDateTimespan__end }
    }
    UNION 
    {
      { ?id eschema:cofk_union_relationship_type-created/eschema:cofk_union_relationship_type-was_sent_from ?knownLocation__id }
        UNION 
      { ?id ^eschema:cofk_union_relationship_type-was_addressed_to/eschema:cofk_union_relationship_type-was_sent_to ?knownLocation__id }
    ?knownLocation__id skos:prefLabel ?knownLocation__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?knownLocation__id), "^.*\\\\/(.+)", "$1")) AS ?knownLocation__dataProviderUrl)
    }
    UNION
    {
      VALUES (?rel__prop ?rel__label) {
        (eschema:cofk_union_relationship_type-sibling_of "Sibling of")
        (eschema:cofk_union_relationship_type-spouse_of "Spouse of")
        (eschema:cofk_union_relationship_type-parent_of "Parent of")
        (eschema:cofk_union_relationship_type-acquaintance_of "Acquaintance of")
        (eschema:cofk_union_relationship_type-collaborated_with "Collaborated with")
        (eschema:cofk_union_relationship_type-employed "Employed")
        (eschema:cofk_union_relationship_type-member_of "Member of")
        (eschema:cofk_union_relationship_type-relative_of "Relative of")
        (eschema:cofk_union_relationship_type-unspecified_relationship_with "Unspecified relationship with")
        (eschema:cofk_union_relationship_type-friend_of "Friend of")
        (eschema:cofk_union_relationship_type-colleague_of "Colleague of")
        (eschema:cofk_union_relationship_type-was_patron_of "Was patron of")
      }
      ?id ?rel__prop ?rel__id .
      ?rel__id skos:prefLabel ?rel__label2
      BIND (CONCAT(?rel__label, ' ',?rel__label2) AS ?rel__prefLabel)
      BIND(CONCAT("/actors/page/", REPLACE(STR(?rel__id), "^.*\\\\/(.+)", "$1")) AS ?rel__dataProviderUrl)  
    }
    UNION
    {
      { SELECT DISTINCT ?id ?cor__id (COUNT(DISTINCT ?letter) AS ?cor__count)
        WHERE {
          {
            ?id eschema:cofk_union_relationship_type-created ?letter .
            ?letter a eschema:Letter ;
                eschema:cofk_union_relationship_type-was_addressed_to ?cor__id .
          } UNION {
            ?letter eschema:cofk_union_relationship_type-was_addressed_to ?id ;
                    a eschema:Letter ;
                    ^eschema:cofk_union_relationship_type-created ?cor__id .
          }

        } GROUP BY ?id ?cor__id ORDER BY DESC(?cor__count) }
      FILTER (BOUND(?id) && BOUND(?cor__id))
      ?cor__id skos:prefLabel ?cor__label .
      FILTER (!REGEX(?cor__label, '(unknown|no_recipient_given)', 'i'))
      BIND (CONCAT(?cor__label, ' (',STR(?cor__count), ')') AS ?cor__prefLabel)
      BIND(CONCAT("/actors/page/", REPLACE(STR(?cor__id), "^.*\\\\/(.+)", "$1")) AS ?cor__dataProviderUrl)  
    }

`

export const actorPropertiesFacetResults =
  `
  BIND(?id as ?uri__id)
  BIND(?id as ?uri__dataProviderUrl)
  BIND(?id as ?uri__prefLabel)

  VALUES (?type__id ?type__prefLabel) { 
    (crm:E21_Person "Person")
    (crm:E74_Group "Group") }
  ?id a ?type__id .
  BIND (?type__id as ?type_dataProviderUrl)
  
  {
    ?id skos:prefLabel ?prefLabel__id .
    BIND (?prefLabel__id as ?prefLabel__prefLabel)
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
  }
  UNION
  {
    ?id foaf:gender ?gender__id . 
    VALUES (?gender__id ?gender__prefLabel) { 
      (sdmx-code:sex-M "Male" ) 
      (sdmx-code:sex-F "Female" ) 
    }
    BIND(?gender__id as ?gender__dataProviderUrl)
  }
  UNION
  {
    ?id eschema:birthDate ?birthDateTimespan__id .
    ?birthDateTimespan__id skos:prefLabel ?birthDateTimespan__prefLabel .
    OPTIONAL { ?birthDateTimespan__id crm:P82a_begin_of_the_begin ?birthDateTimespan__start }
    OPTIONAL { ?birthDateTimespan__id crm:P82b_end_of_the_end ?birthDateTimespan__end }
  }
  UNION
  {
    ?id eschema:deathDate ?deathDateTimespan__id .
    ?deathDateTimespan__id skos:prefLabel ?deathDateTimespan__prefLabel .
    OPTIONAL { ?deathDateTimespan__id crm:P82a_begin_of_the_begin ?deathDateTimespan__start }
    OPTIONAL { ?deathDateTimespan__id crm:P82b_end_of_the_end ?deathDateTimespan__end }
  }
`

//  https://api.triplydb.com/s/U-6MA_haY
export const emloLetterLinksQuery = `
SELECT DISTINCT ?source ?target 
  (COUNT(DISTINCT ?letter) AS ?weight)
  (STR(COUNT(DISTINCT ?letter)) AS ?prefLabel)
WHERE 
{
  VALUES ?id { <ID> }
  {
    ?id eschema:cofk_union_relationship_type-created ?letter .
    ?letter a eschema:Letter ;
      eschema:cofk_union_relationship_type-was_addressed_to ?target .
    ?target skos:prefLabel ?target__label . 
    FILTER (!REGEX(?target__label, '(unknown|no_recipient_given)', 'i'))
  
    BIND(?id AS ?source)
  } UNION {
    ?letter eschema:cofk_union_relationship_type-was_addressed_to ?id ;
      a eschema:Letter .
    ?source eschema:cofk_union_relationship_type-created ?letter ;
      skos:prefLabel ?source__label . 
    FILTER (!REGEX(?source__label, '(unknown|no_recipient_given)', 'i'))

    BIND(?id AS ?target)
  }
  
} GROUP BY ?source ?target `

//  https://api.triplydb.com/s/lhDOivCiG
export const emloPeopleEventPlacesQuery = `
SELECT DISTINCT ?id ?lat ?long 
(COUNT(DISTINCT ?person) AS ?instanceCount)
WHERE {

  {
    ?person eschema:cofk_union_relationship_type-created/eschema:cofk_union_relationship_type-was_sent_from ?id .
  } UNION {
    ?person ^eschema:cofk_union_relationship_type-was_addressed_to/eschema:cofk_union_relationship_type-was_sent_to ?id .
  } 
  
  ?id geo:lat ?lat ;
    geo:long ?long .
  
} GROUP BY ?id ?lat ?long
`

export const emloNetworkNodesQuery = `
  SELECT DISTINCT ?id ?prefLabel ?class ?href
  WHERE {
    VALUES ?class { crm:E21_Person crm:E74_Group }
    VALUES ?id { <ID_SET> }
    ?id a ?class ;
      skos:prefLabel ?prefLabel .
    BIND(CONCAT("../", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1"),"/letterNetwork") AS ?href)
  }
`

// # https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
export const migrationsQuery = `
  SELECT DISTINCT ?id ?manuscript__id ?manuscript__prefLabel ?manuscript__dataProviderUrl
    ?from__id ?from__prefLabel ?from__dataProviderUrl ?from__lat ?from__long
    ?to__id ?to__prefLabel ?to__dataProviderUrl ?to__lat ?to__long
  WHERE {
    <FILTER>
    ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?from__id ;
                    mmm-schema:last_known_location ?to__id ;
                    skos:prefLabel ?manuscript__prefLabel .
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
    ?from__id skos:prefLabel ?from__prefLabel ;
              wgs84:lat ?from__lat ;
              wgs84:long ?from__long .
    BIND(CONCAT("/places/page/", REPLACE(STR(?from__id), "^.*\\\\/(.+)", "$1")) AS ?from__dataProviderUrl)
    ?to__id skos:prefLabel ?to__prefLabel ;
            wgs84:lat ?to__lat ;
            wgs84:long ?to__long .
    BIND(CONCAT("/places/page/", REPLACE(STR(?to__id), "^.*\\\\/(.+)", "$1")) AS ?to__dataProviderUrl)
    BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "http://ldf.fi/mmm/place/", ""))) as ?id)
  }
`

//  https://api.triplydb.com/s/f74HvbLN0
export const emloSentReceivedQuery = `
  SELECT DISTINCT (?year as ?category) 
    (count(distinct ?sent_letter) AS ?sentCount) 
    (count(distinct ?received_letter) AS ?receivedCount) 
    ((?sentCount + ?receivedCount) as ?allCount)
  WHERE {
    BIND(<ID> as ?id)
    {
      ?id eschema:cofk_union_relationship_type-created ?sent_letter .
      ?sent_letter a eschema:Letter ;
                   crm:P4_has_time-span/crm:P82a_begin_of_the_begin ?time_0 .
      BIND (STR(year(?time_0)) AS ?year)
    } 
    UNION 
    {
      ?received_letter eschema:cofk_union_relationship_type-was_addressed_to ?id ;
                       a eschema:Letter ;
                      crm:P4_has_time-span/crm:P82a_begin_of_the_begin ?time_0 .
      BIND (STR(year(?time_0)) AS ?year)
    }
  } 
  GROUP BY ?year 
  ORDER BY ?year 
`
