import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import { makeObjectList } from './SparqlObjectMapper';
import { generateFilter } from './Helpers';

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

export const getPlace = (filters, uri) => {
  const config = datasetConfig['mmm'];
  let query = config['placeQuery'];
  query = query.replace('<PLACE_ID>', `<${uri}>`);
  if (filters == null) {
    query = query.replace('<FILTER>', '# no filters');
  } else {
    query = query.replace('<FILTER>', generateFilter('manuscript__id',filters));
  }
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};

const getPlacesData = (variant, page, pagesize, filters, sortBy, sortDirection) => {
  const config = datasetConfig['mmm'];
  let query = config[`${variant}Query`];
  if (filters == null) {
    query = query.replace('<FILTER>', '# no filters');
  } else {
    query = query.replace('<FILTER>', generateFilter('manuscript',filters));
  }
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};
