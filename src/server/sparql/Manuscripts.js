import SparqlSearchEngine from './SparqlSearchEngine';
import datasetConfig from './Datasets';
import { mapCount } from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';
import { facetConfigs } from './FacetConfigs';
import { generateResultFilter } from './Helpers';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getManuscripts = (variant, page, pagesize, filters, sortBy, sortDirection) => {
  return Promise.all([
    getManuscriptCount(filters),
    getManuscriptData(variant, page, pagesize, filters, sortBy, sortDirection),
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

const getManuscriptData = (variant, page, pagesize, filters, sortBy, sortDirection) => {
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
