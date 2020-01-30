const perspectiveID = 'perspective1'

export const manuscriptPropertiesInstancePage =
`   {
      ?id skos:prefLabel ?prefLabel__id .
      BIND (?prefLabel__id as ?prefLabel__prefLabel)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
      BIND("""
          HYK ms., Index s. 127a; HYK ms., Pohj. osak. matr. #113; KA mf. ES 2031 (rr 11) Pyhäjoen käräjät 20.-21.1.1665 f. 599 
          (<em>Företrädde H:r Matz och angaf Hendrich Tiainen och dess Son Nils, som skulle dee Lasteligen hafwa talt om Gudh</em>); 
          KA mf. ES 2032 (rr 12) Pyhäjoen käräjät 20.-21.7.1670 f. 458v; KA mf. ES 2033 (rr 13) Pyhäjoen käräjät 13.-15.7.1674 f. 
          776v (<em>Caplans Sal: H:r Mathiæ Mathesij Enckia</em>). — K. F. Ignatius, SHS:n pöytäk. 18.1.1883 [Eräs v:n 1658 ylioppilasmeteliin 
            <a href="henkilo.php?id=791">791</a>
            liittyvä jäljennös]. HArk 8 (1884) s. 386; V. Lagus, Studentmatrikel I (1889-91) s. 66 (XV); Consistorii academici Aboensis äldre 
            protokoller II [1654-64] (utg. A. G. Fontell, 1887) s. 20-21, 28, 39-40, 41, 139 (25.11.1658), 178, 180-181, 195, 262, 290-292, 
            308, 319; Consistorii ecclesiastici Aboënsis protokoller I 1656-1658. SKHST 2 (utg. Ad. Neovius, 1899) s. 9; A. Luukko, 
            Pohjalaisen osakunnan nimikirja I 1640-1713 (1946) #113. — C. H. Strandberg, Åbo stifts herdaminne II (1834) s. 160; A. Bergholm, 
            Sukukirja II (1901) s. 855 (Mathesius Taulu 6); J. Vallinkoski, Turun akatemian väitöskirjat 1642-1828. HYKJ 30 (1962-66) #2014G; 
            Sursillin suku (täyd. ja toim. E. Kojonen, 1971) #4373; V. P. Toropainen, Turun porvariston keskinäiset verkostot vuosina 1549-1660. 
            SSV 47 (2006) s. 192 (Suutarin kisällit Matts Eriksson ja Matts Markusson ovat pahoinpidelleet ylioppilas Matthias Matthiaen tapaninpäivänä, 
              lähdeviitteenä TKA TRO 5‹!›.12.1657: 298-308. Mahdollisesti kyseinen yo on Matthias Mathesius).
      """ as ?note)
    }
    UNION
    {
      ?id mmm-schema:data_provider_url ?source__id .
      BIND (?source__id AS ?source__prefLabel)
      BIND (?source__id AS ?source__dataProviderUrl)
    }
    UNION
    {
      ?id mmm-schema:manuscript_author ?author__id .
      ?author__id skos:prefLabel ?author__prefLabel .
      BIND(CONCAT("/actors/page/", REPLACE(STR(?author__id), "^.*\\\\/(.+)", "$1")) AS ?author__dataProviderUrl)
    }
    UNION
    {
      ?id mmm-schema:manuscript_work ?work__id .
      ?work__id skos:prefLabel ?work__prefLabel .
      BIND(CONCAT("/works/page/", REPLACE(STR(?work__id), "^.*\\\\/(.+)", "$1")) AS ?work__dataProviderUrl)
    }
    UNION
    {
      ?id ^crm:P108_has_produced/crm:P4_has_time-span ?productionTimespan__id .
      ?productionTimespan__id skos:prefLabel ?productionTimespan__prefLabel .
      ?productionTimespan__id dct:source ?productionTimespan__source__id .
      ?productionTimespan__source__id skos:prefLabel ?productionTimespan__source__prefLabel .
      ?productionTimespan__source__id mmm-schema:data_provider_url ?productionTimespan__source__dataProviderUrl .
      OPTIONAL { ?productionTimespan__id crm:P82a_begin_of_the_begin ?productionTimespan__start }
      OPTIONAL { ?productionTimespan__id crm:P82b_end_of_the_end ?productionTimespan__end }
    }
    UNION
    {
      ?id ^crm:P108_has_produced ?production .
      ?production crm:P7_took_place_at ?productionPlace__id .
      ?productionPlace__id skos:prefLabel ?productionPlace__prefLabel .
      ?production dct:source ?productionPlace__source__id .
      ?productionPlace__source__id skos:prefLabel ?productionPlace__source__prefLabel .
      ?productionPlace__source__id mmm-schema:data_provider_url ?productionPlace__source__dataProviderUrl .
      BIND(CONCAT("/places/page/", REPLACE(STR(?productionPlace__id), "^.*\\\\/(.+)", "$1")) AS ?productionPlace__dataProviderUrl)
    }
    #UNION
    #{
    #  ?id crm:P3_has_note ?note .
    #}
    UNION
    {
      ?id crm:P128_carries ?expression__id .
      ?expression__id skos:prefLabel ?expression__prefLabel .
      OPTIONAL {
        ?expression__id crm:P72_has_language ?language__id .
        ?expression__id dct:source ?language__source__id .
        ?language__source__id skos:prefLabel ?language__source__prefLabel .
        ?language__id skos:prefLabel ?language__prefLabel .
      }
      BIND(CONCAT("/expressions/page/", REPLACE(STR(?expression__id), "^.*\\\\/(.+)", "$1")) AS ?expression__dataProviderUrl)
    }
    UNION
    {
      ?event__id crm:P108_has_produced ?id .
      ?event__id a ?event__type .
      OPTIONAL { ?event__id crm:P4_has_time-span/skos:prefLabel ?event__date }
      OPTIONAL {
        ?event__id crm:P7_took_place_at ?event__place__id .
        ?event__place__id skos:prefLabel ?event__place__prefLabel__id .
        BIND(?event__place__prefLabel__id as ?event__place__prefLabel__prefLabel)
        BIND(CONCAT("/places/page/", REPLACE(STR(?event__place__id), "^.*\\\\/(.+)", "$1")) AS ?event__place__prefLabel__dataProviderUrl)
        ?event__place__id wgs84:lat ?event__place__lat ;
                           wgs84:long ?event__place__long .
      }
      BIND("Production" AS ?event__prefLabel)
      BIND(CONCAT("/events/page/", REPLACE(STR(?event__id), "^.*\\\\/(.+)", "$1")) AS ?event__dataProviderUrl)
    }
    UNION
    {
      ?id mmm-schema:last_known_location ?lastKnownLocation__id  .
      ?lastKnownLocation__id skos:prefLabel ?lastKnownLocation__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?lastKnownLocation__id), "^.*\\\\/(.+)", "$1")) AS ?lastKnownLocation__dataProviderUrl)
    }
    UNION
    {
      ?event__id crm:P30_transferred_custody_of ?id .
      ?event__id a ?event__type .
      OPTIONAL { ?event__id crm:P4_has_time-span/skos:prefLabel ?event__date }
      OPTIONAL {
        ?event__id crm:P7_took_place_at ?event__place__id .
        ?event__place__id skos:prefLabel ?event__place__prefLabel__id .
        BIND(?event__place__prefLabel__id as ?event__place__prefLabel__prefLabel)
        BIND(CONCAT("/places/page/", REPLACE(STR(?event__place__id), "^.*\\\\/(.+)", "$1")) AS ?event__place__prefLabel__dataProviderUrl)
        ?event__place__id wgs84:lat ?event__place__lat ;
                           wgs84:long ?event__place__long .
      }
      OPTIONAL {
        ?event__id crm:P28_custody_surrendered_by ?event__from__id .
        ?event__from__id skos:prefLabel ?event__from__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?event__from__id), "^.*\\\\/(.+)", "$1")) AS ?event__from__dataProviderUrl)
      }
      OPTIONAL {
        ?event__id crm:P29_custody_received_by ?event__to__id .
        ?event__to__id skos:prefLabel ?event__to__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?event__to__id), "^.*\\\\/(.+)", "$1")) AS ?event__to__dataProviderUrl)
      }
      BIND("Transfer of Custody" AS ?event__prefLabel)
      BIND(CONCAT("/events/page/", REPLACE(STR(?event__id), "^.*\\\\/(.+)", "$1")) AS ?event__dataProviderUrl)
    }
    UNION
    {
      ?event__id mmm-schema:observed_manuscript ?id .
      ?event__id a crm:E7_Activity .
      ?event__id a ?event__type .
      OPTIONAL { ?event__id crm:P4_has_time-span/skos:prefLabel ?event__date }
      OPTIONAL {
        ?event__id crm:P7_took_place_at ?event__place__id .
        ?event__place__id skos:prefLabel ?event__place__prefLabel__id .
        BIND(?event__place__prefLabel__id as ?event__place__prefLabel__prefLabel)
        BIND(CONCAT("/places/page/", REPLACE(STR(?event__place__id), "^.*\\\\/(.+)", "$1")) AS ?event__place__prefLabel__dataProviderUrl)
        ?event__place__id wgs84:lat ?event__place__lat ;
                           wgs84:long ?event__place__long .
      }
      OPTIONAL {
        ?event__id mmm-schema:ownership_attributed_to ?event__observedOwner__id .
        ?event__observedOwner__id skos:prefLabel ?event__observedOwner__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?event__observedOwner__id), "^.*\\\\/(.+)", "$1")) AS ?event__observedOwner__dataProviderUrl)
      }
      BIND("Provenance" AS ?event__prefLabel)
      BIND(CONCAT("/events/page/", REPLACE(STR(?event__id), "^.*\\\\/(.+)", "$1")) AS ?event__dataProviderUrl)
    }
    UNION
    {
      ?id crm:P51_has_former_or_current_owner ?owner__id .
      ?owner__id skos:prefLabel ?owner__prefLabel .
      BIND(CONCAT("/actors/page/", REPLACE(STR(?owner__id), "^.*\\\\/(.+)", "$1")) AS ?owner__dataProviderUrl)
      #OPTIONAL {
      #  [] rdf:subject ?id ;
      #    rdf:predicate crm:P51_has_former_or_current_owner ;
      #    rdf:object ?owner__id ;
      #    mmm-schema:order ?order .
      #  BIND(xsd:integer(?order) + 1 AS ?owner__order)
      #}
    }
    UNION
    {
      ?id crm:P46i_forms_part_of ?collection__id .
      ?collection__id skos:prefLabel ?collection__prefLabel .
      BIND(CONCAT("/collections/page/", ENCODE_FOR_URI(REPLACE(STR(?collection__id), "^.*\\\\/(.+)", "$1"))) AS ?collection__dataProviderUrl)
    }
    UNION
    {
      ?id ^crm:P30_transferred_custody_of/crm:P7_took_place_at ?transferOfCustodyPlace__id .
      ?transferOfCustodyPlace__id skos:prefLabel ?transferOfCustodyPlace__prefLabel .
      BIND(CONCAT("/places/page/", REPLACE(STR(?transferOfCustodyPlace__id), "^.*\\\\/(.+)", "$1")) AS ?transferOfCustodyPlace__dataProviderUrl)
    }
    UNION
    {
      ?id ^crm:P30_transferred_custody_of/crm:P4_has_time-span ?transferOfCustodyTimespan__id .
      ?transferOfCustodyTimespan__id skos:prefLabel ?transferOfCustodyTimespan__prefLabel .
      ?transferOfCustodyTimespan__id dct:source ?transferOfCustodyTimespan__source__id .
      ?transferOfCustodyTimespan__source__id skos:prefLabel ?transferOfCustodyTimespan__source__prefLabel .
      OPTIONAL { ?transferOfCustodyTimespan__id crm:P82a_begin_of_the_begin ?transferOfCustodyTimespan__start }
      OPTIONAL { ?transferOfCustodyTimespan__id crm:P82b_end_of_the_end ?transferOfCustodyTimespan__end }
    }
    UNION
    {
      ?id crm:P45_consists_of ?material__id .
      ?material__id skos:prefLabel ?material__prefLabel .
    }
    UNION
    {
      ?id mmm-schema:height/crm:P90_has_value ?height .
    }
    UNION
    {
      ?id mmm-schema:width/crm:P90_has_value ?width .
    }
    UNION
    {
      ?id mmm-schema:folios/crm:P90_has_value ?folios .
    }
    UNION
    {
      ?id mmm-schema:lines/crm:P90_has_value ?lines .
    }
    UNION
    {
      ?id mmm-schema:columns/crm:P90_has_value ?columns .
    }
    UNION
    {
      ?id mmm-schema:decorated_initials/crm:P90_has_value ?decoratedInitials .
    }
    UNION
    {
      ?id mmm-schema:historiated_initials/crm:P90_has_value ?historiatedInitials .
    }
`

