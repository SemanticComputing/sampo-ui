import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import {
  mapFacet,
  mapCount
} from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getManuscripts = (page, filterObj) => {
  let { endpoint, manuscriptQuery } = datasetConfig['mmm'];
  const pageSize = 5;
  manuscriptQuery = manuscriptQuery.replace('<FILTER>', generateFilter(filterObj));
  manuscriptQuery = manuscriptQuery.replace('<PAGE>', `ORDER BY ?id LIMIT ${pageSize} OFFSET ${page * pageSize}`);
  // console.log(manuscriptQuery)
  return sparqlSearchEngine.doSearch(manuscriptQuery, endpoint, makeObjectList);
};

export const getManuscriptCount = (filterObj) => {
  let { endpoint, countQuery } = datasetConfig['mmm'];
  countQuery = countQuery.replace('<FILTER>', generateFilter(filterObj));
  return sparqlSearchEngine.doSearch(countQuery, endpoint, mapCount);
};

export const getPlaces = () => {
  const { endpoint, placesQuery } = datasetConfig['mmm'];
  return sparqlSearchEngine.doSearch(placesQuery, endpoint, makeObjectList);
};

export const getPlace = (id) => {
  let { endpoint, placeQuery } = datasetConfig['mmm'];
  placeQuery = placeQuery.replace('<PLACE_ID>', `<http://ldf.fi/mmm/place/${id}>`);
  return sparqlSearchEngine.doSearch(placeQuery, endpoint, makeObjectList);
};

export const getFacet = (property) => {
  const { endpoint } = datasetConfig['mmm'];
  // console.log(facetQuery)
  return sparqlSearchEngine.doSearch(facetQuery, endpoint, mapFacet);
};

const generateFilter = (filterObj) => {
  let filterStr = '';
  for (let property in filterObj) {
    filterStr += `
            ?id ${filterObj[property].predicate} ?${property}Filter
            VALUES ?${property}Filter { ${filterObj[property].values.join(' ')} }
      `;
  }
  return filterStr;
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
`;
