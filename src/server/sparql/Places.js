import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import { makeObjectList } from './SparqlObjectMapper';
import { generateResultFilter } from './Helpers';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getPlaces = (variant, page, pagesize, filters, sortBy, sortDirection) => {
  return Promise.all([
    getPlacesData(variant, page, pagesize, filters, sortBy, sortDirection)
  ]).then(data => {
    return {
      resultCount: data[0].count,
      results: data[0]
    };
  });
};

export const getPlace = uri => {
  const config = datasetConfig['mmm'];
  let query = config['placeQuery'];
  query = query.replace('<PLACE_ID>', `<${uri}>`);
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};

const getPlacesData = (variant, page, pagesize, filters, sortBy, sortDirection) => {
  const config = datasetConfig['mmm'];
  let query = config[`${variant}Query`];
  if (filters == null) {
    query = query.replace('<FILTER>', '');
  } else {
    query = query.replace('<FILTER>', generateResultFilter(filters));
  }
  //console.log(query)
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};

// export const getPlace = id => {
//   let { endpoint, placeQuery } = datasetConfig['mmm'];
//   placeQuery = placeQuery.replace('<PLACE_ID>', `<${id}>`);
//   // console.log(placeQuery)
//   return sparqlSearchEngine.doSearch(placeQuery, endpoint, makeObjectList);
// };
