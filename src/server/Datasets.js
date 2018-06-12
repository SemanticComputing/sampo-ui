module.exports = {
  'warsa_karelian_places': {
    'title': 'Karelian map names',
    'shortTitle': 'KMN',
    'timePeriod': '1922-1944',
    'endpoint': 'http://ldf.fi/warsa/sparql',
    'suggestionQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      SELECT DISTINCT ?label (COUNT(?s) AS ?count)
      WHERE {
        GRAPH <http://ldf.fi/warsa/places/karelian_places> {
          (?s ?score) text:query (skos:prefLabel '<QUERYTERM>*') .
        }
        ?s skos:prefLabel ?lbl .
        BIND(STR(?lbl) AS ?label)
      }
      GROUP BY ?label
      ORDER BY DESC(MAX(?score)) ?label
      LIMIT 50
      `,
    'simpleSuggestionQuery': `
        PREFIX text: <http://jena.apache.org/text#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX gs: <http://www.opengis.net/ont/geosparql#>
        SELECT DISTINCT ?label
        WHERE {
          GRAPH <http://ldf.fi/warsa/places/karelian_places> {
            ?s text:query (skos:prefLabel '<QUERYTERM>*' 10000) .
          }
          ?s skos:prefLabel ?lbl .
          BIND(STR(?lbl) AS ?label)
        }
        `,
    'resultQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      SELECT DISTINCT *
      WHERE {
        {
          SELECT DISTINCT ?s {
            GRAPH <http://ldf.fi/warsa/places/karelian_places> {
              (?s ?score) text:query (skos:prefLabel '<QUERYTERM>') .
            }
          }
        }
        ?s skos:prefLabel ?label .
        ?s a/skos:prefLabel ?typeLabel .
        ?s gs:sfWithin/skos:prefLabel ?broaderAreaLabel .
        BIND("KMN" AS ?source)
        OPTIONAL {
          ?s wgs84:lat ?lat .
          ?s wgs84:long ?long .
        }
        FILTER(LANGMATCHES(LANG(?label), 'fi'))
        FILTER(LANGMATCHES(LANG(?typeLabel), 'fi'))
        FILTER(LANGMATCHES(LANG(?broaderAreaLabel), 'fi'))
      }
      ORDER BY ?score
      `,
  },
  'warsa_municipalities': {
    'title': 'Finnish WW2 municipalities',
    'shortTitle': 'FWM',
    'timePeriod': '1939-1944',
    'lang': '',
    'endpoint': 'http://ldf.fi/warsa/sparql',
    'suggestionQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      SELECT DISTINCT ?label (COUNT(?s) AS ?count)
      WHERE {
        GRAPH <http://ldf.fi/warsa/places/municipalities> {
          (?s ?score) text:query (skos:prefLabel '<QUERYTERM>*') .
        }
        ?s skos:prefLabel ?lbl .
        BIND(STR(?lbl) AS ?label)
      }
      GROUP BY ?label
      ORDER BY DESC(MAX(?score)) ?label
      `,
    'simpleSuggestionQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      SELECT DISTINCT ?label
      WHERE {
        GRAPH <http://ldf.fi/warsa/places/municipalities> {
          ?s text:query (skos:prefLabel '<QUERYTERM>*' 10000) .
        }
        ?s skos:prefLabel ?lbl .
        BIND(STR(?lbl) AS ?label)
      }
      `,
    'resultQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      SELECT DISTINCT *
      WHERE {
        {
          SELECT DISTINCT ?s {
            GRAPH <http://ldf.fi/warsa/places/municipalities> {
              (?s ?score) text:query (skos:prefLabel '<QUERYTERM>') .
            }
          }
        }
        ?s skos:prefLabel ?label .
        ?s a/skos:prefLabel ?typeLabel .
        ?s gs:sfWithin/skos:prefLabel ?broaderAreaLabel .
        BIND("FWM" AS ?source)
        OPTIONAL {
          ?s wgs84:lat ?lat .
          ?s wgs84:long ?long .
        }
        FILTER(LANGMATCHES(LANG(?label), 'fi'))
        FILTER(LANGMATCHES(LANG(?typeLabel), 'fi'))
        FILTER(LANGMATCHES(LANG(?broaderAreaLabel), 'fi'))
      }
      ORDER BY ?score
      `,
  },
  'pnr': {
    'title': 'Finnish Geographic Names Registry (contemporary)',
    'shortTitle': 'FGN',
    'timePeriod': 'contemporary',
    'endpoint': 'http://ldf.fi/pnr/sparql',
  },
  'kotus': {
    'title': 'Institute for the Languages of Finland (Kotus) Digital Names archive',
    'shortTitle': 'DNA',
    'endpoint': 'http://ldf.fi/kotus-digital-names-archive/sparql',
    //'endpoint': 'http://localhost:3037/ds/sparql',
    'suggestionQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      PREFIX hipla: <http://ldf.fi/schema/hipla/>
      SELECT DISTINCT ?label (COUNT(?s) AS ?count)
      WHERE {
        (?s ?score) text:query (skos:prefLabel '<QUERYTERM>*') .
        ?s hipla:type [] .
        ?s skos:prefLabel ?lbl .
        BIND(STR(?lbl) AS ?label)
      }
      ORDER BY DESC(MAX(?score)) ?label
      LIMIT 50
      `,
    'simpleSuggestionQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      PREFIX hipla: <http://ldf.fi/schema/hipla/>
      SELECT DISTINCT ?label
      WHERE {
        ?s text:query (skos:prefLabel '<QUERYTERM>*' 10000) .
        ?s hipla:type [] .
        ?s skos:prefLabel ?lbl .
        BIND(STR(?lbl) AS ?label)
      }
      `,
    'resultQuery': `
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX gs: <http://www.opengis.net/ont/geosparql#>
      PREFIX hipla: <http://ldf.fi/schema/hipla/>
      PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      SELECT DISTINCT *
      WHERE {
        (?s ?score) text:query (skos:prefLabel '<QUERYTERM>') .
        ?s a hipla:Place .
        ?s skos:prefLabel ?label .
        ?s hipla:municipality ?broaderAreaLabel .
        OPTIONAL { ?s hipla:type ?typeLabel . }
        BIND("DNA" AS ?source)
        OPTIONAL {
          ?s wgs84:lat ?lat .
          ?s wgs84:long ?long .
        }
        #FILTER(LANGMATCHES(LANG(?label), 'fi'))
        #FILTER(LANGMATCHES(LANG(?typeLabel), 'fi'))
        #FILTER(LANGMATCHES(LANG(?broaderAreaLabel), 'fi'))
      }
      ORDER BY ?score
      `,
  },
};
