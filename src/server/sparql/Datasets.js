module.exports = {

  'mmm': {
    'title': 'MMM',
    'shortTitle': 'MMM',
    'timePeriod': '',
    'endpoint': 'http://ldf.fi/mmm-sdbm-cidoc/sparql',
    //'endpoint': 'http://localhost:3034/ds/sparql',
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
      ?id ?sdbmId
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
          BIND(CONCAT(STR(?authorId), ";", STR(?authorLabel)) AS ?author_)
        }
        OPTIONAL { ?expression_creation crm:P4_has_time_span ?timespan_ . }
        OPTIONAL {
          ?expression_creation crm:P7_took_place_at ?creationPlaceId .
          ?creationPlaceId skos:prefLabel ?creationPlaceLabel .
          BIND(CONCAT(STR(?creationPlaceId), ";", STR(?creationPlaceLabel)) AS ?creationPlace_)
        }
        OPTIONAL {
          ?id crm:P128_carries ?expression .
          ?expression crm:P72_has_language ?language_ .
        }
        OPTIONAL {
          ?id mmm-schema:manuscript_record ?sdbmId .
        }
      }
      GROUP BY ?id  ?sdbmId
      ORDER BY DESC(?creationPlace)
      `,
    'placeQuery': `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX frbroo: <http://erlangen-crm.org/efrbroo/>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX mmm-schema: <http://ldf.fi/mmm/schema/>
      SELECT ?id ?label ?lat ?long ?source ?parent
      (GROUP_CONCAT(DISTINCT ?manuscript_id; SEPARATOR=",") AS ?manuscript)
      (COUNT(DISTINCT ?manuscript_id) as ?manuscriptCount)
      WHERE {
        ?id a mmm-schema:Place .
        ?id skos:prefLabel ?label .
        ?manuscript_id ^frbroo:R18_created/crm:P7_took_place_at ?id .
        OPTIONAL {
          ?id wgs84:lat ?lat ;
              wgs84:long ?long .
        }
        OPTIONAL { ?id owl:sameAs ?source . }
        OPTIONAL { ?id mmm-schema:parent ?parent }
      }
      GROUP BY ?id ?label ?lat ?long ?source  ?parent
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
