import { runSelectQuery } from './SparqlApi';
import { prefixes } from './SparqlQueriesPrefixes';
import { endpoint, countQuery, facetResultSetQuery } from './SparqlQueriesGeneral';
import {
  manuscriptProperties,
  productionPlacesQuery,
  migrationsQuery,
  networkQuery,
} from './SparqlQueriesManuscripts';
import { workProperties } from './SparqlQueriesWorks';
import { eventProperties } from './SparqlQueriesEvents';
import { actorProperties } from './SparqlQueriesActors';
import { placeProperties, placeQuery, allPlacesQuery } from './SparqlQueriesPlaces';
import { facetConfigs } from './FacetConfigs';
import { mapCount } from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';
import {
  generateConstraintsBlock,
} from './Filters';

export const getPaginatedResults = async ({
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  const data = await getPaginatedData({
    resultClass,
    page,
    pagesize,
    constraints,
    sortBy,
    sortDirection,
    resultFormat
  });
  if (resultFormat === 'json') {
    return {
      pagesize: pagesize,
      page: page,
      results: data
    };
  } else {
    return data;
  }
};

export const getAllResults = ({
  // resultClass, // TODO: handle other classes than manuscripts
  facetClass,
  constraints,
  variant,
  resultFormat
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
    case 'network':
      q = networkQuery;
      filterTarget = 'manuscript__id';
      break;
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: filterTarget,
      facetID: null
    }));
  }
  // if (variant == 'productionPlaces') {
  //   console.log(prefixes + q)
  // }
  return runSelectQuery(prefixes + q, endpoint, makeObjectList, resultFormat);
};

export const getResultCount = ({
  resultClass,
  constraints,
  resultFormat
}) => {
  let q = countQuery;
  q = q.replace('<FACET_CLASS>', facetConfigs[resultClass].facetClass);
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: resultClass,
      constraints: constraints,
      filterTarget: 'id',
      facetID: null
    }));
  }
  return runSelectQuery(prefixes + q, endpoint, mapCount, resultFormat);
};

const getPaginatedData = ({
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  let q = facetResultSetQuery;
  const facetConfig = facetConfigs[resultClass];
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: resultClass,
      constraints: constraints,
      filterTarget: 'id',
      facetID: null}));
  }
  q = q.replace('<FACET_CLASS>', facetConfig.facetClass);
  if (sortBy == null) {
    q = q.replace('<ORDER_BY_TRIPLE>', '');
    q = q.replace('<ORDER_BY>', '# no sorting');
  } else {
    let sortByPredicate = '';
    if (sortBy.endsWith('Timespan')) {
      sortByPredicate = sortDirection === 'asc'
        ? facetConfig[sortBy].sortByAscPredicate
        : facetConfig[sortBy].sortByDescPredicate;
    } else {
      sortByPredicate = facetConfig[sortBy].labelPath;
    }
    q = q.replace('<ORDER_BY_TRIPLE>',
      `OPTIONAL { ?id ${sortByPredicate} ?orderBy }`);
    q = q.replace('<ORDER_BY>',
      `ORDER BY (!BOUND(?orderBy)) ${sortDirection}(?orderBy)`);
  }
  q = q.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`);
  let resultSetProperties;
  switch (resultClass) {
    case 'manuscripts':
      resultSetProperties = manuscriptProperties;
      break;
    case 'works':
      resultSetProperties = workProperties;
      break;
    case 'events':
      resultSetProperties = eventProperties;
      break;
    case 'places':
      resultSetProperties = placeProperties;
      break;
    case 'actors':
      resultSetProperties = actorProperties;
      break;
    default:
      resultSetProperties = '';
  }
  q = q.replace('<RESULT_SET_PROPERTIES>', resultSetProperties);
  console.log(prefixes + q);
  return runSelectQuery(prefixes + q, endpoint, makeObjectList, resultFormat);
};

export const getByURI = ({
  resultClass,
  facetClass,
  constraints,
  //variant,
  uri,
  resultFormat
}) => {
  let q;
  switch (resultClass) {
    case 'places':
      q = placeQuery;
      break;
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'manuscript__id',
      facetID: null}));
  }
  q = q.replace('<ID>', `<${uri}>`);
  // if (variant === 'productionPlaces') {
  //   console.log(prefixes + q)
  // }
  return runSelectQuery(prefixes + q, endpoint, makeObjectList, resultFormat);
};
