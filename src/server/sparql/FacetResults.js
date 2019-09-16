import { runSelectQuery } from './SparqlApi';
import { prefixes } from './SparqlQueriesPrefixes';
import {
  endpoint,
  countQuery,
  facetResultSetQuery,
  instanceQuery
} from './SparqlQueriesGeneral';
import {
  manuscriptPropertiesFacetResults,
  manuscriptPropertiesInstancePage,
  expressionProperties,
  collectionProperties,
  productionPlacesQuery,
  migrationsQuery,
  networkQuery,
  allManuscriptsQuery
} from './SparqlQueriesManuscripts';
import { workProperties } from './SparqlQueriesWorks';
import { eventProperties } from './SparqlQueriesEvents';
import {
  actorProperties,
  placesActorsQuery,
} from './SparqlQueriesActors';
import {
  placePropertiesInstancePage,
  placePropertiesFacetResults,
  placePropertiesInfoWindow,
  manuscriptsProducedAt,
  actorsAt,
  allPlacesQuery,
} from './SparqlQueriesPlaces';
import { facetConfigs } from './FacetConfigsMMM';
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
  resultClass,
  facetClass,
  constraints,
  resultFormat
}) => {
  let q = '';
  let filterTarget = '';
  let mapper = makeObjectList;
  switch (resultClass) {
    case 'placesAll':
      q = allPlacesQuery;
      filterTarget = 'id';
      break;
    case 'placesMsProduced':
      q = productionPlacesQuery;
      filterTarget = 'manuscripts';
      mapper = mapPlaces;
      break;
    case 'placesActors':
      q = placesActorsQuery;
      filterTarget = 'actor__id';
      mapper = mapPlaces;
      break;
    case 'placesMsMigrations':
      q = migrationsQuery;
      filterTarget = 'manuscript__id';
      break;
    case 'network':
      q = networkQuery;
      filterTarget = 'manuscript__id';
      break;
    case 'allManuscripts':
      q = allManuscriptsQuery;
      filterTarget = 'id';
      break;
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters');
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: filterTarget,
      facetID: null
    }));
  }
  // console.log(prefixes + q)
  return runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: mapper,
    resultFormat
  });
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
  const response = await runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: mapCount,
    resultFormat
  });
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
      resultSetProperties = manuscriptPropertiesFacetResults;
      break;
    case 'works':
      resultSetProperties = workProperties;
      break;
    case 'events':
      resultSetProperties = eventProperties;
      break;
    case 'places':
      resultSetProperties = placePropertiesFacetResults;
      break;
    case 'actors':
      resultSetProperties = actorProperties;
      break;
    default:
      resultSetProperties = '';
  }
  q = q.replace('<RESULT_SET_PROPERTIES>', resultSetProperties);
  // console.log(prefixes + q);
  return runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: makeObjectList,
    resultFormat
  });
};

export const getByURI = ({
  resultClass,
  facetClass,
  constraints,
  uri,
  resultFormat
}) => {
  let q;
  switch (resultClass) {
    case 'manuscripts':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', manuscriptPropertiesInstancePage);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'expressions':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', expressionProperties);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'collections':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', collectionProperties);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'works':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', workProperties);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'events':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', eventProperties);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'actors':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', actorProperties);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'places':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', placePropertiesInstancePage);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'placesAll':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow);
      q = q.replace('<RELATED_INSTANCES>', '');
      break;
    case 'placesActors':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow);
      q = q.replace('<RELATED_INSTANCES>', actorsAt);
      break;
    case 'placesMsProduced':
      q = instanceQuery;
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow);
      q = q.replace('<RELATED_INSTANCES>', manuscriptsProducedAt);
      break;
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
  // console.log(prefixes + q)
  return runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: makeObjectList,
    resultFormat
  });
};