export const manuscriptPropertiesFacetResults =
  `?id skos:prefLabel ?prefLabel__id .
      BIND (?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      {
        ?id mmm-schema:data_provider_url ?source__id .
        BIND (?source__id AS ?source__prefLabel)
        BIND (?source__id AS ?source__dataProviderUrl)
      }
      UNION
      {
        ?id mmm-schema:manuscript_author ?author__id .
        ?author__id skos:prefLabel ?author__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?author__id), "^.*\\\\/(.+)", "$1")) AS ?author__dataProviderUrl)
      }
      {
        ?id mmm-schema:manuscript_work ?work__id .
        ?work__id skos:prefLabel ?work__prefLabel .
        BIND(CONCAT("/works/page/", REPLACE(STR(?work__id), "^.*\\\\/(.+)", "$1")) AS ?work__dataProviderUrl)
      }
      UNION
      {
        ?id ^crm:P108_has_produced/crm:P4_has_time-span ?productionTimespan__id .
        ?productionTimespan__id skos:prefLabel ?productionTimespan__prefLabel .
        ?productionTimespan__id dct:source ?productionTimespan__source__id .
        ?productionTimespan__source__id skos:prefLabel ?productionTimespan__source__prefLabel .
        OPTIONAL { ?productionTimespan__id crm:P82a_begin_of_the_begin ?productionTimespan__start }
        OPTIONAL { ?productionTimespan__id crm:P82b_end_of_the_end ?productionTimespan__end }
      }
      UNION
      {
        ?id ^crm:P108_has_produced ?production .
        ?production crm:P7_took_place_at ?productionPlace__id .
        ?productionPlace__id skos:prefLabel ?productionPlace__prefLabel .
        ?production dct:source ?productionPlace__source__id .
        ?productionPlace__source__id skos:prefLabel ?productionPlace__source__prefLabel .
        BIND(CONCAT("/places/page/", REPLACE(STR(?productionPlace__id), "^.*\\\\/(.+)", "$1")) AS ?productionPlace__dataProviderUrl)
      }
      UNION
      {
        ?id mmm-schema:last_known_location ?lastKnownLocation__id  .
        ?lastKnownLocation__id skos:prefLabel ?lastKnownLocation__prefLabel .
        BIND(CONCAT("/places/page/", REPLACE(STR(?lastKnownLocation__id), "^.*\\\\/(.+)", "$1")) AS ?lastKnownLocation__dataProviderUrl)
      }
      UNION
      {
        ?id crm:P3_has_note ?note .
      }
      UNION
      {
        ?id crm:P128_carries ?expression__id .
        ?expression__id skos:prefLabel ?expression__prefLabel .
        OPTIONAL {
          ?expression__id crm:P72_has_language ?language__id .
          ?expression__id dct:source ?language__source__id .
          ?language__source__id skos:prefLabel ?language__source__prefLabel .
          ?language__id skos:prefLabel ?language__prefLabel .
        }
        BIND(CONCAT("/expressions/page/", REPLACE(STR(?expression__id), "^.*\\\\/(.+)", "$1")) AS ?expression__dataProviderUrl)
      }
      UNION
      {
        ?event__id crm:P108_has_produced ?id .
        ?event__id a ?event__type .
        OPTIONAL { ?event__id crm:P4_has_time-span/skos:prefLabel ?event__date }
        BIND("Production" AS ?event__prefLabel)
        BIND(CONCAT("/events/page/", REPLACE(STR(?event__id), "^.*\\\\/(.+)", "$1")) AS ?event__dataProviderUrl)
      }
      UNION
      {
        ?event__id crm:P30_transferred_custody_of ?id .
        ?event__id a ?event__type .
        OPTIONAL { ?event__id crm:P4_has_time-span/skos:prefLabel ?event__date }
        BIND("Transfer of Custody" AS ?event__prefLabel)
        BIND(CONCAT("/events/page/", REPLACE(STR(?event__id), "^.*\\\\/(.+)", "$1")) AS ?event__dataProviderUrl)
      }
      UNION
      {
        ?event__id mmm-schema:observed_manuscript ?id .
        ?event__id a crm:E7_Activity .
        ?event__id a ?event__type .
        OPTIONAL { ?event__id crm:P4_has_time-span/skos:prefLabel ?event__date }
        OPTIONAL {
          ?event__id crm:P7_took_place_at ?event__place__id .
          ?event__place__id skos:prefLabel ?event__place__prefLabel__id .
          BIND(?event__place__prefLabel__id as ?event__place__prefLabel__prefLabel)
          BIND(CONCAT("/places/page/", REPLACE(STR(?event__place__id), "^.*\\\\/(.+)", "$1")) AS ?event__place__prefLabel__dataProviderUrl)
          ?event__place__id wgs84:lat ?event__place__lat ;
                             wgs84:long ?event__place__long .
        }
        OPTIONAL {
          ?event__id mmm-schema:ownership_attributed_to ?event__observedOwner__id .
          ?event__observedOwner__id skos:prefLabel ?event__observedOwner__prefLabel .
          BIND(CONCAT("/actors/page/", REPLACE(STR(?event__observedOwner__id), "^.*\\\\/(.+)", "$1")) AS ?event__observedOwner__dataProviderUrl)
        }
        BIND("Provenance" AS ?event__prefLabel)
        BIND(CONCAT("/events/page/", REPLACE(STR(?event__id), "^.*\\\\/(.+)", "$1")) AS ?event__dataProviderUrl)
      }
      UNION
      {
        ?id crm:P51_has_former_or_current_owner ?owner__id .
        ?owner__id skos:prefLabel ?owner__prefLabel .
        BIND(CONCAT("/actors/page/", REPLACE(STR(?owner__id), "^.*\\\\/(.+)", "$1")) AS ?owner__dataProviderUrl)
      }
      UNION
      {
        ?id crm:P46i_forms_part_of ?collection__id .
        ?collection__id skos:prefLabel ?collection__prefLabel .
        BIND(CONCAT("/collections/page/", ENCODE_FOR_URI(REPLACE(STR(?collection__id), "^.*\\\\/(.+)", "$1"))) AS ?collection__dataProviderUrl)
      }
      UNION
      {
        ?id ^crm:P30_transferred_custody_of/crm:P7_took_place_at ?transferOfCustodyPlace__id .
        ?transferOfCustodyPlace__id skos:prefLabel ?transferOfCustodyPlace__prefLabel .
        BIND(CONCAT("/places/page/", REPLACE(STR(?transferOfCustodyPlace__id), "^.*\\\\/(.+)", "$1")) AS ?transferOfCustodyPlace__dataProviderUrl)
      }
      UNION
      {
        ?id ^crm:P30_transferred_custody_of/crm:P4_has_time-span ?transferOfCustodyTimespan__id .
        ?transferOfCustodyTimespan__id skos:prefLabel ?transferOfCustodyTimespan__prefLabel .
        ?transferOfCustodyTimespan__id dct:source ?transferOfCustodyTimespan__source__id .
        ?transferOfCustodyTimespan__source__id skos:prefLabel ?transferOfCustodyTimespan__source__prefLabel .
        OPTIONAL { ?transferOfCustodyTimespan__id crm:P82a_begin_of_the_begin ?transferOfCustodyTimespan__start }
        OPTIONAL { ?transferOfCustodyTimespan__id crm:P82b_end_of_the_end ?transferOfCustodyTimespan__end }
      }
      UNION
      {
        ?id crm:P45_consists_of ?material__id .
        ?material__id skos:prefLabel ?material__prefLabel .
      }
      UNION
      {
        ?id mmm-schema:height/crm:P90_has_value ?height .
      }
      UNION
      {
        ?id mmm-schema:width/crm:P90_has_value ?width .
      }
      UNION
      {
        ?id mmm-schema:folios/crm:P90_has_value ?folios .
      }
      UNION
      {
        ?id mmm-schema:lines/crm:P90_has_value ?lines .
      }
      UNION
      {
        ?id mmm-schema:columns/crm:P90_has_value ?columns .
      }
      UNION
      {
        ?id mmm-schema:decorated_initials/crm:P90_has_value ?decoratedInitials .
      }
      UNION
      {
        ?id mmm-schema:historiated_initials/crm:P90_has_value ?historiatedInitials .
      }
`

