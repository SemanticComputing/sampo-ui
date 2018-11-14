import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import {
  mapFacet,
  mapCount,
  //mapManuscripts
} from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getManuscripts = (page, filterObj) => {
  let { endpoint, manuscriptQuery } = datasetConfig['mmm'];
  const pageSize = 5;
  manuscriptQuery = manuscriptQuery.replace('<FILTER>', generateFilter(filterObj));
  manuscriptQuery = manuscriptQuery.replace('<PAGE>', `LIMIT ${pageSize} OFFSET ${page * pageSize}`);
  // console.log(manuscriptQuery)
  return sparqlSearchEngine.doSearch(manuscriptQuery, endpoint, makeObjectList);
  //return sparqlSearchEngine.doSearch(manuscriptQuery, endpoint, mapManuscripts);
};

export const getManuscriptCount = (filterObj) => {
  let { endpoint, countQuery } = datasetConfig['mmm'];
  countQuery = countQuery.replace('<FILTER>', generateFilter(filterObj));
  return sparqlSearchEngine.doSearch(countQuery, endpoint, mapCount);
};

export const getPlaces = variant => {
  // console.log(variant)
  const config = datasetConfig['mmm'];
  return sparqlSearchEngine.doSearch(config[`${variant}Query`], config.endpoint, makeObjectList);
};

export const getPlace = (id) => {
  let { endpoint, placeQuery } = datasetConfig['mmm'];
  placeQuery = placeQuery.replace('<PLACE_ID>', `<http://ldf.fi/mmm/place/${id}>`);
  return sparqlSearchEngine.doSearch(placeQuery, endpoint, makeObjectList);
};

export const getFacet = () => {
  const { endpoint, facetQuery } = datasetConfig['mmm'];
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
