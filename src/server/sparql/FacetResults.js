import SparqlSearchEngine from './SparqlSearchEngine';
import { endpoint, countQuery, facetResultSetQuery } from './SparqlQueriesGeneral';
import { manuscriptTableProperties, productionPlacesQuery } from './SparqlQueriesManuscripts';
import { placeQuery, allPlacesQuery } from './SparqlQueriesPlaces';
import { prefixes } from './SparqlQueriesPrefixes';
import { facetConfigs } from './FacetConfigs';
import { mapCount } from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';
import { generateFilter } from './Filters';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getPaginatedResults = (resultClass, page, pagesize, filters, sortBy, sortDirection) => {
  return Promise.all([
    getResultCount(resultClass, filters),
    getPaginatedData(resultClass, page, pagesize, filters, sortBy, sortDirection),
  ])
    .then(data => {
      return {
        resultCount: data[0].count,
        pagesize: pagesize,
        page: page,
        results: data[1]
      };
    });
};

export const getAllResults = (resultClass, facetClass, variant, filters) => {
  return Promise.all([
    getData(resultClass, facetClass, variant, filters)
  ]).then(data => {
    return {
      resultCount: data[0].count,
      results: data[0]
    };
  });
};

const getResultCount = (resultClass, filters) => {
  let q = countQuery;
  q = q.replace('<RDF_TYPE>', facetConfigs[resultClass].rdfType);
  if (filters !== null ) {
    q = q.replace('<FILTER>', generateFilter(resultClass, resultClass, filters, 'id', null));
  } else {
    q = q.replace('<FILTER>', '# no filters');
  }
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, mapCount);
};

const getPaginatedData = (resultClass, page, pagesize, filters, sortBy, sortDirection) => {
  let q = facetResultSetQuery;
  const facetConfig = facetConfigs[resultClass];
  if (filters !== null) {
    q = q.replace('<FILTER>', generateFilter(resultClass, resultClass, filters, 'id', null));
  } else {
    q = q.replace('<FILTER>', '# no filters');
  }
  q = q.replace('<RDF_TYPE>', facetConfig.rdfType);
  q = q.replace('<ORDER_BY_PREDICATE>', facetConfig[sortBy].labelPath);
  q = q.replace('<SORT_DIRECTION>', sortDirection);
  q = q.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`);
  let resultSetProperties = '';
  switch (resultClass) {
    case 'manuscripts':
      resultSetProperties = manuscriptTableProperties;
      break;
  }
  q = q.replace('<RESULT_SET_PROPERTIES>', resultSetProperties);
  //console.log(q)
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, makeObjectList);
};

const getData = (resultClass, facetClass, variant, filters) => {
  let q = '';
  switch (variant) {
    case 'allPlaces':
      q = allPlacesQuery;
      break;
    case 'productionPlaces':
      q = productionPlacesQuery;
  }
  if (filters == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateFilter(resultClass, facetClass, filters, facetClass, null));
  }
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, makeObjectList);
};

export const getPlace = (filters, uri) => {
  let q = placeQuery;
  q = q.replace('<PLACE_ID>', `<${uri}>`);
  if (filters == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateFilter('places', 'manuscripts', filters, 'manuscript__id', null));
  }
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, makeObjectList);
};