export const expressionProperties =
`   {
      ?id skos:prefLabel ?prefLabel__id .
      BIND (?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/expressions/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id dct:source ?source__id .
      ?source__id skos:prefLabel ?source__prefLabel .
      ?source__id mmm-schema:data_provider_url ?source__dataProviderUrl .
    }
    UNION
    {
      ?id ^crm:P128_carries ?manuscript__id .
      ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
    }
    UNION
    {
      ?id crm:P72_has_language ?language__id .
      ?language__id skos:prefLabel ?language__prefLabel .
      BIND(?language__id as ?language__dataProviderUrl)
    }
`

export const collectionProperties =
 `  {
       ?id skos:prefLabel ?prefLabel__id .
       BIND (?prefLabel__id as ?prefLabel__prefLabel)
       BIND(CONCAT("/collections/page/", ENCODE_FOR_URI(REPLACE(STR(?id), "^.*\\\\/(.+)", "$1"))) AS ?prefLabel__dataProviderUrl)
       BIND(?id as ?uri__id)
       BIND(?id as ?uri__dataProviderUrl)
       BIND(?id as ?uri__prefLabel)
     }
     UNION
     {
       ?id dct:source ?source__id .
       ?source__id skos:prefLabel ?source__prefLabel .
       ?source__id mmm-schema:data_provider_url ?source__dataProviderUrl .
     }
     UNION
     {
       ?id ^crm:P46i_forms_part_of ?manuscript__id .
       ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
       BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
     }
     UNION
     {
       ?id crm:P51_has_former_or_current_owner ?owner__id .
       ?owner__id skos:prefLabel ?owner__prefLabel .
       BIND(CONCAT("/actors/page/", REPLACE(STR(?owner__id), "^.*\\\\/(.+)", "$1")) AS ?owner__dataProviderUrl)
     }
     UNION
     {
       ?id mmm-schema:collection_location ?place__id .
       ?place__id skos:prefLabel ?place__prefLabel .
       BIND(CONCAT("/places/page/", REPLACE(STR(?place__id), "^.*\\\\/(.+)", "$1")) AS ?place__dataProviderUrl)
     }
`

