import { runSelectQuery } from './SparqlApi';
import { prefixes } from './SparqlQueriesPrefixes';
import {
  endpoint,
  countQuery,
  facetResultSetQuery,
  instanceQuery
} from './SparqlQueriesGeneral';
import {
  manuscriptProperties,
  expressionProperties,
  collectionProperties,
  productionPlacesQuery,
  migrationsQuery,
  networkQuery,
} from './SparqlQueriesManuscripts';
import { workProperties } from './SparqlQueriesWorks';
import { eventProperties } from './SparqlQueriesEvents';
import {
  actorProperties,
  actorPlacesQuery,
} from './SparqlQueriesActors';
import {
  placeProperties,
  manuscriptsProducedAt,
  actorsAt,
  allPlacesQuery,
} from './SparqlQueriesPlaces';
import { facetConfigs } from './FacetConfigs';
import { mapCount, mapPlaces } from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';
import { generateConstraintsBlock } from './Filters';

export const getPaginatedResults = async ({
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  const response = await getPaginatedData({
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
      resultClass: resultClass,
      page: page,
      pagesize: pagesize,
      data: response.data,
      sparqlQuery: response.sparqlQuery
    };
  } else {
    return response;
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
  let mapper = makeObjectList;
  switch (variant) {
    case 'allPlaces':
      q = allPlacesQuery;
      filterTarget = 'id';
      break;
    case 'productionPlaces':
      q = productionPlacesQuery;
      filterTarget = 'manuscripts';
      mapper = mapPlaces;
      break;
    case 'migrations':
      q = migrationsQuery;
      filterTarget = 'manuscript__id';
      break;
    case 'network':
      q = networkQuery;
      filterTarget = 'manuscript__id';
      break;
    case 'actorPlaces':
      q = actorPlacesQuery;
      filterTarget = 'actor__id';
      mapper = mapPlaces;
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
  return runSelectQuery(prefixes + q, endpoint, mapper, resultFormat);
};

export const getResultCount = async ({
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
  const response = await runSelectQuery(prefixes + q, endpoint, mapCount, resultFormat);
  return({
    resultClass: resultClass,
    data: response.data,
    sparqlQuery: response.sparqlQuery
  });
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
  // console.log(prefixes + q);
  return runSelectQuery(prefixes + q, endpoint, makeObjectList, resultFormat);
};

export const getByURI = ({
  resultClass,
  facetClass,
  constraints,
  variant,
  uri,
  resultFormat
}) => {
  let q;
  switch (resultClass) {
    case 'manuscripts':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', manuscriptProperties);
      break;
    case 'expressions':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', expressionProperties);
      break;
    case 'collections':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', collectionProperties);
      break;
    case 'works':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', workProperties);
      break;
    case 'events':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', eventProperties);
      break;
    case 'actors':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', actorProperties);
      break;
    case 'places':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', placeProperties);
      break;
  }
  switch (variant) {
    case 'productionPlaces':
      q = q.replace('<RELATED_INSTANCES>', manuscriptsProducedAt);
      break;
    case 'actorPlaces':
      q = q.replace('<RELATED_INSTANCES>', actorsAt);
      break;
    case 'allPlaces':
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    default:
      q = q.replace('<RELATED_INSTANCES>', '');
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'related__id',
      facetID: null}));
  }
  q = q.replace('<ID>', `<${uri}>`);
  return runSelectQuery(prefixes + q, endpoint, makeObjectList, resultFormat);
};
