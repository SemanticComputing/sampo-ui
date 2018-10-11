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
    //'endpoint': 'http://localhost:3034/ds/sparql',
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
      SELECT *
      WHERE {
        {
          SELECT DISTINCT ?id {
            ?id a frbroo:F4_Manifestation_Singleton .
          }
          <PAGE>
        }
        FILTER(BOUND(?id))
        ?id skos:prefLabel ?prefLabel .
        ?id mmm-schema:entry ?entry .
        OPTIONAL { ?id mmm-schema:manuscript_record ?manuscriptRecord . }
        OPTIONAL { ?id crm:P45_consists_of ?material . }
        ?expression_creation frbroo:R18_created ?id .
        OPTIONAL {
          ?expression_creation crm:P14_carried_out_by ?author__id .
          ?author__id skos:prefLabel ?author__prefLabel
          BIND(REPLACE(STR(?author__id), "http://ldf.fi/mmm/person/", "https://sdbm.library.upenn.edu/names/") AS ?author__sdbmLink)
        }
        OPTIONAL {
          ?expression_creation crm:P4_has_time_span ?timespan .
          ?timespan rdfs:label ?timespan__id .
          ?timespan crm:P79_beginning_is_qualified_by ?timespan__start .
          ?timespan crm:P80_end_is_qualified_by ?timespan__end .
          BIND (?timespan__id AS ?timespan__prefLabel)
        }
        OPTIONAL {
          ?expression_creation crm:P7_took_place_at ?creationPlace__id .
          ?creationPlace__id skos:prefLabel ?creationPlace__prefLabel .
          BIND(REPLACE(STR(?creationPlace__id), "http://ldf.fi/mmm/place/", "https://sdbm.library.upenn.edu/places/") AS ?creationPlace__sdbmLink)
        }
        OPTIONAL {
          ?id crm:P128_carries ?expression .
          ?expression crm:P72_has_language ?language .
        }
      }
      `,
    'allQuery': `
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
      (GROUP_CONCAT(DISTINCT ?prefLabel_; SEPARATOR=" | ") AS ?prefLabel)
      (GROUP_CONCAT(DISTINCT ?author_; SEPARATOR="|") AS ?author)
      (GROUP_CONCAT(DISTINCT ?timespan_; SEPARATOR="|") AS ?timespan)
      (GROUP_CONCAT(DISTINCT ?creationPlace_; SEPARATOR="|") AS ?creationPlace)
      (GROUP_CONCAT(DISTINCT ?material_; SEPARATOR="|") AS ?material)
      (GROUP_CONCAT(DISTINCT ?language_; SEPARATOR="|") AS ?language)
      WHERE {
        ?id a frbroo:F4_Manifestation_Singleton .
        ?id skos:prefLabel ?prefLabel_ .
        OPTIONAL { ?id crm:P45_consists_of ?material_ . }
        ?expression_creation frbroo:R18_created ?id .
        OPTIONAL {
          ?expression_creation crm:P14_carried_out_by ?authorId .
          ?authorId skos:prefLabel ?authorLabel
          BIND(CONCAT(STR(?authorLabel), ";", STR(?authorId)) AS ?author_)
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
        OPTIONAL { ?id mmm-schema:manuscript_record ?manuscriptRecord . }
      }
      GROUP BY ?id ?manuscriptRecord
      ORDER BY (!BOUND(?creationPlace)) ?creationPlace
      <PAGE>
      `,
    'placesQuery': `
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
