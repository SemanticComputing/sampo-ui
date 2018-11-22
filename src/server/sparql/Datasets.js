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
    'timePeriod': '',
    'endpoint': 'http://ldf.fi/mmm-cidoc/sparql',
    //'endpoint': 'http://localhost:3050/ds/sparql',
    'countQuery': `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
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
        ?id a frbroo:F4_Manifestation_Singleton .
      }
      `,
    'manuscriptQuery': `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
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
            #?id ^<http://erlangen-crm.org/efrbroo/R18_created>/<http://www.cidoc-crm.org/cidoc-crm/P7_took_place_at> ?orderBy .
          }
          ORDER BY ?id
          #ORDER BY (!BOUND(?orderBy)) ?orderBy
          <PAGE>
        }
        FILTER(BOUND(?id))
        ?id skos:prefLabel ?prefLabel .
        ?id mmm-schema:data_provider_url ?sdbmLink .
        {
          ?id crm:P51_has_former_or_current_owner ?owner__id .
          ?owner__id skos:prefLabel ?owner__prefLabel .
          [] rdf:subject ?id ;
             rdf:predicate crm:P51_has_former_or_current_owner ;
             rdf:object ?owner__id ;
             mmm-schema:order ?order .
          BIND(xsd:integer(?order) + 1 AS ?owner__order)
          BIND(REPLACE(STR(?owner__id), "http://ldf.fi/mmm/person/", "https://sdbm.library.upenn.edu/names/") AS ?owner__sdbmLink)
        }
        UNION
        {
          ?expression_creation frbroo:R18_created ?id .
          ?expression_creation crm:P14_carried_out_by ?author__id .
          ?author__id skos:prefLabel ?author__prefLabel
          BIND(REPLACE(STR(?author__id), "http://ldf.fi/mmm/person/", "https://sdbm.library.upenn.edu/names/") AS ?author__sdbmLink)
        }
        UNION
        {
          ?expression_creation frbroo:R18_created ?id .
          ?expression_creation crm:P4_has_time-span ?timespan .
          ?timespan skos:prefLabel ?timespan__id .
          ?timespan crm:P79_beginning_is_qualified_by ?timespan__start .
          ?timespan crm:P80_end_is_qualified_by ?timespan__end .
          BIND (?timespan__id AS ?timespan__prefLabel)
        }
        UNION
        {
          ?expression_creation frbroo:R18_created ?id .
          ?expression_creation crm:P7_took_place_at ?creationPlace__id .
          ?creationPlace__id skos:prefLabel ?creationPlace__prefLabel .
          BIND(REPLACE(STR(?creationPlace__id), "http://ldf.fi/mmm/place/", "https://sdbm.library.upenn.edu/places/") AS ?creationPlace__sdbmLink)
        }
        UNION
        {
          ?id crm:P128_carries ?expression .
          ?expression crm:P72_has_language ?language .
        }
        UNION
        {
          ?observation__id crm:P24_transferred_title_of|mmm-schema:observed_manuscript ?id .
          ?observation__id skos:prefLabel ?observation__prefLabel .
          OPTIONAL { ?observation__id crm:P4_has_time-span ?observation__date. }
          OPTIONAL { ?observation__id crm:P7_took_place_at ?observation__place. }
          #OPTIONAL { ?observation__id mmm-schema: ?observation__placeLiteral. }
          OPTIONAL { ?observation__id  mmm-schema:data_provider_url ?observation__sdbmLink }
        }
      }
      `,
    'manuscriptQuery2': `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX mmm: <http://ldf.fi/mmm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX sdbm: <https://sdbm.library.upenn.edu/>
      SELECT
      ?id ?manuscriptRecord
      #(GROUP_CONCAT(DISTINCT ?entry_; SEPARATOR=" | ") AS ?entry)
      (GROUP_CONCAT(DISTINCT ?prefLabel_; SEPARATOR=" | ") AS ?prefLabel)
      (GROUP_CONCAT(DISTINCT ?author_; SEPARATOR="|") AS ?author)
      (GROUP_CONCAT(DISTINCT ?owner_; SEPARATOR="|") AS ?owner)
      (GROUP_CONCAT(DISTINCT ?timespan_; SEPARATOR="|") AS ?timespan)
      (GROUP_CONCAT(DISTINCT ?creationPlace_; SEPARATOR="|") AS ?creationPlace)
      (GROUP_CONCAT(DISTINCT ?material_; SEPARATOR="|") AS ?material)
      (GROUP_CONCAT(DISTINCT ?language_; SEPARATOR="|") AS ?language)
      WHERE {
        {
          SELECT DISTINCT ?id {
            <FILTER>
            ?id a frbroo:F4_Manifestation_Singleton .
          }
          <ORDER_BY>
          <PAGE>
        }
        FILTER(BOUND(?id))
        #?id mmm-schema:entry ?entry_ .
        ?id skos:prefLabel ?prefLabel_ .
        OPTIONAL { ?id mmm-schema:manuscript_record ?manuscriptRecord . }
        OPTIONAL { ?id crm:P45_consists_of ?material_ . }
        ?expression_creation frbroo:R18_created ?id .
        OPTIONAL {
          ?expression_creation crm:P14_carried_out_by ?authorId .
          ?authorId skos:prefLabel ?authorLabel
          BIND(CONCAT(STR(?authorLabel), ";", STR(?authorId)) AS ?author_)
        }
        OPTIONAL {
         ?id crm:P51_has_former_or_current_owner ?ownerId .
         ?ownerId skos:prefLabel ?ownerLabel .
         ?rei a rdf:Statement ;
              rdf:subject ?id ;
              rdf:predicate crm:P51_has_former_or_current_owner ;
              rdf:object ?ownerId ;
              mmm-schema:entry ?ownerEntry ;
              mmm-schema:order ?ownerOrder .
         BIND(CONCAT(STR(?ownerLabel), ";", STR(?ownerId), ";", STR(?ownerOrder), ";", STR(?ownerEntry)) AS ?owner_)
        }
        OPTIONAL {
          ?expression_creation crm:P4_has_time_span ?timespanId .
          ?timespanId rdfs:label ?timespan_.
        }
        OPTIONAL {
          ?expression_creation crm:P7_took_place_at ?creationPlaceId .
          ?creationPlaceId skos:prefLabel ?creationPlaceLabel .
          BIND(CONCAT(STR(?creationPlaceLabel), ";", STR(?creationPlaceId)) AS ?creationPlace_)
        }
        OPTIONAL {
          ?id crm:P128_carries ?expression .
          ?expression crm:P72_has_language ?language_ .
        }

      }
      GROUP BY ?id ?manuscriptRecord
      `,
    'creationPlacesQuery': `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT ?id ?lat ?long ?prefLabel
      (COUNT(DISTINCT ?manuscript) as ?manuscriptCount)
      WHERE {
        ?id a mmm-schema:Place .
        ?id skos:prefLabel ?prefLabel .
        ?manuscript ^frbroo:R18_created/crm:P7_took_place_at ?id .
        OPTIONAL {
          ?id wgs84:lat ?lat ;
              wgs84:long ?long .
        }
      }
      GROUP BY ?id ?lat ?long ?prefLabel
        `,
    'migrationsQuery': `
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT DISTINCT ?id ?manuscript__id ?manuscript__url ?from__id ?from__name ?from__lat ?from__long ?to__id ?to__name ?to__lat ?to__long
      WHERE {
        # https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
        #?id ^frbroo:R18_created/crm:P7_took_place_at ?from__id .
        ?manuscript__id ^frbroo:R18_created/crm:P7_took_place_at ?from__id .
        ?manuscript__id mmm-schema:data_provider_url ?manuscript__url .
        ?from__id skos:prefLabel ?from__name .
        ?from__id wgs84:lat ?from__lat ;
                  wgs84:long ?from__long .
        ?acquisition__id crm:P24_transferred_title_of ?manuscript__id .
        ?acquisition__id skos:prefLabel ?acquisition__prefLabel .
        ?acquisition__id crm:P4_has_time-span ?acquisition__date .
        ?acquisition__id crm:P7_took_place_at ?to__id .
        ?to__id skos:prefLabel ?to__name .
        ?to__id wgs84:lat ?to__lat ;
                wgs84:long ?to__long .
        BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "http://ldf.fi/mmm/place/", ""))) as ?id)
        FILTER NOT EXISTS {
          ?acquisition__id2 crm:P24_transferred_title_of ?manuscript__id .
          ?acquisition__id2 crm:P4_has_time-span ?acquisition__date2 .
          filter (?acquisition__date2 > ?acquisition__date)
        }
      }
        `,
    'migrationsQuery2': `
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT DISTINCT ?id ?manuscript__id ?manuscript__url ?from__id ?from__name ?from__lat ?from__long ?to__id ?to__name ?to__lat ?to__long
      WHERE {
        # https://github.com/uber/deck.gl/blob/master/docs/layers/arc-layer.md
        #?id ^frbroo:R18_created/crm:P7_took_place_at ?from__id .
        ?manuscript__id ^frbroo:R18_created/crm:P7_took_place_at ?from__id .
        ?manuscript__id mmm-schema:data_provider_url ?manuscript__url .
        ?from__id skos:prefLabel ?from__name .
        ?from__id wgs84:lat ?from__lat ;
                  wgs84:long ?from__long .
        ?manuscript__id crm:P51_has_former_or_current_owner ?owner .
        ?rei rdf:subject ?manuscript__id ;
             rdf:predicate crm:P51_has_former_or_current_owner ;
             rdf:object ?owner ;
             mmm-schema:order ?order .
        ?owner mmm-schema:person_place ?to__id .
        ?to__id skos:prefLabel ?to__name .
        ?to__id wgs84:lat ?to__lat ;
                wgs84:long ?to__long .
        FILTER NOT EXISTS {
          ?rei mmm-schema:order ?order2 .
          filter (?order2 > ?order)
        }
        BIND(IRI(CONCAT(STR(?from__id), "-", REPLACE(STR(?to__id), "http://ldf.fi/mmm/place/", ""))) as ?id)
      }
        `,
    // http://vocab.getty.edu/doc/queries/#Places_by_Direct_and_Hierarchical_Type
    'placeQuery': `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT ?id ?prefLabel ?manuscript__id ?manuscript__entry ?manuscript__manuscriptRecord ?sdbmLink ?source ?parent
      WHERE {
        BIND (<PLACE_ID> AS ?id)
        BIND(REPLACE(STR(?id), "http://ldf.fi/mmm/place/", "https://sdbm.library.upenn.edu/places/") AS ?sdbmLink)
        ?id skos:prefLabel ?prefLabel .
        ?manuscript__id ^frbroo:R18_created/crm:P7_took_place_at ?id .
        ?manuscript__id mmm-schema:entry ?manuscript__entry .
        OPTIONAL { ?manuscript__id mmm-schema:manuscript_record ?manuscript__manuscriptRecord }
        OPTIONAL { ?id owl:sameAs ?source . }
        OPTIONAL { ?id mmm-schema:parent ?parent }
        #SERVICE <http://sparql.org/books> {
        #  ?source dc:title ?title . ?s dc:creator ?a
        #}
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
          SELECT DISTINCT ?cnt ?facet_text ?value ?parent
          WHERE {
            SELECT DISTINCT ?cnt ?value ?facet_text ?parent {
              { SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) ?value ?parent
                {
                  ?id a frbroo:F4_Manifestation_Singleton .
                  ?id skos:prefLabel ?name .
                  ?id ^frbroo:R18_created/crm:P7_took_place_at ?value .
                  OPTIONAL { ?value mmm-schema:parent ?parent }
                }
                GROUP BY ?value ?parent
              }
              FILTER(BOUND(?value)) BIND(COALESCE(?value, <http://ldf.fi/NONEXISTENT_URI>) AS ?labelValue)
              OPTIONAL { ?labelValue skos:prefLabel ?lbl .
                FILTER(langMatches(lang(?lbl), "fi")) . }
              OPTIONAL { ?labelValue rdfs:label ?lbl .
                FILTER(langMatches(lang(?lbl), "fi")) . }
              OPTIONAL { ?labelValue skos:prefLabel ?lbl .
                FILTER(langMatches(lang(?lbl), "en")) . }
              OPTIONAL { ?labelValue rdfs:label ?lbl .
                FILTER(langMatches(lang(?lbl), "en")) . }
              OPTIONAL { ?labelValue skos:prefLabel ?lbl .
                FILTER(langMatches(lang(?lbl), "sv")) . }
              OPTIONAL { ?labelValue rdfs:label ?lbl .
                FILTER(langMatches(lang(?lbl), "sv")) . }
              OPTIONAL { ?labelValue skos:prefLabel ?lbl .
                FILTER(langMatches(lang(?lbl), "")) . }
              OPTIONAL { ?labelValue rdfs:label ?lbl .
                FILTER(langMatches(lang(?lbl), "")) . }
              BIND(COALESCE(?lbl, IF(!ISURI(?value), ?value, "")) AS ?facet_text) }
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
