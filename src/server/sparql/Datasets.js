// # (GROUP_CONCAT(DISTINCT ?owner_; SEPARATOR=" | ") AS ?owner)
// # OPTIONAL {
// #   ?id crm:P51_has_former_or_current_owner ?ownerId .
// #   ?ownerId skos:prefLabel ?ownerLabel .
// #   ?ownerRei rdf:subject ?id ;
// #             rdf:predicate crm:P51_has_former_or_current_owner ;
// #             rdf:object ?ownerId ;
// #             mmm-schema:order ?ownerOrder ;
// #             mmm-schema:entry ?ownerEntry .
// #   BIND(CONCAT(STR(?ownerLabel), ";", STR(?ownerId), ";", STR(?ownerOrder), ";", STR(?ownerEntry)) AS ?owner_)
// # }
module.exports = {
  'mmm': {
    'title': 'MMM',
    'shortTitle': 'MMM',
    //'timePeriod': '',
    'endpoint': 'http://ldf.fi/mmm-cidoc/sparql',
    //'endpoint': 'http://localhost:3050/ds/sparql',
    'countQuery': `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX mmm: <http://ldf.fi/mmm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX sdbm: <https://sdbm.library.upenn.edu/>
      SELECT (COUNT(DISTINCT ?id) as ?count)
      WHERE {
        <FILTER>
        ?id a  frbroo:F4_Manifestation_Singleton .
        # ?id dct:source mmm-schema:Bodley .
        # ?id dct:source mmm-schema:SDBM .
      }
      `,
    'manuscriptQuery': `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX mmm: <http://ldf.fi/mmm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX sdbm: <https://sdbm.library.upenn.edu/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      SELECT *
      WHERE {
        {
          SELECT DISTINCT ?id {
            <FILTER>
            ?id a frbroo:F4_Manifestation_Singleton .
            # ?id dct:source mmm-schema:Bodley .
            # ?id dct:source mmm-schema:SDBM .
            # ?id (^frbroo:R18_created|^crm:P108_has_produced)/crm:P7_took_place_at/skos:prefLabel ?orderBy .
          }
          #ORDER BY (!BOUND(?orderBy)) ?orderBy
          ORDER BY ?id

          <PAGE>
        }
        FILTER(BOUND(?id))
        ?id skos:prefLabel ?prefLabel .
        {
          ?id dct:source ?source__id .
          ?source__id skos:prefLabel ?source__prefLabel .
          OPTIONAL { ?id mmm-schema:data_provider_url ?source__dataProviderUrl }
        }
        UNION
        {
          ?production frbroo:R18_created|crm:P108_has_produced ?id .
          ?production mmm-schema:carried_out_by_as_author ?author__id .
          ?author__id skos:prefLabel ?author__prefLabel .
          ?author__id mmm-schema:data_provider_url ?author__dataProviderUrl .
        }
        UNION
        {
          ?production frbroo:R18_created|crm:P108_has_produced ?id .
          ?production crm:P4_has_time-span ?timespan .
          ?timespan skos:prefLabel ?timespan__id .
          ?timespan crm:P79_beginning_is_qualified_by ?timespan__start .
          ?timespan crm:P80_end_is_qualified_by ?timespan__end .
          BIND (?timespan__id AS ?timespan__prefLabel)
        }
        UNION
        {
          ?production frbroo:R18_created|crm:P108_has_produced ?id .
          ?production crm:P7_took_place_at ?productionPlace__id .
          ?productionPlace__id skos:prefLabel ?productionPlace__prefLabel .
          OPTIONAL { ?productionPlace__id mmm-schema:data_provider_url ?productionPlace__dataProviderUrl }
          FILTER NOT EXISTS {
            ?production crm:P7_took_place_at ?productionPlace__id2 .
            ?productionPlace__id2 crm:P89_falls_within+ ?productionPlace__id .
          }
        }
        UNION
        {
          ?id crm:P51_has_former_or_current_owner ?owner__id .
          ?owner__id skos:prefLabel ?owner__prefLabel .
          ?owner__id mmm-schema:data_provider_url ?owner__dataProviderUrl .
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

      }
      `,
    'productionPlacesQuery': `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT ?id ?lat ?long ?prefLabel ?dataProviderUrl
      (COUNT(DISTINCT ?manuscript) as ?manuscriptCount)
      WHERE {
        {
          ?manuscript ^frbroo:R18_created/crm:P7_took_place_at ?id .
          ?id skos:prefLabel ?prefLabel .
          OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }  
          OPTIONAL {
            ?id wgs84:lat ?lat ;
                wgs84:long ?long .
          }
        }
        UNION
        {
          ?manuscript ^crm:P108_has_produced/crm:P7_took_place_at ?id .
          ?id skos:prefLabel ?prefLabel .
          OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
          OPTIONAL {
            ?id wgs84:lat ?lat ;
                wgs84:long ?long .
          }
        }
      }
      GROUP BY ?id ?lat ?long ?prefLabel ?dataProviderUrl
        `,
    'migrationsQuery': `
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT DISTINCT ?id ?manuscript__id ?manuscript__url ?from__id ?from__name ?from__lat ?from__long ?to__id ?to__name ?to__lat ?to__long
      WHERE {
        # https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
        ?manuscript__id ^frbroo:R18_created/crm:P7_took_place_at ?from__id .
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
        BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "http://ldf.fi/mmm/place/", ""))) as ?id)
        FILTER NOT EXISTS {
          ?event__id2 crm:P24_transferred_title_of ?manuscript__id .
          ?event__id2 crm:P4_has_time-span ?event__date2 .
          filter (?event__date2 > ?event__date)
        }
      }
        `,
    // http://vocab.getty.edu/doc/queries/#Places_by_Direct_and_Hierarchical_Type
    'placeQuery': `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT *
      WHERE {
        BIND (<PLACE_ID> AS ?id)
        ?id skos:prefLabel ?prefLabel .
        OPTIONAL {
          ?id crm:P89_falls_within ?parent__id .
          ?parent__id skos:prefLabel ?parent__prefLabel .
          ?parent__id mmm-schema:data_provider_url ?parent__dataProviderUrl .
        }
        OPTIONAL { ?id mmm-schema:data_provider_url ?dataProviderUrl }
        OPTIONAL { ?id owl:sameAs ?sameAs }
        {
          ?manuscript__id ^frbroo:R18_created/crm:P7_took_place_at ?id .
          ?manuscript__id mmm-schema:data_provider_url ?manuscript__dataProviderUrl .
        }
        UNION
        {
          ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?id .
          ?manuscript__id mmm-schema:data_provider_url ?manuscript__dataProviderUrl .
        }
      }
        `,
    'facetQuery': `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX sch: <http://schema.org/>
      PREFIX geosparql: <http://www.opengis.net/ont/geosparql#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT DISTINCT ?id ?prefLabel ?source ?parent ?instanceCount {
        { SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) ?id ?parent ?source
          {
            ?instance a frbroo:F4_Manifestation_Singleton .
            <FILTER>
            #?value dct:source mmm-schema:Bodley .
            ?instance <PREDICATE> ?id .
            ?id dct:source ?source .
            OPTIONAL { ?id crm:P89_falls_within ?parent_ }
            BIND(COALESCE(?parent_, '0') as ?parent)
          }
          GROUP BY ?id ?source ?parent
          ORDER BY DESC(?instanceCount)
        }
        FILTER(BOUND(?id))
        #<SELECTED_VALUES>
        #VALUES ?selectedValues { <http://ldf.fi/mmm/place/926> }
        ?id skos:prefLabel ?prefLabel_
        BIND(STR(?prefLabel_) AS ?prefLabel)
      }
    `,
    'tgn': {
      // Getty LOD documentation:
      // http://vocab.getty.edu/queries#Places_by_Type
      // https://groups.google.com/forum/#!topic/gettyvocablod/r4wsSJyne84
      // https://confluence.ontotext.com/display/OWLIMv54/OWLIM-SE+Full-text+Search
      // http://vocab.getty.edu/queries#Combination_Full-Text_and_Exact_String_Match
      // http://vocab.getty.edu/doc/#TGN_Place_Types
      'title': 'The Getty Thesaurus of Geographic Names',
      'shortTitle': 'TGN',
      'timePeriod': '',
      'endpoint': 'http://vocab.getty.edu/sparql.json',
      'simpleSuggestionQuery':
        'SELECT+DISTINCT+?label+' +
        'WHERE+{' +
        '?s+a+skos:Concept;+' +
        'luc:term+"<QUERYTERM>*";+' +
        'skos:inScheme+tgn:;' +
        'gvp:prefLabelGVP/xl:literalForm+?lbl+.' +
        '+BIND(STR(?lbl)+AS+?label)' +
        'FILTER+(STRSTARTS(LCASE(?lbl),+"<QUERYTERM>"))' +
        '}' +
        'LIMIT+20',
      'resultQuery':
        'SELECT+?s+(COALESCE(?labelEn,?labelGVP)+AS+?label)+?typeLabel+?broaderAreaLabel+?source+?lat+?long+?markerColor' +
        'WHERE+{' +
        '?s+luc:term+"<QUERYTERM>";+' +
        'skos:inScheme+tgn:;+' +
        'gvp:placeTypePreferred+[gvp:prefLabelGVP+[xl:literalForm+?typeLabel;dct:language+gvp_lang:en]];+' +
        'gvp:parentStringAbbrev+?broaderAreaLabel+.+' +
        'OPTIONAL+{?s+xl:prefLabel+[xl:literalForm+?labelEn;+dct:language+gvp_lang:en]}+' +
        'OPTIONAL{?s+gvp:prefLabelGVP+[xl:literalForm?labelGVP]}+' +
        'OPTIONAL{?s+foaf:focus+?place+.+?place+wgs:lat+?lat;+wgs:long+?long}+' +
        'FILTER+EXISTS+{?s+xl:prefLabel/gvp:term+?term+.+FILTER+(LCASE(STR(?term))="<QUERYTERM>")}' +
        'BIND("TGN"+AS+?source)+' +
        'BIND("orange"+AS+?markerColor)+' +
        '}',
    },
  },
};
