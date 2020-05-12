import { has } from 'lodash'
import { runSelectQuery } from './SparqlApi'
import { makeObjectList } from './SparqlObjectMapper'
import { mapCount } from './Mappers'
import { generateConstraintsBlock } from './Filters'
import {
  countQuery,
  facetResultSetQuery,
  instanceQuery
} from './SparqlQueriesGeneral'

export const getPaginatedResults = async ({
  backendSearchConfig,
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  const response = await getPaginatedData({
    backendSearchConfig,
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
  backendSearchConfig,
  resultClass,
  facetClass,
  constraints,
  resultFormat,
  groupBy
}) => {
  const config = backendSearchConfig[resultClass]
  let endpoint
  if (has(config, 'endpoint')) {
    endpoint = config.endpoint
  } else {
    endpoint = backendSearchConfig[config.perspectiveID].endpoint
  }
  const { filterTarget, resultMapper } = config
  let { q } = config
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: filterTarget,
      facetID: null
    }))
  }
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper,
    resultFormat
  })
}

export const getResultCount = async ({
  backendSearchConfig,
  resultClass,
  constraints,
  resultFormat
}) => {
  let q = countQuery
  const config = backendSearchConfig[resultClass]
  let endpoint
  if (has(config, 'endpoint')) {
    endpoint = config.endpoint
  } else {
    endpoint = backendSearchConfig[config.perspectiveID].endpoint
  }
  q = q.replace('<FACET_CLASS>', config.facetClass)
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: resultClass,
      constraints: constraints,
      filterTarget: 'id',
      facetID: null
    }))
  }
  const response = await runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
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
  backendSearchConfig,
  resultClass,
  page,
  pagesize,
  constraints,
  sortBy,
  sortDirection,
  resultFormat
}) => {
  let q = facetResultSetQuery
  const config = backendSearchConfig[resultClass]
  let endpoint
  if (has(config, 'endpoint')) {
    endpoint = config.endpoint
  } else {
    endpoint = backendSearchConfig[config.perspectiveID].endpoint
  }
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: resultClass,
      constraints: constraints,
      filterTarget: 'id',
      facetID: null
    }))
  }
  q = q.replace('<FACET_CLASS>', config.facetClass)
  if (sortBy == null) {
    q = q.replace('<ORDER_BY_TRIPLE>', '')
    q = q.replace('<ORDER_BY>', '# no sorting')
  } else {
    let sortByPredicate = ''
    if (sortBy.endsWith('Timespan')) {
      sortByPredicate = sortDirection === 'asc'
        ? config.facets[sortBy].sortByAscPredicate
        : config.facets[sortBy].sortByDescPredicate
    } else {
      sortByPredicate = config.facets[sortBy].labelPath
    }
    q = q.replace('<ORDER_BY_TRIPLE>',
      `OPTIONAL { ?id ${sortByPredicate} ?orderBy }`)
    q = q.replace('<ORDER_BY>',
      `ORDER BY (!BOUND(?orderBy)) ${sortDirection}(?orderBy)`)
  }
  q = q.replace('<PAGE>', `LIMIT ${pagesize} OFFSET ${page * pagesize}`)
  q = q.replace('<RESULT_SET_PROPERTIES>', config.paginatedResults.properties)
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
    resultFormat
  })
}

export const getByURI = ({
  backendSearchConfig,
  resultClass,
  facetClass,
  constraints,
  uri,
  resultFormat
}) => {
  const config = backendSearchConfig[resultClass]
  const { properties, relatedInstances } = config.instance
  let q = instanceQuery
  let endpoint
  if (has(config, 'endpoint')) {
    endpoint = config.endpoint
  } else {
    endpoint = backendSearchConfig[config.perspectiveID].endpoint
  }
  q = q.replace('<PROPERTIES>', properties)
  q = q.replace('<RELATED_INSTANCES>', relatedInstances)
  if (constraints == null) {
    q = q.replace('<FILTER>', '# no filters')
  } else {
    q = q.replace('<FILTER>', generateConstraintsBlock({
      backendSearchConfig,
      resultClass: resultClass,
      facetClass: facetClass,
      constraints: constraints,
      filterTarget: 'related__id',
      facetID: null
    }))
  }
  q = q.replace('<ID>', `<${uri}>`)
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
    resultFormat
  })
}
