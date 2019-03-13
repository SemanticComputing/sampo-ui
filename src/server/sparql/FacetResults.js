import SparqlSearchEngine from './SparqlSearchEngine';
import { prefixes } from './SparqlQueriesPrefixes';
import { endpoint, countQuery, facetResultSetQuery } from './SparqlQueriesGeneral';
import { manuscriptProperties, productionPlacesQuery, migrationsQuery } from './SparqlQueriesManuscripts';
import { workProperties } from './SparqlQueriesWorks';
import { personProperties } from './SparqlQueriesPeople';
import { organizationProperties } from './SparqlQueriesOrganizations';
import { placeProperties, placeQuery, allPlacesQuery } from './SparqlQueriesPlaces';
import { facetConfigs } from './FacetConfigs';
import { mapCount } from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';
import { generateFilter } from './Filters';

const sparqlSearchEngine = new SparqlSearchEngine();

export const getPaginatedResults = ({
  resultClass,
  page,
  pagesize,
  filters,
  sortBy,
  sortDirection
}) => {
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

export const getAllResults = ({
  resultClass,
  facetClass,
  filters,
  variant
}) => {
  let q = '';
  let filterTarget = '';
  switch (variant) {
    case 'allPlaces':
      q = allPlacesQuery;
      filterTarget = 'id';
      break;
    case 'productionPlaces':
      q = productionPlacesQuery;
      filterTarget = 'manuscripts';
      break;
    case 'migrations':
      q = migrationsQuery;
      filterTarget = 'manuscript__id';
      break;
  }
  if (filters == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateFilter(resultClass, facetClass, filters, filterTarget, null));
  }
  // if (variant == 'migrations') {
  //   console.log(prefixes + q)
  // }
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, makeObjectList);
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
  let resultSetProperties;
  switch (resultClass) {
    case 'manuscripts':
      resultSetProperties = manuscriptProperties;
      break;
    case 'works':
      resultSetProperties = workProperties;
      break;
    case 'places':
      resultSetProperties = placeProperties;
      break;
    case 'people':
      resultSetProperties = personProperties;
      break;
    case 'organizations':
      resultSetProperties = organizationProperties;
      break;
    default:
      resultSetProperties = '';
  }
  q = q.replace('<RESULT_SET_PROPERTIES>', resultSetProperties);
  // console.log(prefixes + q)
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, makeObjectList);
};

export const getByURI = (resultClass, facetClass, variant, filters, uri) => {
  let q;
  switch (resultClass) {
    case 'places':
      q = placeQuery;
      break;
  }
  if (variant === 'productionPlaces') {
    const manuscriptsProduced =
      `OPTIONAL {
          ${generateFilter(resultClass, facetClass, filters, 'manuscript__id', null)}
          ?manuscript__id ^crm:P108_has_produced/crm:P7_took_place_at ?id .
          ?manuscript__id mmm-schema:data_provider_url ?manuscript__dataProviderUrl .
        }`;
    q = q.replace('<MANUSCRIPTS>', manuscriptsProduced);
  } else {
    q = q.replace('<MANUSCRIPTS>', '');
  }
  q = q.replace('<ID>', `<${uri}>`);
  // if (variant === 'productionPlaces') {
  //   console.log(prefixes + q)
  // }
  return sparqlSearchEngine.doSearch(prefixes + q, endpoint, makeObjectList);
};
