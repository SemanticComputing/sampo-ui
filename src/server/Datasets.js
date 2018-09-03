module.exports = {

  'mmm': {
    'title': 'MMM',
    'shortTitle': 'MMM',
    'timePeriod': '',
    'endpoint': 'http://ldf.fi/mmm-sdbm-cidoc/sparql',
    'getAllQuery': `
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
      SELECT ?id ?label ?sdbm_id ?material ?author ?timespan ?place ?lat ?long ?language {
        ?id a frbroo:F4_Manifestation_Singleton .
        ?id rdfs:label ?label .
        ?id crm:P1_is_identified_by ?sdbm_id .
        OPTIONAL {
          ?id crm:P45_consists_of ?material .
        }
        ?expression_creation frbroo:R18_created ?id .
        OPTIONAL {
          ?expression_creation crm:P14_carried_out_by ?author_id .
          ?author_id skos:prefLabel ?author .
          OPTIONAL { ?author_id mmm-schema:person_place/skos:prefLabel ?author_place . }
        }
        OPTIONAL {
          ?expression_creation crm:P4_has_time_span ?timespan_id .
          ?timespan_id rdfs:label ?timespan .
          ?timespan crm:P79_beginning_is_qualified_by ?timespan_start .
          ?timespan crm:P80_end_is_qualified_by ?timespan_end .
        }
        OPTIONAL {
         ?expression_creation crm:P7_took_place_at ?place_id .
         ?place_id skos:prefLabel ?place .
         OPTIONAL {
           ?place_id wgs84:lat ?lat .
           ?place_id wgs84:long ?long .
         }
       }
       OPTIONAL {
         ?id crm:P128_carries ?expression .
         ?expression crm:P72_has_language ?language .
       }
      }
      LIMIT 5000
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
