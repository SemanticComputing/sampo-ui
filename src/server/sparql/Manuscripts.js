import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import {
  mapPlaces,
  mapManuscripts
} from './Mappers';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getManuscripts = (page) => {
  let { endpoint, allQuery } = datasetConfig['mmm'];
  allQuery = allQuery.replace('<PAGE>', 'LIMIT 50');
  return sparqlSearchEngine.doSearch(allQuery, endpoint, mapManuscripts);
};

export const getPlaces = () => {
  const { endpoint, placeQuery } = datasetConfig['mmm'];
  return sparqlSearchEngine.doSearch(placeQuery, endpoint, mapPlaces);
};


const facetQuery = `
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
  SELECT DISTINCT ?cnt ?facet_text ?value
  WHERE {
    {
      { SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) {
          ?id a frbroo:F4_Manifestation_Singleton .
          ?id skos:prefLabel ?name .
        }
      } BIND("-- Ei valintaa --" AS ?facet_text) }
    UNION
    {
      SELECT DISTINCT ?cnt ?value ?facet_text {
        { SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) ?value {
            ?id a frbroo:F4_Manifestation_Singleton .
            ?id skos:prefLabel ?name .
            ?id ^frbroo:R18_created/crm:P7_took_place_at ?value .
          }
          GROUP BY ?value
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
  }
`;
