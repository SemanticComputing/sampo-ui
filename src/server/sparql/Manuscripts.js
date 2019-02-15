import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import { mapCount } from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';
import { facetConfigs } from './FacetConfigs';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getManuscripts = (page, pagesize, filters, sortBy, sortDirection) => {
  return Promise.all([
    getManuscriptCount(filters),
    getManuscriptData(page, pagesize, filters, sortBy, sortDirection),
  ])
    .then(data => {
      return {
        resultCount: data[0].count,
        pagesize: pagesize,
        page: page,
        results: data[1]
      };
    })
    .catch(err => console.log(err));
};

const getManuscriptData = (page, pagesize, filters, sortBy, sortDirection) => {
  let { endpoint, manuscriptQuery } = datasetConfig['mmm'];
  if (filters == null) {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', '');
  } else {
    manuscriptQuery = manuscriptQuery.replace('<FILTER>', generateResultFilter(filters));
  }
  manuscriptQuery = manuscriptQuery.replace('<ORDER_BY_PREDICATE>', facetConfigs[sortBy].labelPath);
  manuscriptQuery = manuscriptQuery.replace('<SORT_DIRECTION>', sortDirection);
  manuscriptQuery = manuscriptQuery.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`);
  // console.log(manuscriptQuery)
  return sparqlSearchEngine.doSearch(manuscriptQuery, endpoint, makeObjectList);
};

const getManuscriptCount = filters => {
  let { endpoint, countQuery } = datasetConfig['mmm'];
  countQuery = countQuery.replace('<FILTER>', generateResultFilter(filters));
  return sparqlSearchEngine.doSearch(countQuery, endpoint, mapCount);
};

export const getPlaces = variant => {
  const config = datasetConfig['mmm'];
  const query = config[`${variant}Query`];
  //console.log(query)
  return sparqlSearchEngine.doSearch(query, config.endpoint, makeObjectList);
};

export const getPlace = id => {
  let { endpoint, placeQuery } = datasetConfig['mmm'];
  placeQuery = placeQuery.replace('<PLACE_ID>', `<${id}>`);
  // console.log(placeQuery)
  return sparqlSearchEngine.doSearch(placeQuery, endpoint, makeObjectList);
};

const generateResultFilter = filters => {
  let filterStr = '';
  for (let property in filters) {
    filterStr += `
            VALUES ?${property}Filter { <${filters[property].join('> <')}> }
            ?id ${facetConfigs[property].predicate} ?${property}Filter .
    `;
  }
  return filterStr;
};
