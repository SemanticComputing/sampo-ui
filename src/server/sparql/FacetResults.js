import { runSelectQuery } from './SparqlApi'
import { runNetworkQuery } from './NetworkApi'
import { prefixes } from './sampo/SparqlQueriesPrefixes'
import {
  countQuery,
  facetResultSetQuery,
  instanceQuery
} from './SparqlQueriesGeneral'
import {
  manuscriptPropertiesFacetResults,
  manuscriptPropertiesInstancePage,
  productionPlacesQuery,
  productionCoordinatesQuery,
  lastKnownLocationsQuery,
  migrationsQuery,
  networkLinksQuery,
  networkNodesQuery
} from './sampo/SparqlQueriesPerspective1'
import { workProperties } from './sampo/SparqlQueriesPerspective2'
import { eventProperties, eventPlacesQuery } from './sampo/SparqlQueriesPerspective3'
import {
  placePropertiesInfoWindow,
  manuscriptsProducedAt,
  lastKnownLocationsAt,
  actorsAt,
  allPlacesQuery
} from './sampo/SparqlQueriesPlaces'
import { facetConfigs, endpoint } from './sampo/FacetConfigsSampo'
import { mapCount, mapPlaces, mapCoordinates } from './Mappers'
import { makeObjectList } from './SparqlObjectMapper'
import { generateConstraintsBlock } from './Filters'

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
  })
  if (resultFormat === 'json') {
    return {
      resultClass: resultClass,
      page: page,
      pagesize: pagesize,
      data: response.data,
      sparqlQuery: response.sparqlQuery
    }
  } else {
    return response
  }
}

export const getAllResults = ({
  resultClass,
  facetClass,
  constraints,
  resultFormat,
  groupBy
}) => {
  let q = ''
  let filterTarget = ''
  let mapper = makeObjectList
  switch (resultClass) {
    case 'placesAll':
      q = allPlacesQuery
      filterTarget = 'id'
      break
    case 'placesMsProduced':
      q = groupBy ? productionPlacesQuery : productionCoordinatesQuery
      filterTarget = 'manuscripts'
      mapper = groupBy ? mapPlaces : mapCoordinates
      break
    case 'lastKnownLocations':
      q = lastKnownLocationsQuery
      filterTarget = 'manuscripts'
      mapper = mapPlaces
      break
    case 'placesActors':
      q = placesActorsQuery
      filterTarget = 'actor__id'
      mapper = mapPlaces
      break
    case 'placesMsMigrations':
      q = migrationsQuery
      filterTarget = 'manuscript__id'
      break
    case 'placesEvents':
      q = eventPlacesQuery
      filterTarget = 'event'
      break
    case 'eventsByTimePeriod':
      q = generateEventsByPeriodQuery({ startYear: 1600, endYear: 1620, periodLength: 10 })
      filterTarget = 'event'
      break
    case 'manuscriptsNetwork':
      q = networkLinksQuery
      filterTarget = 'source'
      break
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: filterTarget,
      facetID: null
    }))
  }
  if (resultClass === 'manuscriptsNetwork') {
    // console.log(prefixes + q)
    return runNetworkQuery({
      endpoint,
      prefixes,
      links: q,
      nodes: networkNodesQuery
    })
  }
  // console.log(prefixes + q)
  return runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: mapper,
    resultFormat
  })
}

export const getResultCount = async ({
  resultClass,
  constraints,
  resultFormat
}) => {
  let q = countQuery
  q = q.replace('<FACET_CLASS>', facetConfigs[resultClass].facetClass)
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: resultClass,
      constraints: constraints,
      filterTarget: 'id',
      facetID: null
    }))
  }
  const response = await runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: mapCount,
    resultFormat
  })
  return ({
    resultClass: resultClass,
    data: response.data,
    sparqlQuery: response.sparqlQuery
  })
}

const getPaginatedData = ({
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  let q = facetResultSetQuery
  const facetConfig = facetConfigs[resultClass]
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: resultClass,
      constraints: constraints,
      filterTarget: 'id',
      facetID: null
    }))
  }
  q = q.replace('<FACET_CLASS>', facetConfig.facetClass)
  if (sortBy == null) {
    q = q.replace('<ORDER_BY_TRIPLE>', '')
    q = q.replace('<ORDER_BY>', '# no sorting')
  } else {
    let sortByPredicate = ''
    if (sortBy.endsWith('Timespan')) {
      sortByPredicate = sortDirection === 'asc'
        ? facetConfig[sortBy].sortByAscPredicate
        : facetConfig[sortBy].sortByDescPredicate
    } else {
      sortByPredicate = facetConfig[sortBy].labelPath
    }
    q = q.replace('<ORDER_BY_TRIPLE>',
      `OPTIONAL { ?id ${sortByPredicate} ?orderBy }`)
    q = q.replace('<ORDER_BY>',
      `ORDER BY (!BOUND(?orderBy)) ${sortDirection}(?orderBy)`)
  }
  q = q.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`)
  let resultSetProperties
  switch (resultClass) {
    case 'perspective1':
      resultSetProperties = manuscriptPropertiesFacetResults
      break
    case 'perspective2':
      resultSetProperties = workProperties
      break
    case 'perspective3':
      resultSetProperties = eventProperties
      break
    default:
      resultSetProperties = ''
  }
  q = q.replace('<RESULT_SET_PROPERTIES>', resultSetProperties)
  // console.log(prefixes + q);
  return runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: makeObjectList,
    resultFormat
  })
}

export const getByURI = ({
  resultClass,
  facetClass,
  constraints,
  uri,
  resultFormat
}) => {
  let q
  switch (resultClass) {
    case 'perspective1':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', manuscriptPropertiesInstancePage)
      q = q.replace('<RELATED_INSTANCES>', '')
      break
    case 'perspective2':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', workProperties)
      q = q.replace('<RELATED_INSTANCES>', '')
      break
    case 'perspective3':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', eventProperties)
      q = q.replace('<RELATED_INSTANCES>', '')
      break
    case 'placesAll':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow)
      q = q.replace('<RELATED_INSTANCES>', '')
      break
    case 'placesActors':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow)
      q = q.replace('<RELATED_INSTANCES>', actorsAt)
      break
    case 'placesMsProduced':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow)
      q = q.replace('<RELATED_INSTANCES>', manuscriptsProducedAt)
      break
    case 'lastKnownLocations':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow)
      q = q.replace('<RELATED_INSTANCES>', lastKnownLocationsAt)
      break
    case 'placesEvents':
      q = instanceQuery
      q = q.replace('<PROPERTIES>', placePropertiesInfoWindow)
      q = q.replace('<RELATED_INSTANCES>', '')
      break
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'related__id',
      facetID: null
    }))
  }
  q = q.replace('<ID>', `<${uri}>`)
  // console.log(prefixes + q)
  return runSelectQuery({
    query: prefixes + q,
    endpoint,
    resultMapper: makeObjectList,
    resultFormat
  })
}