export const networkLinksQuery = `
  SELECT DISTINCT ?source ?target ("author" as ?prefLabel)
  WHERE {
    <FILTER>
    ?source ^mmm-schema:manuscript_author ?target .
  }
`

export const networkNodesQuery = `
  SELECT DISTINCT ?id ?prefLabel ?class
  WHERE {
    VALUES ?class { frbroo:F4_Manifestation_Singleton crm:E21_Person }
    VALUES ?id { <ID_SET> }
    ?id a ?class ;
        skos:prefLabel ?prefLabel .
  }
`

export const productionPlacesQuery = `
  SELECT ?id ?lat ?long
  (COUNT(DISTINCT ?manuscripts) as ?instanceCount)
  WHERE {
    <FILTER>
    ?manuscripts ^crm:P108_has_produced/crm:P7_took_place_at ?id .
    ?id wgs84:lat ?lat ;
        wgs84:long ?long .
  }
  GROUP BY ?id ?lat ?long
`

export const lastKnownLocationsQuery = `
  SELECT ?id ?lat ?long
  (COUNT(DISTINCT ?manuscripts) as ?instanceCount)
  WHERE {
    <FILTER>
    ?manuscripts mmm-schema:last_known_location ?id .
    ?id wgs84:lat ?lat ;
        wgs84:long ?long .
  }
  GROUP BY ?id ?lat ?long
`

// # https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
export const migrationsQuery = `
  SELECT DISTINCT ?id ?manuscript__id ?manuscript__prefLabel ?manuscript__dataProviderUrl
    ?from__id ?from__prefLabel ?from__dataProviderUrl ?from__lat ?from__long
    ?to__id ?to__prefLabel ?to__dataProviderUrl ?to__lat ?to__long
  WHERE {
    <FILTER>
    ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?from__id .
    ?manuscript__id skos:prefLabel ?manuscript__prefLabel .
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
    ?from__id skos:prefLabel ?from__prefLabel ;
              wgs84:lat ?from__lat ;
              wgs84:long ?from__long .
    BIND(CONCAT("/places/page/", REPLACE(STR(?from__id), "^.*\\\\/(.+)", "$1")) AS ?from__dataProviderUrl)
    ?manuscript__id mmm-schema:last_known_location ?to__id .
    ?to__id skos:prefLabel ?to__prefLabel ;
            wgs84:lat ?to__lat ;
            wgs84:long ?to__long .
    BIND(CONCAT("/places/page/", REPLACE(STR(?to__id), "^.*\\\\/(.+)", "$1")) AS ?to__dataProviderUrl)
    BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "http://ldf.fi/mmm/place/", ""))) as ?id)
  }
`
